'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Feeds the pointer position to every `[data-spotlight]` element inside the
 * group, as `--spot-x` / `--spot-y` relative to each element, so the
 * `.spotlight-card` glow in globals.css can follow the mouse across a grid.
 *
 * Mouse only: on touch devices there's no hover to follow, so nothing is wired.
 */
export function useSpotlight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const group = ref.current;
    if (!group || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      group.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${x - r.left}px`);
        card.style.setProperty('--spot-y', `${y - r.top}px`);
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    group.addEventListener('pointermove', onMove);
    return () => {
      group.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}
