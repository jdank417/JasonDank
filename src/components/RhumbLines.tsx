'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { cssToken, monoFont, onThemeChange, prefersReducedMotion, sizeCanvas, withAlpha } from '@/lib/canvas';
import { charlesRiver } from '@/data/voyages';

/**
 * A portolan-chart backdrop: compass roses throwing out 32 straight rhumb
 * lines, one per point of the compass. The main rose sits in the top-right
 * with a coordinate label; a fainter one anchors the bottom-left.
 *
 * With `chart`, the shoreline from that file (see scripts/build-charts.py) is
 * drawn under the lines, placed so its origin sits at the centre of the rose.
 *
 * Over the rose floats a compass needle. On desktop it swings toward the
 * pointer; on phones it can point at real north using the phone's compass
 * (iPhones ask permission, so there the rose is a button to turn it on).
 *
 * Renders absolutely positioned layers — place it inside a `relative` box.
 */
export default function RhumbLines({
  label,
  deskRoseY,
  chart,
}: {
  label?: string;
  deskRoseY?: number;
  /** URL of a chart file whose path is in km from its origin. */
  chart?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startCompass = useRef<() => void>(() => {});
  const iosCompass = useSyncExternalStore(noop, needsCompassPermission, () => false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const needle = needleRef.current;
    const card = cardRef.current;
    if (!canvas || !host || !needle || !card) return;

    let frame = 0;
    let shore: { path: Path2D; origin: [number, number] } | null = null;
    // Where the rose landed on the last draw, for the needle and the pointer.
    const rose = { x: 0, y: 0, R: 0 };

    const drawRose = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      R: number,
      fg: string,
      accent: string,
      cardColor: string,
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
        ctx.fillStyle = cardColor;
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
      const cardColor = cssToken('--card');
      const muted = cssToken('--muted');
      const border = cssToken('--border');
      const background = cssToken('--background');

      // Phones: tuck the rose into the top-right corner, above the hero copy.
      const narrow = w < 640;
      const R = narrow ? 22 : Math.min(44, Math.max(28, w * 0.03));
      // From lg up a page can pin the rose's east-west line to a fixed height
      // (`deskRoseY`), so content can be placed against it.
      const roseX = narrow ? w - 44 : w * 0.82;
      const roseY = narrow
        ? 46
        : w >= 1024 && deskRoseY !== undefined
          ? deskRoseY
          : Math.min(150, Math.max(70, h * 0.15));
      Object.assign(rose, { x: roseX, y: roseY, R });
      const roses: [number, number, number][] = [
        [roseX, roseY, 1],
        [w * 0.04, h * 0.98, 0.55],
      ];

      // Lines fade out with distance from their rose, the way they thin out
      // across an old chart. On phones the fade is short, so the lines end
      // before they reach the body copy.
      const reach = Math.hypot(w, h) * 1.3;
      const fade = narrow ? 260 : Math.max(w, h) * 0.85;
      const fading = (cx: number, cy: number, color: string, alpha: number, radius = fade) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0, withAlpha(color, alpha));
        g.addColorStop(0.55, withAlpha(color, alpha * 0.6));
        g.addColorStop(1, withAlpha(color, 0));
        return g;
      };

      if (shore) {
        // px per km. The shoreline is strongest round the rose and fades out
        // well before the hero copy on the left.
        const k = narrow ? 18 : Math.min(36, Math.max(24, w / 42));
        const toPx = (lat: number, lon: number): [number, number] => {
          const [olon, olat] = shore!.origin;
          const kx = 111.32 * Math.cos((olat * Math.PI) / 180);
          return [roseX + (lon - olon) * kx * k, roseY + (merc(olat) - merc(lat)) * kx * k];
        };
        const land = new Path2D();
        land.addPath(shore.path, new DOMMatrix([k, 0, 0, k, roseX, roseY]));
        const chartFade = narrow ? 300 : Math.max(w, h) * 0.5;
        ctx.fillStyle = fading(roseX, roseY, border, 0.6, chartFade);
        ctx.fill(land, 'evenodd');
        ctx.strokeStyle = fading(roseX, roseY, muted, 0.45, chartFade);
        ctx.lineWidth = 0.75;
        ctx.stroke(land);

        // The Charles is too narrow for the shoreline data; draw it as a line.
        ctx.beginPath();
        charlesRiver.forEach(([lat, lon], i) => {
          const [x, y] = toPx(lat, lon);
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        });
        ctx.lineJoin = 'round';
        ctx.strokeStyle = fading(roseX, roseY, muted, 0.45, chartFade);
        ctx.lineWidth = 0.32 * k + 1.5;
        ctx.stroke();
        ctx.strokeStyle = background;
        ctx.lineWidth = 0.32 * k;
        ctx.stroke();

        // Water names, set like the italic labels on a printed chart.
        ctx.font = `italic ${monoFont(400, 10)}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '2px';
        // Phones have no room for them beside the rose.
        for (const [name, lat, lon] of narrow ? [] : HARBOR_WATERS) {
          const [x, y] = toPx(lat, lon);
          const d = Math.hypot(x - roseX, y - roseY);
          const alpha = 0.75 * Math.max(0, 1 - d / chartFade);
          if (alpha < 0.08) continue;
          ctx.fillStyle = withAlpha(muted, alpha);
          ctx.fillText(name, x, y);
        }
        if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';
      }

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

      drawRose(ctx, roseX, roseY, R, fg, accent, cardColor);

      if (label) {
        ctx.font = monoFont(500, 10);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lx = Math.min(roseX, w - 60);
        const ly = roseY + R + 22;
        const tw = ctx.measureText(label).width;
        // A chip of page background so the lines don't strike through the text.
        ctx.fillStyle = background;
        ctx.fillRect(lx - tw / 2 - 5, ly - 8, tw + 10, 16);
        ctx.fillStyle = muted;
        ctx.fillText(label, lx, ly);
      }

      // The needle and the iPhone compass button sit on the rose.
      const size = R * 2;
      for (const el of [needle, card]) {
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.left = `${roseX - R}px`;
        el.style.top = `${roseY - R}px`;
      }
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    // --- Needle: a damped spring toward a target bearing (degrees from north).
    let bearing = 0;
    let velocity = 0;
    let target = 0;
    let spin = 0;
    const blade = needle.firstElementChild as HTMLElement;
    const step = () => {
      // Shortest way round, so 350° → 10° turns 20°, not 340°.
      const diff = ((((target - bearing) % 360) + 540) % 360) - 180;
      velocity = (velocity + diff * 0.045) * 0.82;
      bearing += velocity;
      blade.style.transform = `rotate(${bearing}deg)`;
      spin = Math.abs(diff) > 0.05 || Math.abs(velocity) > 0.05 ? requestAnimationFrame(step) : 0;
    };
    const aim = (deg: number) => {
      target = deg;
      if (!spin) spin = requestAnimationFrame(step);
    };

    const reduced = prefersReducedMotion();
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = host.getBoundingClientRect();
      const dx = e.clientX - r.left - rose.x;
      const dy = e.clientY - r.top - rose.y;
      aim((Math.atan2(dx, -dy) * 180) / Math.PI);
    };
    const onLeave = () => aim(0);

    // Phones: hold the needle on real north, against the phone's heading.
    let compassOn = false;
    const onOrient = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      let heading: number | null = null;
      if (typeof e.webkitCompassHeading === 'number') heading = e.webkitCompassHeading;
      else if (e.absolute && e.alpha !== null) heading = 360 - e.alpha;
      if (heading === null) return;
      heading += screen.orientation?.angle ?? 0;
      aim(-heading);
    };
    const listenCompass = (event: 'deviceorientation' | 'deviceorientationabsolute') => {
      if (compassOn) return;
      compassOn = true;
      window.addEventListener(event, onOrient as EventListener);
    };
    startCompass.current = () => {
      const Orientation = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      Orientation.requestPermission?.().then((state) => {
        if (state === 'granted') listenCompass('deviceorientation');
      }, () => {});
    };

    if (!reduced) {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      // Android reports an absolute heading without asking.
      if ('ondeviceorientationabsolute' in window && matchMedia('(pointer: coarse)').matches) {
        listenCompass('deviceorientationabsolute');
      }
    }

    if (chart) {
      loadChart(chart).then((data) => {
        if (!data) return;
        shore = data;
        queue();
      });
    }

    const resize = new ResizeObserver(queue);
    resize.observe(host);
    const stopTheme = onThemeChange(queue);
    document.fonts?.ready.then(queue);
    draw();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (spin) cancelAnimationFrame(spin);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('deviceorientation', onOrient as EventListener);
      window.removeEventListener('deviceorientationabsolute', onOrient as EventListener);
      startCompass.current = () => {};
      resize.disconnect();
      stopTheme();
    };
  }, [label, deskRoseY, chart]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent)' }}
      />
      <div ref={needleRef} aria-hidden className="pointer-events-none absolute">
        <svg viewBox="-50 -50 100 100" className="h-full w-full overflow-visible">
          {/* North half in the accent, south half hollow, on a pivot. */}
          <path d="M0 -46 L7 0 L-7 0 Z" fill="var(--accent)" stroke="var(--foreground)" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M0 46 L7 0 L-7 0 Z" fill="var(--card)" stroke="var(--foreground)" strokeWidth="1.6" strokeLinejoin="round" />
          <circle r="5" fill="var(--card)" stroke="var(--foreground)" strokeWidth="1.6" />
        </svg>
      </div>
      {/* iPhones only hand out the compass after a tap, so there the rose is a button. */}
      <div ref={cardRef} className={`absolute z-[1] ${iosCompass ? '' : 'pointer-events-none'}`}>
        {iosCompass && (
          <button
            type="button"
            onClick={() => startCompass.current()}
            aria-label="Point the needle at north using your phone's compass"
            className="h-full w-full rounded-full"
          />
        )}
      </div>
    </>
  );
}

// Only waters that land right of the hero copy at desktop widths.
const HARBOR_WATERS: [string, number, number][] = [
  ['BOSTON HARBOR', 42.338, -70.985],
  ['QUINCY BAY', 42.276, -70.975],
];

const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;

const charts = new Map<string, Promise<{ path: Path2D; origin: [number, number] } | null>>();
function loadChart(url: string) {
  if (!charts.has(url)) {
    charts.set(
      url,
      fetch(url)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { d: string; origin: [number, number] } | null) =>
          data ? { path: new Path2D(data.d), origin: data.origin } : null,
        )
        .catch(() => null),
    );
  }
  return charts.get(url)!;
}

const noop = () => () => {};
function needsCompassPermission() {
  return (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function' &&
    matchMedia('(pointer: coarse)').matches
  );
}
