'use client';

import { motion } from 'framer-motion';

const focusAreas = [
  {
    title: 'Systems design',
    description:
      'Architecting full-stack, desktop, and mobile solutions end to end — from data model to deployment.',
  },
  {
    title: 'Automation & AI/ML',
    description:
      'Fine-tuning language models, building ML pipelines, and scripting away repetitive operational work.',
  },
  {
    title: 'Leadership in practice',
    description:
      'Running a 25-member sailing team and chairing a university board taught me the same thing engineering did: process beats improvisation.',
  },
];

export default function About() {
  return (
    <section id="about" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;00</span>
          <h2 className="text-display font-bold">About</h2>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-7"
          >
            <p>
              Full-stack software engineer with experience across enterprise IT
              operations, AI/ML systems, and product development. I&apos;m
              currently an <span className="font-medium text-foreground">Endpoint Systems Engineer Intern</span> at
              Harvard University Information Technology, and finishing my B.S.
              in Computer Science &mdash; with minors in Business Analytics,
              Applied Mathematics, and Data Science &mdash; at Wentworth
              Institute of Technology, graduating April 2026.
            </p>
            <p>
              Outside of coursework, I&apos;ve fine-tuned language models, built
              CI/CD pipelines, shipped a published macOS app, and stood up a
              GPU-accelerated remote compute environment for model training.
            </p>
            <p>
              I also serve as <span className="font-medium text-foreground">Executive Vice President</span> of the
              Wentworth Student Government and <span className="font-medium text-foreground">Captain</span> of the
              Wentworth Sailing Team &mdash; more on that on the{' '}
              <a href="/sailing" className="underline decoration-border underline-offset-4 hover:text-foreground">
                sailing page
              </a>.
            </p>
          </motion.div>

          <div className="space-y-8 lg:col-span-5">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="border-l-2 border-border pl-5"
              >
                <h3 className="font-bold">{area.title}</h3>
                <p className="mt-1.5 text-muted">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
