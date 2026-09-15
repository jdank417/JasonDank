'use client';

import { motion } from 'framer-motion';
import SectionHeading from '../SectionHeading';

const skillGroups = [
  {
    title: 'Languages',
    items: ['Python', 'Java', 'Swift', 'JavaScript', 'TypeScript', 'C / C++', 'SQL', 'R', 'Bash', 'PowerShell', 'LC-3 Assembly'],
  },
  {
    title: 'Full-stack & fintech',
    items: ['React', 'Node.js', 'Spring Boot', 'Next.js', 'Flask', 'REST APIs', 'SQLite', 'MySQL', 'Cloudflare Workers', 'Render'],
  },
  {
    title: 'Machine learning & data',
    items: ['PyTorch', 'TensorFlow & Keras', 'scikit-learn', 'Pandas & NumPy', 'Hugging Face', 'Weights & Biases', 'NLP', 'Data Visualization'],
  },
  {
    title: 'Platform & DevOps',
    items: ['Docker', 'AWS', 'Azure', 'CI/CD (GitHub Actions, GitLab)', 'Linux Administration', 'Windows Administration', 'Tailscale', 'CUDA / WSL2'],
  },
  {
    title: 'Enterprise IT',
    items: ['Jamf Pro / Protect', 'SCCM', 'ServiceNow', 'Asset Track', 'Cisco CLI', 'Wireshark', 'Hyper-V', 'VMware', 'Apple OS (iOS / macOS / watchOS / iPadOS / tvOS)'],
  },
  {
    title: 'Ways of working',
    items: ['Agile / Scrum', 'Jira & Jira Align', 'MSFT Project', 'Technical Writing', 'Stakeholder Management', 'Mentoring', 'Public Speaking'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="05" title="Skills" />

        <div className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
              viewport={{ once: true, margin: '-40px' }}
              className="rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground"
            >
              <p className="mb-3 text-xs uppercase tracking-[0.12em] text-muted">{group.title}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded border border-border px-2 py-1 text-xs text-muted sm:text-sm"
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
