'use client';

import { useEffect, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Templates re-mount on every navigation, so each new page eases in under the
// persistent header. The very first page is left alone, so the server-rendered
// HTML is never hidden while it waits for JavaScript.
let firstPage = true;

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const animate = !firstPage && !reduce;

  useEffect(() => {
    firstPage = false;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
