'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

const THEME_EVENT = 'themechange';

/**
 * The resolved theme lives in the DOM (`data-theme`, set before first paint by
 * the boot script in `layout.tsx`) with the media query as the fallback, so we
 * subscribe to it as an external store rather than mirroring it into state.
 */
function getSnapshot(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    media.removeEventListener('change', onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode — the choice just won't persist */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={`switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-foreground hover:text-foreground ${className}`}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
