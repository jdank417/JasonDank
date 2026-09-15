'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SectionHeading from '../SectionHeading';

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
    id: 'sailing-captain',
    title: 'President & Captain, Wentworth Sailing Team',
    org: 'NEISA Conference — Dinghy Class (FJ / 420 / Lark)',
    period: 'Spring 2023 — Spring 2026',
    description: [
      'Grew the team from two members to twenty-five and led it across 15+ regional regattas per season.',
      'Ran registration, the executive board, fundraisers, scrimmages, and practices; worked directly with the coach on competitive goals.',
      'Delivered the highest-performing season the program has had since 2019.',
    ],
  },
  {
    id: 'evp',
    title: 'Executive Vice President',
    org: 'Wentworth Student Government',
    period: 'Fall 2025 — Spring 2026',
    description: [
      'Led the Board of Directors in reorganizing and optimizing all processes, facilitating increased collaboration between directors and university officials as chairman.',
      'Applied Agile practices from co-op to student government, including a Jira board to keep initiatives on track.',
      'Oversaw the creation of a committee to run a hackathon brokered between Student Government and the School of Computing and Data Science.',
      'Implemented communication pipelines between all university units and board directors, optimizing feedback delivery.',
      'Coordinated with the Provost, Registrar, and faculty to resolve a clerical application error involving minor completion requirements.',
    ],
  },
  {
    id: 'ai-task-force',
    title: 'Task Force on Gen AI & Academic Integrity',
    org: 'Student Body Representative, Wentworth Institute of Technology',
    period: 'Fall 2025 — Spring 2026',
    description: [
      'Advised the task force on AI-based enhancements across campus and on integrating AI into the curriculum.',
      'Explored methods to help faculty detect, document, and minimize GenAI-based academic misconduct.',
      'Paneled at an AI Alliance event hosted at Wentworth alongside founders and CTOs of Boston-area AI and tech firms.',
    ],
  },
  {
    id: 'itsc',
    title: 'Information Technology Steering Committee',
    org: 'Student Body Representative, Wentworth Institute of Technology',
    period: 'Fall 2025 — Spring 2026',
    description: [
      'Guided campus-wide strategic technology decisions in partnership with the CIO, IT Executive Committee, and Project Management Team.',
      'Reviewed business proposals ahead of meetings, shaping technology procurement and implementation strategy.',
      'Contributed to a seven-figure learning management system procurement.',
    ],
  },
  {
    id: 'business-affairs',
    title: 'Director of Business Affairs',
    org: 'Wentworth Student Government',
    period: 'Fall 2024 — Fall 2025',
    description: [
      'Chaired the Business Affairs Committee; coordinated efforts between the student body and Dining, IT, Police, and Facilities.',
      'Shipped a barcode scanner web app giving students real-time price data in the campus grocery store, and introduced halal and kosher items to the dining hall.',
    ],
  },
  {
    id: 'hacking-injustice',
    title: 'Director of Technologies',
    org: 'Engineering Hope (Non-Profit) — Hacking Injustice 2025',
    period: 'Dec 2024 — Apr 2025',
    description: [
      'Built the digital infrastructure for an intercollegiate hackathon hosted at Harvard University.',
      'Procured tooling licenses ahead of the event and assembled a technical team to advise competing students.',
    ],
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
    <section id="leadership" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="03" title="Leadership & Certifications" />

        <div className="space-y-4 sm:space-y-0 sm:divide-y sm:divide-border">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              viewport={{ once: true, margin: '-40px' }}
              className="grid gap-4 rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground sm:grid-cols-12 sm:gap-8 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:py-8"
            >
              <div className="sm:col-span-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted">{item.period}</p>
                <h3 className="mt-2 font-bold leading-snug">{item.title}</h3>
                <p className="mt-1 text-sm text-muted sm:text-base">{item.org}</p>
                {credlyIds[item.id] && (
                  <a
                    href={`https://www.credly.com/badges/${credlyIds[item.id]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 py-1 text-xs font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    view credential
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <ul className="space-y-2.5 sm:col-span-8">
                {item.description.map((line, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted sm:text-base">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted sm:mt-2.5" />
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
