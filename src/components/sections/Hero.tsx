'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const metrics = [
  { label: 'Years Building', value: '3+' },
  { label: 'Projects Shipped', value: '12+' },
  { label: 'Client Collaborations', value: '5+' }
];

export default function Hero() {
  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,#2a325f_0%,#0b0f1c_35%,#05070f_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-40 [background:linear-gradient(to_right,rgba(120,130,180,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,130,180,.16)_1px,transparent_1px)] [background-size:72px_72px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="mx-auto max-w-6xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-indigo-100 backdrop-blur">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          Boston-based full stack engineer + endpoint systems specialist
        </div>

        <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Jason Dank builds high-impact software, infrastructure, and AI-powered tooling.
        </h1>

        <p className="mt-8 max-w-3xl text-lg text-slate-300 sm:text-xl">
          From enterprise endpoint automation at Harvard to production-ready product MVPs, I design systems that are fast,
          resilient, and built for real users.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={() => jumpTo('work')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Explore Projects
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => jumpTo('contact')}
            className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
          >
            Contact Jason
          </button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {metrics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/15 bg-slate-900/50 p-6 backdrop-blur">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
