'use client';

import { motion } from 'framer-motion';

const skillGroups = [
  {
    title: 'Programming Languages',
    items: ['Python', 'Swift', 'C', 'Java', 'JavaScript', 'R', 'SQLite', 'MySQL', 'LC-3 Assembly'],
  },
  {
    title: 'Software & Systems',
    items: [
      'GitHub',
      'GitLab',
      'JetBrains IDEs',
      'VS Code',
      'Cisco CLI',
      'Linux',
      'bash',
      'PowerShell',
      'Wireshark',
      'Hyper-V',
      'Oracle VM VirtualBox',
      'VMware',
      'Socket Programming',
      'Apple OS (iOS / watchOS / macOS / iPadOS / tvOS)',
      'Windows',
      'ServiceNow',
      'SCCM',
      'Jamf Pro / Protect',
      'Asset Track',
      'WandB',
      'Jira',
      'MSFT Project',
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;05</span>
          <h2 className="text-display font-bold">Skills</h2>
        </motion.div>

        <div className="space-y-10">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <p className="mb-3 text-xs uppercase tracking-[0.1em] text-muted">{group.title}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded border border-border px-2 py-1 text-sm text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
