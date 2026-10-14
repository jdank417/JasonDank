import { fade, keyframes, play, type Scene, type Stop } from './kit';

// ---------------------------------------------------------------------------
// Live Boston: a transit map with every train moving on it, beside the
// sidebar as it counts down to leaving for the commute, lists what's
// disrupting service, then rides along with one train into the cab view.
// ---------------------------------------------------------------------------

type Pt = [number, number];

const RED = '#da291c';
const ORANGE = '#ed8b00';
const GREEN = '#00843d';
const BLUE = '#003da5';
const PURPLE = '#80276c';
const TEAL = '#008eaa';
const AMBER = '#f59e0b';

/** Schematic lines, drawn the way transit diagrams are: straight runs at 45° turns. */
const LINES: Record<string, Pt[]> = {
  red: [[110, 60], [230, 170], [300, 200], [345, 214], [380, 250], [380, 330], [440, 390], [440, 420]],
  orange: [[360, 20], [360, 150], [335, 186], [322, 240], [240, 322], [240, 420]],
  green: [[40, 232], [180, 232], [250, 202], [330, 190], [380, 150], [380, 20]],
  blue: [[330, 190], [420, 150], [520, 110], [600, 64]],
  rail: [[40, 150], [200, 172], [338, 206]],
  ferry: [[425, 238], [520, 300], [600, 380]],
};

function measure(points: Pt[]) {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  return cum;
}

/** Position and heading (degrees) a fraction of the way along a line. */
function along(points: Pt[], f: number): { x: number; y: number; deg: number } {
  const cum = measure(points);
  const d = f * cum[cum.length - 1];
  let i = 1;
  while (i < points.length - 1 && cum[i] < d) i++;
  const [ax, ay] = points[i - 1];
  const [bx, by] = points[i];
  const k = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, deg: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI };
}

/**
 * A train running the length of its line once a loop, starting `phase` of the
 * way along. It fades out at the end of the line and back in at the start,
 * so the jump between them is never seen.
 */
function run(name: string, points: Pt[], phase: number) {
  const stops: Stop[] = [];
  let last: number | null = null;
  for (let p = 0; p <= 100; p++) {
    const f = (p / 100 + phase) % 1;
    const { x, y, deg } = along(points, f);
    // Keep the heading continuous so a turn never spins the long way round.
    let a = deg;
    if (last != null) while (a - last > 180) a -= 360;
    if (last != null) while (a - last < -180) a += 360;
    last = a;
    const opacity = Math.max(0, Math.min(1, Math.min(f, 1 - f) / 0.04));
    stops.push([p, `transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(1)}deg);opacity:${opacity.toFixed(2)}`]);
  }
  return keyframes(name, stops);
}

const pts = (points: Pt[]) => points.map((p) => p.join(',')).join(' ');

export default function liveBoston(): Scene {
  const T = 18;
  /** Where a paused card rests: mid-way through the alerts, with everything on the map. */
  const STILL = 0.45;

  const trains = [
    { line: 'red', phase: 0.06, color: RED, ride: true },
    { line: 'red', phase: 0.42, color: RED },
    { line: 'red', phase: 0.74, color: RED },
    // Two Orange Line trains nose to tail: bunched.
    { line: 'orange', phase: 0.3, color: ORANGE },
    { line: 'orange', phase: 0.335, color: ORANGE },
    { line: 'green', phase: 0.15, color: GREEN },
    { line: 'green', phase: 0.62, color: GREEN },
    { line: 'blue', phase: 0.5, color: BLUE },
    { line: 'rail', phase: 0.2, color: PURPLE, long: true },
    { line: 'ferry', phase: 0.55, color: TEAL, boat: true },
  ];

  // The commute countdown, a minute at a time, then "leave now".
  const countdown = ['4', '3', '2', '1'];
  const css = [
    ...trains.map((t, i) => run(`lb-t${i}`, LINES[t.line], t.phase)),
    fade('lb-commute', [0, 1.5, 29, 31]),
    ...countdown.map((_, i) => fade(`lb-count${i}`, [i * 6, i * 6 + 0.5, i * 6 + 5.5, i * 6 + 6])),
    fade('lb-now', [24, 24.5, 29, 31]),
    fade('lb-alerts', [31, 33, 62, 64]),
    fade('lb-alert1', [33, 35, 62, 64]),
    fade('lb-alert2', [36, 38, 62, 64]),
    fade('lb-alert3', [39, 41, 62, 64]),
    fade('lb-shuttle', [33, 35, 62, 64]),
    fade('lb-ride', [64, 66, 98, 100]),
    fade('lb-ring', [64, 67, 97, 99]),
    keyframes('lb-pulse', [[0, 'transform:scale(.7);opacity:.9'], [100, 'transform:scale(1.9);opacity:0']]),
    keyframes('lb-go', [[0, 'opacity:1'], [50, 'opacity:.55'], [100, 'opacity:1']]),
  ];

  const resting = (line: string, phase: number) => {
    const { x, y, deg } = along(LINES[line], (STILL + phase) % 1);
    return `translate(${x}px,${y}px) rotate(${deg}deg)`;
  };

  const label = (text: string, x: number, y: number) => (
    <text x={x} y={y} fontSize="10" letterSpacing="1.2" className="fill-muted">{text}</text>
  );

  const svg = (
    <g>
      <defs>
        <clipPath id="lb-map">
          <rect x="40" y="20" width="560" height="400" rx="16" />
        </clipPath>
        <clipPath id="lb-cab">
          <rect x="664" y="246" width="232" height="120" rx="10" />
        </clipPath>
      </defs>

      {/* The map */}
      <g clipPath="url(#lb-map)">
        <rect x="40" y="20" width="560" height="400" className="fill-card" />
        <path d="M600 20 H468 C446 70 452 140 424 196 C406 236 428 292 470 326 C512 362 540 398 552 420 H600 Z" className="fill-border" fillOpacity="0.7" />
        <text x="478" y="62" fontSize="11" letterSpacing="1.5" className="fill-muted">BOSTON HARBOR</text>

        {/* Commuter rail and the ferry dashed; the subway solid. */}
        <polyline points={pts(LINES.rail)} fill="none" stroke={PURPLE} strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" opacity="0.8" />
        <polyline points={pts(LINES.ferry)} fill="none" stroke={TEAL} strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />
        {(['green', 'blue', 'orange', 'red'] as const).map((line) => (
          <polyline
            key={line}
            points={pts(LINES[line])}
            fill="none"
            stroke={{ red: RED, orange: ORANGE, green: GREEN, blue: BLUE }[line]}
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* A suspended stretch of the Orange Line, in amber while shuttles run. */}
        <g style={play('lb-shuttle', T, { opacity: 1 })}>
          <polyline points="240,322 240,420" fill="none" stroke={AMBER} strokeWidth="11" strokeOpacity="0.35" strokeLinecap="round" />
          <polyline points="240,322 240,420" fill="none" stroke={AMBER} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
          <rect x="252" y="368" width="96" height="22" rx="11" fill={AMBER} />
          <text x="300" y="383" fontSize="11" fontWeight="700" textAnchor="middle" fill="#1c1404">Shuttle buses</text>
        </g>

        {/* Stations */}
        {/* Labels sit clear of the downtown tangle: above, beside or below each station. */}
        {(
          [
            [330, 190, null, 0, 0, 'end'],
            [345, 214, 'South Station', -10, 20, 'end'],
            [360, 150, 'Haymarket', -10, 4, 'end'],
            [230, 170, 'Kendall', 10, -8, 'start'],
            [240, 322, 'Jackson Sq', -12, 4, 'end'],
          ] as const
        ).map(([x, y, name, dx, dy, anchor]) => (
          <g key={`${x},${y}`}>
            <circle cx={x} cy={y} r="5.5" strokeWidth="2.5" className="fill-card stroke-foreground" />
            {name && <text x={x + dx} y={y + dy} fontSize="11" textAnchor={anchor} className="fill-muted">{name}</text>}
          </g>
        ))}

        {/* Trains */}
        {trains.map((t, i) => (
          <g key={i} style={play(`lb-t${i}`, T, { transformBox: 'view-box', transformOrigin: '0 0', transform: resting(t.line, t.phase) }, 'linear')}>
            {t.ride && (
              <g style={play('lb-ring', T, { opacity: 0 })}>
                <circle r="13" fill="none" strokeWidth="2" className="stroke-foreground" style={play('lb-pulse', 1.6, { transformBox: 'fill-box', transformOrigin: 'center' }, 'ease-out')} />
              </g>
            )}
            {t.boat ? (
              <path d="M-9 -5 H5 L11 0 L5 5 H-9 Z" fill={t.color} className="stroke-card" strokeWidth="1.5" />
            ) : (
              <rect x={t.long ? -16 : -11} y="-4.5" width={t.long ? 32 : 22} height="9" rx="4.5" fill={t.color} className="stroke-card" strokeWidth="1.5" />
            )}
          </g>
        ))}
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
          { key: 'lb-alert1', y: 126, color: ORANGE, title: 'Orange Line · Shuttles', body: 'Jackson Sq–Forest Hills', chip: null },
          { key: 'lb-alert2', y: 210, color: PURPLE, title: 'Fitchburg Line · Delays', body: 'Up to 15 min', chip: 'Freight train' },
          { key: 'lb-alert3', y: 294, color: ORANGE, title: 'Bunched · Orange Line', body: 'Two trains 300 ft apart', chip: null },
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
        <text x="664" y="178" fontSize="15" fontWeight="600" className="fill-foreground">Kendall/MIT</text>
        {label('SPEED', 812, 158)}
        <text x="812" y="178" fontSize="15" fontWeight="600" className="fill-foreground">34 mph</text>
        {label('CAB VIEW', 664, 230)}
        <g clipPath="url(#lb-cab)">
          <rect x="664" y="246" width="232" height="120" fill="#0f1726" />
          <rect x="664" y="306" width="232" height="60" fill="#0a0c10" />
          {[[672, 268, 30, 38], [706, 282, 22, 24], [818, 262, 34, 44], [856, 278, 28, 28], [740, 290, 18, 16]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#1e2532" />
          ))}
          <path d="M770 306 L790 306 L840 366 L720 366 Z" fill={RED} />
        </g>
        <rect x="664.5" y="246.5" width="231" height="119" rx="9.5" fill="none" className="stroke-border" />
        <text x="664" y="394" fontSize="12" className="fill-muted">From the driver’s seat, live</text>
      </g>
    </g>
  );
  return { css, svg };
}
