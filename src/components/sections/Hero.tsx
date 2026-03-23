'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ChevronRight } from 'lucide-react';

export default function Hero() {
  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    workSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Name */}
          <motion.h1 
            className="font-heading text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <span className="block text-white">Jason</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Dank
            </span>
          </motion.h1>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <p className="font-body text-xl sm:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide">
              Software Engineer | AI Systems | Product Builder
            </p>
            
            {/* Tagline */}
            <p className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white max-w-4xl mx-auto leading-tight">
              Building systems that actually matter.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="pt-8"
          >
            <button
              onClick={scrollToWork}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
            >
              View Work
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-gray-400 cursor-pointer hover:text-green-400 transition-colors duration-300"
            onClick={scrollToWork}
          >
            <span className="text-sm font-medium tracking-wider uppercase">Scroll</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-60"
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-400 rounded-full opacity-40"
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-green-300 rounded-full opacity-50"
        animate={{
          y: [0, -25, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </section>
  );
}