'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface NodePoint {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface DataParticle {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export default function Hero() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);

      const checkIsMobile = () => {
        return (
          window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        );
      };

      setIsMobile(checkIsMobile());
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    workSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const nameLetters = 'JASON'.split('');
  const surnameLetters = 'DANK'.split('');

  const systemNodes: NodePoint[] = useMemo(() => {
    const desktopNodes: NodePoint[] = [
      { id: 0, x: 18, y: 20, size: 10, delay: 0, duration: 4.2 },
      { id: 1, x: 43, y: 12, size: 8, delay: 0.3, duration: 5.0 },
      { id: 2, x: 71, y: 20, size: 12, delay: 0.6, duration: 4.8 },
      { id: 3, x: 83, y: 38, size: 7, delay: 0.9, duration: 5.4 },
      { id: 4, x: 67, y: 55, size: 9, delay: 1.2, duration: 4.6 },
      { id: 5, x: 40, y: 50, size: 11, delay: 1.5, duration: 5.2 },
      { id: 6, x: 20, y: 65, size: 8, delay: 1.8, duration: 4.4 },
      { id: 7, x: 52, y: 78, size: 13, delay: 2.1, duration: 5.6 },
      { id: 8, x: 78, y: 76, size: 9, delay: 2.4, duration: 4.9 },
    ];

    const mobileNodes: NodePoint[] = [
      { id: 0, x: 22, y: 22, size: 9, delay: 0, duration: 4.5 },
      { id: 1, x: 52, y: 18, size: 8, delay: 0.4, duration: 5.1 },
      { id: 2, x: 76, y: 28, size: 10, delay: 0.8, duration: 4.7 },
      { id: 3, x: 64, y: 56, size: 9, delay: 1.2, duration: 5.0 },
      { id: 4, x: 30, y: 60, size: 10, delay: 1.6, duration: 4.8 },
      { id: 5, x: 54, y: 80, size: 12, delay: 2.0, duration: 5.4 },
    ];

    return isMobile ? mobileNodes : desktopNodes;
  }, [isMobile]);

  const connections = useMemo(() => {
    if (isMobile) {
      return [
        [0, 1],
        [1, 2],
        [1, 4],
        [2, 3],
        [4, 5],
        [3, 5],
      ];
    }

    return [
      [0, 1],
      [0, 5],
      [1, 2],
      [1, 5],
      [2, 3],
      [2, 4],
      [3, 4],
      [4, 5],
      [4, 8],
      [5, 6],
      [5, 7],
      [6, 7],
      [7, 8],
    ];
  }, [isMobile]);

  const ambientParticles: DataParticle[] = useMemo(() => {
    const count = isMobile ? 12 : 24;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: isMobile ? 8 + Math.random() * 4 : 6 + Math.random() * 4,
    }));
  }, [isMobile]);

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.55,
      transition: {
        pathLength: {
          delay: 0.8 + i * 0.08,
          duration: 0.9,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
        opacity: {
          delay: 0.8 + i * 0.08,
          duration: 0.5,
        },
      },
    }),
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      filter: 'blur(8px)',
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.07,
        duration: 0.65,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const xOffset = ((mousePosition.x - 50) / 50) * (isMobile ? 6 : 14);
  const yOffset = ((mousePosition.y - 50) / 50) * (isMobile ? 6 : 14);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%),linear-gradient(135deg,#000_0%,#050816_45%,#000_100%)]" />

        <div
          className="absolute inset-0 opacity-40 transition-all duration-700 ease-out"
          style={{
            backgroundImage: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.06) 18%, transparent 40%),
              radial-gradient(circle at ${100 - mousePosition.x * 0.85}% ${100 - mousePosition.y * 0.9}%, rgba(34,197,94,0.12) 0%, transparent 38%),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 42px 42px, 42px 42px',
            backgroundPosition: 'center center, center center, center center, center center',
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.18)_60%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {isClient &&
          ambientParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute h-[2px] w-[2px] rounded-full bg-emerald-400/70"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                transform: 'translateZ(0)',
                willChange: 'transform, opacity',
              }}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [0, -50, -100],
                scale: [0.7, 1, 0.7],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center px-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="space-y-9">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="inline-flex items-center gap-3 rounded-full border border-transparent bg-transparent px-4 py-2"
              style={{ transform: 'translateZ(0)', visibility: 'hidden' }}
            >
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-0" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full opacity-0" />
              </div>
            </motion.div>
            <div className="space-y-4">
              <div className="overflow-visible">
                <div className="flex flex-wrap items-center gap-x-1 gap-y-0 sm:gap-x-2">
                  {nameLetters.map((letter, i) => (
                    <motion.div
                      key={`name-${i}`}
                      custom={i}
                      variants={letterVariants}
                      initial="hidden"
                      animate="visible"
                      className="cursor-default"
                      style={{
                        transform: `translateZ(0) translate(${xOffset * 0.22}px, ${yOffset * 0.22}px)`,
                        willChange: 'transform, opacity, filter',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <span
                        className="font-hero select-none text-white transition-colors duration-300"
                        style={{
                          fontSize: 'clamp(3.4rem, 9vw, 7rem)',
                          lineHeight: '0.88',
                          letterSpacing: '-0.06em',
                          fontWeight: 900,
                          textShadow: '0 0 28px rgba(255,255,255,0.06)',
                          WebkitFontSmoothing: 'antialiased',
                          transform: 'translateZ(0)',
                        }}
                      >
                        {letter}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="overflow-visible">
                <div className="flex flex-wrap items-center gap-x-1 gap-y-0 sm:gap-x-2">
                  {surnameLetters.map((letter, i) => (
                    <motion.div
                      key={`surname-${i}`}
                      custom={i + 5}
                      variants={letterVariants}
                      initial="hidden"
                      animate="visible"
                      className="cursor-default"
                      style={{
                        transform: `translateZ(0) translate(${xOffset * 0.36}px, ${yOffset * 0.36}px)`,
                        willChange: 'transform, opacity, filter',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <span
                        className="font-hero select-none bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 bg-clip-text text-transparent"
                        style={{
                          fontSize: 'clamp(3.4rem, 9vw, 7rem)',
                          lineHeight: '0.88',
                          letterSpacing: '-0.06em',
                          fontWeight: 900,
                          WebkitFontSmoothing: 'antialiased',
                          transform: 'translateZ(0)',
                        }}
                      >
                        {letter}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="flex flex-wrap gap-3"
            >
              {['Full Stack', 'System Design', 'Web Development'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.95 + i * 0.12 }}
                  className="rounded-full border border-emerald-400/15 bg-emerald-400/5 px-4 py-2 backdrop-blur-sm"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-300 sm:text-xs">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05 }}
              className="space-y-5"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="space-y-2">
                <p className="font-accent text-xs uppercase tracking-[0.34em] text-emerald-400 sm:text-sm">
                  Software Engineer
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gray-500 sm:text-xs">
                  System Design / Full Stack Development
                </p>
              </div>

              <h2
                className="max-w-3xl font-display text-3xl font-semibold leading-[1.02] text-white sm:text-4xl lg:text-5xl"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  transform: 'translateZ(0)',
                }}
              >
                Building software that works.
                <br />
                <span className="font-editorial italic text-gray-300">
                  Simple solutions for complex problems.
                </span>
              </h2>

              <p className="max-w-xl font-editorial text-lg leading-relaxed text-gray-300 sm:text-[1.15rem]">
                I enjoy creating web applications and working on projects that solve real problems
                for people and businesses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 1.45 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button
                onClick={scrollToWork}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 px-8 py-4 text-black shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-300 hover:shadow-[0_18px_55px_rgba(16,185,129,0.22)]"
                style={{ transform: 'translateZ(0)' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/0 to-white/20"
                  initial={{ x: '-120%' }}
                  whileHover={{ x: '120%' }}
                  transition={{ duration: 0.85, ease: 'easeInOut' }}
                />
                <span className="relative z-10 flex items-center gap-3 font-heading text-base font-bold sm:text-lg">
                  Selected Work
                  <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </motion.button>

              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-gray-500 sm:text-xs">
                Let's build something together
              </div>
            </motion.div>
          </div>

          <div className="relative flex min-h-[520px] items-center justify-center lg:min-h-[640px]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative h-[420px] w-full max-w-[560px] sm:h-[500px] lg:h-[600px]"
              style={{
                transform: `translateZ(0) translate(${xOffset * 0.45}px, ${yOffset * 0.45}px)`,
              }}
            >
              <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm" />
              <div className="absolute inset-[14px] rounded-[1.5rem] border border-emerald-400/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />

              <div className="absolute left-6 top-5 right-6 z-20 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-emerald-400">
                    SYSTEM OVERVIEW
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    Live architecture signal
                  </p>
                </div>

                <motion.div
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-300">
                    Stable
                  </span>
                </motion.div>
              </div>

              <div className="absolute bottom-5 left-6 right-6 z-20 grid grid-cols-3 gap-3">
                {[
                  ['Latency', '19ms'],
                  ['Reliability', '99.98%'],
                  ['Signals', 'Realtime'],
                ].map(([label, value], i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 1.25 + i * 0.12 }}
                    className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3 backdrop-blur-sm"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
                      {label}
                    </p>
                    <p className="mt-1 font-heading text-base font-semibold text-white sm:text-lg">
                      {value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <svg
                className="absolute inset-0 z-10 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="system-line" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(16,185,129,0.2)" />
                    <stop offset="50%" stopColor="rgba(74,222,128,0.9)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                  </linearGradient>
                  <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(74,222,128,0.95)" />
                    <stop offset="100%" stopColor="rgba(74,222,128,0.0)" />
                  </radialGradient>
                </defs>

                {connections.map(([a, b], i) => {
                  const start = systemNodes[a];
                  const end = systemNodes[b];

                  return (
                    <motion.line
                      key={`${a}-${b}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="url(#system-line)"
                      strokeWidth="0.32"
                      custom={i}
                      variants={lineVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  );
                })}

                {connections.map(([a, b], i) => {
                  const start = systemNodes[a];
                  const end = systemNodes[b];

                  return (
                    <motion.circle
                      key={`signal-${a}-${b}`}
                      r="0.65"
                      fill="rgba(255,255,255,0.95)"
                      initial={{ cx: start.x, cy: start.y, opacity: 0 }}
                      animate={{
                        cx: [start.x, end.x],
                        cy: [start.y, end.y],
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: 2.3 + (i % 4) * 0.4,
                        delay: 1.2 + i * 0.18,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  );
                })}

                {systemNodes.map((node) => (
                  <g key={node.id}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size * 0.23}
                      fill="url(#node-glow)"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: [0.18, 0.45, 0.18],
                        scale: [0.92, 1.06, 0.92],
                      }}
                      transition={{
                        duration: node.duration,
                        delay: node.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ transformOrigin: `${node.x}% ${node.y}%` }}
                    />
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size * 0.08}
                      fill="rgba(255,255,255,0.95)"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: [0.8, 1, 0.8],
                        scale: [0.96, 1.04, 0.96],
                      }}
                      transition={{
                        duration: node.duration,
                        delay: node.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ transformOrigin: `${node.x}% ${node.y}%` }}
                    />
                  </g>
                ))}

                <motion.circle
                  cx={50}
                  cy={50}
                  r="22"
                  fill="none"
                  stroke="rgba(16,185,129,0.14)"
                  strokeWidth="0.24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '50% 50%' }}
                />
                <motion.circle
                  cx={50}
                  cy={50}
                  r="30"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.18"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '50% 50%' }}
                />
              </svg>

              <div className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_42%)]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}