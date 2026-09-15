'use client';

import { motion } from 'framer-motion';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  achievements: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: 'harvard-endpoint',
    title: 'Endpoint Systems Engineer Intern',
    company: 'Harvard University Information Technology',
    location: 'Cambridge, MA',
    period: 'Jan 2025 — Present',
    current: true,
    achievements: [
      'Managed over 20,000 macOS, Windows, and Linux endpoints; maintained system stability.',
      'Led large-scale stakeholder meetings and development initiatives; drove software deployments.',
      "Acted as service owner/engineer for the university's data retention service.",
      'Owned a 1,000-device scope remediation effort, closing a three-year backlog ahead of architecting a new process.',
      'Used Jira for Agile project management to streamline development.',
      'Scripted applications to optimize IT processes and operational efficiency.',
    ],
  },
  {
    id: 'wicked-pickleball',
    title: 'Technical Program and Operations Manager',
    company: 'Wicked Pickleball (RSVP LLC)',
    location: 'Remote',
    period: 'Jun 2025 — Sep 2025',
    achievements: [
      'Managed a team of sales and marketing specialists; piloted and managed private label and brand deal product lines.',
      'Served as engineer and service owner for MVP testing and development; accelerated new platform innovation.',
      'Oversaw contractors and ensured project completion.',
    ],
  },
  {
    id: 'mouth-watchers',
    title: 'IT Services Consultant',
    company: 'Mouth Watchers LLC',
    location: 'Remote',
    period: 'Jun 2025 — Sep 2025',
    achievements: [
      'Engineered a migration from Network Solutions to Google for email services and hosting; minimized downtime to 15 minutes.',
      'Provided ongoing tier 1 IT support post-migration; maintained 100% service uptime and user productivity.',
    ],
  },
  {
    id: 'wit-tutor',
    title: 'Computer Science Tutor',
    company: 'Wentworth Institute of Technology',
    location: 'Boston, MA',
    period: 'Jan 2024 — Jan 2025',
    achievements: [
      'Tutored Computer Science students, providing 1-on-1 appointment services to 4,000 students.',
      'Developed individualized plans for each student, tailoring support to course needs.',
    ],
  },
  {
    id: 'harvard-support',
    title: 'Technical Support Engineer Intern',
    company: 'Harvard University Information Technology',
    location: 'Cambridge, MA',
    period: 'Apr 2024 — Aug 2024',
    achievements: [
      'Mentored new contractors while providing field support and resolving tier 2 technical issues.',
      'Authored user guides and technical documentation for developed scripts and applications, optimizing team workflows.',
    ],
  },
  {
    id: 'pjyc',
    title: 'Sailing Instructor',
    company: 'Port Jefferson Yacht Club',
    location: 'Port Jefferson, NY',
    period: 'May 2019 — Aug 2023',
    achievements: [
      'Taught sailing to 300–400 students (ages 6–75), developing comfort and racing skills.',
      'Instructed in group and private settings, achieving student readiness for basic races.',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;01</span>
          <h2 className="text-display font-bold">Experience</h2>
        </motion.div>

        <div className="divide-y divide-border">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              viewport={{ once: true }}
              className="grid gap-4 py-8 sm:grid-cols-12 sm:gap-8"
            >
              <div className="sm:col-span-4">
                <h3 className="font-bold leading-snug">{exp.title}</h3>
                <p className="mt-1 text-muted">{exp.company}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.1em] text-muted">
                  {exp.period}
                  {exp.current && (
                    <span className="ml-2 rounded border border-foreground px-1.5 py-0.5 text-foreground">
                      current
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted">{exp.location}</p>
              </div>

              <ul className="sm:col-span-8 space-y-2.5">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="flex gap-3 text-muted">
                    <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                    <span>{achievement}</span>
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
