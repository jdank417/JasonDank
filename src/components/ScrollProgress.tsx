'use client';

import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  // On the desktop home page the latitude ruler shows progress instead.
  const home = usePathname() === '/';

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className={`fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent ${home ? 'lg:hidden' : ''}`}
    />
  );
}
