'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ChevronRight, Code, Zap, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnimatedElement {
  id: number;
  x: number;
  y: number;
  rotate: number;
  duration: number;
  delay: number;
  left: number;
  top: number;
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [floatingSymbols, setFloatingSymbols] = useState<AnimatedElement[]>([]);
  const [ambientParticles, setAmbientParticles] = useState<AnimatedElement[]>([]);

  useEffect(() => {
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsClient(true);
      
      // Detect mobile devices
      const checkIsMobile = () => {
        return window.innerWidth < 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      };
      const mobile = checkIsMobile();
      setIsMobile(mobile);
      
      // Reduce animations on mobile for better performance
      const symbolCount = mobile ? 6 : 12;
      const particleCount = mobile ? 8 : 20;
      
      // Generate floating symbols data
      const symbols = Array.from({ length: symbolCount }, (_, i) => ({
        id: i,
        x: Math.random() * 1200,
        y: Math.random() * 800,
        rotate: Math.random() * 360,
        duration: mobile ? 15 + Math.random() * 5 : 10 + Math.random() * 10, // Slower on mobile
        delay: i * 0.5,
        left: Math.random() * 100,
        top: Math.random() * 100,
      }));
      setFloatingSymbols(symbols);

      // Generate ambient particles data
      const particles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 1200,
        y: Math.random() * 800,
        rotate: 0,
        duration: mobile ? 12 + Math.random() * 4 : 8 + Math.random() * 4, // Slower on mobile
        delay: Math.random() * 5,
        left: Math.random() * 100,
        top: Math.random() * 100,
      }));
      setAmbientParticles(particles);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    workSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Letter animation variants - optimized for performance
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, // Reduced from 100 for smoother animation
      scale: 0.8 // Less dramatic scale change
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08, // Slightly faster stagger
        duration: 0.6, // Shorter duration for snappier feel
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        type: "tween" as const // Use tween instead of spring for more predictable performance
      }
    })
  };

  const nameLetters = "JASON".split("");
  const surnameLetters = "DANK".split("");

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Dynamic grid that follows mouse */}
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `
              radial-gradient(circle at ${mousePosition.x * 0.1}% ${mousePosition.y * 0.1}%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x * 0.1}% ${100 - mousePosition.y * 0.1}%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
              linear-gradient(45deg, transparent 40%, rgba(34, 197, 94, 0.05) 50%, transparent 60%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 30px 30px'
          }}
        />

        {/* Floating code symbols */}
        <div className="absolute inset-0">
          {isClient && floatingSymbols.map((symbol) => (
            <motion.div
              key={symbol.id}
              className="absolute text-green-400 opacity-10"
              initial={{ 
                x: symbol.x, 
                y: symbol.y,
                rotate: symbol.rotate
              }}
              animate={{
                y: [null, -50, null],
                rotate: [null, 360, null],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: symbol.duration,
                repeat: Infinity,
                ease: "linear",
                delay: symbol.delay
              }}
              style={{
                left: `${symbol.left}%`,
                top: `${symbol.top}%`
              }}
            >
              {symbol.id % 3 === 0 ? <Code className="w-6 h-6" /> : 
               symbol.id % 3 === 1 ? <Zap className="w-4 h-4" /> : 
               <Brain className="w-5 h-5" />}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Massive Name Display */}
          <div className="text-center mb-16">
            {/* JASON - First Name */}
            <div className="mb-8 perspective-1000">
              <div className="flex justify-center items-center gap-2 sm:gap-4 lg:gap-8">
                {nameLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ 
                      scale: 1.2, 
                      rotateY: 15,
                      color: "#22c55e",
                      textShadow: "0 0 30px rgba(34, 197, 94, 0.8)"
                    }}
                    className="font-hero font-black text-white cursor-pointer select-none"
                    style={{
                      fontSize: 'clamp(8rem, 25vw, 28rem)',
                      lineHeight: '0.8',
                      letterSpacing: '-0.05em',
                      textShadow: '0 0 50px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* DANK - Last Name */}
            <div className="mb-16 perspective-1000">
              <div className="flex justify-center items-center gap-2 sm:gap-4 lg:gap-8">
                {surnameLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i + 5}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ 
                      scale: 1.2, 
                      rotateY: -15,
                      textShadow: "0 0 30px rgba(16, 185, 129, 0.8)"
                    }}
                    className="font-hero font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent cursor-pointer select-none"
                    style={{
                      fontSize: 'clamp(8rem, 25vw, 28rem)',
                      lineHeight: '0.8',
                      letterSpacing: '-0.05em',
                      filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.3))'
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Animated Role Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mb-12"
            >
              <div className="relative overflow-hidden h-16 flex items-center justify-center">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute whitespace-nowrap font-accent text-lg sm:text-xl text-green-400 font-bold tracking-[0.5em] uppercase"
                >
                  SOFTWARE ENGINEER • AI SYSTEMS • PRODUCT BUILDER • FULL STACK DEVELOPER • TECHNICAL LEADER • 
                </motion.div>
              </div>
            </motion.div>

            {/* Dramatic Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="mb-16"
            >
              <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Building systems that
                <br />
                <motion.span 
                  className="font-editorial italic bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  actually matter.
                </motion.span>
              </h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="font-editorial text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              >
                Full-stack engineer at <span className="text-green-400 font-semibold">Fidelity Investments</span>, 
                specializing in financial technology solutions. From enterprise infrastructure to AI applications—creating products that solve real problems.
              </motion.p>
            </motion.div>

            {/* Interactive CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={scrollToWork}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-heading text-xl font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Selected Work
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {isClient && ambientParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 0
            }}
            animate={{
              y: [null, -100, null],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`
            }}
          />
        ))}
      </div>
    </section>
  );
}