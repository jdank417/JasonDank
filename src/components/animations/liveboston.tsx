import { fade, keyframes, play, SYSTEM_FONT, type Scene, type Stop } from './kit';
import { PARKS, PX_PER_M, STATIONS, STOPS, STREETS, TRACK, WATER, type Line, type Pt } from './liveboston-map';

// ---------------------------------------------------------------------------
// Live Boston: downtown between North Station and South Station, drawn from
// the MBTA's own track shapes and station positions over the real shoreline
// and streets. Trains run on their true track, on the right-hand rail, at
// their true length, easing into every station and pausing there. Beside the
// map, the sidebar counts down to leaving for the commute, lists what's
// disrupting service, then rides along with the Red Line over the Longfellow
// Bridge, into the view from the cab.
// ---------------------------------------------------------------------------

const RED = '#da291c';
const ORANGE = '#ed8b00';
const GREEN = '#00843d';
const BLUE = '#003da5';
const PURPLE = '#80276c';
const TEAL = '#008eaa';
const AMBER = '#f59e0b';
const WATER_BLUE = '#3b82f6';

const T = 36;
/** Where a paused card rests: mid-way through the alerts, with trains all over the map. */
const STILL = 0.45;

/** Map units a train covers per percent of the loop at cruise, and its dwell at a stop. */
const SPEED = 11;
const DWELL = 2;
/** What starting and stopping add to each run between stations. */
const EASE = 1;

/** True train lengths: cars × car length, in meters. */
const CONSISTS: Record<Line, { cars: number; car: number; color: string }> = {
  red: { cars: 6, car: 21.3, color: RED },
  orange: { cars: 6, car: 19.8, color: ORANGE },
  green: { cars: 2, car: 22.7, color: GREEN },
  blue: { cars: 6, car: 14.8, color: BLUE },
  north: { cars: 8, car: 25.9, color: PURPLE },
  south: { cars: 8, car: 25.9, color: PURPLE },
  ferry: { cars: 1, car: 46, color: TEAL },
};

function measure(points: Pt[]) {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  return cum;
}

const CUM = Object.fromEntries(Object.entries(TRACK).map(([k, p]) => [k, measure(p)])) as Record<Line, number[]>;
const length = (line: Line) => CUM[line][CUM[line].length - 1];

/** How far along its track a line is still on the map, or just off its edge. */
function reach(line: Line) {
  const inView = (d: number) => {
    const { x, y } = along(line, d);
    return x > 14 && x < 626 && y > -6 && y < 446;
  };
  let d = length(line);
  while (d > 0 && !inView(d)) d -= 2;
  return Math.min(length(line), d + 2);
}

/** A point `d` along a line's track, its heading there, and the normal to its right. */
function along(line: Line, d: number) {
  const points = TRACK[line];
  const cum = CUM[line];
  let i = 1;
  while (i < points.length - 1 && cum[i] < d) i++;
  const [ax, ay] = points[i - 1];
  const [bx, by] = points[i];
  const k = Math.max(0, Math.min(1, (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)));
  const a = Math.atan2(by - ay, bx - ax);
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, a, nx: -Math.sin(a), ny: Math.cos(a) };
}

/**
 * One train's run across the map.
 *
 * `at` is when, in percent of the loop, it sets off from the start of its
 * track (or the end, when `reverse`): just off the map, or at the terminal it
 * leaves from. A train with `turn` runs in to the end of the line, waits that
 * long, and goes back out the way it came, the way commuter rail and the Blue
 * Line at Bowdoin do. `lane` moves it sideways, in map units, onto another
 * track; by default it keeps to the right-hand rail.
 */
interface Train {
  line: Line;
  reverse?: boolean;
  at: number;
  turn?: number;
  lane?: number;
  skip?: string[];
  ride?: boolean;
  /**
   * Loops a run takes. A run too long for one loop takes two, paired with a
   * second train a loop behind it, so between them the line looks the same
   * every time round.
   */
  loops?: number;
}

interface Knot {
  t: number;
  d: number;
  /** Travel direction along the track: 1 with its shape, -1 against it. */
  dir: number;
  opacity: number;
}

/** The train's distance along its track over its run, as knots to step through. */
function schedule(train: Train): Knot[] {
  // A train that turns back only needs to come in from just off the map.
  const len = train.turn != null ? reach(train.line) : length(train.line);
  const stops = (STOPS[train.line] ?? []).filter(([id]) => !train.skip?.includes(id)).map(([, d]) => d);
  const knots: Knot[] = [];
  let t = 0;

  const run = (from: number, to: number, dir: number, stopsOn: number[]) => {
    const legs = [from, ...stopsOn, to];
    for (let i = 1; i < legs.length; i++) {
      const a = legs[i - 1];
      const b = legs[i];
      const dt = EASE + Math.abs(b - a) / SPEED;
      // Starting and stopping: speed rises and falls over each run between
      // stations (a cycloid: still at both ends, fastest midway), sampled
      // finely enough that the straight-line steps between keyframes don't show.
      const n = Math.max(4, Math.ceil(Math.abs(b - a) / 16));
      for (let s = i === 1 ? 0 : 1; s <= n; s++) {
        const u = s / n;
        const f = u - Math.sin(2 * Math.PI * u) / (2 * Math.PI);
        knots.push({ t: t + u * dt, d: a + (b - a) * f, dir, opacity: 1 });
      }
      t += dt;
      if (i < legs.length - 1) {
        t += DWELL;
        knots.push({ t, d: b, dir, opacity: 1 });
      }
    }
  };

  if (train.turn != null) {
    // In to the terminal at the start of the track, a wait, and back out.
    // A stop right at the end of the line is the terminal itself.
    const inbound = [...stops].filter((d) => d > 6).sort((x, y) => y - x);
    run(len, 0, -1, inbound);
    t += train.turn;
    knots.push({ t, d: 0, dir: -1, opacity: 1 });
    knots.push({ t: t + 0.01, d: 0, dir: 1, opacity: 1 });
    run(0, len, 1, [...inbound].reverse());
  } else if (train.reverse) {
    run(len, 0, -1, [...stops].sort((x, y) => y - x));
  } else {
    run(0, len, 1, [...stops].sort((x, y) => x - y));
  }
  return knots;
}

/**
 * Keyframes for a train's run. Off the map it's hidden, so when the loop
 * comes round it can jump back to where it starts without being seen.
 */
function trainKeyframes(name: string, train: Train) {
  const knots = schedule(train);
  const end = knots[knots.length - 1];
  const span = 100 * (train.loops ?? 1);
  if (end.t > span - 0.1) throw new Error(`${name}: a ${end.t.toFixed(1)}% run doesn't fit in ${span}%`);
  const lane = train.lane ?? 3.2;

  // Positions in order of the run, with the heading unwound so it never spins
  // the long way round.
  let last: number | null = null;
  const states = knots.map((k) => {
    const p = along(train.line, k.d);
    // Terminal trains keep to one track both ways; through trains keep right.
    const side = train.turn != null ? -lane : lane * k.dir;
    let deg = ((p.a * 180) / Math.PI) + (k.dir < 0 ? 180 : 0);
    if (last != null) while (deg - last > 180) deg -= 360;
    if (last != null) while (deg - last < -180) deg += 360;
    last = deg;
    return { t: k.t, x: p.x + p.nx * side, y: p.y + p.ny * side, deg, opacity: k.opacity };
  });
  type State = (typeof states)[number];
  const first = states[0];
  const hidden = (s: State, t: number): State => ({ ...s, t, opacity: 0 });
  const timeline: State[] = [hidden(first, 0), ...states.map((s) => ({ ...s, t: s.t + 0.02 })), hidden(states[states.length - 1], end.t + 0.04)];
  timeline.push(hidden(first, span));

  /** The state at a time into the run, between the two knots around it. */
  const at = (t: number): State => {
    let i = 1;
    while (i < timeline.length - 1 && timeline[i].t < t) i++;
    const a = timeline[i - 1];
    const b = timeline[i];
    const k = (t - a.t) / (b.t - a.t || 1);
    const mix = (u: number, v: number) => u + (v - u) * k;
    return { t, x: mix(a.x, b.x), y: mix(a.y, b.y), deg: mix(a.deg, b.deg), opacity: b.opacity === 0 || a.opacity === 0 ? 0 : 1 };
  };

  // Shift the run to start at `at`, wrapping round the end of the loop.
  const shift = ((train.at % span) + span) % span;
  const wrap = (span - shift) % span;
  const frames = timeline
    .slice(0, -1)
    .map((s) => ({ ...s, p: (((s.t + shift) % span) * 100) / span }))
    .sort((a, b) => a.p - b.p);
  const edge = at(wrap);
  frames.unshift({ ...edge, p: 0 });
  frames.push({ ...edge, p: 100 });

  const transform = (s: State) => `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px) rotate(${Math.round(s.deg)}deg)`;
  // Opacity only where it changes: keyframes without it carry it over.
  const stops: Stop[] = frames.map((f, i) => {
    const turns = i === 0 || i === frames.length - 1 || frames[i - 1].opacity !== f.opacity || frames[i + 1].opacity !== f.opacity;
    return [Number(f.p.toFixed(2)), `transform:${transform(f)}${turns ? `;opacity:${f.opacity}` : ''}`];
  });
  // The still frame, for reduced motion and a paused card.
  const still = at((STILL * span - shift + span) % span);
  const resting = {
    transform: transform(still),
    opacity: still.opacity,
  };
  return { css: keyframes(name, stops), resting };
}

/** When a train leaves a station, in percent of its run. */
function departure(train: Train, station: string) {
  const d = STOPS[train.line]?.find(([id]) => id === station)?.[1];
  if (d == null) throw new Error(`${train.line} doesn't stop at ${station}`);
  const knots = schedule(train);
  // The last knot still sitting at the station is the moment it pulls out.
  let t = 0;
  for (let i = 1; i < knots.length; i++) {
    if (Math.abs(knots[i].d - d) < 0.01 && Math.abs(knots[i - 1].d - d) < 0.01) t = knots[i].t;
  }
  return t;
}

const pts = (points: Pt[]) => points.map((p) => p.join(',')).join(' ');
const px = (meters: number) => meters * PX_PER_M;

export default function liveBoston(): Scene {
  // The train ridden along: a Red Line train to Alewife, timed to pull out of
  // Park Street just as the ride-along starts.
  const rider: Train = { line: 'red', reverse: true, at: 0, ride: true };
  rider.at = 66 - departure(rider, 'place-pktrm');

  const trains: Train[] = [
    rider,
    { line: 'red', reverse: true, at: 82 },
    { line: 'red', at: 8 },
    { line: 'red', at: 55 },
    // Two Orange Line trains to Oak Grove, a stop apart: bunched.
    { line: 'orange', at: 20 },
    { line: 'orange', at: 31 },
    { line: 'orange', reverse: true, at: 70 },
    // Science Park is closed, so the Green Line runs straight through it.
    { line: 'green', at: 4, skip: ['place-spmnl'] },
    { line: 'green', at: 52, skip: ['place-spmnl'] },
    { line: 'green', reverse: true, at: 26, skip: ['place-spmnl'] },
    { line: 'green', reverse: true, at: 76, skip: ['place-spmnl'] },
    { line: 'blue', at: 12, turn: 6, loops: 2 },
    { line: 'blue', at: 112, turn: 6, loops: 2 },
    { line: 'blue', at: 62, turn: 6, loops: 2 },
    { line: 'blue', at: 162, turn: 6, loops: 2 },
    { line: 'north', at: 6, turn: 24, lane: 4 },
    { line: 'north', at: 50, turn: 20, lane: -5 },
    { line: 'south', at: 30, turn: 22, lane: 4 },
    { line: 'south', at: 78, turn: 18, lane: -4 },
    { line: 'ferry', at: 18, turn: 30, lane: 0 },
  ];
  const runs = trains.map((t, i) => trainKeyframes(`lb-t${i}`, t));

  // The commute countdown, a minute at a time, then "leave now".
  const countdown = ['4', '3', '2', '1'];
  const css = [
    ...runs.map((r) => r.css),
    fade('lb-commute', [0, 1.5, 29, 31]),
    ...countdown.map((_, i) => fade(`lb-count${i}`, [i * 6, i * 6 + 0.5, i * 6 + 5.5, i * 6 + 6])),
    fade('lb-now', [24, 24.5, 29, 31]),
    fade('lb-alerts', [31, 33, 62, 64]),
    fade('lb-alert1', [33, 35, 62, 64]),
    fade('lb-alert2', [36, 38, 62, 64]),
    fade('lb-alert3', [39, 41, 62, 64]),
    fade('lb-closed', [33, 35, 62, 64]),
    fade('lb-ride', [64, 66, 98, 100]),
    fade('lb-ring', [64, 67, 97, 99]),
    // Park Street to Charles/MGH underground, out into the light at Charles
    // Circle, then over the river, past the bridge's towers at mid-span.
    fade('lb-next1', [64, 66, 81.5, 82.5]),
    fade('lb-next2', [81.5, 82.5, 98, 100]),
    fade('lb-tunnel', [64, 66, 77, 78.5]),
    fade('lb-day', [77, 78.5, 98, 100]),
    keyframes('lb-bridge', [[0, 'transform:scale(.5)'], [82, 'transform:scale(.5)'], [88, 'transform:scale(1)'], [92, 'transform:scale(2.8)'], [100, 'transform:scale(2.8)']]),
    keyframes('lb-rush', [[0, 'transform:scale(.12);opacity:0'], [20, 'opacity:.9'], [100, 'transform:scale(2.4);opacity:0']]),
    keyframes('lb-pulse', [[0, 'transform:scale(.7);opacity:.9'], [100, 'transform:scale(1.9);opacity:0']]),
    keyframes('lb-blink', [[0, 'opacity:1'], [50, 'opacity:.25'], [100, 'opacity:1']]),
    keyframes('lb-go', [[0, 'opacity:1'], [50, 'opacity:.55'], [100, 'opacity:1']]),
  ];

  const label = (text: string, x: number, y: number) => (
    <text x={x} y={y} fontSize="10" letterSpacing="1.2" className="fill-muted">{text}</text>
  );

  // Every station on the map, its label beside it, clear of the lines.
  const stationLabels: [string, number, number, 'start' | 'middle' | 'end', boolean?][] = [
    ['place-north', 11, -4, 'start', true],
    ['place-sstat', 9, -9, 'start', true],
    ['place-spmnl', -9, 4, 'end'],
    ['place-haecl', 9, 4, 'start'],
    ['place-bomnl', -8, -4, 'end'],
    ['place-gover', -9, 4, 'end'],
    ['place-state', 6, 13, 'start'],
    ['place-aqucl', 0, -9, 'middle'],
    ['place-pktrm', -12, 15, 'end'],
    ['place-dwnxg', 10, 3, 'start'],
    ['place-chncl', 9, 4, 'start'],
    ['place-boyls', -9, 3, 'end'],
    ['place-armnl', -9, 3, 'end'],
    ['place-chmnl', 0, -10, 'middle'],
    ['place-tumnl', -9, 4, 'end'],
  ];
  const transfers = new Set(['place-north', 'place-sstat', 'place-haecl', 'place-gover', 'place-state', 'place-dwnxg', 'place-pktrm']);

  // A scale bar of 200 m, and the closed station's ring.
  const bar = px(200);
  const [spX, spY] = STATIONS['place-spmnl'].at;
  const [pkX, pkY] = STATIONS['place-pktrm'].at;

  // The cab view's vanishing point.
  const VX = 780;
  const VY = 298;

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <clipPath id="lb-map">
          <rect x="40" y="20" width="560" height="400" rx="16" />
        </clipPath>
        <clipPath id="lb-cab">
          <rect x="664" y="246" width="232" height="120" rx="10" />
        </clipPath>
        <linearGradient id="lb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fa3d6" />
          <stop offset="1" stopColor="#f2c99a" />
        </linearGradient>
      </defs>

      {/* The map */}
      <g clipPath="url(#lb-map)">
        <rect x="40" y="20" width="560" height="400" className="fill-card" />
        <path d={STREETS} fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className="stroke-border" />
        <path d={PARKS} fill="#22c55e" fillOpacity="0.16" />
        <path d={WATER} fill={WATER_BLUE} fillOpacity="0.26" fillRule="evenodd" stroke={WATER_BLUE} strokeOpacity="0.3" strokeWidth="0.6" />
        <g fontSize="9" fontStyle="italic" letterSpacing="1.4" fill={WATER_BLUE} fillOpacity="0.75">
          <text x="66" y="264" transform="rotate(-58 66 264)">CHARLES RIVER</text>
          <text x="492" y="292">BOSTON HARBOR</text>
          <text x="458" y="318" fontSize="7.5" transform="rotate(-60 458 318)">FORT POINT CHANNEL</text>
        </g>
        <text x="166" y="313" fontSize="8" letterSpacing="1.2" fill="#16a34a" fillOpacity="0.85" fontStyle="italic">BOSTON COMMON</text>

        {/* Commuter rail and the ferry dashed; the subway solid, on a casing. */}
        {(['north', 'south'] as const).map((line) => (
          <polyline key={line} points={pts(TRACK[line])} fill="none" stroke={PURPLE} strokeWidth="3.5" strokeDasharray="6 3" strokeLinecap="butt" opacity="0.8" />
        ))}
        <polyline points={pts(TRACK.ferry)} fill="none" stroke={TEAL} strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
        {(['green', 'orange', 'blue', 'red'] as const).map((line) => (
          <polyline key={line} points={pts(TRACK[line])} fill="none" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" className="stroke-card" />
        ))}
        {(['green', 'orange', 'blue', 'red'] as const).map((line) => (
          <polyline key={line} points={pts(TRACK[line])} fill="none" stroke={CONSISTS[line].color} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
        ))}

        {/* Science Park, closed while the alerts are up. */}
        <g style={play('lb-closed', T, { opacity: 1 })}>
          <circle cx={spX} cy={spY} r="11" fill={AMBER} fillOpacity="0.25" stroke={AMBER} strokeWidth="2" />
          <rect x={spX - 22} y={spY + 13} width="44" height="15" rx="7.5" fill={AMBER} />
          <text x={spX} y={spY + 23.5} fontSize="9" fontWeight="700" textAnchor="middle" fill="#1c1404">Closed</text>
        </g>

        {/* Stations */}
        {stationLabels.map(([id, dx, dy, anchor, major]) => {
          const [x, y] = STATIONS[id].at;
          return (
            <g key={id}>
              {transfers.has(id) ? (
                <circle cx={x} cy={y} r="5" strokeWidth="2.2" className="fill-card stroke-foreground" />
              ) : (
                <circle cx={x} cy={y} r="3.4" strokeWidth="1.8" className="fill-card stroke-foreground" />
              )}
              <text
                x={x + dx}
                y={y + dy}
                fontSize={major ? 11 : 8.5}
                fontWeight={major ? 700 : 500}
                textAnchor={anchor}
                strokeWidth="3"
                strokeLinejoin="round"
                paintOrder="stroke"
                className={major ? 'fill-foreground stroke-card' : 'fill-muted stroke-card'}
              >
                {STATIONS[id].name}
              </text>
            </g>
          );
        })}

        {/* Park Street, where the commute starts. */}
        <g style={play('lb-commute', T, { opacity: 0 })}>
          <circle cx={pkX} cy={pkY} r="9" fill="none" stroke={RED} strokeWidth="2" style={play('lb-pulse', 1.6, { transformBox: 'fill-box', transformOrigin: 'center' }, 'ease-out')} />
        </g>

        {/* Trains, each its true length, with a car joint between every car. */}
        {trains.map((t, i) => {
          const { cars, car, color } = CONSISTS[t.line];
          const boat = t.line === 'ferry';
          const len = Math.max(px(cars * car), 7);
          const joints = Array.from({ length: cars - 1 }, (_, c) => -len / 2 + (len / cars) * (c + 1));
          return (
            <g key={i} style={play(`lb-t${i}`, T * (t.loops ?? 1), { transformBox: 'view-box', transformOrigin: '0 0', ...runs[i].resting }, 'linear')}>
              {t.ride && (
                <g style={play('lb-ring', T, { opacity: 0 })}>
                  <circle r="14" fill="none" stroke={RED} strokeWidth="2.5" style={play('lb-pulse', 1.6, { transformBox: 'fill-box', transformOrigin: 'center' }, 'ease-out')} />
                </g>
              )}
              {boat ? (
                <>
                  <path d="M-18 -4 L-9 0 L-18 4" fill="none" stroke={TEAL} strokeOpacity="0.5" strokeWidth="1.2" />
                  <path d="M-7 -4 H4 L9 0 L4 4 H-7 Z" fill={color} className="stroke-card" strokeWidth="1.2" />
                </>
              ) : (
                <>
                  <rect x={-len / 2 - 3} y="-6" width={len + 6} height="12" rx="6" fill={color} fillOpacity="0.25" />
                  <rect x={-len / 2} y="-3.2" width={len} height="6.4" rx="2.4" fill={color} strokeWidth="1.3" className="stroke-foreground" />
                  {joints.map((x) => (
                    <line key={x} x1={x} y1="-2.4" x2={x} y2="2.4" strokeWidth="0.9" className="stroke-card" />
                  ))}
                  <circle cx={len / 2 - 1.5} cy="0" r="1.2" fill="#fff7cc" />
                </>
              )}
            </g>
          );
        })}

        {/* Live, a north arrow and the scale */}
        <rect x="54" y="34" width="96" height="22" rx="11" strokeWidth="1" className="fill-background stroke-border" />
        <circle cx="67" cy="45" r="3.5" fill="#ef4444" style={play('lb-blink', 1.4)} />
        <text x="76" y="49" fontSize="10" fontWeight="700" letterSpacing="0.8" className="fill-foreground">LIVE · 9:36</text>
        <g transform="translate(580 384)">
          <path d="M0 -12 L6 6 L0 2 L-6 6 Z" className="fill-foreground" />
          <text y="18" fontSize="9" fontWeight="700" textAnchor="middle" className="fill-foreground">N</text>
        </g>
        <g transform="translate(56 402)">
          <path d={`M0 -4 V0 H${bar} V-4`} fill="none" strokeWidth="1.5" className="stroke-foreground" />
          <text x={bar + 6} y="1" fontSize="9" className="fill-muted">200 m</text>
        </g>
      </g>
      <rect x="40.5" y="20.5" width="559" height="399" rx="15.5" fill="none" className="stroke-border" />

      {/* The sidebar, as on a phone */}
      <rect x="636.5" y="20.5" width="287" height="399" rx="28" className="fill-background stroke-border" />
      <rect x="740" y="34" width="80" height="8" rx="4" className="fill-border" />

      {/* 1. My commute */}
      <g style={play('lb-commute', T, { opacity: 0 })}>
        {label('MY COMMUTE', 664, 74)}
        <rect x="664" y="88" width="232" height="132" rx="16" fill={RED} fillOpacity="0.1" stroke={RED} strokeOpacity="0.35" />
        <rect x="678" y="102" width="4" height="40" rx="2" fill={RED} />
        <text x="692" y="114" fontSize="12" fontWeight="700" fill={RED}>Red Line · Park Street</text>
        <text x="692" y="137" fontSize="19" fontWeight="700" className="fill-foreground">To Alewife</text>
        <text x="678" y="170" fontSize="10" letterSpacing="1.2" className="fill-muted">LEAVE IN</text>
        {countdown.map((n, i) => (
          <g key={n} style={play(`lb-count${i}`, T, { opacity: 0 })}>
            <text x="678" y="206" fontSize="34" fontWeight="800" className="fill-foreground">{n}</text>
            <text x={700} y="206" fontSize="14" fontWeight="600" className="fill-muted">min</text>
          </g>
        ))}
        <g style={play('lb-now', T, { opacity: 0 })}>
          <rect x="676" y="178" width="124" height="36" rx="12" fill="#34d399" style={play('lb-go', 1.4)} />
          <text x="738" y="202" fontSize="17" fontWeight="800" textAnchor="middle" fill="#04130d">Leave now</text>
        </g>
        {label('DEPARTS', 664, 252)}
        <text x="664" y="274" fontSize="15" fontWeight="600" className="fill-foreground">9:46 · then 9:53, 10:00</text>
        {label('WALK TO THE PLATFORM', 664, 312)}
        <text x="664" y="334" fontSize="15" fontWeight="600" className="fill-foreground">6 min</text>
        <text x="664" y="384" fontSize="12" className="fill-muted">A reminder when it’s time to go</text>
      </g>

      {/* 2. Alerts */}
      <g style={play('lb-alerts', T, { opacity: 1 })}>
        {label('ALERTS', 664, 74)}
        <g>
          <text x="664" y="108" fontSize="26" fontWeight="800" fill={AMBER}>2</text>
          <text x="684" y="108" fontSize="12" className="fill-muted">disruptions</text>
          <text x="790" y="108" fontSize="26" fontWeight="800" fill={AMBER}>1</text>
          <text x="808" y="108" fontSize="12" className="fill-muted">bunched</text>
        </g>
        {[
          { key: 'lb-alert1', y: 126, color: GREEN, title: 'Green Line · Station closed', body: 'Science Park/West End', chip: null },
          { key: 'lb-alert2', y: 210, color: PURPLE, title: 'Fitchburg Line · Delays', body: 'Up to 15 min', chip: 'Freight train' },
          { key: 'lb-alert3', y: 294, color: ORANGE, title: 'Bunched · Orange Line', body: 'Two trains a stop apart', chip: null },
        ].map((a) => (
          <g key={a.key} style={play(a.key, T, { opacity: 1 })}>
            <rect x="664" y={a.y} width="232" height="72" rx="14" className="fill-card stroke-border" />
            <rect x="676" y={a.y + 14} width="4" height="44" rx="2" fill={a.color} />
            <text x="690" y={a.y + 28} fontSize="11.5" fontWeight="700" fill={a.color}>{a.title}</text>
            <text x="690" y={a.y + 50} fontSize="13" fontWeight="600" className="fill-foreground">{a.body}</text>
            {a.chip && (
              <g>
                <rect x="796" y={a.y + 37} width="90" height="19" rx="6" fill="#8b9cff" fillOpacity="0.2" />
                <text x="841" y={a.y + 50} fontSize="10" fontWeight="700" textAnchor="middle" fill="#6d7ce0">{a.chip}</text>
              </g>
            )}
          </g>
        ))}
      </g>

      {/* 3. Riding along, with the view from the cab */}
      <g style={play('lb-ride', T, { opacity: 0 })}>
        {label('RIDING ALONG', 664, 74)}
        <text x="664" y="102" fontSize="12" fontWeight="700" fill={RED}>Red Line</text>
        <text x="664" y="126" fontSize="20" fontWeight="700" className="fill-foreground">To Alewife</text>
        {label('NEXT STOP', 664, 158)}
        <text x="664" y="178" fontSize="15" fontWeight="600" className="fill-foreground" style={play('lb-next1', T, { opacity: 0 })}>Charles/MGH</text>
        <text x="664" y="178" fontSize="15" fontWeight="600" className="fill-foreground" style={play('lb-next2', T, { opacity: 0 })}>Kendall/MIT</text>
        {label('CARS', 812, 158)}
        <text x="812" y="178" fontSize="15" fontWeight="600" className="fill-foreground">6 · 128 m</text>
        {label('CAB VIEW', 664, 230)}
        <g clipPath="url(#lb-cab)">
          {/* Under Beacon Hill: the tunnel's lights rushing past. */}
          <g style={play('lb-tunnel', T, { opacity: 0 })}>
            <rect x="664" y="246" width="232" height="120" fill="#07090d" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i} style={{ animation: `lb-rush 1.2s linear ${-i * 0.3}s infinite`, transformBox: 'view-box', transformOrigin: `${VX}px ${VY}px`, opacity: 0 }}>
                <rect x={VX - 60} y={VY - 40} width="120" height="80" rx="34" fill="none" stroke="#2a3140" strokeWidth="5" />
                <circle cx={VX - 52} cy={VY - 18} r="3" fill="#ffd27a" />
                <circle cx={VX + 52} cy={VY - 18} r="3" fill="#ffd27a" />
              </g>
            ))}
            <path d={`M736 366 L${VX - 3} ${VY + 4} M824 366 L${VX + 3} ${VY + 4}`} stroke="#5b6372" strokeWidth="2" />
          </g>
          {/* Out over the Charles on the Longfellow Bridge, between its towers. */}
          <g style={play('lb-day', T, { opacity: 0 })}>
            <rect x="664" y="246" width="232" height="56" fill="url(#lb-sky)" />
            <path d="M664 302 V290 H676 V276 H688 V284 H700 V266 H712 V288 H730 V280 H742 V294 H818 V272 H830 V262 H842 V282 H858 V270 H872 V288 H896 V302 Z" fill="#4a5a70" fillOpacity="0.85" />
            <rect x="664" y="302" width="232" height="64" fill="#3f6f9c" />
            <path d={`M664 330 L${VX - 10} ${VY + 6} M896 330 L${VX + 10} ${VY + 6}`} stroke="#c8ccd2" strokeWidth="1.5" />
            <path d={`M664 366 L${VX - 10} ${VY + 6} L${VX + 10} ${VY + 6} L896 366 Z`} fill="#8a8f98" />
            <path d={`M736 366 L${VX - 3} ${VY + 6} M824 366 L${VX + 3} ${VY + 6}`} stroke="#2b2f36" strokeWidth="2" />
            {/* The salt-and-pepper towers, coming up as the train reaches mid-river. */}
            <g style={play('lb-bridge', T, { transformBox: 'view-box', transformOrigin: `${VX}px ${VY + 6}px`, transform: 'scale(1)' })}>
              {[-1, 1].map((s) => (
                <g key={s}>
                  <rect x={VX + s * 44 - 7} y={VY - 30} width="14" height="36" fill="#d9d2c3" />
                  <path d={`M${VX + s * 44 - 8} ${VY - 30} L${VX + s * 44} ${VY - 44} L${VX + s * 44 + 8} ${VY - 30} Z`} fill="#b8ae9b" />
                  <rect x={VX + s * 44 - 3} y={VY - 22} width="6" height="9" fill="#6b6457" />
                </g>
              ))}
            </g>
          </g>
        </g>
        <rect x="664.5" y="246.5" width="231" height="119" rx="9.5" fill="none" className="stroke-border" />
        <text x="664" y="394" fontSize="12" className="fill-muted">From the driver’s seat, live</text>
      </g>
    </g>
  );
  return { css, svg };
}

