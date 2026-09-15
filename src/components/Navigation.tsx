'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ArrowLeft, ArrowUpRight, Anchor } from 'lucide-react';

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
  { name: 'contact', id: 'contact' },
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

  const scrollToSection = (sectionId: string) => {
    if (!isHome) return;
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  if (!isHome) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-baseline gap-2">
            <Link href="/" className="text-sm font-bold tracking-tight">
              jasondank.com
            </Link>
            <span className="text-sm text-muted">/sailing</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            back to portfolio
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-baseline gap-2 text-left"
          >
            <span className="text-sm font-bold tracking-tight">jasondank.com</span>
            <span className="hidden text-sm text-muted sm:inline">{'// software engineer'}</span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`border-b-2 px-3 py-1 text-sm transition-colors ${
                  activeSection === item.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {item.name}
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
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md border border-border p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <nav className="flex min-h-screen flex-col items-start justify-center gap-6 px-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-3xl font-bold ${
                  activeSection === item.id ? 'text-foreground' : 'text-muted'
                }`}
              >
                {item.name}
              </button>
            ))}
            <Link
              href="/sailing"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-foreground bg-accent px-4 py-2 text-lg font-medium text-accent-ink"
            >
              <Anchor className="h-4 w-4" />
              sailing resume
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
