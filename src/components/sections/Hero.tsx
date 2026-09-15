'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Github, Linkedin } from 'lucide-react';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const ticker = [
  'React',
  'Node.js',
  'Java',
  'Spring Boot',
  'TypeScript',
  'Python',
  'Swift',
  'SQL',
  'Flask',
  'Docker',
  'AWS',
  'CI/CD',
  'PyTorch',
  'NLP',
  'Bash',
  'PowerShell',
];

const stats = [
  { value: '7', label: 'roles' },
  { value: '10', label: 'shipped projects' },
  { value: '2', label: 'apps on the App Store' },
  { value: '20k+', label: 'endpoints managed' },
];

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 bg-graph opacity-60"
        style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent opacity-20 blur-3xl sm:h-96 sm:w-96"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="text-foreground">@ Fidelity Investments</span>
          </span>
          <span className="rounded-full border border-border px-3 py-1.5">Boston, MA</span>
          <span className="hidden rounded-full border border-border px-3 py-1.5 sm:inline">
            B.S. CS — Wentworth
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-huge font-bold text-foreground"
        >
          Jason Dank
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-huge italic font-normal text-muted"
        >
          full-stack engineer.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          I build full-stack systems for <mark>private markets</mark> on the{' '}
          <span className="font-medium text-foreground">Fidelity Private Shares</span>{' '}
          platform. Before Fidelity I ran endpoint engineering across 20,000+ devices
          at Harvard University IT. On my own time I ship Swift apps — two of them on
          the App Store — alongside <mark>automation</mark> and <mark>AI/ML</mark> projects.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center"
        >
          {/* The two calls to action share a row of their own on phones so
              neither label wraps; everything sits inline from sm up. */}
          <div className="flex gap-2.5">
            <button
              onClick={() => scrollTo('work')}
              className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:flex-none"
            >
              view work
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-foreground px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 sm:flex-none"
            >
              contact
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2.5">
            <a
              href="https://github.com/jdank417"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/jason-dank"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-foreground hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card px-4 py-5">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl font-bold sm:text-3xl">{stat.value}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-muted">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Stack ticker — a nod to BullBar, and it gives the fold some motion on phones. */}
      <div className="marquee-viewport marquee-mask relative overflow-hidden border-t border-border bg-card py-2.5">
        <div className="marquee-track" aria-hidden>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {ticker.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-4 whitespace-nowrap px-4 text-xs uppercase tracking-[0.15em] text-muted"
                >
                  {item}
                  <span className="text-border">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <span className="sr-only">
          Core stack: {ticker.join(', ')}.
        </span>
      </div>
    </section>
  );
}
