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
  /** Screenshots for the case study page, in public/projects/<folder>/. */
  shots?: Shot[];
  /** In Jason's words: what he's proudest of. Shown on the case study when set. */
  proud?: string;
  /** An overview paragraph in Jason's words, leading the case study. */
  summary?: string;
}

export interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** phone: an iPhone screen; desktop: a Mac screen; card: a small widget. */
  frame: 'phone' | 'desktop' | 'card';
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
    shots: [
      { src: '/projects/regattatrack/leg.webp', width: 600, height: 1300, alt: 'The Leg screen: heading to the next mark in true and magnetic, distance, rounding side and point of sail', frame: 'phone' },
      { src: '/projects/regattatrack/countdown.webp', width: 600, height: 1300, alt: 'The start countdown at one minute to the gun, with sync and plus or minus one minute', frame: 'phone' },
      { src: '/projects/regattatrack/map.webp', width: 600, height: 1300, alt: 'The Map screen with the night\'s course plotted mark to mark', frame: 'phone' },
      { src: '/projects/regattatrack/live-activity.webp', width: 700, height: 297, alt: 'The lock-screen Live Activity: countdown, next leg, heading and wind', frame: 'card' },
    ],
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
    shots: [
      { src: '/projects/bullbar/ticker.webp', width: 828, height: 516, alt: 'BullBar\'s always-on-top strip of live stock quotes across the top of a Mac desktop', frame: 'desktop' },
      { src: '/projects/bullbar/settings.webp', width: 828, height: 516, alt: 'BullBar settings: tickers, scroll speed, refresh interval and low-power mode', frame: 'desktop' },
    ],
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
    shots: [
      { src: '/projects/bartender-gpt/cabinet.webp', width: 390, height: 853, alt: 'The home screen: liquor cabinet, custom cocktails and favorites with what you can make', frame: 'phone' },
      { src: '/projects/bartender-gpt/search.webp', width: 390, height: 850, alt: 'Searching cocktails, each with ingredients and steps', frame: 'phone' },
      { src: '/projects/bartender-gpt/custom.webp', width: 390, height: 850, alt: 'Adding a custom cocktail with ingredients and a description', frame: 'phone' },
      { src: '/projects/bartender-gpt/grocery.webp', width: 390, height: 850, alt: 'The grocery list for missing ingredients', frame: 'phone' },
      { src: '/projects/bartender-gpt/stores.webp', width: 390, height: 850, alt: 'Finding liquor and grocery stores nearby on a map', frame: 'phone' },
    ],
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
    summary:
      'Fine-tuning a Flan-T5 model for answering questions about sailing rules and interpreting racing scenarios. The model is trained on JSON data containing instructions, optional context, and expected outputs to create an assistant that can answer questions about sailing rules.',
    shots: [{ src: '/projects/ai-model-fine-tuning/rules-assistant.webp', width: 485, height: 319, alt: 'The Sailing Rules Assistant (2025–2028 rules): a question, optional context and the answer panel, with example questions below', frame: 'desktop' }],
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
    technologies: ['WSL2', 'Linux', 'CUDA', 'Tailscale', 'Docker', 'Windows', 'Ubuntu'],
    demoUrl: 'https://drive.google.com/file/d/1kRTeivItPW3HBvMCnBD8cd3wxtmspbez/view?usp=sharing',
    demoLabel: 'watch walkthrough',
    summary:
      'Systematic transformation of an HP ZBook Fury laptop into a robust, always-on home server infrastructure. Solved critical challenges including WSL2\'s idle shutdown behavior, secure SSH-over-Tailscale connectivity, and GPU passthrough configuration for CUDA workloads.',
    shots: [{ src: '/projects/remote-compute-environment/server-motd.webp', width: 589, height: 388, alt: 'Logging in to the server: its banner and nvidia-smi showing the NVIDIA RTX A3000 laptop GPU available to CUDA', frame: 'desktop' }],
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
    summary:
      'A chatbot utilizing Natural Language Processing to assist new hires at Harvard University Information Technology by referencing documented information from past technicians, using natural language in a conversational format rather than fishing through a knowledge base.',
    shots: [{ src: '/projects/huit-chatbot/chat.webp', width: 588, height: 384, alt: 'The HUIT chatbot answering questions in conversation, such as where to send Dell repairs', frame: 'desktop' }],
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
    summary:
      'This project implements a Convolutional Neural Network (CNN) and Long Short-Term Memory (LSTM) model to predict stock prices. The model uses historical stock data, along with technical indicators, to forecast future stock prices.',
    shots: [{ src: '/projects/stock-price-prediction/forecast.webp', width: 440, height: 292, alt: 'Actual price (blue) against the model’s prediction (red)', frame: 'desktop' }],
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
    technologies: ['Python', 'PyQt5', 'SSH', 'Linux', 'Sub-processes'],
    summary:
      'DSPM (Dank\'s Squash Pie Monitor) is a Python-based GUI application that monitors multiple Linux systems from a macOS or Windows environment. Leveraging SSH connections, the application periodically retrieves critical system metrics such as CPU usage, memory consumption, disk usage, and system uptime.',
    shots: [{ src: '/projects/linux-device-monitor/dashboard.webp', width: 440, height: 289, alt: 'Dank\'s Squash Pie Monitor: a tile per host with CPU, memory, disk, uptime and last update (hostnames redacted)', frame: 'desktop' }],
  },
];
