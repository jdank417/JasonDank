'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Trophy } from 'lucide-react';
import Burgee, { burgeeLabel, type BurgeeKey } from '@/components/Burgee';

interface RaceEntry {
  id: string;
  boat: string;
  period?: string;
  venue: string;
  flags: BurgeeKey[];
  result?: string;
  bullets: string[];
}

const racing: RaceEntry[] = [
  {
    id: 'fawn-libowitz',
    boat: 'Fawn Libowitz — MAT 1070',
    period: 'Apr 2025 — Present',
    venue: 'Boston Harbor — MBSA',
    flags: ['mbsa', 'figawi'],
    result: 'Won Figawi 2026',
    bullets: [
      'Circulated between mast, pit, and bow throughout the season.',
      'Numerous regattas throughout the season across the MBSA (Spring, Summer, Fall).',
      'Pumpkin Pursuit Series.',
      'Wednesday night racing series — 2nd place overall.',
      'Thursday night racing series — 1st place overall.',
    ],
  },
  {
    id: 'tango',
    boat: 'Tango — IOD 16',
    venue: 'Marblehead — MRA',
    flags: ['iod', 'mra'],
    bullets: ['Jib trim and spinnaker for various MRA races.', 'Marblehead Race Week.'],
  },
  {
    id: 'gypsey',
    boat: 'Gypsey — IOD 7',
    venue: 'Marblehead & Fishers Island, NY',
    flags: ['iod', 'cyc'],
    result: 'IOD North Americans',
    bullets: [
      'My most-sailed keelboat — many seasons of racing aboard IOD 7.',
      'IOD North American Championship at Fishers Island, NY.',
      'Corinthian Classic Yacht Regatta.',
    ],
  },
  {
    id: 'etchells',
    boat: 'Etchells (1071 / 1099)',
    venue: 'Marblehead — MRA',
    flags: ['mra'],
    bullets: [
      'Bow on Etchells 1071 for a few MRA races.',
      'Bow on Etchells 1099 (LiRuPa) for an MRA race.',
    ],
  },
  {
    id: 'crew-call',
    boat: 'Crew Call',
    period: 'Jul 2024 — Present',
    venue: 'Boston Harbor & Marblehead',
    flags: ['byc', 'eyc', 'iod'],
    bullets: [
      'Raced on the BYC team racing team (bow) for the Eastern Yacht Club Halloween team race.',
      'Raced with ARES (C&C 40), doing bow for a few PHRF and pursuit events.',
      'Raced an MRA with IOD 49 Kungsornen doing jib and spinnaker.',
      'Raced on IOD Desperado in Marblehead, trimming jib — MRA (2024).',
    ],
  },
];

interface ClubEntry {
  id: string;
  flag: BurgeeKey;
  name: string;
  location: string;
  period: string;
  bullets: string[];
  boats: string;
  link?: { label: string; href: string };
}

const clubs: ClubEntry[] = [
  {
    id: 'squantum',
    flag: 'syc',
    name: 'Squantum Yacht Club',
    location: 'Quincy, MA',
    period: '2024 — Present',
    bullets: [
      'Joined in the summer of 2024.',
      'Served as Launch Chairman for the summer of 2025.',
      'Quickly assumed the role of Assistant Director of Adult Sailing.',
      'Assisted with the Junior program, primarily the race team.',
      'Race Committee for the Lipton Cup 2024.',
    ],
    boats: 'Pearson 26 / J22 / Catalina 32 / C420 / Sonar 22 / Mercury (Keel) / Rhodes 19 / Laser',
  },
  {
    id: 'community-boating',
    flag: 'cbi',
    name: 'Community Boating Incorporated',
    location: 'Boston, MA',
    period: '2024 — Present',
    bullets: [
      'Joined in the summer of 2024.',
      'Became certified in almost their entire fleet of boats.',
      'Raced in the Monday night laser series.',
    ],
    boats: 'Fleet-certified',
  },
  {
    id: 'wentworth',
    flag: 'wit',
    name: 'Wentworth Sailing',
    location: 'Boston, MA',
    period: '2022 — 2026',
    bullets: [
      'Joined as a freshman in 2022; moved into the Captain role in the spring of freshman year and later served as President.',
      'Built the team from two to twenty-five members.',
      'Fall 2024: achieved the highest-scoring season since 2019.',
    ],
    boats: 'FJ / Z420 / E420 / Lark / Rhodes 19',
    link: { label: 'techscore', href: 'https://scores.collegesailing.org/schools/wentworth-institute/' },
  },
  {
    id: 'pjyc',
    flag: 'pjyc',
    name: 'Port Jefferson Yacht Club',
    location: 'Long Island — North Shore, NY',
    period: '2017 — 2023',
    bullets: [
      'Built out the race program, mostly scrimmages with local schools due to size.',
      'Group lessons, private lessons, and race training.',
      'Handled lesson plans and ensured proper instruction by subordinate instructors.',
      'Managed COVID-19 regulations.',
    ],
    boats: "C420 / Opti / Sunfish / Daysailer 16' / MacGregor 26 / J70 / Catalina",
  },
  {
    id: 'westhampton',
    flag: 'wys',
    name: 'Westhampton Yacht Squadron',
    location: 'Long Island — South Shore, NY',
    period: '2012 — 2016',
    bullets: [
      'First sailing experience — mostly learn-to-sail with some light racing.',
      'Sailed around the Great South Bay on various boats.',
    ],
    boats: 'Opti / JY / C420 / Flying Scot',
  },
];

// Every burgee shown on the page, clubs first, in the order they appear.
const allFlags: BurgeeKey[] = [
  ...clubs.map((club) => club.flag),
  ...Array.from(new Set(racing.flatMap((entry) => entry.flags))),
];

const highlights = [
  { label: 'Won Figawi 2026', detail: 'Fawn Libowitz — MAT 1070' },
  { label: 'IOD North Americans', detail: 'Fishers Island, NY — IOD 7' },
  { label: '1st overall, Thursday series', detail: 'Boston Harbor — MBSA' },
];

export default function SailingPage() {
  return (
    <main id="main" className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-graph opacity-60"
          style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
        />
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
            <h2 className="text-display font-bold">Certifications</h2>
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
            <h2 className="text-display font-bold">Racing</h2>
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
                      <Burgee key={flag} name={flag} />
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
            <h2 className="text-display font-bold">Clubs</h2>
          </div>

          {/* Burgee key — every club and fleet flown across the page. */}
          <div className="mb-10 flex flex-wrap gap-x-5 gap-y-3">
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                viewport={{ once: true }}
                className="grid gap-4 py-7 sm:grid-cols-12 sm:gap-8"
              >
                <div className="sm:col-span-4">
                  <div className="mb-2">
                    <Burgee name={club.flag} className="h-6 w-9" />
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
                    {club.boats.split(' / ').map((boat) => (
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
