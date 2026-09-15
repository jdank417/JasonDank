'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowLeft, ArrowUpRight, Anchor, Github, Linkedin, Mail } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  name: string;
  id: string;
}

const navItems: NavItem[] = [
  { name: 'about', id: 'about' },
  { name: 'experience', id: 'experience' },
  { name: 'work', id: 'work' },
  { name: 'leadership', id: 'leadership' },
  { name: 'education', id: 'education' },
  { name: 'skills', id: 'skills' },
  { name: 'contact', id: 'contact' },
];

const quickLinks = [
  { label: 'github', href: 'https://github.com/jdank417', icon: Github },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/jason-dank', icon: Linkedin },
  { label: 'email', href: 'mailto:jason.dank@outlook.com', icon: Mail },
];

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveSection('contact');
        return;
      }

      const sections = ['hero', ...navItems.map((item) => item.id)]
        .map((id) => document.getElementById(id));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Keep the page behind the overlay from scrolling, and let Escape close it.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (!isHome) return;
      setIsOpen(false);
      // Let the overlay unmount before scrolling so the body isn't still locked.
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      });
    },
    [isHome],
  );

  if (!isHome) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4">
          <div className="flex min-w-0 items-baseline gap-2">
            <Link href="/" className="text-sm font-bold tracking-tight">
              jasondank.com
            </Link>
            <span className="truncate text-sm text-muted">/sailing</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">back to portfolio</span>
              <span className="sr-only sm:hidden">back to portfolio</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const activeLabel =
    activeSection === 'hero'
      ? 'top'
      : navItems.find((item) => item.id === activeSection)?.name ?? activeSection;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex min-w-0 items-baseline gap-2 text-left"
          >
            <span className="whitespace-nowrap text-sm font-bold tracking-tight">jasondank.com</span>
            <span className="hidden whitespace-nowrap text-sm text-muted sm:inline lg:hidden xl:inline">
              {'// software engineer'}
            </span>
            {/* On phones the slot is used for a live section readout instead. */}
            <span className="truncate text-sm text-muted sm:hidden">/ {activeLabel}</span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-1.5 text-sm transition-colors ${
                  activeSection === item.id
                    ? 'text-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
            <Link
              href="/sailing"
              className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-foreground bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink transition-transform hover:-translate-y-0.5"
            >
              <Anchor className="h-3.5 w-3.5" />
              sailing
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <ThemeToggle className="ml-2" />
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-colors hover:border-foreground"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-background lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-graph opacity-40" />

            <nav className="relative flex min-h-[100dvh] flex-col justify-center gap-1 px-6 pb-16 pt-24">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.04 + index * 0.035 }}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-baseline gap-4 border-b border-border py-3 text-left"
                >
                  <span className="w-8 shrink-0 text-xs text-muted">
                    §{String(index).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-3xl font-bold transition-colors ${
                      activeSection === item.id ? 'text-foreground' : 'text-muted'
                    }`}
                  >
                    {item.name}
                  </span>
                  {activeSection === item.id && (
                    <span className="ml-auto h-2 w-2 shrink-0 self-center rounded-full bg-accent" />
                  )}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.3 }}
                className="mt-8 space-y-5"
              >
                <Link
                  href="/sailing"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-md border border-foreground bg-accent px-4 py-3 text-base font-medium text-accent-ink"
                >
                  <Anchor className="h-4 w-4" />
                  sailing résumé
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <div className="flex flex-wrap gap-2">
                  {quickLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm text-muted transition-colors hover:border-foreground hover:text-foreground"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
