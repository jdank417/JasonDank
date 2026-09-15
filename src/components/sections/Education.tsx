'use client';

import { motion } from 'framer-motion';
import SectionHeading from '../SectionHeading';

const minors = ['Data Science', 'Applied Mathematics', 'Business Analytics'];

const courses = [
  'Machine Learning (R)',
  'System Administration (Linux)',
  'Operating Systems (C)',
  'Algorithms (Java)',
  'Probability & Statistics for Engineers (R)',
  'Network Programming (Python)',
  'Linear Algebra & Matrix Theory',
  'Differential Equations',
  'Parallel Computing (C)',
];

const honors = [
  "Dean's List — Fall 2022 through Fall 2024",
  'Wentworth 2025–2026 Scholarship Report Recognition',
];

export default function Education() {
  return (
    <section id="education" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="04" title="Education" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-12 sm:gap-8"
        >
          <div className="sm:col-span-4">
            <p className="text-xs uppercase tracking-[0.1em] text-muted">2022 — April 2026</p>
            <h3 className="mt-2 font-bold leading-snug">Wentworth Institute of Technology</h3>
            <p className="mt-1 text-muted">Boston, MA</p>
          </div>

          <div className="space-y-6 sm:col-span-8">
            <div className="grid gap-px overflow-hidden rounded-md border border-border sm:grid-cols-2">
              <div className="bg-card px-5 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">Degree</p>
                <p className="mt-1 font-bold">B.S. Computer Science</p>
              </div>
              <div className="bg-card px-5 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">GPA</p>
                <p className="mt-1 font-bold">3.7 / 4.0</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.1em] text-muted">Minors</p>
              <div className="flex flex-wrap gap-1.5">
                {minors.map((minor) => (
                  <span
                    key={minor}
                    className="rounded border border-foreground px-2 py-1 text-xs"
                  >
                    {minor}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.1em] text-muted">Honors</p>
              <ul className="space-y-2">
                {honors.map((honor) => (
                  <li key={honor} className="flex gap-3 text-sm text-muted sm:text-base">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted sm:mt-2.5" />
                    <span>{honor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.1em] text-muted">Related coursework</p>
              <div className="flex flex-wrap gap-1.5">
                {courses.map((course) => (
                  <span
                    key={course}
                    className="rounded border border-border px-2 py-1 text-xs text-muted"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
