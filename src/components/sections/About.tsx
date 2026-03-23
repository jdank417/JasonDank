'use client';

import { motion } from 'framer-motion';

const focusAreas = [
  'Enterprise endpoint systems (Jamf, SCCM, cross-platform scripting)',
  'Full stack delivery for web and mobile products',
  'Machine learning workflows for practical automation',
  'Technical leadership, mentoring, and project operations'
];

const education = [
  'B.S. Computer Science — Wentworth Institute of Technology',
  'Minors: Data Science, Applied Mathematics, Business Analytics, Computer Networking',
  'GPA: 3.7 · Dean’s List: Fall 2022, Spring 2023, Fall 2023, Spring 2024, Fall 2024',
  'Expected graduation: August 2026'
];

export default function About() {
  return (
    <section id="about" className="bg-[#05070f] px-6 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">About</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Engineering systems people can trust.</h2>
          <p className="mt-6 text-lg text-slate-300">
            I’m a full stack software developer with experience across enterprise IT, automation, and product engineering. Most
            recently, I worked on endpoint systems at Harvard, building tooling and workflows that improved speed and reliability
            for internal operations.
          </p>
          <p className="mt-4 text-lg text-slate-300">
            Alongside engineering work, I’ve led student and community initiatives where communication, planning, and execution
            mattered as much as code quality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-5"
        >
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold text-white">Primary Focus</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              {focusAreas.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-semibold text-white">Education</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              {education.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </motion.div>
      </div>
    </section>
  );
}
