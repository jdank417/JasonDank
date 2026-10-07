'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Anchor,
  ArrowUpRight,
  Briefcase,
  Copy,
  FileText,
  FlaskConical,
  FolderGit2,
  Github,
  GraduationCap,
  Hash,
  Home,
  Linkedin,
  Mail,
  Search,
  SunMoon,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { toggleTheme } from './ThemeToggle';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, REGATTATRACK_BETA_URL } from '@/data/site';

const OPEN_EVENT = 'command-palette:open';

/** Opens the palette from anywhere, e.g. the header's ⌘K button. */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/* ------------------------------------------------------------------ */
/* Platform-aware shortcut label: "⌘K" on Apple devices, "Ctrl K" else */

const noopSubscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

export function useShortcutLabel() {
  // Server and first client render agree on ⌘K; non-Apple devices update after hydration.
  const apple = useSyncExternalStore(noopSubscribe, isApple, () => true);
  return apple ? '⌘K' : 'Ctrl K';
}

/* ------------------------------------------------------------------ */

type Command = {
  id: string;
  group: 'Navigate' | 'Actions' | 'Links';
  label: string;
  hint: string;
  keywords: string;
  icon: LucideIcon;
  /** Navigation commands close the palette themselves; actions leave it open. */
  run: () => void;
};

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname.replace(/\/$/, '') || '/';

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setActive(0);
    setStatus('');
    setOpen(true);
  }, []);

  const goToSection = useCallback(
    (id: string) => {
      setOpen(false);
      if (path === '/') {
        // Wait a frame so the scroll lock is released before scrolling.
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
      } else {
        router.push(`/#${id}`);
      }
    },
    [path, router],
  );

  const goTo = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const openExternal = useCallback((url: string) => {
    setOpen(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const commands = useMemo<Command[]>(() => {
    const sections: [string, string, string, LucideIcon][] = [
      ['about', 'About', 'bio summary intro', Hash],
      ['work', 'Work', 'experience jobs roles fidelity harvard resume', Briefcase],
      ['projects', 'Projects', 'portfolio apps humanauth regattatrack bullbar', FolderGit2],
      ['leadership', 'Leadership & honors', 'certifications awards paragon student government', Hash],
      ['education', 'Education', 'wentworth degree school cum laude', GraduationCap],
      ['skills', 'Skills', 'stack languages tools', Hash],
      ['contact', 'Contact', 'email reach hire', Mail],
    ];

    const list: Command[] = [];
    if (path !== '/') {
      list.push({ id: 'home', group: 'Navigate', label: 'Home', hint: '/', keywords: 'portfolio top', icon: Home, run: () => goTo('/') });
    }
    for (const [id, label, keywords, icon] of sections) {
      list.push({ id, group: 'Navigate', label, hint: `#${id}`, keywords, icon, run: () => goToSection(id) });
    }
    if (path !== '/sailing') {
      list.push({ id: 'sailing', group: 'Navigate', label: 'Sailing résumé', hint: '/sailing', keywords: 'boat regatta race club burgee figawi', icon: Anchor, run: () => goTo('/sailing') });
    }
    if (path !== '/terminal') {
      list.push({ id: 'terminal', group: 'Navigate', label: 'Terminal', hint: '/terminal', keywords: 'shell command line cli easter egg', icon: Terminal, run: () => goTo('/terminal') });
    }

    list.push(
      {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: EMAIL,
        keywords: 'mail contact clipboard',
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(EMAIL).then(
            () => setStatus(`Copied ${EMAIL}`),
            () => setStatus(`Couldn't reach the clipboard. The address is ${EMAIL}`),
          );
        },
      },
      {
        id: 'theme',
        group: 'Actions',
        label: 'Toggle dark mode',
        hint: 'theme',
        keywords: 'light dark theme appearance',
        icon: SunMoon,
        run: () => {
          setStatus(`Switched to ${toggleTheme()} mode.`);
        },
      },
      { id: 'paper', group: 'Links', label: 'Read the HumanAuth paper', hint: 'PDF', keywords: 'capstone research captcha computer vision', icon: FileText, run: () => openExternal(PAPER_URL) },
      { id: 'beta', group: 'Links', label: 'Join the RegattaTrack beta', hint: 'TestFlight', keywords: 'app ios sailing course', icon: FlaskConical, run: () => openExternal(REGATTATRACK_BETA_URL) },
      { id: 'github', group: 'Links', label: 'GitHub', hint: 'jdank417', keywords: 'code source repos', icon: Github, run: () => openExternal(GITHUB_URL) },
      { id: 'linkedin', group: 'Links', label: 'LinkedIn', hint: 'in/jason-dank', keywords: 'profile resume', icon: Linkedin, run: () => openExternal(LINKEDIN_URL) },
    );
    return list;
  }, [path, goTo, goToSection, openExternal]);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return commands;
    return commands.filter((c) => {
      const hay = `${c.label} ${c.hint} ${c.keywords} ${c.group}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  // A group label sits above the first command of each group.
  const groupStarts = useMemo(
    () => results.map((cmd, i) => (i === 0 || results[i - 1].group !== cmd.group ? cmd.group : null)),
    [results],
  );

  const runCommand = useCallback((cmd: Command | undefined) => {
    if (!cmd) return;
    cmd.run();
  }, []);

  // ⌘K / Ctrl K toggles from anywhere; the header button sends OPEN_EVENT.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [open, close, show]);

  // While open: lock page scroll and focus the input. On close, hand focus back.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previous;
      const target = returnFocus.current;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
  }, [open]);

  // Keep the highlighted row in view as the arrow keys move it.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length) setActive((activeIndex + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setActive((activeIndex - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(results[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      // The input is the palette's only focus stop; keep focus inside the dialog.
      e.preventDefault();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-background/70 px-4 backdrop-blur-sm"
          style={{ paddingTop: 'max(12vh, calc(env(safe-area-inset-top, 0px) + 24px))' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl overflow-hidden rounded-md border border-foreground bg-background shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.14 }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 flex-shrink-0 text-muted" aria-hidden />
              <input
                ref={inputRef}
                id="command-palette-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                  setStatus('');
                }}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                autoComplete="off"
                spellCheck={false}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results.length ? `${listId}-${activeIndex}` : undefined}
                className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted"
              />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[0.7rem] text-muted sm:inline">esc</kbd>
            </div>

            <ul ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-[min(60vh,420px)] overflow-y-auto p-1.5">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">No commands match “{query}”.</li>
              )}
              {results.map((cmd, i) => {
                const header = groupStarts[i];
                const selected = i === activeIndex;
                const Icon = cmd.icon;
                return (
                  <li key={cmd.id} role="presentation">
                    {header && (
                      <div className="px-3 pb-1 pt-3 text-[0.68rem] uppercase tracking-[0.12em] text-muted">{header}</div>
                    )}
                    <div
                      id={`${listId}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => {
                        if (active !== i) setActive(i);
                      }}
                      onClick={() => runCommand(cmd)}
                      className={`flex cursor-pointer items-center gap-3 rounded px-3 py-2.5 text-sm ${
                        selected ? 'bg-accent text-accent-ink' : 'text-foreground'
                      }`}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${selected ? '' : 'text-muted'}`} aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                      <span className={`truncate text-xs ${selected ? 'text-accent-ink' : 'text-muted'}`}>{cmd.hint}</span>
                      {cmd.group === 'Links' && <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-xs text-muted">
              <span aria-live="polite" className="min-w-0 truncate">
                {status || (
                  <>
                    <kbd className="font-mono">↑↓</kbd> to move · <kbd className="font-mono">↵</kbd> to select
                  </>
                )}
              </span>
              <span className="hidden flex-shrink-0 sm:inline">jasondank.com</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
