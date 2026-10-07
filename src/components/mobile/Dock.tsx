'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Anchor, Briefcase, FolderGit2, Moon, Search, Sun, type LucideIcon } from 'lucide-react';
import { openCommandPalette, useShortcutLabel } from '../CommandPalette';
import { toggleTheme, useTheme } from '../ThemeToggle';

/**
 * The phone and tablet navigation: a floating dock pinned above the home
 * indicator, in thumb reach. It replaces the old full-screen menu: the two
 * busiest sections and the sailing page are one tap away, and Search opens
 * the command palette, which reaches every section, page and link.
 * Hidden from `lg` up, where the header nav takes over.
 */
export default function Dock({
  isHome,
  isSailing,
  activeSection,
}: {
  isHome: boolean;
  isSailing: boolean;
  activeSection: string;
}) {
  const router = useRouter();
  const theme = useTheme();
  const shortcut = useShortcutLabel();

  const goToSection = (id: string) => {
    if (isHome) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    else router.push(`/#${id}`);
  };

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-50 flex justify-center px-4 lg:hidden"
    >
      <div className="flex items-stretch gap-0.5 rounded-2xl border border-border bg-background/85 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <DockButton
          icon={Briefcase}
          label="Work"
          active={isHome && activeSection === 'work'}
          onClick={() => goToSection('work')}
        />
        <DockButton
          icon={FolderGit2}
          label="Projects"
          active={isHome && activeSection === 'projects'}
          onClick={() => goToSection('projects')}
        />
        <DockButton icon={Anchor} label="Sailing" active={isSailing} href="/sailing" />
        <span className="mx-0.5 my-2 w-px bg-border" aria-hidden />
        <DockButton
          icon={Search}
          label="Search"
          ariaLabel={`Search and commands (${shortcut})`}
          onClick={openCommandPalette}
        />
        <DockButton
          icon={theme === 'dark' ? Sun : Moon}
          label={theme === 'dark' ? 'Light' : 'Dark'}
          ariaLabel={`switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => toggleTheme()}
        />
      </div>
    </nav>
  );
}

function DockButton({
  icon: Icon,
  label,
  ariaLabel,
  active = false,
  href,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  ariaLabel?: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const className = `press relative flex min-w-[3.6rem] flex-col items-center gap-1 rounded-xl px-2 pb-1.5 pt-2 text-[0.6rem] uppercase tracking-[0.08em] transition-colors ${
    active ? 'text-accent-ink' : 'text-muted hover:text-foreground'
  }`;
  const content = (
    <>
      {active && (
        <motion.span
          layoutId="dock-active"
          className="absolute inset-0 rounded-xl bg-accent"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          aria-hidden
        />
      )}
      <Icon className="relative h-[1.15rem] w-[1.15rem]" aria-hidden />
      <span className="relative">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} aria-current={active ? 'page' : undefined} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={active ? 'location' : undefined}
      className={className}
    >
      {content}
    </button>
  );
}
