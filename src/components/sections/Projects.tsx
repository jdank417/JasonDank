'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FileText, FlaskConical, Github, Smartphone } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import { filters, projects, type Category } from '@/data/projects';


export default function Projects() {
  const [active, setActive] = useState<Category | 'all'>('all');

  const visible = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.categories.includes(active))),
    [active],
  );

  return (
    <section id="projects" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="02" title="Projects" kicker="10 projects — 2 on the App Store, 1 in public beta, 1 written up as a paper." />

        {/* Horizontally scrollable on phones so the filters never wrap into a wall. */}
        <div className="-mx-5 mb-8 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActive(filter.id)}
                aria-pressed={active === filter.id}
                className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
                  active === filter.id
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted hover:border-foreground hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground sm:p-6"
              >
                <span className="text-xs uppercase tracking-[0.1em] text-muted">
                  {project.year}
                </span>
                <h3 className="mt-2 font-bold leading-snug">{project.title}</h3>

                <ul className="mt-4 flex-1 space-y-2.5">
                  {project.description.map((line, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border px-1.5 py-0.5 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {(project.githubUrl ||
                  project.demoUrl ||
                  project.appStoreUrl ||
                  project.paperUrl ||
                  project.betaUrl) && (
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <Github className="h-3.5 w-3.5" />
                        source
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {project.demoLabel ?? 'demo'}
                      </a>
                    )}
                    {project.paperUrl && (
                      <a
                        href={project.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        read the paper
                      </a>
                    )}
                    {project.betaUrl && (
                      <a
                        href={project.betaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <FlaskConical className="h-3.5 w-3.5" />
                        testflight beta
                      </a>
                    )}
                    {project.appStoreUrl && (
                      <a
                        href={project.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        app store
                      </a>
                    )}
                  </div>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
