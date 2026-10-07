import { PAPER_URL, REGATTATRACK_BETA_URL } from './site';

export type Category = 'ml' | 'web' | 'apple' | 'automation';

export interface Project {
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

export const filters: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'ml', label: 'machine learning' },
  { id: 'web', label: 'web' },
  { id: 'apple', label: 'ios / macos' },
  { id: 'automation', label: 'automation' },
];

export const projects: Project[] = [
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
    paperUrl: PAPER_URL,
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
    betaUrl: REGATTATRACK_BETA_URL,
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
