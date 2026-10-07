// A tiny read-only filesystem for the /terminal page, generated from the same
// data the page sections render, so `cat` never drifts from the site.
import { experiences } from '@/data/work';
import { projects } from '@/data/projects';
import { clubs, racing } from '@/data/sailing';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/data/site';

export type FsFile = {
  type: 'file';
  content: string;
  /** What `open` does with this file: an outside link, or a page on the site. */
  href?: string;
};
export type FsDir = { type: 'dir'; children: Record<string, FsNode> };
export type FsNode = FsFile | FsDir;

const bullets = (lines: string[]) => lines.map((l) => `  - ${l}`).join('\n');

const workDir: FsDir = {
  type: 'dir',
  children: Object.fromEntries(
    experiences.map((e) => [
      e.id,
      {
        type: 'file',
        content: [
          `${e.title} · ${e.company}`,
          `${e.period} · ${e.location}${e.current ? ' · current' : ''}`,
          '',
          bullets(e.achievements),
          '',
          `stack: ${e.stack.join(', ')}`,
        ].join('\n'),
        href: '/#work',
      } satisfies FsFile,
    ]),
  ),
};

const projectsDir: FsDir = {
  type: 'dir',
  children: Object.fromEntries(
    projects.map((p) => {
      const links = [
        p.githubUrl && `source   ${p.githubUrl}`,
        p.demoUrl && `${(p.demoLabel ?? 'demo').padEnd(8)} ${p.demoUrl}`,
        p.appStoreUrl && `app      ${p.appStoreUrl}`,
        p.paperUrl && `paper    ${p.paperUrl}`,
        p.betaUrl && `beta     ${p.betaUrl}`,
      ].filter(Boolean);
      return [
        p.id,
        {
          type: 'file',
          content: [
            p.title,
            p.year,
            '',
            bullets(p.description),
            '',
            `tech: ${p.technologies.join(', ')}`,
            ...(links.length ? ['', ...links] : []),
          ].join('\n'),
          href: p.githubUrl ?? p.paperUrl ?? p.betaUrl ?? p.appStoreUrl ?? p.demoUrl ?? '/#projects',
        } satisfies FsFile,
      ];
    }),
  ),
};

const racingDir: FsDir = {
  type: 'dir',
  children: Object.fromEntries(
    racing.map((r) => [
      r.id,
      {
        type: 'file',
        content: [
          r.boat,
          [r.venue, r.period].filter(Boolean).join(' · '),
          ...(r.result ? [`result: ${r.result}`] : []),
          '',
          bullets(r.bullets),
        ].join('\n'),
        href: '/sailing',
      } satisfies FsFile,
    ]),
  ),
};

const clubsDir: FsDir = {
  type: 'dir',
  children: Object.fromEntries(
    clubs.map((c) => [
      c.id,
      {
        type: 'file',
        content: [
          `${c.name} · ${c.location}`,
          c.period,
          '',
          bullets(c.bullets),
          ...(c.boats ? ['', `boats: ${c.boats}`] : []),
        ].join('\n'),
        href: `/sailing#club-${c.id}`,
      } satisfies FsFile,
    ]),
  ),
};

export const root: FsDir = {
  type: 'dir',
  children: {
    'about.txt': {
      type: 'file',
      content: [
        'Jason Dank. Full-stack software engineer at Fidelity Investments,',
        'building on the Fidelity Private Shares platform, on-site at the Boston Seaport.',
        '',
        'Before that, two terms of endpoint engineering across 20,000+ devices at',
        'Harvard University IT. B.S. Computer Science, Wentworth, cum laude.',
        'Sails out of Marblehead and Boston Harbor. Won Figawi 2026 aboard Fawn.',
      ].join('\n'),
      href: '/#about',
    },
    'contact.txt': {
      type: 'file',
      content: [`email     ${EMAIL}`, `github    ${GITHUB_URL}`, `linkedin  ${LINKEDIN_URL}`].join('\n'),
      href: '/#contact',
    },
    work: workDir,
    projects: projectsDir,
    sailing: { type: 'dir', children: { racing: racingDir, clubs: clubsDir } },
  },
};

/** Resolves `path` against `cwd` (both as segment arrays). Supports ~, /, . and .. */
export function resolvePath(cwd: string[], path: string): string[] | null {
  const raw = path.trim();
  let segs: string[] = raw.startsWith('/') || raw === '~' || raw.startsWith('~/') ? [] : [...cwd];
  for (const part of raw.replace(/^~\/?/, '').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') segs.pop();
    else segs = [...segs, part];
  }
  return getNode(segs) ? segs : null;
}

export function getNode(segs: string[]): FsNode | null {
  let node: FsNode = root;
  for (const s of segs) {
    if (node.type !== 'dir' || !(s in node.children)) return null;
    node = node.children[s];
  }
  return node;
}

export function listDir(dir: FsDir): string {
  return Object.entries(dir.children)
    .map(([name, n]) => (n.type === 'dir' ? `${name}/` : name))
    .join('  ');
}
