'use client';

import { useId, useRef, useState } from 'react';
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
  // Below md only one group shows at a time, picked from a swipeable tab strip.
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const select = (i: number) => {
    setActive(i);
    // Keep the chosen tab in view in the strip without moving the page.
    const strip = stripRef.current;
    const tab = strip?.children[i] as HTMLElement | undefined;
    if (strip && tab) {
      strip.scrollTo({ left: tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
    }
  };

  return (
    <section id="skills" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="05" title="Skills" />

        <div
          ref={stripRef}
          className="no-scrollbar relative -mx-5 mb-4 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:hidden"
        >
          {skillGroups.map((group, i) => (
            <button
              key={group.title}
              type="button"
              onClick={() => select(i)}
              aria-pressed={active === i}
              aria-controls={`${baseId}-${i}`}
              className={`press shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
                active === i
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted'
              }`}
            >
              {group.title}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              id={`${baseId}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
              viewport={{ once: true, margin: '-40px' }}
              className={`${index === active ? '' : 'max-md:hidden'} rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground`}
            >
              <p className="mb-3 text-xs uppercase tracking-[0.12em] text-muted max-md:hidden">{group.title}</p>
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
