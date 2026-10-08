'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import { CollapsePanel, ExpandOverlay, useDisclosure } from '../mobile/Disclosure';
import { credlyIds, leadership as items, type LeadershipItem } from '@/data/leadership';

export default function Certifications() {
  return (
    <section id="leadership" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="03" title="Leadership, Honors & Certifications" />

        <div className="space-y-4 sm:space-y-0 sm:divide-y sm:divide-border">
          {items.map((item, index) => (
            <LeadershipEntry key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** One leadership role, honor or certification. Bullets collapse behind a tap on phones. */
function LeadershipEntry({ item, index }: { item: LeadershipItem; index: number }) {
  const { open, toggle, panelId } = useDisclosure(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      viewport={{ once: true, margin: '-40px' }}
      className="relative grid rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground sm:grid-cols-12 sm:gap-8 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:py-8"
    >
      <div className="pr-10 sm:col-span-4 sm:pr-0">
        <p className="text-xs uppercase tracking-[0.1em] text-muted">{item.period}</p>
        <h3 className="font-display mt-2 font-bold leading-snug">{item.title}</h3>
        <p className="mt-1 text-sm text-muted sm:text-base">{item.org}</p>
        {credlyIds[item.id] && (
          <a
            href={`https://www.credly.com/badges/${credlyIds[item.id]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-[1] mt-3 inline-flex items-center gap-1.5 py-1 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            view credential
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <CollapsePanel open={open} id={panelId} className="sm:col-span-8">
        <ul className="space-y-2.5 pt-4 sm:pt-0">
          {item.description.map((line, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted sm:text-base">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted sm:mt-2.5" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </CollapsePanel>

      <ExpandOverlay open={open} onToggle={toggle} controls={panelId} label={item.title} />
    </motion.div>
  );
}
