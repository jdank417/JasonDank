'use client';

import { useEffect, useRef } from 'react';
import { cssToken, monoFont, onThemeChange, prefersReducedMotion, sizeCanvas, withAlpha } from '@/lib/canvas';

/**
 * A portolan-chart backdrop: compass roses throwing out 32 straight rhumb
 * lines, one per point of the compass. The main rose sits in the top-right
 * with a coordinate label; a fainter one anchors the bottom-left. Lines drift a
 * few pixels with the pointer (mouse only, and never under reduced motion).
 *
 * Renders an absolutely positioned canvas — place it inside a `relative` box.
 */
export default function RhumbLines({ label }: { label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let px = 0;
    let py = 0;
    let frame = 0;

    const drawRose = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      R: number,
      fg: string,
      accent: string,
      card: string,
    ) => {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 8, 0, Math.PI * 2);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;

      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 - Math.PI / 2;
        const len = k % 2 ? R * 0.55 : R;
        const half = k % 2 ? R * 0.11 : R * 0.17;
        const tip: [number, number] = [cx + Math.cos(a) * len, cy + Math.sin(a) * len];
        const left: [number, number] = [cx + Math.cos(a - Math.PI / 2) * half, cy + Math.sin(a - Math.PI / 2) * half];
        const right: [number, number] = [cx + Math.cos(a + Math.PI / 2) * half, cy + Math.sin(a + Math.PI / 2) * half];

        // Each point is two half-blades: one solid, one in the card colour.
        ctx.beginPath();
        ctx.moveTo(...tip);
        ctx.lineTo(...left);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fillStyle = k === 0 ? accent : fg;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(...tip);
        ctx.lineTo(...right);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fillStyle = card;
        ctx.fill();
        ctx.strokeStyle = fg;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.fillStyle = fg;
      ctx.font = monoFont(700, 11);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('N', cx, cy - R - 13);
    };

    const draw = () => {
      frame = 0;
      const { ctx, w, h } = sizeCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const fg = cssToken('--foreground');
      const accent = cssToken('--accent');
      const card = cssToken('--card');
      const muted = cssToken('--muted');

      // Phones: tuck the rose into the top-right corner, above the hero copy.
      const narrow = w < 640;
      const R = narrow ? 22 : Math.min(44, Math.max(28, w * 0.03));
      const roseX = (narrow ? w - 44 : w * 0.82) + px * 14;
      const roseY = (narrow ? 46 : Math.min(150, Math.max(70, h * 0.15))) + py * 10;
      const roses: [number, number, number][] = [
        [roseX, roseY, 1],
        [w * 0.04 - px * 8, h * 0.98 - py * 6, 0.55],
      ];

      // Lines fade out with distance from their rose, the way they thin out
      // across an old chart. On phones the fade is short, so the lines end
      // before they reach the body copy.
      const reach = Math.hypot(w, h) * 1.3;
      const fade = narrow ? 260 : Math.max(w, h) * 0.85;
      const fading = (cx: number, cy: number, color: string, alpha: number) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, fade);
        g.addColorStop(0, withAlpha(color, alpha));
        g.addColorStop(0.55, withAlpha(color, alpha * 0.6));
        g.addColorStop(1, withAlpha(color, 0));
        return g;
      };
      for (const [cx, cy, strength] of roses) {
        const cardinal = fading(cx, cy, accent, 0.9 * strength);
        const inter = fading(cx, cy, fg, 0.2 * strength);
        const minor = fading(cx, cy, fg, 0.08 * strength);
        for (let i = 0; i < 32; i++) {
          const a = (i * Math.PI) / 16;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * reach, cy + Math.sin(a) * reach);
          if (i % 8 === 0) {
            // The four cardinal lines carry the accent.
            ctx.strokeStyle = cardinal;
            ctx.lineWidth = 1.3;
          } else if (i % 4 === 0) {
            ctx.strokeStyle = inter;
            ctx.lineWidth = 1;
          } else {
            ctx.strokeStyle = minor;
            ctx.lineWidth = 0.8;
          }
          ctx.stroke();
        }
      }

      drawRose(ctx, roseX, roseY, R, fg, accent, card);

      if (label) {
        ctx.font = monoFont(500, 10);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lx = Math.min(roseX, w - 60);
        const ly = roseY + R + 22;
        const tw = ctx.measureText(label).width;
        // A chip of page background so the lines don't strike through the text.
        ctx.fillStyle = cssToken('--background');
        ctx.fillRect(lx - tw / 2 - 5, ly - 8, tw + 10, 16);
        ctx.fillStyle = muted;
        ctx.fillText(label, lx, ly);
      }
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = host.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5;
      py = (e.clientY - r.top) / r.height - 0.5;
      queue();
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      queue();
    };

    const reduced = prefersReducedMotion();
    if (!reduced) {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
    }
    const resize = new ResizeObserver(queue);
    resize.observe(host);
    const stopTheme = onThemeChange(queue);
    document.fonts?.ready.then(queue);
    draw();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      resize.disconnect();
      stopTheme();
    };
  }, [label]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent)' }}
    />
  );
}
