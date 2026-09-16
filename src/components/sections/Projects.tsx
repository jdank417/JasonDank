'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FileText, FlaskConical, Github, Smartphone } from 'lucide-react';
import SectionHeading from '../SectionHeading';

type Category = 'ml' | 'web' | 'apple' | 'automation';

interface Project {
  id: string;
  title: string;
  year: string;
  categories: Category[];
  description: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  demoLabel?: string;
  appStoreUrl?: string;
  paperUrl?: string;
  betaUrl?: string;
}

const filters: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'ml', label: 'machine learning' },
  { id: 'web', label: 'web' },
  { id: 'apple', label: 'ios / macos' },
  { id: 'automation', label: 'automation' },
];

const projects: Project[] = [
  {
    id: 'humanauth',
    title: 'HumanAuth — Replacing CAPTCHA with Real-Time Computer Vision',
    year: '2026',
    categories: ['ml', 'web'],
    description: [
      'Senior capstone with Jack Denholm: a web-based biometric system that tells humans from automated agents in real time, using continuous behavioral analysis instead of static challenge solving.',
      'An Angular front end streams webcam frames over a persistent WebSocket to a Python Flask backend, where MediaPipe face and hand landmark models feed six complementary liveness checks — micro-movement, 3D facial consistency, blink patterns, texture analysis, gesture challenge-response, and hand tracking.',
      'Across 50 trials with four participants: 3.3s average completion against 7.0s for traditional CAPTCHA, a 92% authentication success rate against 80%, and 76% of simulated presentation attacks blocked against 67%.',
    ],
    technologies: ['Angular', 'Python', 'Flask', 'MediaPipe', 'WebSocket', 'Computer Vision'],
    githubUrl: 'https://github.com/Dexteritize/HumanAuth',
    paperUrl:
      'https://drive.google.com/file/d/1OIx32NCxWxwVYz6PbNBdLCoa11eFes2q/view?usp=drivesdk',
  },
  {
    id: 'regatta-positioning-system',
    title: 'RegattaTrack — Regatta Positioning System',
    year: '2026',
    categories: ['web', 'apple'],
    description: [
      'A course-plotting tool for one-design yacht racing: pick your club and the night’s mark list, build the course the way the Race Committee posted it, and get it plotted on a chart with true and magnetic headings and a distance for every leg.',
      'Ported a static single-club reference app into a full client/server platform any yacht club can run — an Angular front end (standalone components and signals) over a FastAPI and PostgreSQL backend with JWT auth, plus a club-admin console for mark list CRUD and spreadsheet uploads.',
      'Ships as a one-command Docker Compose stack and a Render blueprint, seeded with four Massachusetts Bay yacht clubs and their real mark data.',
    ],
    technologies: ['Angular', 'FastAPI', 'PostgreSQL', 'Docker', 'JWT', 'Render'],
    betaUrl: 'https://testflight.apple.com/join/MG4VxcvY',
  },
  {
    id: 'bullbar',
    title: 'BullBar — SwiftUI macOS App',
    year: '2025',
    categories: ['apple', 'automation'],
    description: [
      'Built a lightweight SwiftUI macOS utility that floats above all windows with an always-on-top strip of real-time stock quotes.',
      'Routed market data through a secure Cloudflare Workers proxy so no user credentials are required, with clamped refresh intervals to stay inside free-tier limits.',
      'Implemented customizable display, adjustable scroll speed, light/dark theming, and a low-power mode for battery efficiency.',
    ],
    technologies: ['Swift', 'SwiftUI', 'macOS', 'Cloudflare Workers'],
    appStoreUrl: 'https://apps.apple.com/us/app/bullbar/id6745433379?mt=12',
  },
  {
    id: 'bartender-gpt',
    title: 'Bartender-GPT — iOS App',
    year: '2025',
    categories: ['apple'],
    description: [
      'Built and published an iOS app in Swift, optimized for iPhone with full functionality on iPad.',
      'An ongoing project on the App Store that continues to receive feature updates.',
    ],
    technologies: ['Swift', 'iOS', 'iPadOS', 'App Store'],
    appStoreUrl: 'https://apps.apple.com/us/app/bartender-gpt/id6743064352?platform=iphone',
  },
  {
    id: 'barcode-scanning-webapp',
    title: 'Barcode Scanning WebApp',
    year: '2023',
    categories: ['web', 'ml'],
    description: [
      'Led design and delivery as chief architect / service owner / PM, owning the product roadmap for ML-based barcode detection.',
      'Drove the full-stack integration effort and delivered a production-ready web application with 80%+ barcode detection accuracy.',
      'Managed Agile project management in GitLab; led DevOps and hosting and built the CI/CD pipelines.',
      'Implemented Excel-backed inventory uploads converted to SQLite, easing updates for non-technical stakeholders.',
    ],
    technologies: ['Flask', 'JavaScript', 'SQLite', 'Machine Learning', 'GitLab CI/CD'],
    demoUrl: 'https://grocerybarcodescanner.onrender.com/',
    demoLabel: 'live demo',
  },
  {
    id: 'ai-model-fine-tuning',
    title: 'AI Model Fine-Tuning — Sailing Rules Assistant',
    year: '2024',
    categories: ['ml'],
    description: [
      'Designed and implemented a Flan-T5 fine-tuning solution (Python-only codebase) to answer sailing rules questions and interpret racing scenarios.',
      'Trained on structured JSON of instructions, optional context, and expected outputs; wrote the training and evaluation pipelines.',
    ],
    technologies: ['Python', 'Flan-T5', 'NLP', 'Fine-tuning'],
    githubUrl: 'https://github.com/jdank417/Flan-t5-sailing-JasonDank',
  },
  {
    id: 'remote-compute-environment',
    title: 'Remote Compute Environment for AI Fine-Tuning',
    year: '2024',
    categories: ['automation'],
    description: [
      'Engineered a reproducible WSL2-based Linux training environment with containerized workflows on an HP ZBook Fury.',
      "Solved WSL2's idle shutdown behaviour, configured persistent SSH over Tailscale, and set up GPU passthrough for CUDA workloads — enabling remote fine-tuning with zero idle shutdowns.",
    ],
    technologies: ['WSL2', 'Linux', 'CUDA', 'Tailscale', 'Docker'],
    demoUrl: 'https://drive.google.com/file/d/1kRTeivItPW3HBvMCnBD8cd3wxtmspbez/view?usp=sharing',
    demoLabel: 'watch walkthrough',
  },
  {
    id: 'huit-chatbot',
    title: 'HUIT Training ChatBot',
    year: '2024',
    categories: ['ml'],
    description: [
      'Developed a Python NLP chatbot with a customtkinter GUI to solve documentation overload for new HUIT hires.',
      'Integrated fuzzy search, semantic search (BERT embeddings), and named entity recognition so technicians can ask questions conversationally instead of digging through a knowledge base.',
    ],
    technologies: ['Python', 'NLP', 'BERT', 'spaCy', 'customtkinter'],
  },
  {
    id: 'stock-price-prediction',
    title: 'CNN-LSTM Stock Market Prediction',
    year: '2023',
    categories: ['ml'],
    description: [
      'Implemented a combined CNN and LSTM model in TensorFlow to forecast stock prices from historical data.',
      'Engineered technical indicators (RSI, MACD, Bollinger Bands) from yfinance data and added logging, model management, and actual-vs-predicted visualisation.',
    ],
    technologies: ['Python', 'TensorFlow', 'LSTM', 'CNN', 'yfinance'],
    githubUrl: 'https://github.com/jdank417/Deep-Learning-for-Stock-Market-Predictions',
  },
  {
    id: 'linux-device-monitor',
    title: "Linux Device Monitor — Dank's Squash Pie Monitor",
    year: '2023',
    categories: ['automation'],
    description: [
      'Created a Python/PyQt5 desktop application that monitors multiple Linux systems from macOS or Windows over SSH across custom VLANs.',
      'Polls CPU, memory, disk, and uptime metrics; deployed and active across Harvard Athletics and SEAS field support operations.',
    ],
    technologies: ['Python', 'PyQt5', 'SSH', 'Linux'],
  },
];

export default function Projects() {
  const [active, setActive] = useState<Category | 'all'>('all');

  const visible = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.categories.includes(active))),
    [active],
  );

  return (
    <section id="projects" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="02" title="Projects" kicker="10 projects — 2 on the App Store, 1 in public beta, 1 written up as a paper." />

        {/* Horizontally scrollable on phones so the filters never wrap into a wall. */}
        <div className="-mx-5 mb-8 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActive(filter.id)}
                aria-pressed={active === filter.id}
                className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
                  active === filter.id
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted hover:border-foreground hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground sm:p-6"
              >
                <span className="text-xs uppercase tracking-[0.1em] text-muted">
                  {project.year}
                </span>
                <h3 className="mt-2 font-bold leading-snug">{project.title}</h3>

                <ul className="mt-4 flex-1 space-y-2.5">
                  {project.description.map((line, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border px-1.5 py-0.5 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {(project.githubUrl ||
                  project.demoUrl ||
                  project.appStoreUrl ||
                  project.paperUrl ||
                  project.betaUrl) && (
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <Github className="h-3.5 w-3.5" />
                        source
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {project.demoLabel ?? 'demo'}
                      </a>
                    )}
                    {project.paperUrl && (
                      <a
                        href={project.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        read the paper
                      </a>
                    )}
                    {project.betaUrl && (
                      <a
                        href={project.betaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <FlaskConical className="h-3.5 w-3.5" />
                        testflight beta
                      </a>
                    )}
                    {project.appStoreUrl && (
                      <a
                        href={project.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        app store
                      </a>
                    )}
                  </div>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
