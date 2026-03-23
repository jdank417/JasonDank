'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  id: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#hero', id: 'hero' },
  { name: 'Work', href: '#work', id: 'work' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Experience', href: '#experience', id: 'experience' },
  { name: 'Certifications', href: '#certifications', id: 'certifications' },
  { name: 'Recommendations', href: '#recommendations', id: 'recommendations' },
  { name: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 12]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 sm:px-8 lg:px-12"
        style={{
          backdropFilter: `blur(${headerBlur}px)`,
        }}
      >
        <motion.div
          className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-black/80 px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          style={{ opacity: headerOpacity }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection('hero')}
              className="group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500" />
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <span className="font-heading text-lg font-bold text-white">
                  JD
                </span>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(1).map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-full font-mono text-sm transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-emerald-300'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 rounded-full border border-emerald-400/20 bg-emerald-400/10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 uppercase tracking-[0.1em]">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="h-5 w-5 text-white" />
                ) : (
                  <Menu className="h-5 w-5 text-white" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className="lg:hidden fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <motion.nav
          className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 px-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`group relative font-heading text-3xl font-bold transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-emerald-300'
                  : 'text-white hover:text-emerald-300'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: isOpen ? 1 : 0, 
                y: isOpen ? 0 : 30 
              }}
              transition={{ 
                duration: 0.4, 
                delay: isOpen ? 0.2 + index * 0.1 : 0 
              }}
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative">
                {item.name}
                <motion.div
                  className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </span>
            </motion.button>
          ))}
        </motion.nav>
      </motion.div>
    </>
  );
}