import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, FileText, FlaskConical, Github, Smartphone } from 'lucide-react';
import ProjectAnimation from '@/components/animations';
import { projects, type Project, type Shot } from '@/data/projects';

// One static page per project, generated at build time for the Pages export.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

const split = (title: string) => {
  const [name, ...rest] = title.split(' — ');
  return { name, subtitle: rest.join(' — ') };
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  const { name } = split(project.title);
  const title = `${name} — Jason Dank`;
  const description = project.description[0];
  // Drawn from the project's animation by scripts/build-og.mjs.
  const image = { url: `/og/${project.id}.png`, width: 1200, height: 630, alt: `${project.title}: case study` };
  return {
    title,
    description,
    openGraph: {
      type: 'article',
      url: `/projects/${project.id}/`,
      siteName: 'Jason Dank',
      title,
      description,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = projects.findIndex((p) => p.id === id);
  if (index < 0) notFound();
  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const { name, subtitle } = split(project.title);
  const shots = project.shots ?? [];
  const phones = shots.filter((s) => s.frame === 'phone');
  const desktops = shots.filter((s) => s.frame === 'desktop');
  const cards = shots.filter((s) => s.frame === 'card');

  return (
    <main id="main" className="min-h-screen">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              <Link href="/#projects" className="underline decoration-border underline-offset-4 hover:text-foreground">
                Projects
              </Link>{' '}
              / {project.year} · {index + 1} of {projects.length}
            </p>
            {/* Step through the case studies without going back to the list. */}
            <nav aria-label="More projects" className="flex shrink-0 gap-2">
              <StepLink project={prev} direction="previous" />
              <StepLink project={next} direction="next" />
            </nav>
          </div>
          <h1 className="mt-4 font-display text-display font-extrabold">{name}</h1>
          {subtitle && <p className="mt-2 max-w-3xl text-lg italic text-muted sm:text-xl">{subtitle}</p>}
          <ProjectLinks project={project} />
        </div>
      </section>

      <ProjectAnimation id={project.id} />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-xs uppercase tracking-[0.15em] text-muted">What it does</h2>
            {project.summary && <p className="mt-4 text-lg leading-relaxed">{project.summary}</p>}
            <ul className="mt-4 space-y-3">
              {project.description.map((line, i) => (
                <li key={i} className="flex gap-3 leading-relaxed">
                  <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {project.proud && (
              <blockquote className="mt-8 border-l-2 border-accent pl-4">
                <p className="text-xs uppercase tracking-[0.15em] text-muted">What I&apos;m proudest of</p>
                <p className="mt-2 text-lg leading-relaxed">{project.proud}</p>
              </blockquote>
            )}
          </div>

          <aside className="space-y-8 lg:col-span-5">
            <div>
              <h2 className="text-xs uppercase tracking-[0.15em] text-muted">Built with</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded border border-border px-2 py-1 text-sm text-muted">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.betaUrl && (
              <div className="flex items-center gap-5 rounded-md border border-border bg-card p-5">
                {/* Scan from a laptop; on a phone the link right beside it does the job. */}
                <Image
                  src="/projects/regattatrack/testflight-qr.svg"
                  width={112}
                  height={112}
                  alt="QR code for the RegattaTrack TestFlight beta"
                  className="hidden h-28 w-28 shrink-0 rounded bg-white p-1 sm:block"
                />
                <div>
                  <p className="font-bold">Join the beta</p>
                  <p className="mt-1 text-sm text-muted">RegattaTrack is in public beta on TestFlight for iPhone.</p>
                  <a
                    href={project.betaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    Open TestFlight
                  </a>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {shots.length > 0 && (
        <section className="border-b border-border bg-card/60" aria-labelledby="screenshots">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            <h2 id="screenshots" className="text-xs uppercase tracking-[0.15em] text-muted">
              Screenshots
            </h2>
            {phones.length > 0 && (
              <div className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
                {phones.map((shot) => (
                  <Phone key={shot.src} shot={shot} />
                ))}
              </div>
            )}
            {desktops.length + cards.length > 0 && (
              <div className="mt-6 grid items-start gap-8 md:grid-cols-2">
                {desktops.map((shot) => (
                  // Very wide images, like a diagram, take the full width so they stay legible.
                  <figure key={shot.src} className={`m-0 ${shot.width / shot.height > 3 ? 'md:col-span-2' : ''}`}>
                    <Image
                      src={shot.src}
                      width={shot.width}
                      height={shot.height}
                      alt={shot.alt}
                      className="h-auto w-full rounded-lg border border-border shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)]"
                    />
                    <figcaption className="mt-2 text-xs text-muted">{shot.alt}</figcaption>
                  </figure>
                ))}
                {cards.map((shot) => (
                  <figure key={shot.src} className="m-0">
                    <Image
                      src={shot.src}
                      width={shot.width}
                      height={shot.height}
                      alt={shot.alt}
                      className="h-auto w-full rounded-[1.4rem] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)]"
                    />
                    <figcaption className="mt-2 text-xs text-muted">{shot.alt}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function StepLink({ project, direction }: { project: Project; direction: 'previous' | 'next' }) {
  const label = `${direction === 'previous' ? 'Previous' : 'Next'} project: ${split(project.title).name}`;
  const Icon = direction === 'previous' ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={`/projects/${project.id}`}
      aria-label={label}
      title={label}
      className="press inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-foreground hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

function Phone({ shot }: { shot: Shot }) {
  return (
    <figure className="m-0 w-[min(15rem,70vw)] shrink-0 snap-start">
      <div className="overflow-hidden rounded-[2.2rem] border-[6px] border-[#101010] bg-[#101010] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)] ring-1 ring-border">
        <Image src={shot.src} width={shot.width} height={shot.height} alt={shot.alt} className="block h-auto w-full rounded-[1.75rem]" />
      </div>
      <figcaption className="mt-3 text-xs leading-snug text-muted">{shot.alt}</figcaption>
    </figure>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.githubUrl && { href: project.githubUrl, label: 'source', icon: Github },
    project.paperUrl && { href: project.paperUrl, label: 'read the paper', icon: FileText },
    project.betaUrl && { href: project.betaUrl, label: 'testflight beta', icon: FlaskConical },
    project.appStoreUrl && { href: project.appStoreUrl, label: 'app store', icon: Smartphone },
    project.demoUrl && { href: project.demoUrl, label: project.demoLabel ?? 'demo', icon: ExternalLink },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Github }[];
  if (!links.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          <l.icon className="h-3.5 w-3.5" />
          {l.label}
        </a>
      ))}
    </div>
  );
}
