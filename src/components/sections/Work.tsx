'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../SectionHeading';
import { experiences, type ExperienceItem } from '@/data/work';
import { CollapsePanel, ExpandOverlay, useDisclosure } from '../mobile/Disclosure';
import { useSpotlight } from '@/lib/useSpotlight';


export default function Work() {
  const listRef = useRef<HTMLDivElement>(null);
  useSpotlight(listRef);

  return (
    <section id="work" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="01" title="Work" kicker="7 roles, newest first." />

        {/* Timeline rail: a continuous hairline with a node per role. */}
        <div ref={listRef} className="spotlight-group relative space-y-4 sm:space-y-0">
          <div
            className="absolute bottom-6 left-[5px] top-3 hidden w-px bg-border sm:block"
            aria-hidden
          />

          {experiences.map((exp, index) => (
            <WorkEntry key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** One role. On phones the bullets collapse behind a tap; the current role starts open. */
function WorkEntry({ exp, index }: { exp: ExperienceItem; index: number }) {
  const { open, toggle, panelId } = useDisclosure(Boolean(exp.current));
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      viewport={{ once: true, margin: '-40px' }}
      data-spotlight
      className={`spotlight-card relative rounded-md border p-5 transition-colors sm:rounded-none sm:border-0 sm:border-b sm:border-border sm:py-8 sm:pl-8 ${
        exp.current
          ? 'border-foreground bg-card sm:bg-transparent'
          : 'border-border bg-card hover:border-foreground sm:bg-transparent'
      }`}
    >
      <span
        className={`absolute left-0 top-10 hidden h-[11px] w-[11px] rounded-full border-2 sm:block ${
          exp.current
            ? 'border-foreground bg-accent'
            : 'border-border bg-background'
        }`}
        aria-hidden
      />

      <div className="grid sm:grid-cols-12 sm:gap-8">
        <div className="pr-10 sm:col-span-4 sm:pr-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.1em] text-muted">{exp.period}</p>
            {exp.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.1em]">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                current
              </span>
            )}
          </div>
          <h3 className="font-display mt-2 font-bold leading-snug">{exp.title}</h3>
          <p className="mt-1 text-muted">{exp.company}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted">
            {exp.location}
          </p>
        </div>

        <CollapsePanel open={open} id={panelId} className="sm:col-span-8">
          <ul className="space-y-2.5 pt-4 sm:pt-0">
            {exp.achievements.map((achievement, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted sm:text-base">
                <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted sm:mt-2.5" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {exp.stack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-border px-1.5 py-0.5 text-xs text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </CollapsePanel>
      </div>

      <ExpandOverlay open={open} onToggle={toggle} controls={panelId} label={`${exp.title}, ${exp.company}`} />
    </motion.article>
  );
}
