'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Below `md`, a section's card list becomes a horizontal scroll-snap row.
 * This hook tracks which card is in view for the counter, scrolls to a card
 * for the arrow buttons, and — the first time the row comes into view on a
 * phone — nudges it sideways and back once, so people learn it swipes.
 *
 * The scroller must be `relative` so its children's offsetLeft is measured
 * from it.
 */
export function useCarousel(ref: RefObject<HTMLElement | null>) {
  const [index, setIndex] = useState(0);

  const items = useCallback(() => {
    const el = ref.current;
    return el ? (Array.from(el.children) as HTMLElement[]) : [];
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
        const at = el.scrollLeft + pad;
        let best = 0;
        let bestDist = Infinity;
        items().forEach((child, i) => {
          const d = Math.abs(child.offsetLeft - at);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    // One-time swipe hint, phones only, never under reduced motion.
    const phone = window.matchMedia('(max-width: 767.98px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];
    let io: IntersectionObserver | undefined;
    if (phone && !reduced) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || el.scrollWidth <= el.clientWidth + 4 || el.scrollLeft > 0) return;
          io?.disconnect();
          el.style.scrollSnapType = 'none';
          el.scrollTo({ left: 64, behavior: 'smooth' });
          timers.push(
            window.setTimeout(() => {
              el.scrollTo({ left: 0, behavior: 'smooth' });
              timers.push(window.setTimeout(() => (el.style.scrollSnapType = ''), 450));
            }, 520),
          );
        },
        { threshold: 0.6 },
      );
      io.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      io?.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [ref, items]);

  const goTo = useCallback(
    (i: number) => {
      const el = ref.current;
      const list = items();
      if (!el || !list.length) return;
      const target = list[Math.max(0, Math.min(list.length - 1, i))];
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollTo({ left: target.offsetLeft - pad, behavior: reduced ? 'auto' : 'smooth' });
    },
    [ref, items],
  );

  return { index, goTo };
}

/** "03 / 10" with previous / next buttons. Phones only. */
export function CarouselControls({
  index,
  count,
  onGo,
  label,
}: {
  index: number;
  count: number;
  onGo: (i: number) => void;
  label: string;
}) {
  if (count < 2) return null;
  const current = Math.min(index, count - 1);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="mt-3 flex items-center justify-between gap-3 md:hidden">
      <p className="text-xs uppercase tracking-[0.12em] text-muted" aria-live="polite">
        <span className="font-bold text-foreground tabular-nums">{pad(current + 1)}</span>
        <span className="tabular-nums"> / {pad(count)}</span>
        <span className="ml-2">swipe {label}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onGo(current - 1)}
          disabled={current === 0}
          aria-label={`Previous ${label.replace(/s$/, '')}`}
          className="press inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground disabled:opacity-35"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onGo(current + 1)}
          disabled={current >= count - 1}
          aria-label={`Next ${label.replace(/s$/, '')}`}
          className="press inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground disabled:opacity-35"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
