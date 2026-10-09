'use client';

import { useEffect, useRef } from 'react';
import { SceneSvg } from '.';
import { scenes } from './scenes';

/**
 * A project's scene in miniature, for its card. It rests on a still frame and
 * plays only while it has attention: while the card is hovered where there's a
 * mouse, or while it's on screen on touch devices. Eleven scenes running at once
 * would be a lot to look at, and a lot of work for a phone.
 */
export default function ProjectThumb({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const scene = scenes[id];
    if (!el || !scene) return;
    // Reduced motion turns the animations off in CSS, leaving nothing to find here.
    const animations = () => el.getAnimations({ subtree: true });
    for (const animation of animations()) {
      animation.pause();
      animation.currentTime = Number(animation.effect?.getTiming().duration ?? 0) * scene.still;
    }
    const setPlaying = (on: boolean) => animations().forEach((a) => (on ? a.play() : a.pause()));

    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const card = el.closest('article') ?? el;
      const play = () => setPlaying(true);
      const pause = () => setPlaying(false);
      card.addEventListener('pointerenter', play);
      card.addEventListener('pointerleave', pause);
      return () => {
        card.removeEventListener('pointerenter', play);
        card.removeEventListener('pointerleave', pause);
      };
    }
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.intersectionRatio >= 0.6), {
      threshold: [0, 0.6, 1],
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div ref={ref} className="project-anim">
      <SceneSvg id={id} className="block h-auto w-full" />
    </div>
  );
}
