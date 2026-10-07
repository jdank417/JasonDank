'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Trophy } from 'lucide-react';
import Burgee, { burgeeLabel, type BurgeeKey } from '@/components/Burgee';
import { clubs, highlights, racing } from '@/data/sailing';
import RhumbLines from '@/components/RhumbLines';
import ScrambleText from '@/components/ScrambleText';

// Every burgee shown on the page, clubs first, in the order they appear.
const allFlags: BurgeeKey[] = Array.from(
  new Set<BurgeeKey>([
    ...clubs.map((club) => club.flag),
    ...racing.flatMap((entry) => entry.flags),
  ]),
);


export default function SailingPage() {
  return (
    <main id="main" className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-graph opacity-35"
          style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
        />
        <RhumbLines />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.15em] text-muted"
          >
            <span>Boston, MA</span>
            <span>/</span>
            <span>US Sailing: Small Boat Instructor Level 1</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-huge font-bold"
          >
            Jason Dank
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-huge italic font-normal text-muted"
          >
            sailing résumé.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted"
          >
            Racing, instructing, and club sailing since 2012 — President and
            Captain of the Wentworth Sailing Team through 2026, racing dinghies
            and keelboats around Boston Harbor and Marblehead.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 grid gap-px overflow-hidden rounded-md border border-border sm:grid-cols-3"
          >
            {highlights.map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-card px-5 py-4">
                <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-sm font-bold leading-snug">{item.label}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-muted">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Horizon line — a bit of water under the masthead. */}
        <svg
          aria-hidden
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="relative block h-8 w-full text-border"
        >
          <path
            d="M0 26 Q 75 14 150 26 T 300 26 T 450 26 T 600 26 T 750 26 T 900 26 T 1050 26 T 1200 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M0 34 Q 75 24 150 34 T 300 34 T 450 34 T 600 34 T 750 34 T 900 34 T 1050 34 T 1200 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 flex items-baseline gap-4 border-b border-border pb-4">
            <span className="text-sm text-muted">§00</span>
            <h2 className="text-display font-bold">
              <ScrambleText text="Certifications" />
            </h2>
          </div>
          <div className="flex gap-3">
            <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
            <p className="text-muted">
              <span className="font-medium text-foreground">US Sailing: Small Boat Instructor Level 1</span>
              {' '}— Teaching and Coaching Fundamentals.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 flex items-baseline gap-4 border-b border-border pb-4">
            <span className="text-sm text-muted">§01</span>
            <h2 className="text-display font-bold">
              <ScrambleText text="Racing" />
            </h2>
          </div>

          <div className="divide-y divide-border">
            {racing.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                viewport={{ once: true }}
                className="grid gap-4 py-7 sm:grid-cols-12 sm:gap-8"
              >
                <div className="sm:col-span-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    {entry.flags.map((flag) => (
                      <Burgee key={flag} name={flag} className="h-8 w-12" />
                    ))}
                  </div>
                  <h3 className="font-bold leading-snug">{entry.boat}</h3>
                  <p className="mt-1 text-sm text-muted">{entry.venue}</p>
                  {entry.period && (
                    <p className="mt-2 text-xs uppercase tracking-[0.1em] text-muted">{entry.period}</p>
                  )}
                  {entry.result && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-foreground bg-accent px-2.5 py-1 text-xs font-medium text-accent-ink">
                      <Trophy className="h-3 w-3" />
                      {entry.result}
                    </p>
                  )}
                </div>
                <ul className="sm:col-span-8 space-y-2.5">
                  {entry.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-muted">
                      <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-6 flex items-baseline gap-4 border-b border-border pb-4">
            <span className="text-sm text-muted">§02</span>
            <h2 className="text-display font-bold">
              <ScrambleText text="Clubs" />
            </h2>
          </div>

          {/* Burgee key — every club and fleet flown across the page. */}
          <div className="mb-10 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {allFlags.map((flag) => (
              <span key={flag} className="flex items-center gap-2 text-xs text-muted">
                <Burgee name={flag} />
                {burgeeLabel(flag)}
              </span>
            ))}
          </div>

          <div className="divide-y divide-border">
            {clubs.map((club, index) => (
              <motion.div
                key={club.id}
                id={`club-${club.id}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                viewport={{ once: true }}
                className="grid gap-4 py-7 sm:grid-cols-12 sm:gap-8"
              >
                <div className="sm:col-span-4">
                  <div className="mb-2">
                    <Burgee name={club.flag} className="h-9 w-[54px]" />
                  </div>
                  <h3 className="font-bold leading-snug">{club.name}</h3>
                  <p className="mt-1 text-muted">{club.location}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.1em] text-muted">{club.period}</p>
                  {club.link && (
                    <a
                      href={club.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                    >
                      {club.link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="sm:col-span-8">
                  <ul className="space-y-2.5">
                    {club.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-muted">
                        <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(club.boats ? club.boats.split(' / ') : []).map((boat) => (
                      <span
                        key={boat}
                        className="rounded border border-border px-1.5 py-0.5 text-xs text-muted"
                      >
                        {boat}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
