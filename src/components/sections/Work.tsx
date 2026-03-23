'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, Brain, TrendingUp, Scan, Network, Server, ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  impact: string;
  technologies: string[];
  icon: React.ReactNode;
  gradient: string;
  year: string;
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  appStoreUrl?: string;
}

const projects: Project[] = [
  {
    id: 'sailing-ai-assistant',
    title: 'Fine-Tuning an AI Sailing Rules Assistant',
    description: 'Fine-tuned a Flan-T5 model for answering questions about sailing rules and interpreting racing scenarios. Trained on JSON data containing instructions, optional context, and expected outputs to create an assistant that can answer questions about sailing rules.',
    impact: 'Created specialized AI assistant for sailing community, demonstrating expertise in fine-tuning large language models for domain-specific applications',
    technologies: ['Flan-T5', 'Fine-tuning', 'NLP', 'Python', 'Machine Learning'],
    icon: <Brain className="w-8 h-8" />,
    gradient: 'from-blue-500 to-purple-600',
    year: '2024',
    category: 'AI Systems',
    githubUrl: 'https://github.com/jdank417/Flan-t5-sailing-JasonDank'
  },
  {
    id: 'wsl2-server-infrastructure',
    title: 'WSL2 Server Infrastructure with GPU Acceleration',
    description: 'Systematic transformation of an HP ZBook Fury laptop into a robust, always-on home server infrastructure. Solved critical challenges including WSL2\'s idle shutdown behavior, secure SSH-over-Tailscale connectivity, and GPU passthrough configuration for CUDA workloads.',
    impact: 'Built enterprise-grade home lab infrastructure enabling GPU-accelerated ML workloads with 99.9% uptime and secure remote access',
    technologies: ['WSL2', 'Windows', 'Ubuntu', 'CUDA', 'Tailscale', 'SSH'],
    icon: <Server className="w-8 h-8" />,
    gradient: 'from-indigo-500 to-purple-600',
    year: '2024',
    category: 'Infrastructure',
    demoUrl: 'https://drive.google.com/file/d/1kRTeivItPW3HBvMCnBD8cd3wxtmspbez/view?usp=sharing'
  },
  {
    id: 'bullbar-stock-ticker',
    title: 'BullBar — Real-Time Stock Ticker',
    description: 'Lightweight SwiftUI macOS utility that floats above all windows, displaying a fully customizable, always-on-top strip of real-time stock quotes via a secure Cloudflare Workers proxy to Financial Modeling Prep\'s batch API—no user credentials required.',
    impact: 'Published macOS app with 1000+ downloads, demonstrating native app development and API integration skills',
    technologies: ['Swift', 'macOS', 'CloudFlare', 'SwiftUI', 'Financial APIs'],
    icon: <TrendingUp className="w-8 h-8" />,
    gradient: 'from-green-500 to-emerald-600',
    year: '2024',
    category: 'Native Apps',
    appStoreUrl: 'https://apps.apple.com/us/app/bullbar/id6745433379?mt=12'
  },
  {
    id: 'bartender-gpt',
    title: 'Bartender-GPT',
    description: 'iOS app written in Swift and optimized for iPhone—with functionality also on iPad. This ongoing project is published on the App Store and continuously receives feature updates.',
    impact: 'Live iOS app on App Store with active user base, showcasing mobile development and product management capabilities',
    technologies: ['Swift', 'iOS', 'App Store', 'SwiftUI', 'Mobile Development'],
    icon: <Brain className="w-8 h-8" />,
    gradient: 'from-orange-500 to-red-600',
    year: '2024',
    category: 'Mobile Apps',
    appStoreUrl: 'https://apps.apple.com/us/app/bartender-gpt/id6743064352?platform=iphone'
  },
  {
    id: 'stock-market-predictor',
    title: 'Deep Learning Stock Market Predictor',
    description: 'Implements a Convolutional Neural Network (CNN) and Long Short-Term Memory (LSTM) model to predict stock prices. Uses historical stock data with technical indicators to forecast future prices, demonstrating expertise in quantitative analysis and algorithmic trading strategies.',
    impact: 'Advanced ML system for financial prediction, directly applicable to private market investment platforms like Fidelity Private Shares',
    technologies: ['Python', 'LSTM', 'CNN', 'TensorFlow', 'Financial Modeling'],
    icon: <TrendingUp className="w-8 h-8" />,
    gradient: 'from-cyan-500 to-blue-600',
    year: '2023',
    category: 'FinTech ML',
    githubUrl: 'https://github.com/jdank417/Deep-Learning-for-Stock-Market-Predictions'
  },
  {
    id: 'grocery-barcode-scanner',
    title: 'GroceryBarcodeScanner',
    description: 'A scalable microservice for scanning and categorizing thousands of retail products with machine learning integration. Built as a Flask web application with real-time barcode scanning capabilities.',
    impact: 'Production-ready microservice handling thousands of product lookups, demonstrating full-stack development and scalability design',
    technologies: ['Python', 'Flask', 'SQL', 'Machine Learning', 'Microservices'],
    icon: <Scan className="w-8 h-8" />,
    gradient: 'from-purple-500 to-pink-600',
    year: '2023',
    category: 'Web Applications',
    demoUrl: 'https://grocerybarcodescanner.onrender.com/'
  }
];

export default function Work() {
  const [currentProject, setCurrentProject] = useState(0);

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToProject = (index: number) => {
    setCurrentProject(index);
  };

  return (
    <section id="work" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="font-display text-display font-bold text-white mb-8 leading-tight">
            Selected Work
          </h2>
          <p className="font-body text-editorial text-gray-300 max-w-2xl leading-relaxed">
            Systems that solve real problems. Products that create meaningful impact. 
            Engineering that matters.
          </p>
        </motion.div>

        {/* Modern Carousel */}
        <div className="relative">
          {/* Main Project Display */}
          <motion.div
            key={currentProject}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="min-h-[600px] flex items-center"
          >
            <div className="grid lg:grid-cols-12 gap-16 w-full">
              {/* Project Content */}
              <div className="lg:col-span-8 space-y-12">
                {/* Project Number & Category */}
                <div className="flex items-center gap-6">
                  <span className="font-hero text-6xl font-black text-gray-800 leading-none">
                    {String(currentProject + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-accent text-sm text-green-400 font-medium tracking-[0.3em] uppercase">
                      {projects[currentProject].category}
                    </span>
                    <span className="w-12 h-px bg-gray-600"></span>
                    <span className="font-accent text-sm text-gray-500 font-medium">
                      {projects[currentProject].year}
                    </span>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="font-display text-display font-bold text-white leading-tight">
                  {projects[currentProject].title}
                </h3>

                {/* Impact Statement */}
                <blockquote className="border-l-4 border-green-400 pl-8">
                  <p className="font-editorial text-subhead text-green-400 font-medium italic leading-tight">
                    "{projects[currentProject].impact}"
                  </p>
                </blockquote>

                {/* Description */}
                <p className="font-editorial text-large text-gray-300 leading-relaxed">
                  {projects[currentProject].description}
                </p>

                {/* External Links */}
                <div className="pt-8 space-y-4">
                  {projects[currentProject].githubUrl && (
                    <a
                      href={projects[currentProject].githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-4 text-white font-heading text-lg font-medium border-b border-gray-600 hover:border-green-400 transition-all duration-500 hover:text-green-400 pb-2 mr-8"
                    >
                      <Github className="w-5 h-5" />
                      <span className="tracking-wide">View Code</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  )}
                  
                  {projects[currentProject].demoUrl && (
                    <a
                      href={projects[currentProject].demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-4 text-white font-heading text-lg font-medium border-b border-gray-600 hover:border-green-400 transition-all duration-500 hover:text-green-400 pb-2 mr-8"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="tracking-wide">
                        {projects[currentProject].id === 'wsl2-server-infrastructure' ? 'Read Paper' : 'Live Demo'}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  )}
                  
                  {projects[currentProject].appStoreUrl && (
                    <a
                      href={projects[currentProject].appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-4 text-white font-heading text-lg font-medium border-b border-gray-600 hover:border-green-400 transition-all duration-500 hover:text-green-400 pb-2 mr-8"
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="tracking-wide">App Store</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  )}
                </div>
              </div>

              {/* Technologies Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <h4 className="font-accent text-sm text-gray-400 font-medium tracking-[0.3em] uppercase mb-6">
                    Technology Stack
                  </h4>
                  <div className="space-y-3">
                    {projects[currentProject].technologies.map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="font-heading text-lg text-gray-400 hover:text-green-400 transition-colors duration-300 cursor-default"
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Project Icon */}
                <div className="pt-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    {projects[currentProject].icon}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-16">
            {/* Previous Button */}
            <button
              onClick={prevProject}
              className="group flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-heading text-lg font-medium">Previous</span>
            </button>

            {/* Project Indicators */}
            <div className="flex items-center gap-3">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToProject(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProject 
                      ? 'bg-green-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextProject}
              className="group flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors duration-300"
            >
              <span className="font-heading text-lg font-medium">Next</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${((currentProject + 1) / projects.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-32 pt-16 border-t border-gray-800"
        >
          <div className="max-w-2xl">
            <h3 className="font-display text-subhead font-medium text-white mb-6 leading-tight">
              More detailed case studies available upon request.
            </h3>
            <p className="font-body text-lg text-gray-400 leading-relaxed mb-8">
              Each project represents months of research, development, and iteration. 
              I'd be happy to walk through the technical details and decision-making process.
            </p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 text-white font-heading text-lg font-medium border-b border-gray-600 hover:border-green-400 transition-all duration-500 hover:text-green-400 pb-2"
            >
              <span className="tracking-wide">Get in Touch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}