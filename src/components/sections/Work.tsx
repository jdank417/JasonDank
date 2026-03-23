'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  title: string;
  summary: string;
  stack: string[];
  domain: string;
}

const projects: Project[] = [
  {
    title: 'Fine-Tuning an AI Sailing Rules Assistant',
    domain: 'Machine Learning',
    summary:
      'Fine-tuned a Flan-T5 model on structured racing-rule scenarios so sailors can ask natural-language questions and get reliable rule interpretations.',
    stack: ['Python', 'Flan-T5', 'NLP', 'JSON Datasets']
  },
  {
    title: 'WSL2 Server Infrastructure with GPU Acceleration',
    domain: 'Infrastructure',
    summary:
      'Converted a laptop into a stable, always-on home server with CUDA workloads, secure SSH-over-Tailscale access, and resilient uptime behavior.',
    stack: ['Windows', 'WSL2', 'Ubuntu', 'CUDA', 'Tailscale']
  },
  {
    title: 'GroceryBarcodeScanner',
    domain: 'Web + Automation',
    summary:
      'Built a scalable barcode-scanning app for rapid product categorization with a path to machine-learning based classification.',
    stack: ['Python', 'Flask', 'SQL', 'JavaScript']
  },
  {
    title: 'HUIT_BoT',
    domain: 'NLP + Internal Tools',
    summary:
      'Created an NLP assistant to help new Harvard IT technicians find operational knowledge faster than traditional documentation searches.',
    stack: ['Python', 'spaCy', 'NLP', 'Knowledge Base']
  },
  {
    title: 'BullBar — Real-Time Stock Ticker for macOS',
    domain: 'Apple Platform',
    summary:
      'Shipped a SwiftUI macOS utility for always-on-top market tracking with smart refresh controls, theming, and low-power operation.',
    stack: ['SwiftUI', 'macOS', 'Cloudflare Workers', 'API Integration']
  },
  {
    title: 'Bartender-GPT',
    domain: 'Mobile Product',
    summary:
      'Published and iterated an iOS app experience with continuous updates and support for both iPhone and iPad form factors.',
    stack: ['Swift', 'iOS', 'iPadOS', 'App Store']
  }
];

export default function Work() {
  return (
    <section id="work" className="relative overflow-hidden bg-[#060913] px-6 py-24 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(52,95,255,0.2)_0%,transparent_30%),radial-gradient(circle_at_80%_60%,rgba(20,220,255,0.14)_0%,transparent_36%)]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Selected Work</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Built for impact, not just demos.</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, idx) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="group rounded-3xl border border-white/10 bg-slate-900/45 p-7 backdrop-blur transition hover:border-cyan-300/40"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{project.domain}</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
              <p className="mt-4 text-slate-300">{project.summary}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-sm text-slate-200">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
                Case study available on request <ArrowUpRight className="h-4 w-4" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
