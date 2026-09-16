'use client';

import { motion } from 'framer-motion';
import SectionHeading from '../SectionHeading';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  achievements: string[];
  stack: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: 'fidelity-private-shares',
    title: 'Full Stack Software Engineer',
    company: 'Fidelity Investments',
    location: 'Boston Seaport, MA — On-site',
    period: 'Apr 2026 — Present',
    current: true,
    achievements: [
      'Build on the Fidelity Private Shares platform, developing scalable solutions for private market investments.',
      'Ship full-stack applications with modern web technologies, improving the experience for private equity and venture capital transactions.',
      'Partner with cross-functional teams to deliver financial technology used by institutional and individual investors.',
    ],
    stack: ['React', 'Node.js', 'Java', 'Spring Boot', 'Private Markets', 'Fintech'],
  },
  {
    id: 'harvard-endpoint',
    title: 'Endpoint Systems Engineer Intern',
    company: 'Harvard University Information Technology',
    location: 'Cambridge, MA — Hybrid',
    period: 'Jan 2025 — Mar 2026 · two terms',
    achievements: [
      'Managed over 20,000 macOS, Windows, and Linux endpoints; maintained system stability across the university.',
      "Acted as service owner and engineer for the university's data retention service.",
      'Owned a 1,000-device remediation effort, closing a three-year backlog ahead of architecting a replacement process.',
      'Built a Mac device renaming solution now used across Harvard departments, plus custom cross-platform monitoring applications.',
      'Automated workflows with PowerShell and Unix scripting; contributed to cloud printing infrastructure.',
      'Led large-scale stakeholder meetings and ran delivery in Jira using Agile practices.',
    ],
    stack: ['Shell', 'PowerShell', 'Jamf Pro', 'SCCM', 'Linux', 'Jira Align'],
  },
  {
    id: 'mouth-watchers',
    title: 'IT Services Consultant',
    company: 'Mouth Watchers LLC',
    location: 'Beverly, MA — Hybrid',
    period: 'Jun 2025 — Aug 2025',
    achievements: [
      'Audited every technical system in the company, then engineered a migration from Network Solutions to Google for email and hosting.',
      'Held total downtime to 15 minutes across the cutover and provided ongoing tier 1 support post-launch.',
    ],
    stack: ['DevOps', 'Google Workspace', 'DNS', 'Migration'],
  },
  {
    id: 'wicked-pickleball',
    title: 'Technical Program and Operations Manager',
    company: 'Wicked Pickleball (RSVP LLC)',
    location: 'Boston, MA — Hybrid',
    period: 'May 2025 — Aug 2025',
    achievements: [
      'Managed a team of sales and marketing specialists; piloted private label and brand deal product lines.',
      'Served as lead engineer and service owner for MVP testing and development of new platforms.',
      'Oversaw contractors and drove projects to completion.',
    ],
    stack: ['Agile', 'MVP Development', 'Program Management'],
  },
  {
    id: 'wit-tutor',
    title: 'Computer Science Tutor',
    company: 'Wentworth Institute of Technology',
    location: 'Boston, MA',
    period: 'Jan 2024 — Jan 2025',
    achievements: [
      'Tutored students across the School of Computing and Data Science in 1-on-1 appointments and group review sessions.',
      'Developed individualized plans for each student, tailoring support to their course needs.',
    ],
    stack: ['Java', 'Python', 'C', 'Teaching'],
  },
  {
    id: 'harvard-support',
    title: 'Technical Support Engineer Intern',
    company: 'Harvard University Information Technology',
    location: 'Cambridge, MA — On-site',
    period: 'Apr 2024 — Aug 2024',
    achievements: [
      'Maintained security standards across the Allston/SEAS network for 2,000+ users; imaged and deployed machines to users and labs.',
      'Built automation tools in PowerShell, Batch, and Python, and authored documentation that improved technician onboarding.',
      'Mentored new contractors and worked with management on incident response during the 2024 CrowdStrike outage.',
    ],
    stack: ['Python', 'PowerShell', 'ServiceNow', 'Jamf', 'SCCM'],
  },
  {
    id: 'pjyc',
    title: 'Sailing Instructor',
    company: 'Port Jefferson Yacht Club',
    location: 'Port Jefferson, NY',
    period: 'May 2019 — Aug 2023',
    achievements: [
      'Taught sailing to 300–400 students (ages 6–75), developing comfort on the water and racing skills.',
      'Instructed in group and private settings, bringing students to readiness for their first races.',
    ],
    stack: ['Instruction', 'Race Coaching'],
  },
];

export default function Work() {
  return (
    <section id="work" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="01" title="Work" kicker="7 roles, newest first." />

        {/* Timeline rail: a continuous hairline with a node per role. */}
        <div className="relative space-y-4 sm:space-y-0">
          <div
            className="absolute bottom-6 left-[5px] top-3 hidden w-px bg-border sm:block"
            aria-hidden
          />

          {experiences.map((exp, index) => (
            <motion.article
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              viewport={{ once: true, margin: '-40px' }}
              className={`relative rounded-md border p-5 transition-colors sm:rounded-none sm:border-0 sm:border-b sm:border-border sm:py-8 sm:pl-8 ${
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

              <div className="grid gap-4 sm:grid-cols-12 sm:gap-8">
                <div className="sm:col-span-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.1em] text-muted">{exp.period}</p>
                    {exp.current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.1em]">
                        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                        current
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-bold leading-snug">{exp.title}</h3>
                  <p className="mt-1 text-muted">{exp.company}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted">
                    {exp.location}
                  </p>
                </div>

                <div className="sm:col-span-8">
                  <ul className="space-y-2.5">
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
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
