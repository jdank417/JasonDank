'use client';

import { motion } from 'framer-motion';

interface Role {
  title: string;
  org: string;
  period: string;
  detail: string;
}

const roles: Role[] = [
  {
    title: 'Endpoint Systems Engineer Intern',
    org: 'Harvard University',
    period: 'Aug 2025 – Present',
    detail:
      'Continued work with Harvard’s Endpoint Solutions team, focusing on scripting, Jamf workflows, and enterprise endpoint operations.'
  },
  {
    title: 'IT Services Consultant',
    org: 'MouthWatchers',
    period: 'Jun 2025 – Aug 2025',
    detail:
      'Audited core IT systems and led migration of company email/hosting from Network Solutions to Google with minimal downtime.'
  },
  {
    title: 'Technical Program and Operations Manager',
    org: 'Wicked Pickleball',
    period: 'May 2025 – Aug 2025',
    detail:
      'Managed cross-functional contributors, coordinated contractors, and supported MVP testing and platform development operations.'
  },
  {
    title: 'Endpoint Systems Engineer Intern',
    org: 'Harvard University',
    period: 'Jan 2025 – Apr 2025',
    detail:
      'Built monitoring tooling, developed macOS renaming automation, and improved imaging/onboarding documentation for field teams.'
  },
  {
    title: 'Technical Support Engineer Intern',
    org: 'Harvard University',
    period: 'Apr 2024 – Aug 2024',
    detail:
      'Helped secure and support multi-OS environments for 2,000+ users while automating IT workflows with PowerShell, Batch, and Python.'
  }
];

export default function Experience() {
  return (
    <section id="experience" className="bg-[#060913] px-6 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Experience</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Recent roles & leadership trajectory</h2>
        </motion.div>

        <div className="space-y-4">
          {roles.map((role, idx) => (
            <motion.article
              key={`${role.title}-${role.period}`}
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{role.title}</h3>
                  <p className="text-cyan-200">{role.org}</p>
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{role.period}</p>
              </div>
              <p className="mt-4 text-slate-300">{role.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
