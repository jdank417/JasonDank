'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = '#%&*+=/<>[]{}01';

/**
 * Text that cycles through random glyphs and settles left to right, like a
 * terminal decoding, the first time it scrolls into view. The site is set in a
 * monospace face, so the scramble never shifts the layout.
 *
 * The real text is always in the DOM for screen readers and search; only the
 * visible copy animates. Skipped entirely under reduced motion.
 */
export default function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // null whenever the text is at rest, so a changed `text` prop shows at once.
  const [frame, setFrame] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const duration = 450 + text.length * 35;
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        if (progress >= 1) {
          setFrame(null);
          return;
        }
        const settled = Math.floor(progress * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          out += i < settled || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setFrame(out);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{frame ?? text}</span>
    </span>
  );
}
