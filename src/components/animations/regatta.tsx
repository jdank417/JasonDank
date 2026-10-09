import { draw, drawn, fade, keyframes, play, type Scene, type Stop } from './kit';

// ---------------------------------------------------------------------------
// RegattaTrack: the night's course plotted on a chart, then sailed leg by leg
// with the Leg screen alongside. Headings, distances and points of sail are
// worked out from the marks, so the numbers match the picture.
// ---------------------------------------------------------------------------

const PX_PER_NM = 160;
/** Massachusetts Bay: about 14° west, so magnetic = true + 14. */
const VARIATION_W = 14;
const WIND_FROM = 45;

type Mark = { name: string; x: number; y: number; color: string };

const bearing = (a: Mark, b: Mark) => (Math.round((Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI) + 360) % 360;
const pad = (deg: number) => String(deg).padStart(3, '0');
const pointOfSail = (heading: number) => {
  const off = Math.abs(((heading - WIND_FROM + 540) % 360) - 180);
  return off < 50 ? 'Beat' : off < 120 ? 'Reach' : 'Run';
};

export default function regatta(): Scene {
  const T = 15;
  const start: Mark = { name: 'Start', x: 340, y: 360, color: 'var(--accent)' };
  const marks: Mark[] = [
    { name: 'G7', x: 470, y: 112, color: '#22c55e' },
    { name: 'R4', x: 236, y: 206, color: '#ef4444' },
    { ...start, name: 'Finish' },
  ];
  const stops = [start, ...marks];
  const legs = marks.map((to, i) => {
    const from = stops[i];
    const trueHeading = bearing(from, to);
    return {
      from,
      to,
      trueHeading,
      magnetic: (trueHeading + VARIATION_W) % 360,
      nm: Math.hypot(to.x - from.x, to.y - from.y) / PX_PER_NM,
      sail: pointOfSail(trueHeading),
      // Plotted one after another, then sailed one after another.
      plot: [2 + i * 6, 7 + i * 6],
      sailing: [22 + i * 24, 44 + i * 24],
    };
  });
  const total = legs.reduce((sum, leg) => sum + leg.nm, 0);

  // The boat: along each leg, turning at each mark.
  const at = (m: Mark, deg: number) => `transform:translate(${m.x}px,${m.y}px) rotate(${deg}deg)`;
  const boat: Stop[] = [[0, at(start, legs[0].trueHeading)], [legs[0].sailing[0], at(start, legs[0].trueHeading)]];
  legs.forEach((leg, i) => {
    boat.push([leg.sailing[1] - 1.5, at(leg.to, leg.trueHeading)]);
    const next = legs[i + 1];
    if (next) boat.push([next.sailing[0], at(leg.to, next.trueHeading)]);
  });
  boat.push([100, at(start, legs[2].trueHeading)]);

  const css = [
    keyframes('rt-boat', boat),
    fade('rt-boat-show', [20, 22, 92, 95]),
    fade('rt-summary', [0, 2, 19, 21]),
    ...legs.flatMap((leg, i) => [
      draw(`rt-leg${i}`, [leg.plot[0], leg.plot[1], 93, 98]),
      fade(`rt-card${i}`, [leg.sailing[0] - 1, leg.sailing[0] + 1, leg.sailing[1] - 1, leg.sailing[1] + 1]),
      fade(`rt-ring${i}`, [leg.sailing[0], leg.sailing[0] + 2, leg.sailing[1] - 2, leg.sailing[1]]),
    ]),
    keyframes('rt-pulse', [[0, 'transform:scale(.6);opacity:.9'], [100, 'transform:scale(1.8);opacity:0']]),
  ];

  const field = (label: string, value: string, x: number, y: number, size = 15) => (
    <g>
      <text x={x} y={y} fontSize="10" letterSpacing="1.2" className="fill-muted">{label}</text>
      <text x={x} y={y + size + 6} fontSize={size} fontWeight="700" className="fill-foreground">{value}</text>
    </g>
  );

  const svg = (
    <g>
      <defs>
        <clipPath id="rt-chart">
          <rect x="40" y="20" width="560" height="400" rx="16" />
        </clipPath>
      </defs>

      {/* The chart */}
      <g clipPath="url(#rt-chart)">
        <rect x="40" y="20" width="560" height="400" className="fill-card" />
        {[120, 220, 320].map((y) => (
          <line key={y} x1="40" x2="600" y1={y} y2={y} strokeDasharray="2 6" className="stroke-border" />
        ))}
        {[160, 300, 440].map((x) => (
          <line key={x} y1="20" y2="420" x1={x} x2={x} strokeDasharray="2 6" className="stroke-border" />
        ))}
        <path d="M40 20 H250 C232 58 196 74 178 112 C162 150 110 176 40 186 Z" className="fill-border" />
        <path d="M40 330 C80 318 118 342 132 376 C142 400 132 420 120 420 H40 Z" className="fill-border" />
        <path d="M528 318 c22 -16 62 -10 70 12 c6 22 -30 36 -60 30 c-22 -6 -26 -26 -10 -42z" className="fill-border" />
        <text x="62" y="60" fontSize="11" letterSpacing="1.5" className="fill-muted">MASSACHUSETTS BAY</text>

        {/* Compass rose */}
        <g transform="translate(92 270)">
          <circle r="30" fill="none" className="stroke-border" />
          <path d="M0 -26 L6 0 L0 26 L-6 0 Z" className="fill-muted" fillOpacity="0.35" />
          <path d="M0 -26 L6 0 L-6 0 Z" className="fill-foreground" />
          <text y="-34" fontSize="10" textAnchor="middle" className="fill-muted">N</text>
        </g>

        {/* Wind */}
        <g transform="translate(556 236)">
          <line x1="22" y1="-22" x2="-6" y2="6" strokeWidth="2" className="stroke-muted" />
          <path d="M-10 10 l12 -3 -9 -9z" className="fill-muted" />
          <text x="-12" y="34" fontSize="11" textAnchor="middle" className="fill-muted">{`Wind ${pad(WIND_FROM)}°`}</text>
        </g>

        {/* Course */}
        {legs.map((leg, i) => (
          <line
            key={i}
            x1={leg.from.x}
            y1={leg.from.y}
            x2={leg.to.x}
            y2={leg.to.y}
            pathLength={1}
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={drawn(`rt-leg${i}`, T)}
          />
        ))}
        <line x1="300" y1="360" x2="380" y2="360" strokeDasharray="4 4" strokeWidth="2" className="stroke-foreground" />
        <circle cx="300" cy="360" r="4" className="fill-foreground" />
        <circle cx="380" cy="360" r="4" className="fill-foreground" />
        <text x="340" y="384" fontSize="11" textAnchor="middle" className="fill-muted">Start / Finish</text>
        {marks.slice(0, 2).map((mark) => (
          <g key={mark.name}>
            <circle cx={mark.x} cy={mark.y} r="8" fill={mark.color} />
            <text x={mark.x + 14} y={mark.y + 4} fontSize="13" fontWeight="700" className="fill-foreground">{mark.name}</text>
          </g>
        ))}
        {legs.map((leg, i) => (
          <g key={i} style={play(`rt-ring${i}`, T, { opacity: 0 })}>
            <circle cx={leg.to.x} cy={leg.to.y} r="14" fill="none" stroke={leg.to.color} strokeWidth="2" style={play('rt-pulse', 1.6, { transformBox: 'fill-box', transformOrigin: 'center' }, 'ease-out')} />
          </g>
        ))}

        {/* The boat */}
        <g style={play('rt-boat-show', T, { opacity: 0 })}>
          <g style={play('rt-boat', T, { transformBox: 'view-box', transformOrigin: '0 0', transform: `translate(${start.x}px,${start.y}px)` })}>
            <path d="M0 -13 C6 -4 6 6 4 11 H-4 C-6 6 -6 -4 0 -13 Z" className="fill-foreground" />
            <path d="M0 -8 L0 7 L4 5 Z" fill="var(--accent)" />
          </g>
        </g>
      </g>
      <rect x="40.5" y="20.5" width="559" height="399" rx="15.5" fill="none" className="stroke-border" />

      {/* The Leg screen */}
      <rect x="636.5" y="20.5" width="287" height="399" rx="28" className="fill-background stroke-border" />
      <rect x="740" y="34" width="80" height="8" rx="4" className="fill-border" />

      <g style={play('rt-summary', T, { opacity: 0 })}>
        <text x="664" y="84" fontSize="10" letterSpacing="1.2" className="fill-muted">TONIGHT’S COURSE</text>
        <text x="664" y="114" fontSize="22" fontWeight="700" className="fill-foreground">Start – G7 – R4 – F</text>
        {field('LEGS', String(legs.length), 664, 150)}
        {field('TOTAL', `${total.toFixed(2)} nm`, 780, 150)}
        {legs.map((leg, i) => (
          <g key={i}>
            <text x="664" y={224 + i * 40} fontSize="13" className="fill-foreground">{`${i + 1}. ${leg.from.name} → ${leg.to.name}`}</text>
            <text x="896" y={224 + i * 40} fontSize="13" textAnchor="end" className="fill-muted">{`${pad(leg.trueHeading)}°T · ${leg.nm.toFixed(2)}`}</text>
          </g>
        ))}
      </g>

      {legs.map((leg, i) => (
        <g key={i} style={play(`rt-card${i}`, T, { opacity: i === 1 ? 1 : 0 })}>
          <text x="664" y="84" fontSize="10" letterSpacing="1.2" className="fill-muted">{`LEG ${i + 1} OF ${legs.length}`}</text>
          <text x="664" y="114" fontSize="22" fontWeight="700" className="fill-foreground">{`To ${leg.to.name}`}</text>
          <text x="664" y="190" fontSize="56" fontWeight="800" className="fill-foreground">{`${pad(leg.trueHeading)}°`}</text>
          <text x="800" y="190" fontSize="16" fontWeight="700" fill="var(--accent)">T</text>
          <text x="664" y="222" fontSize="16" className="fill-muted">{`${pad(leg.magnetic)}° magnetic`}</text>
          {field('DISTANCE', `${leg.nm.toFixed(2)} nm`, 664, 262)}
          {field('POINT OF SAIL', leg.sail, 790, 262)}
          {field('ROUNDING', leg.to.name === 'Finish' ? 'Cross the line' : `Leave ${leg.to.name} to port`, 664, 326)}
        </g>
      ))}
    </g>
  );
  return { css, svg };
}
