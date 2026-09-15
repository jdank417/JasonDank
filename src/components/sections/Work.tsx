'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Smartphone } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  year: string;
  description: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  demoLabel?: string;
  appStoreUrl?: string;
}

const projects: Project[] = [
  {
    id: 'barcode-scanning-webapp',
    title: 'Barcode Scanning WebApp',
    year: '2023',
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
    description: [
      'Designed and implemented a Flan-T5 fine-tuning solution (Python-only codebase) to answer sailing rules questions and interpret racing scenarios.',
      'Wrote the training and fine-tuning pipelines, optimizing performance against current evaluation metrics.',
    ],
    technologies: ['Python', 'Flan-T5', 'NLP', 'Fine-tuning'],
    githubUrl: 'https://github.com/jdank417/Flan-t5-sailing-JasonDank',
  },
  {
    id: 'remote-compute-environment',
    title: 'Remote Compute Environment for AI Fine-Tuning',
    year: '2024',
    description: [
      'Engineered a reproducible WSL2-based Linux training environment with containerized workflows.',
      'Configured persistent SSH access via Tailscale, a GPU-enabled CUDA stack, and automated keep-alive processes, enabling seamless remote fine-tuning with zero idle shutdowns.',
    ],
    technologies: ['WSL2', 'Linux', 'CUDA', 'Tailscale', 'Docker'],
    demoUrl: 'https://drive.google.com/file/d/1kRTeivItPW3HBvMCnBD8cd3wxtmspbez/view?usp=sharing',
    demoLabel: 'watch walkthrough',
  },
  {
    id: 'bullbar',
    title: 'BullBar — SwiftUI macOS App',
    year: '2024',
    description: [
      'Built a lightweight SwiftUI macOS utility delivering real-time stock quotes via a secure Cloudflare Workers proxy.',
      'Implemented customizable display, adjustable refresh intervals, theming, and a low-power mode for optimized UX and battery efficiency.',
    ],
    technologies: ['Swift', 'SwiftUI', 'macOS', 'Cloudflare Workers'],
    appStoreUrl: 'https://apps.apple.com/us/app/bullbar/id6745433379?mt=12',
  },
  {
    id: 'huit-chatbot',
    title: 'HUIT Training ChatBot',
    year: '2024',
    description: [
      'Developed a Python NLP chatbot with a customtkinter GUI addressing documentation overload.',
      'Integrated fuzzy search, semantic search (BERT embeddings), and NER for enhanced query retrieval with continuous learning capabilities.',
    ],
    technologies: ['Python', 'NLP', 'BERT', 'customtkinter'],
  },
  {
    id: 'stock-price-prediction',
    title: 'Stock Price Prediction System',
    year: '2023',
    description: [
      'Built an ensemble machine learning model with engineered technical indicators (RSI, MACD, Bollinger Bands) from yfinance data.',
      'Implemented logging, model management, and visualization for actual-vs-predicted price analysis.',
    ],
    technologies: ['Python', 'yfinance', 'Ensemble ML', 'Technical Indicators'],
    githubUrl: 'https://github.com/jdank417/Deep-Learning-for-Stock-Market-Predictions',
  },
  {
    id: 'linux-device-monitor',
    title: 'Linux-based Device Monitoring Application',
    year: '2023',
    description: [
      'Created a Python/PyQt5 application monitoring Linux systems remotely via SSH over custom VLANs, tracking CPU, memory, disk, and uptime metrics.',
      'Deployed and active across Harvard Athletics and SEAS field support operations.',
    ],
    technologies: ['Python', 'PyQt5', 'SSH', 'Linux'],
  },
];

export default function Work() {
  return (
    <section id="work" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;02</span>
          <h2 className="text-display font-bold">Work</h2>
        </motion.div>

        <div className="divide-y divide-border">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              viewport={{ once: true }}
              className="grid gap-4 py-8 sm:grid-cols-12 sm:gap-8"
            >
              <div className="sm:col-span-3">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">
                  {String(index + 1).padStart(2, '0')} / {project.year}
                </span>
                <h3 className="mt-2 font-bold leading-snug">{project.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border px-1.5 py-0.5 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-9">
                <ul className="space-y-2.5 text-muted">
                  {project.description.map((line, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-5">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
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
                      className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {project.demoLabel ?? 'demo'}
                    </a>
                  )}
                  {project.appStoreUrl && (
                    <a
                      href={project.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      app store
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
