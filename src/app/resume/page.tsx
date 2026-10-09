import type { Metadata } from 'next';
import PrintButton from '@/components/PrintButton';
import { Bullets, Entry, Section } from '@/components/ResumeSheet';
import { experiences } from '@/data/work';
import { projects } from '@/data/projects';
import { leadership } from '@/data/leadership';
import { honors, minors, school } from '@/data/education';
import { skillGroups } from '@/data/skills';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/data/site';

export const metadata: Metadata = {
  title: 'Résumé — Jason Dank',
  description: 'Jason Dank’s résumé: full-stack software engineer at Fidelity Investments on the Fidelity Private Shares platform.',
};

// Projects listed in full; the rest share one line, which keeps it to two pages.
const FEATURED = 4;

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

/**
 * The résumé, built from the same data modules as the home page, so it never
 * drifts. "Save as PDF" prints just the sheet (see the print rules in
 * globals.css); the browser's print dialog does the PDF.
 */
export default function ResumePage() {
  return (
    <main id="main" className="min-h-screen bg-background py-8 sm:py-12 print:p-0">
      <div className="mx-auto mb-6 flex max-w-[8.5in] flex-wrap items-center justify-between gap-3 px-5 sm:px-0 print:hidden">
        <p className="text-xs uppercase tracking-[0.12em] text-muted">Built from the same data as the site</p>
        <PrintButton />
      </div>

      <article id="resume" className="resume mx-auto max-w-[8.5in] bg-card px-6 py-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] sm:border sm:border-border sm:px-[0.6in] sm:py-[0.55in]">
        <header className="border-b-2 border-foreground pb-3">
          <h1 className="font-display text-[1.65rem] font-extrabold leading-none">Jason Dank</h1>
          <p className="mt-1.5 text-[0.8rem]">Full Stack Software Engineer · Boston, MA</p>
          <p className="mt-1 flex flex-wrap gap-x-3 text-[0.72rem] text-muted">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href="https://jasondank.com">jasondank.com</a>
            <a href={GITHUB_URL}>{bare(GITHUB_URL)}</a>
            <a href={LINKEDIN_URL}>{bare(LINKEDIN_URL)}</a>
          </p>
        </header>

        <Section title="Experience">
          {experiences.map((e) => (
            <Entry key={e.id} title={e.title} org={e.company} meta={e.period} sub={e.location}>
              <Bullets lines={e.achievements} />
            </Entry>
          ))}
        </Section>

        <Section title="Education">
          <Entry title={school.degree} org={school.name} meta={school.period} sub={`${school.note} · GPA ${school.gpa}`}>
            <p className="text-[0.74rem]">Minors: {minors.join(', ')}</p>
            <p className="text-[0.74rem]">{honors.join(' · ')}</p>
          </Entry>
        </Section>

        <Section title="Projects">
          {projects.slice(0, FEATURED).map((p) => (
            <Entry key={p.id} title={p.title} meta={p.year}>
              <Bullets lines={p.description.slice(0, 1)} />
              <p className="text-[0.68rem] text-muted">{p.technologies.join(' · ')}</p>
            </Entry>
          ))}
          <p className="text-[0.74rem]">
            <span className="font-bold">Also built: </span>
            {projects
              .slice(FEATURED)
              .map((p) => `${p.title.split(' — ')[0]} (${p.year})`)
              .join(' · ')}
          </p>
        </Section>

        <Section title="Leadership, honors & certifications" columns>
          {leadership.map((l) => (
            <Entry key={l.id} title={l.title} org={l.org} meta={l.period} stacked />
          ))}
        </Section>

        <Section title="Skills">
          <dl className="space-y-1 text-[0.72rem]">
            {skillGroups.map((g) => (
              <div key={g.title} className="grid grid-cols-[9.5rem_1fr] gap-2">
                <dt className="font-bold">{g.title}</dt>
                <dd>{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </article>
    </main>
  );
}
