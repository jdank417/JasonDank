'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import SectionHeading from '../SectionHeading';

const channels = [
  {
    id: 'email',
    label: 'email',
    value: 'jason.dank@outlook.com',
    href: 'mailto:jason.dank@outlook.com',
    icon: Mail,
  },
  {
    id: 'linkedin',
    label: 'linkedin',
    value: 'linkedin.com/in/jason-dank',
    href: 'https://www.linkedin.com/in/jason-dank',
    icon: Linkedin,
  },
  {
    id: 'github',
    label: 'github',
    value: 'github.com/jdank417',
    href: 'https://github.com/jdank417',
    icon: Github,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="07" title="Contact" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl text-base text-muted sm:text-lg"
        >
          I’m building on the Fidelity Private Shares platform out of Boston. Always happy to
          talk full-stack and fintech engineering, AI/ML tooling, endpoint systems at scale —
          or sailing. Reach out through any of these.
        </motion.p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-border sm:mt-10 sm:grid-cols-3">
          {channels.map((channel, index) => (
            <motion.a
              key={channel.id}
              href={channel.href}
              target={channel.id === 'email' ? undefined : '_blank'}
              rel={channel.id === 'email' ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group flex items-center justify-between gap-4 bg-card px-5 py-5 transition-colors hover:bg-background sm:px-6 sm:py-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <channel.icon className="h-5 w-5 flex-shrink-0 text-muted" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.1em] text-muted">{channel.label}</p>
                  <p className="mt-0.5 truncate text-sm font-medium sm:text-base">{channel.value}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </motion.a>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs uppercase tracking-[0.1em] text-muted sm:mt-16">
          <span>jasondank.com — Boston, MA</span>
          <a href="/sailing" className="transition-colors hover:text-foreground">
            sailing résumé →
          </a>
        </div>
      </div>
    </section>
  );
}
