'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';

const channels = [
  {
    id: 'email',
    label: 'email',
    value: 'jasondank@yahoo.com',
    href: 'mailto:jasondank@yahoo.com',
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
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;07</span>
          <h2 className="text-display font-bold">Contact</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl text-lg text-muted"
        >
          I&apos;m graduating in April 2026 and looking for full-time software
          engineering roles. Open to a conversation about full-stack, systems,
          or AI/ML work &mdash; reach out through any of these.
        </motion.p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-border sm:grid-cols-3">
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
              className="group flex items-center justify-between gap-4 bg-card px-6 py-6 transition-colors hover:bg-background"
            >
              <div className="flex items-center gap-3">
                <channel.icon className="h-5 w-5 text-muted" />
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] text-muted">{channel.label}</p>
                  <p className="mt-0.5 font-medium">{channel.value}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </motion.a>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-6 text-xs uppercase tracking-[0.1em] text-muted">
          jasondank.com &mdash; Boston, MA
        </div>
      </div>
    </section>
  );
}
