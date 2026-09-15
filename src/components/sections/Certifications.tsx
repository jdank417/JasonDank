'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface LeadershipItem {
  id: string;
  title: string;
  org: string;
  period: string;
  description: string[];
  credlyId?: string;
}

const items: LeadershipItem[] = [
  {
    id: 'evp',
    title: 'Executive Vice President',
    org: 'Wentworth Student Government',
    period: 'Fall 2025 — Present',
    description: [
      'Led the Board of Directors in reorganizing and optimizing all processes, facilitating increased collaboration between directors and university officials as chairman.',
      'Oversaw the creation of a committee to run a hackathon brokered between Student Government and the School of Computing and Data Science; continues to advise the committee and the Dean.',
      'Implemented communication pipelines/protocols between all university units and board directors, optimizing feedback delivery.',
      'Coordinated with the Provost, Registrar, and faculty to resolve a clerical application error involving minor completion requirements.',
    ],
  },
  {
    id: 'ai-task-force',
    title: 'Task Force on Gen AI & Academic Integrity',
    org: 'Student Body Representative, Wentworth Institute of Technology',
    period: 'Fall 2025 — Present',
    description: [
      'Advised the task force on AI-based enhancements across campus and how to better integrate AI into the curriculum.',
      'Paneled at an AI Alliance event hosted at Wentworth alongside founders and CTOs of Boston-area AI and tech firms.',
    ],
  },
  {
    id: 'itsc',
    title: 'Information Technology Steering Committee',
    org: 'Student Body Representative, Wentworth Institute of Technology',
    period: 'Fall 2025 — Present',
    description: [
      'Reviewed business proposals ahead of meetings, guiding campus technology procurement and implementation strategy.',
      'Contributed to a seven-figure learning management system procurement.',
    ],
  },
  {
    id: 'sailing-captain',
    title: 'Captain, Wentworth Sailing Team',
    org: 'NEISA Conference — Dinghy Class (FJ / 420 / Lark)',
    period: 'Spring 2023 — Present',
    description: ['Led a 25-member competitive sailing team across 15+ regional regattas per season.'],
  },
  {
    id: 'business-affairs',
    title: 'Director of Business Affairs',
    org: 'Wentworth Student Government',
    period: 'Fall 2024 — Fall 2025',
    description: ['Chaired the Business Affairs Committee; coordinated efforts between the student body and Dining, IT, Police, and Facilities.'],
  },
  {
    id: 'hacking-injustice',
    title: 'Director of Technologies',
    org: 'Engineering Hope (Non-Profit) — Hacking Injustice 2025',
    period: 'Fall 2024 — Spring 2025',
    description: ['Director of Technologies for Hacking Injustice, an intercollegiate hackathon hosted at Harvard University.'],
  },
  {
    id: 'jamf',
    title: 'Jamf Certified Associate — Jamf Protect / Jamf Pro',
    org: 'Jamf',
    period: 'Jan 2025 — Mar 2025',
    description: [
      'Certified in Jamf Protect and Jamf Pro, endpoint security and mobile device management (MDM) solutions for Apple products.',
    ],
  },
];

const credlyIds: Record<string, string> = {
  jamf: 'e5fd2530-7870-4762-9f30-2c537853b165',
};

export default function Certifications() {
  return (
    <section id="leadership" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;03</span>
          <h2 className="text-display font-bold">Leadership &amp; Certifications</h2>
        </motion.div>

        <div className="divide-y divide-border">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              viewport={{ once: true }}
              className="grid gap-4 py-8 sm:grid-cols-12 sm:gap-8"
            >
              <div className="sm:col-span-4">
                <h3 className="font-bold leading-snug">{item.title}</h3>
                <p className="mt-1 text-muted">{item.org}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.1em] text-muted">{item.period}</p>
                {credlyIds[item.id] && (
                  <a
                    href={`https://www.credly.com/badges/${credlyIds[item.id]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    view credential
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <ul className="sm:col-span-8 space-y-2.5">
                {item.description.map((line, i) => (
                  <li key={i} className="flex gap-3 text-muted">
                    <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
