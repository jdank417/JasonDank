'use client';

import { useEffect, useRef, useState } from 'react';

export interface RulerSection {
  id: string;
  name: string;
  /** The section's number as its heading shows it (§00 → "00"); unnumbered ones get a dot. */
  mark?: string;
}

// The home page's sections, numbered as their headings are (§00, §01, …).
export const HOME_SECTIONS: RulerSection[] = [
  'about',
  'work',
  'projects',
  'leadership',
  'education',
  'skills',
  'recommendations',
  'contact',
].map((id, i) => ({ id, name: id, mark: String(i).padStart(2, '0') }));

interface Mark extends RulerSection {
  /** Where on the ruler (0–1) the pointer sits when this section reaches the top. */
  at: number;
}

/**
 * A latitude scale down the left edge, like the border of a printed chart:
 * alternating bars, a tick and number per section, and a brass pointer that
 * tracks the scroll. Desktop only; it sits in the page's side padding, so it
 * never covers content.
 */
export default function LatitudeRuler({ sections = HOME_SECTIONS }: { sections?: RulerSection[] }) {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const pointer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const range = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const measure = () => {
      const max = range();
      setMarks(
        sections.flatMap((section) => {
          const el = document.getElementById(section.id);
          return el ? [{ ...section, at: Math.min(1, Math.max(0, (el.offsetTop - 80) / max)) }] : [];
        }),
      );
    };

    const onScroll = () => {
      const f = Math.min(1, window.scrollY / range());
      if (pointer.current) pointer.current.style.top = `${f * 100}%`;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let here: string | null = null;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop - 120 <= window.scrollY) here = id;
      }
      setCurrent(atBottom ? sections[sections.length - 1].id : here);
    };

    // The observer fires once on observe, which also takes the first measurement.
    const resize = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    resize.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [sections]);

  const name = marks.find((m) => m.id === current)?.name;

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-6 left-0 top-24 z-40 hidden w-7 lg:block">
      <div className="relative h-full">
        <div className="latitude-bars absolute inset-y-0 left-2 w-[5px] border border-foreground/50" />

        {marks.map((m) => (
          <button
            key={m.id}
            type="button"
            tabIndex={-1}
            onClick={() => document.getElementById(m.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="group pointer-events-auto absolute left-0 flex -translate-y-1/2 items-center"
            style={{ top: `${m.at * 100}%` }}
            title={m.name}
          >
            <span className={`h-px w-4 ${current === m.id ? 'bg-accent' : 'bg-foreground/60'}`} />
            <span
              className={`ml-0.5 text-[0.55rem] tabular-nums transition-colors group-hover:text-foreground ${
                current === m.id ? 'text-foreground' : 'text-muted'
              }`}
            >
              {m.mark ?? '·'}
            </span>
          </button>
        ))}

        {/* You are here: a brass pointer and the section's name. */}
        <div ref={pointer} className="absolute left-0 top-0 w-7 transition-[top] duration-150 ease-out">
          <span className="absolute -left-px top-0 h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[7px] border-y-transparent border-l-accent" />
          {name && (
            <span className="absolute left-[14px] top-2 bg-background py-1 text-[0.6rem] uppercase tracking-[0.18em] text-foreground [writing-mode:vertical-rl]">
              {name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
