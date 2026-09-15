'use client';

import { motion } from 'framer-motion';

export default function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-10 border-b border-border pb-4 sm:mb-12"
    >
      <div className="flex items-baseline gap-3 sm:gap-4">
        <span className="text-sm text-muted">§{index}</span>
        <h2 className="text-display font-bold">{title}</h2>
      </div>
      {kicker && (
        <p className="mt-2 pl-7 text-sm text-muted sm:pl-9">{kicker}</p>
      )}
    </motion.div>
  );
}
