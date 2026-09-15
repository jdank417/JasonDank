'use client';

import { motion } from 'framer-motion';

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

export default function Education() {
  return (
    <section id="education" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;04</span>
          <h2 className="text-display font-bold">Education</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-12"
        >
          <div className="sm:col-span-4">
            <h3 className="font-bold leading-snug">Wentworth Institute of Technology</h3>
            <p className="mt-1 text-muted">Boston, MA</p>
            <p className="mt-3 text-xs uppercase tracking-[0.1em] text-muted">Expected April 2026</p>
          </div>

          <div className="sm:col-span-8 space-y-4">
            <p className="text-muted">
              <span className="font-medium text-foreground">B.S. Computer Science</span> &mdash; Minors in
              Business Analytics, Applied Mathematics, and Data Science.
            </p>
            <p className="text-muted">
              <span className="font-medium text-foreground">GPA: 3.7 / 4.0</span> &mdash; Dean&apos;s List every semester.
            </p>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.1em] text-muted">Related coursework</p>
              <div className="flex flex-wrap gap-1.5">
                {courses.map((course) => (
                  <span key={course} className="rounded border border-border px-1.5 py-0.5 text-xs text-muted">
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
