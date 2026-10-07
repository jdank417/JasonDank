'use client';

import { useEffect, useRef, useState } from 'react';
import Burgee from './Burgee';
import { clubs, type ClubEntry } from '@/data/sailing';
import { cssToken, monoFont, onThemeChange, prefersReducedMotion, sizeCanvas } from '@/lib/canvas';

/**
 * Sail the chart: a small boat on a race course with one mark per club, laid
 * out in the order Jason joined them. At rest an autopilot sails the course;
 * moving the pointer over the water (or tapping it, or the arrow keys) hands
 * over the helm. Rounding a mark links down to that club's entry.
 */

// Oldest club first, so the course runs 2012 → today.
const course: ClubEntry[] = [...clubs].reverse();

const SHORT: Record<string, string> = {
  westhampton: 'Westhampton',
  pjyc: 'Port Jeff',
  wentworth: 'Wentworth',
  squantum: 'Squantum',
  'community-boating': 'Community Boating',
  eastern: 'Eastern',
};

// A zig-zag beat across the chart: marks alternate low and high.
const marks = course.map((club, i) => {
  const n = course.length;
  return {
    club,
    x: 0.09 + (0.82 * i) / (n - 1),
    y: i % 2 === 0 ? 0.7 : 0.3,
    year: club.period.match(/\d{4}/)?.[0] ?? '',
  };
});

const ROUND_RADIUS = 22;

type Status =
  | { kind: 'auto' }
  | { kind: 'helm' }
  | { kind: 'rounded'; club: ClubEntry };

export default function SailChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>({ kind: 'auto' });
  const [rounded, setRounded] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = prefersReducedMotion();
    let W = 0;
    let H = 0;
    const boat = { x: 0, y: 0, h: -0.5, v: 0 };
    let placed = false;
    let auto = !reduced;
    let next = 0;
    let target: [number, number] | null = null;
    let keyMode = false;
    let lastInput = 0;
    let lastRounded = '';
    let wake: [number, number][] = [];
    let running = false;
    let visible = false;
    let last = 0;
    let raf = 0;

    const markPos = (i: number): [number, number] => [marks[i].x * W, marks[i].y * H];

    const draw = () => {
      const { ctx } = sizeCanvas(canvas);
      const fg = cssToken('--foreground');
      const accent = cssToken('--accent');
      const border = cssToken('--border');
      const card = cssToken('--card');
      const muted = cssToken('--muted');

      ctx.fillStyle = card;
      ctx.fillRect(0, 0, W, H);

      // Chart grid.
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      for (let x = 0.5; x < W; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0.5; y < H; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // The course, mark to mark.
      ctx.setLineDash([5, 6]);
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      marks.forEach((_, i) => {
        const [x, y] = markPos(i);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Wake, fading toward the stern.
      ctx.strokeStyle = fg;
      ctx.lineWidth = 1.2;
      for (let i = 1; i < wake.length; i++) {
        ctx.globalAlpha = (i / wake.length) * 0.55;
        ctx.beginPath();
        ctx.moveTo(wake[i - 1][0], wake[i - 1][1]);
        ctx.lineTo(wake[i][0], wake[i][1]);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Marks.
      marks.forEach((m, i) => {
        const [x, y] = markPos(i);
        if (m.club.id === lastRounded) {
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.strokeStyle = accent;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.strokeStyle = fg;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Wind: from 220°, so the arrow points toward 040°.
      ctx.fillStyle = muted;
      ctx.font = monoFont(500, 10);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('WIND 220° · 12 KN', W - 12, 20);
      ctx.save();
      ctx.translate(W - 26, 40);
      ctx.rotate(((40 - 90) * Math.PI) / 180);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.moveTo(12, 0);
      ctx.lineTo(6, -4);
      ctx.moveTo(12, 0);
      ctx.lineTo(6, 4);
      ctx.stroke();
      ctx.restore();

      // The boat: a hull with a yellow sail.
      ctx.save();
      ctx.translate(boat.x, boat.y);
      ctx.rotate(boat.h);
      ctx.beginPath();
      ctx.moveTo(13, 0);
      ctx.quadraticCurveTo(2, -6, -10, -4.5);
      ctx.lineTo(-10, 4.5);
      ctx.quadraticCurveTo(2, 6, 13, 0);
      ctx.closePath();
      ctx.fillStyle = fg;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(-8, -1);
      ctx.lineTo(-6, -11);
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.strokeStyle = fg;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    };

    const step = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      // Hand the helm back to the autopilot after a few quiet seconds.
      if (!auto && !reduced && performance.now() - lastInput > 6000) {
        auto = true;
        keyMode = false;
        setStatus({ kind: 'auto' });
      }

      let tx: number | undefined;
      let ty: number | undefined;
      if (keyMode) {
        tx = boat.x + Math.cos(boat.h) * 80;
        ty = boat.y + Math.sin(boat.h) * 80;
      } else if (auto) {
        [tx, ty] = markPos(next);
      } else if (target) {
        [tx, ty] = target;
      }

      if (tx !== undefined && ty !== undefined) {
        const want = Math.atan2(ty - boat.y, tx - boat.x);
        let d = want - boat.h;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        const rate = 2.4 * dt;
        boat.h += Math.max(-rate, Math.min(rate, d));
        const dist = Math.hypot(tx - boat.x, ty - boat.y);
        const goal = keyMode ? 70 : Math.min(78, dist * 1.4);
        boat.v += (goal - boat.v) * Math.min(1, dt * 2.5);
      } else {
        boat.v *= 0.96;
      }

      boat.x = Math.max(12, Math.min(W - 12, boat.x + Math.cos(boat.h) * boat.v * dt));
      boat.y = Math.max(12, Math.min(H - 12, boat.y + Math.sin(boat.h) * boat.v * dt));
      if (boat.v > 4) {
        wake.push([boat.x, boat.y]);
        if (wake.length > 110) wake.shift();
      }

      marks.forEach((m, i) => {
        const [x, y] = markPos(i);
        if (Math.hypot(x - boat.x, y - boat.y) < ROUND_RADIUS) {
          if (lastRounded !== m.club.id) {
            lastRounded = m.club.id;
            setRounded(m.club.id);
            setStatus({ kind: 'rounded', club: m.club });
          }
          if (auto && i === next) next = (next + 1) % marks.length;
        }
      });

      draw();

      // Under reduced motion, stop once the boat has coasted to a halt.
      if (reduced && !auto && boat.v < 0.5 && performance.now() - lastInput > 1500) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      if (reduced && !(performance.now() - lastInput < 1500)) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      const prevW = W;
      const prevH = H;
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      if (!placed) {
        // Start on the first mark, so at rest the boat sits on the course.
        [boat.x, boat.y] = [marks[0].x * W - 30, marks[0].y * H + 30];
        placed = true;
      } else if (prevW && prevH) {
        boat.x *= W / prevW;
        boat.y *= H / prevH;
        wake = [];
      }
      draw();
    };

    const takeHelm = () => {
      lastInput = performance.now();
      if (auto) {
        auto = false;
        setStatus({ kind: 'helm' });
      }
      start();
    };

    const pointAt = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target = [e.clientX - r.left, e.clientY - r.top];
      keyMode = false;
      takeHelm();
    };
    const onMove = (e: PointerEvent) => {
      // On touch, only taps steer; vertical swipes stay free to scroll the page.
      if (e.pointerType === 'mouse') pointAt(e);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      keyMode = e.key !== 'ArrowDown';
      if (e.key === 'ArrowLeft') boat.h -= 0.2;
      if (e.key === 'ArrowRight') boat.h += 0.2;
      if (e.key === 'ArrowDown') target = [boat.x, boat.y];
      takeHelm();
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', pointAt);
    canvas.addEventListener('keydown', onKey);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.15 },
    );
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const stopTheme = onThemeChange(draw);
    resize();

    return () => {
      stop();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', pointAt);
      canvas.removeEventListener('keydown', onKey);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      stopTheme();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="relative">
        <canvas
          ref={canvasRef}
          id="sail-chart"
          tabIndex={0}
          role="img"
          aria-label={`A boat sailing a course with one mark per club, oldest first: ${course
            .map((c) => c.name)
            .join(', ')}. Steer with the pointer, a tap, or the arrow keys.`}
          className="block h-[clamp(320px,46vw,420px)] w-full cursor-crosshair"
          style={{ touchAction: 'pan-y' }}
        />

        {/* Mark labels sit over the canvas so each can fly its real burgee. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {marks.map((m) => {
            // Full names need room: from md up the end marks align inward so their
            // labels stay on the chart. Narrower than md only the year shows, centred.
            const align = m.x < 0.2 ? '0%' : m.x > 0.8 ? '-100%' : '-50%';
            const above = m.y < 0.5;
            const isRounded = rounded === m.club.id;
            return (
              <div
                key={m.club.id}
                // The burgee sits nearest its buoy whether the label is above or below it.
                className={`absolute flex -translate-x-1/2 translate-y-[var(--ty)] items-center gap-1 md:translate-x-[var(--tx)] ${
                  above ? 'flex-col-reverse' : 'flex-col'
                }`}
                style={
                  {
                    left: `${m.x * 100}%`,
                    top: `${m.y * 100}%`,
                    '--tx': align,
                    '--ty': above ? 'calc(-100% - 12px)' : '12px',
                  } as React.CSSProperties
                }
              >
                <Burgee name={m.club.flag} />
                <span
                  className={`whitespace-nowrap rounded-sm px-1 text-[0.65rem] uppercase tracking-[0.1em] sm:text-[0.7rem] ${
                    isRounded ? 'bg-accent text-accent-ink' : 'bg-card text-foreground'
                  }`}
                >
                  <span className="hidden md:inline">{SHORT[m.club.id] ?? m.club.name} · </span>
                  <span className={isRounded ? '' : 'text-muted'}>{m.year}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="min-h-[2.75rem] border-t border-border bg-background px-4 py-3 text-sm text-muted" aria-live="polite">
        {status.kind === 'auto' && 'Autopilot is sailing the course, oldest club first. Move your pointer over the water, or tap it, to take the helm.'}
        {status.kind === 'helm' && 'You have the helm. Steer toward a mark to round it. Arrow keys work too once the chart is focused.'}
        {status.kind === 'rounded' && (
          <>
            Rounding <span className="font-medium text-foreground">{status.club.name}</span> · {status.club.period}.{' '}
            <a
              href={`#club-${status.club.id}`}
              className="pointer-events-auto text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              See the club ↓
            </a>
          </>
        )}
      </p>
    </div>
  );
}
