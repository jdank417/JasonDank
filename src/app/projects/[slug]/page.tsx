'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Target, Lightbulb, Code, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProjectDetail {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  problem: string;
  approach: string;
  technologies: string[];
  outcome: string;
  impact: string[];
  gradient: string;
  images?: string[];
}

const projectDetails: Record<string, ProjectDetail> = {
  'humanauth': {
    id: 'humanauth',
    title: 'HumanAuth',
    subtitle: 'AI-powered biometric authentication system',
    category: 'AI Systems',
    year: '2024',
    problem: 'Traditional CAPTCHA systems are ineffective and degrade user experience. They can be easily bypassed by bots while creating friction for legitimate users.',
    approach: 'Built a system using MediaPipe to analyze face and hand movements, creating an interactive challenge-response system that integrates real-time computer vision into web workflows.',
    technologies: ['Python', 'Flask', 'MediaPipe', 'OpenCV', 'Angular'],
    outcome: 'Replaced CAPTCHA with behavioral biometric verification, improving UX while increasing bot resistance.',
    impact: [
      'Demonstrates applied AI in authentication systems',
      'Improved user experience by eliminating traditional CAPTCHA',
      'Enhanced security through behavioral biometric analysis',
      'Real-time computer vision integration in web applications'
    ],
    gradient: 'from-blue-500 to-purple-600'
  },
  'stock-analysis': {
    id: 'stock-analysis',
    title: 'Stock Analysis Platform',
    subtitle: 'Full-stack financial data visualization tool',
    category: 'FinTech',
    year: '2023',
    problem: 'Retail investors lack intuitive tools for analyzing stock trends and news together, making it difficult to make informed investment decisions.',
    approach: 'Built a system to fetch real-time stock data and news, visualized trends with interactive charts, and combined quantitative and qualitative signals in a unified interface.',
    technologies: ['Python', 'APIs', 'Data Visualization', 'React', 'Node.js'],
    outcome: 'Enables better decision-making through combined data sources, demonstrates full-stack and data pipeline skills.',
    impact: [
      'Unified quantitative and qualitative investment data',
      'Real-time data processing and visualization',
      'Improved decision-making tools for retail investors',
      'Demonstrates full-stack development capabilities'
    ],
    gradient: 'from-green-500 to-emerald-600'
  },
  'barcode-scanner': {
    id: 'barcode-scanner',
    title: 'Barcode Scanning Web App',
    subtitle: 'Inventory and grocery scanning system',
    category: 'Computer Vision',
    year: '2023',
    problem: 'Manual product lookup is slow and inefficient in retail environments, leading to poor customer experience and operational inefficiencies.',
    approach: 'Built a Flask web app with barcode scanning capabilities, integrated QuaggaJS for real-time scanning, and stored product data in SQLite for fast retrieval.',
    technologies: ['Flask', 'JavaScript', 'QuaggaJS', 'SQLite'],
    outcome: 'Real-time product lookup system demonstrating full-stack and computer vision integration.',
    impact: [
      'Eliminated manual product lookup processes',
      'Real-time barcode recognition in web browsers',
      'Improved retail operational efficiency',
      'Seamless integration of computer vision with web technologies'
    ],
    gradient: 'from-orange-500 to-red-600'
  },
  'raspberry-pi-network': {
    id: 'raspberry-pi-network',
    title: 'Raspberry Pi Network Monitoring Tool',
    subtitle: 'Lightweight network analysis system',
    category: 'IoT Systems',
    year: '2022',
    problem: 'Network diagnostics tools are often heavy and not easily deployable, making it difficult to monitor distributed systems cost-effectively.',
    approach: 'Built a Python-based monitoring tool deployed to a headless Raspberry Pi, collected and analyzed network performance metrics with minimal resource usage.',
    technologies: ['Python', 'Linux', 'Raspberry Pi', 'Network Analysis'],
    outcome: 'Portable, low-cost monitoring solution demonstrating systems and infrastructure thinking.',
    impact: [
      'Cost-effective network monitoring solution',
      'Portable deployment on edge devices',
      'Real-time network performance analysis',
      'Demonstrates systems and infrastructure expertise'
    ],
    gradient: 'from-cyan-500 to-blue-600'
  },
  'harvard-it-tooling': {
    id: 'harvard-it-tooling',
    title: 'Harvard IT Tooling',
    subtitle: 'Enterprise endpoint remediation system',
    category: 'Enterprise Systems',
    year: '2023-Present',
    problem: 'Enterprise endpoints had inconsistent backup states and lacked scalable remediation processes, creating security and compliance risks.',
    approach: 'Designed and deployed CrashPlan remediation systems, built automation for macOS and Windows environments, and created scalable workflows for technicians and self-service.',
    technologies: ['PowerShell', 'Python', 'Bash', 'Enterprise IT Systems', 'macOS', 'Windows'],
    outcome: 'Supported large-scale endpoint remediation, improved reliability and scalability of backup systems across enterprise infrastructure.',
    impact: [
      'Automated enterprise endpoint management',
      'Improved backup system reliability across thousands of devices',
      'Scalable remediation workflows for IT teams',
      'Enhanced security and compliance posture'
    ],
    gradient: 'from-indigo-500 to-purple-600'
  }
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projectDetails[params.slug];

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <Link 
            href="/#work"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Work
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className={`px-4 py-2 bg-gradient-to-r ${project.gradient} text-white text-sm font-semibold rounded-full`}>
                {project.category}
              </span>
              <span className="text-gray-400 text-sm">{project.year}</span>
            </div>
            
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              {project.title}
            </h1>
            
            <p className="font-body text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {project.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="space-y-16">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-white">Problem</h2>
              </div>
              <p className="font-body text-lg text-gray-300 leading-relaxed">
                {project.problem}
              </p>
            </motion.div>

            {/* Approach */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-white">Approach</h2>
              </div>
              <p className="font-body text-lg text-gray-300 leading-relaxed">
                {project.approach}
              </p>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Code className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-white">Technologies</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:border-green-500 hover:text-green-400 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Outcome & Impact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-white">Outcome & Impact</h2>
              </div>
              
              <p className="font-body text-lg text-gray-300 leading-relaxed mb-6">
                {project.outcome}
              </p>
              
              <div className="space-y-3">
                <h3 className="font-heading text-xl font-semibold text-white mb-4">Key Impact Areas:</h3>
                {project.impact.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="font-body text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Interested in this project?
            </h2>
            <p className="font-body text-lg text-gray-400">
              Let&apos;s discuss how we can work together on similar challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
              >
                Get In Touch
                <ExternalLink className="w-5 h-5" />
              </Link>
              <Link
                href="/#work"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-600 hover:border-green-500 text-gray-300 hover:text-green-400 font-semibold text-lg rounded-full transition-all duration-300 hover:bg-gray-900"
              >
                View More Projects
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}