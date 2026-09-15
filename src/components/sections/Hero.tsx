'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Github, Linkedin } from 'lucide-react';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 bg-graph opacity-60"
        style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.15em] text-muted"
        >
          <span>Boston, MA</span>
          <span>/</span>
          <span>B.S. Computer Science &mdash; Wentworth &apos;26</span>
          <span>/</span>
          <span>GPA 3.7</span>
          <span>/</span>
          <span className="rounded border border-border px-1.5 py-0.5">available for new grad roles</span>
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
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted"
        >
          I build full-stack web, desktop, and mobile systems with{' '}
          <mark>automation</mark> and <mark>AI/ML</mark> woven in end to end.
          Currently an Endpoint Systems Engineer Intern at Harvard University IT,
          studying Computer Science at Wentworth Institute of Technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => scrollTo('work')}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            view work
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-2 rounded-md border border-foreground px-5 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5"
          >
            contact
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <a
            href="https://github.com/jdank417"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-2 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            github
          </a>
          <a
            href="https://www.linkedin.com/in/jason-dank"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-2 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
            linkedin
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-6 text-xs uppercase tracking-[0.15em] text-muted"
        >
          <span>6 roles</span>
          <span>/</span>
          <span>7 shipped projects</span>
          <span>/</span>
          <span>2 apps on the App Store</span>
          <span>/</span>
          <span>EVP, Wentworth Student Government</span>
        </motion.div>
      </div>
    </section>
  );
}
