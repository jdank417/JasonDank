'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Burgee from './Burgee';
import { prefersReducedMotion } from '@/lib/canvas';
import {
  charlesRiver,
  delivery,
  mapViews,
  places,
  tracks,
  type MapView,
  type MapViewId,
  type Place,
} from '@/data/voyages';

/** Mercator northing in degree units, matching scripts/build-charts.py. */
const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;

/** lat/lon → viewBox units (the view is 1000 wide). */
function projector(view: MapView) {
  const [west, , east, north] = view.bbox;
  const scale = 1000 / (east - west);
  const top = merc(north);
  return (lat: number, lon: number): [number, number] => [(lon - west) * scale, (top - merc(lat)) * scale];
}

const at = (view: MapView, [x, y]: [number, number]): CSSProperties => ({
  left: `${x / 10}%`,
  top: `${(y / view.height) * 100}%`,
});

interface Marker {
  id: string;
  name: string;
  detail: string;
  xy: [number, number];
  kind: Place['kind'];
  flags: Place['flags'];
}

export default function SailedMap() {
  const [viewId, setViewId] = useState<MapViewId>('east-coast');
  const [coasts, setCoasts] = useState<Partial<Record<MapViewId, string>>>({});
  const [active, setActive] = useState<string | null>(null);
  // The pin the boat is tied up at, lit like a hovered one.
  const [docked, setDocked] = useState<string | null>(null);

  const view = mapViews.find((v) => v.id === viewId)!;
  const project = useMemo(() => projector(view), [view]);

  // Coastlines are static files, fetched the first time each view is shown.
  useEffect(() => {
    if (coasts[viewId]) return;
    let live = true;
    fetch(`/charts/map-${viewId}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { d: string }) => {
        if (live) setCoasts((c) => ({ ...c, [viewId]: data.d }));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [viewId, coasts]);

  const isCoast = viewId === 'east-coast';

  const pins: Marker[] = places
    .filter((p) => p.views.includes(viewId))
    .map((p) => ({ id: p.id, name: p.name, detail: p.detail, xy: project(p.lat, p.lon), kind: p.kind, flags: p.flags }));

  const stops: Marker[] = isCoast
    ? delivery.flatMap((pt, i) =>
        pt.name
          ? [{ id: `stop-${i}`, name: `${pt.name}, ${pt.state}`, detail: '2023 delivery', xy: project(pt.lat, pt.lon), kind: 'stop' as const, flags: undefined }]
          : [],
      )
    : [];

  // Stable per view, so the boat's animation isn't restarted by re-renders.
  const track = useMemo(() => tracks[viewId].map((pt) => project(pt.lat, pt.lon)), [viewId, project]);
  const docks = useMemo(() => tracks[viewId].map((pt) => pt.at), [viewId]);
  const river = viewId === 'boston' ? charlesRiver.map(([lat, lon]) => project(lat, lon)) : [];

  const activeMarker = [...pins, ...stops].find((m) => m.id === active);
  const points = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const select = (id: MapViewId) => {
    setViewId(id);
    setActive(null);
    setDocked(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      {/* View picker: chips on phones, a list beside the map from lg up. */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {mapViews.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => select(v.id)}
            aria-pressed={v.id === viewId}
            className={`press shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs uppercase tracking-[0.1em] transition-colors lg:rounded-md lg:py-3 lg:text-left lg:text-sm lg:normal-case lg:tracking-normal ${
              v.id === viewId
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted hover:border-foreground hover:text-foreground'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* The map. Height is capped so the tall East Coast view still fits a screen. */}
      <figure
        className={`m-0 lg:col-start-5 lg:row-span-2 lg:row-start-1 ${isCoast ? 'lg:col-span-4' : 'lg:col-span-8'}`}
      >
        <div
          className="sailed-map relative mx-auto w-full overflow-hidden rounded-md border border-border bg-card"
          style={{ aspectRatio: `1000 / ${view.height}`, maxWidth: `calc(72vh * ${(1000 / view.height).toFixed(4)})` }}
          onMouseLeave={() => setActive(null)}
        >
          <svg
            key={viewId}
            viewBox={`0 0 1000 ${view.height}`}
            className="map-fade absolute inset-0 h-full w-full"
            aria-hidden
          >
            {coasts[viewId] && (
              <path d={coasts[viewId]} fillRule="evenodd" className="map-land" vectorEffect="non-scaling-stroke" />
            )}
            {river.length > 0 && (
              <>
                <polyline points={points(river)} className="map-river-bank" vectorEffect="non-scaling-stroke" />
                <polyline points={points(river)} className="map-river" vectorEffect="non-scaling-stroke" />
              </>
            )}
            <polyline points={points(track)} className="map-route" vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Overlay: labels and markers in CSS pixels, so they stay crisp at any size. */}
          <div key={`${viewId}-pins`} className="map-fade absolute inset-0" aria-hidden>
            {view.waters.map((w) => (
              <span
                key={w.name}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6rem] uppercase italic tracking-[0.18em] text-muted/80 sm:text-[0.65rem] ${w.wide ? 'hidden sm:block' : ''}`}
                style={at(view, project(w.lat, w.lon))}
              >
                {w.name}
              </span>
            ))}

            {stops.map((m) => (
              <button
                key={m.id}
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setActive(m.id)}
                onClick={() => setActive((a) => (a === m.id ? null : m.id))}
                className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5"
                style={at(view, m.xy)}
              >
                <span
                  className={`block rounded-full border border-foreground transition-transform ${
                    active === m.id || docked === m.id ? 'h-3 w-3 bg-accent' : 'h-2 w-2 bg-card'
                  }`}
                />
              </button>
            ))}

            {pins.map((m) => (
              <Pin
                key={m.id}
                marker={m}
                style={at(view, m.xy)}
                compact={isCoast}
                active={active === m.id || docked === m.id}
                onActive={setActive}
              />
            ))}

            <Boat key={viewId} view={view} points={track} docks={docks} onDock={setDocked} travel={TRAVEL_SECONDS[viewId]} />

            {activeMarker && <Callout marker={activeMarker} view={view} />}
          </div>
        </div>
        <figcaption className="mt-2 text-[0.65rem] uppercase tracking-[0.12em] text-muted">
          {isCoast ? 'Route drawn between logged stops, approximate · ' : ''}Shoreline: GSHHS
        </figcaption>
      </figure>

      {/* What's on this map. This list is the keyboard and screen-reader way in. */}
      <div className="lg:col-span-4">
        <p className="text-sm leading-relaxed text-muted">{view.blurb}</p>

        {pins.length > 0 && (
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {pins.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(m.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(m.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(m.id)}
                  className={`flex w-full items-start gap-3 py-2.5 text-left transition-colors ${
                    active === m.id ? 'text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <MarkerIcon marker={m} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">{m.name}</span>
                    <span className="block text-xs">{m.detail}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {stops.length > 0 && (
        <div className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            2023 delivery · {stops.length} logged stops, south to north
          </p>
          <ol className="mt-2 grid grid-cols-2 gap-x-4 text-xs lg:grid-cols-1">
            {stops.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(m.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(m.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(m.id)}
                  className={`flex w-full gap-2 py-1 text-left transition-colors ${
                    active === m.id ? 'text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <span className="tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">{m.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// Seconds under way for one pass of each track, not counting stops.
const TRAVEL_SECONDS: Record<MapViewId, number> = { 'east-coast': 22, boston: 16, cape: 7, 'long-island': 18 };
const DOCK_SECONDS = 1.1;
const END_SECONDS = 1.6;

/**
 * A small boat that sails the view's track on a loop, tying up for a moment
 * at each pin. It only runs while the map is on screen, and stays parked at
 * the first pin under reduced motion.
 */
function Boat({
  view,
  points,
  docks,
  onDock,
  travel,
}: {
  view: MapView;
  points: [number, number][];
  docks: (string | undefined)[];
  onDock: (id: string | null) => void;
  travel: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || points.length < 2) return;

    const lengths = points.slice(1).map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]));
    const speed = lengths.reduce((a, b) => a + b, 0) / travel; // viewBox units a second
    const pause = view.id === 'east-coast' ? 0.45 : DOCK_SECONDS;
    const course = (i: number) => {
      const [x0, y0] = points[i];
      const [x1, y1] = points[i + 1];
      return (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 90; // the icon's bow points up
    };

    let leg = 0; // index of the leg under way
    let along = 0; // distance into that leg
    let wait = 0; // seconds left tied up
    let heading = course(0);
    const put = () => {
      const [x0, y0] = points[leg];
      const [x1, y1] = points[leg + 1];
      const f = lengths[leg] ? along / lengths[leg] : 0;
      el.style.left = `${(x0 + (x1 - x0) * f) / 10}%`;
      el.style.top = `${((y0 + (y1 - y0) * f) / view.height) * 100}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${heading}deg)`;
    };

    onDock(docks[0] ?? null);
    put();
    if (prefersReducedMotion()) return () => onDock(null);

    wait = pause;
    let raf = 0;
    let last = 0;
    let fading = false;
    const tick = (ts: number) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      if (wait > 0) {
        wait -= dt;
        if (wait <= 0) {
          if (fading) {
            // Back to the start of the course.
            fading = false;
            leg = 0;
            along = 0;
            heading = course(0);
            el.style.opacity = '1';
            onDock(docks[0] ?? null);
            wait = pause;
          } else {
            onDock(null);
          }
        }
      } else {
        along += speed * dt;
        while (along >= lengths[leg]) {
          along -= lengths[leg];
          leg += 1;
          if (leg >= lengths.length) {
            // Made the last pin: rest there, then fade out and start over.
            leg = lengths.length - 1;
            along = lengths[leg];
            onDock(docks[docks.length - 1] ?? null);
            wait = END_SECONDS;
            fading = true;
            el.style.opacity = '0';
            break;
          }
          if (docks[leg]) {
            along = 0;
            onDock(docks[leg]!);
            wait = pause;
            break;
          }
        }
        // Ease the bow round onto the new leg instead of snapping.
        const want = course(leg);
        const turn = ((((want - heading) % 360) + 540) % 360) - 180;
        heading += turn * Math.min(1, dt * 8);
      }
      put();
      raf = requestAnimationFrame(tick);
    };

    // Only sail while the map is on screen.
    const seen = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    seen.observe(el.parentElement ?? el);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(raf);
      onDock(null);
    };
  }, [view, points, docks, onDock, travel]);

  return (
    <div ref={ref} className="pointer-events-none absolute z-[5] transition-opacity duration-500" aria-hidden>
      <svg viewBox="-8 -12 16 24" className="h-6 w-4 drop-shadow-sm">
        <path d="M0 -11 C5 -5 5 4 3.5 10 L-3.5 10 C-5 4 -5 -5 0 -11 Z" fill="var(--card)" stroke="var(--foreground)" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M0 -4 Q 4.5 1.5 0.5 8" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
        <circle cy="-4" r="1.3" fill="var(--foreground)" />
      </svg>
    </div>
  );
}

/** Clubs fly their burgees on a staff; race venues are marks. */
function Pin({
  marker,
  style,
  compact,
  active,
  onActive,
}: {
  marker: Marker;
  style: CSSProperties;
  compact: boolean;
  active: boolean;
  onActive: (id: string | null) => void;
}) {
  const flags = marker.kind === 'club' && !compact ? marker.flags ?? [] : [];
  return (
    <div className="absolute" style={style}>
      {flags.length > 0 && (
        <span className="pointer-events-none absolute bottom-0 left-0">
          <span className="absolute bottom-0 left-0 w-px bg-foreground" style={{ height: `${10 + flags.length * 15}px` }} />
          <span className="absolute left-px flex flex-col gap-px" style={{ bottom: '10px' }}>
            {flags.map((f) => (
              <Burgee key={f} name={f} className="h-[14px] w-[21px] shadow-sm" />
            ))}
          </span>
        </span>
      )}
      <button
        type="button"
        tabIndex={-1}
        onMouseEnter={() => onActive(marker.id)}
        onClick={() => onActive(active ? null : marker.id)}
        className="absolute -translate-x-1/2 -translate-y-1/2 p-1.5"
      >
        <MarkerDot kind={marker.kind} active={active} />
      </button>
    </div>
  );
}

function MarkerDot({ kind, active }: { kind: Place['kind']; active: boolean }) {
  if (kind === 'race') {
    // A racing mark: a small diamond.
    return (
      <span
        className={`block rotate-45 border border-foreground bg-accent transition-transform ${active ? 'h-3 w-3' : 'h-2.5 w-2.5'}`}
      />
    );
  }
  return (
    <span
      className={`block rounded-full border-2 border-foreground transition-transform ${
        active ? 'h-3.5 w-3.5 bg-accent' : 'h-2.5 w-2.5 bg-card'
      }`}
    />
  );
}

function MarkerIcon({ marker }: { marker: Marker }) {
  if (marker.flags?.length && marker.kind === 'club') {
    return (
      <span className="mt-0.5 flex shrink-0 gap-1">
        {marker.flags.map((f) => (
          <Burgee key={f} name={f} className="h-[14px] w-[21px]" />
        ))}
      </span>
    );
  }
  return (
    <span className="mt-1 flex h-[14px] w-[21px] shrink-0 items-center justify-center">
      <MarkerDot kind={marker.kind} active={false} />
    </span>
  );
}

/** The name card beside whichever marker is active. Flips to stay inside the map. */
function Callout({ marker, view }: { marker: Marker; view: MapView }) {
  const [x, y] = marker.xy;
  const right = x > 600;
  const below = y / view.height < 0.18;
  return (
    <div
      className="pointer-events-none absolute z-10 w-max max-w-[min(15rem,70%)]"
      style={{
        ...at(view, marker.xy),
        transform: `translate(${right ? 'calc(-100% - 14px)' : '14px'}, ${below ? '10px' : 'calc(-100% - 10px)'})`,
      }}
    >
      <div className="rounded-md border border-foreground bg-background px-3 py-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]">
        <p className="text-xs font-bold leading-snug">{marker.name}</p>
        <p className="mt-0.5 text-[0.7rem] leading-snug text-muted">{marker.detail}</p>
        {marker.flags && marker.flags.length > 0 && (
          <span className="mt-1.5 flex gap-1">
            {marker.flags.map((f) => (
              <Burgee key={f} name={f} className="h-3 w-[18px]" />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
