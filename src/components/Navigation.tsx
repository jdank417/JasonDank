'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Anchor, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { openCommandPalette, useShortcutLabel } from './CommandPalette';
import Dock from './mobile/Dock';

interface NavItem {
  name: string;
  id: string;
}

const navItems: NavItem[] = [
  { name: 'about', id: 'about' },
  { name: 'work', id: 'work' },
  { name: 'projects', id: 'projects' },
  { name: 'leadership', id: 'leadership' },
  { name: 'education', id: 'education' },
  { name: 'skills', id: 'skills' },
  { name: 'contact', id: 'contact' },
];

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // Shown as the breadcrumb on inner pages, e.g. "/sailing" or "/terminal".
  const path = pathname.replace(/\/$/, '') || '/';

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

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (!isHome) return;
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    },
    [isHome],
  );

  // Below lg the floating dock stands in for the header's controls.
  const dock = <Dock isHome={isHome} isSailing={path === '/sailing'} activeSection={activeSection} />;

  if (!isHome) {
    return (
      <>
        <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4">
            <div className="flex min-w-0 items-baseline gap-2">
              <Link href="/" className="text-sm font-bold tracking-tight">
                jasondank.com
              </Link>
              <span className="truncate text-sm text-muted">{path}</span>
            </div>
            <div className="flex items-center gap-2">
              <PaletteButton keyHint="sm" className="max-lg:hidden" />
              <ThemeToggle className="max-lg:hidden" />
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
        {dock}
      </>
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
                className={`relative px-2.5 py-1.5 text-sm transition-colors xl:px-3 ${
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
            <PaletteButton keyHint="xl" className="ml-2" />
            <ThemeToggle className="ml-2" />
          </nav>

        </div>
      </header>

      {dock}
    </>
  );
}

/** Opens the ⌘K palette. Shows the shortcut where there's room and a keyboard is likely. */
function PaletteButton({
  keyHint,
  className = '',
}: {
  keyHint: 'xl' | 'sm' | 'never';
  className?: string;
}) {
  const label = useShortcutLabel();
  const kbdClass = keyHint === 'xl' ? 'hidden xl:inline' : keyHint === 'sm' ? 'hidden sm:inline' : 'hidden';
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-label={`Search and commands (${label})`}
      aria-keyshortcuts="Meta+K Control+K"
      className={`inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md border border-border px-2.5 text-muted transition-colors hover:border-foreground hover:text-foreground ${className}`}
    >
      <Search className="h-4 w-4" />
      <kbd className={`${kbdClass} whitespace-nowrap font-mono text-xs`}>{label}</kbd>
    </button>
  );
}
