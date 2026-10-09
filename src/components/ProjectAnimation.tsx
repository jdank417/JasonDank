import type { CSSProperties, ReactNode } from 'react';

/*
 * Animated stand-ins for case studies that have no screenshots. Each one is an
 * SVG scene on a single loop: every element's keyframes are written against the
 * same cycle, so nothing drifts out of step however long the page stays open.
 * The static styles on each element are the "finished" frame, which is what
 * shows when someone prefers reduced motion (see .project-anim in globals.css).
 */

type Stop = [number, string];

const keyframes = (name: string, stops: Stop[]) =>
  `@keyframes ${name}{${stops.map(([at, style]) => `${at}%{${style}}`).join('')}}`;

/** In over a→b, out over c→d, as percentages of the loop. */
const fade = (name: string, [a, b, c, d]: number[], peak = 1) =>
  keyframes(name, [
    [0, 'opacity:0'],
    [a, 'opacity:0'],
    [b, `opacity:${peak}`],
    [c, `opacity:${peak}`],
    [d, 'opacity:0'],
    [100, 'opacity:0'],
  ]);

/** The opposite of fade: shown, then hidden over a→b…c→d. */
const hide = (name: string, [a, b, c, d]: number[]) =>
  keyframes(name, [
    [0, 'opacity:1'],
    [a, 'opacity:1'],
    [b, 'opacity:0'],
    [c, 'opacity:0'],
    [d, 'opacity:1'],
    [100, 'opacity:1'],
  ]);

/** Grows from the left edge over a→b: as a clip, it types text out. */
const type = (name: string, [a, b]: number[]) =>
  keyframes(name, [
    [0, 'transform:scaleX(0)'],
    [a, 'transform:scaleX(0)'],
    [b, 'transform:scaleX(1)'],
    [100, 'transform:scaleX(1)'],
  ]);

const play = (name: string, seconds: number, style: CSSProperties = {}): CSSProperties => ({
  animation: `${name} ${seconds}s ease-in-out infinite`,
  ...style,
});

const fromLeft: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'left center' };
const fromCenter: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center' };
const fromBottom: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center bottom' };

const SYSTEM_FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const scenes: Record<string, { label: string; render: () => { css: string[]; svg: ReactNode } }> = {
  dankhome: {
    label: 'A scene button and then the assistant run the lights on a wall-mounted iPad, before the idle night clock takes over',
    render: dankHome,
  },
  humanauth: {
    label: 'Face landmarks tracked from the webcam while the six liveness checks pass one by one',
    render: humanAuth,
  },
  'barcode-scanning-webapp': {
    label: 'The camera finds a barcode, decodes it and looks the item up in the inventory',
    render: barcode,
  },
};

export default function ProjectAnimation({ id }: { id: string }) {
  const scene = scenes[id];
  if (!scene) return null;
  const { css, svg } = scene.render();
  return (
    <section className="project-anim border-b border-border bg-card/60" aria-label="Illustration">
      <figure className="mx-auto m-0 max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <style dangerouslySetInnerHTML={{ __html: css.join('') }} />
        <svg viewBox="0 0 960 440" role="img" aria-label={scene.label} className="mx-auto block h-auto w-full max-w-4xl">
          {svg}
        </svg>
        <figcaption className="mx-auto mt-3 max-w-4xl text-xs leading-snug text-muted">{scene.label}</figcaption>
      </figure>
    </section>
  );
}

// ---------------------------------------------------------------------------
// DankHome: an iPad on the wall. A scene lights the room, the assistant dims the
// kitchen, then the panel goes idle and the night clock fades in.
// ---------------------------------------------------------------------------

function dankHome() {
  const T = 14;
  const lights = [
    { name: 'Ceiling', level: '80%', color: '#ffd8a0' },
    { name: 'Floor Lamp', level: '45%', color: '#ffa65c' },
    { name: 'TV Backlight', level: '60%', color: '#a58bff' },
    { name: 'Pendants', level: '100%', dimmed: '30%', color: '#ffe2b0' },
    { name: 'Under Cabinet', level: '70%', dimmed: '30%', color: '#fff0d4' },
    { name: 'Bedside', level: '20%', color: '#ff8f6b' },
  ];
  const css = [
    fade('dh-press', [2, 4, 12, 16], 0.35),
    fade('dh-glow', [10, 24, 80, 84], 0.55),
    fade('dh-bubble', [38, 41, 68, 71]),
    type('dh-type', [41, 47]),
    fade('dh-reply', [50, 53, 68, 71]),
    fade('dh-night', [72, 76, 94, 98]),
    keyframes('dh-drift', [[0, 'transform:translate(0,0)'], [80, 'transform:translate(0,0)'], [96, 'transform:translate(18px,-8px)'], [100, 'transform:translate(18px,-8px)']]),
    keyframes('dh-arc', [[0, 'stroke-dashoffset:124'], [18, 'stroke-dashoffset:124'], [26, 'stroke-dashoffset:105'], [100, 'stroke-dashoffset:105']]),
    hide('dh-t68', [21, 22, 98, 100]),
    fade('dh-t70', [21, 22, 98, 100]),
    keyframes('dh-eq', [[0, 'transform:scaleY(.35)'], [50, 'transform:scaleY(1)'], [100, 'transform:scaleY(.35)']]),
    ...lights.flatMap((light, i) => {
      const on = 10 + i * 2;
      return light.dimmed
        ? [
            keyframes(`dh-on${i}`, [[0, 'opacity:0'], [on, 'opacity:0'], [on + 3, 'opacity:1'], [52, 'opacity:1'], [55, 'opacity:.45'], [80, 'opacity:.45'], [83, 'opacity:0'], [100, 'opacity:0']]),
            fade(`dh-lv${i}`, [on, on + 3, 52, 54]),
            fade(`dh-dm${i}`, [52, 54, 80, 83]),
            hide(`dh-off${i}`, [on, on + 3, 80, 83]),
          ]
        : [fade(`dh-on${i}`, [on, on + 3, 80, 83]), fade(`dh-lv${i}`, [on, on + 3, 80, 83]), hide(`dh-off${i}`, [on, on + 3, 80, 83])];
    }),
  ];

  const tile = (i: number) => ({ x: 368 + (i % 3) * 150, y: 114 + Math.floor(i / 3) * 92 });
  const scenesRow = ['Bright', 'Relax', 'Movie', 'Good Night'];
  const circumference = 2 * Math.PI * 44;

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <clipPath id="dh-screen">
          <rect x="136" y="32" width="688" height="376" rx="22" />
        </clipPath>
        <radialGradient id="dh-warm" cx="0.35" cy="0.7" r="0.7">
          <stop offset="0" stopColor="#ff9f5a" />
          <stop offset="1" stopColor="#ff9f5a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dh-cool" cx="0.9" cy="0.1" r="0.6">
          <stop offset="0" stopColor="#5b5bd6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b5bd6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dh-art" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#ff6fa8" />
        </linearGradient>
      </defs>

      {/* The iPad */}
      <rect x="120" y="16" width="720" height="408" rx="36" fill="#0a0a0a" />
      <rect x="120.5" y="16.5" width="719" height="407" rx="35.5" fill="none" stroke="#3a3a3a" />
      <g clipPath="url(#dh-screen)">
        <rect x="136" y="32" width="688" height="376" fill="#0b0d14" />
        <rect x="136" y="32" width="688" height="376" fill="url(#dh-cool)" />
        <rect x="136" y="32" width="688" height="376" fill="url(#dh-warm)" style={play('dh-glow', T, { opacity: 0.55 })} />

        {/* Header: clock, rooms, weather, assistant and settings */}
        <text x="160" y="80" fontSize="32" fontWeight="300" fill="#fff">9:41</text>
        <text x="160" y="98" fontSize="11" fill="#fff" fillOpacity="0.6">Friday, October 9</text>
        {[
          { label: 'All', x: 290, w: 44, on: true },
          { label: 'Living Room', x: 342, w: 100 },
          { label: 'Kitchen', x: 450, w: 72 },
          { label: 'Bedroom', x: 530, w: 80 },
        ].map((room) => (
          <g key={room.label}>
            <rect x={room.x} y="58" width={room.w} height="28" rx="14" fill="#fff" fillOpacity={room.on ? 1 : 0.1} />
            <text x={room.x + room.w / 2} y="76" fontSize="12" textAnchor="middle" fill={room.on ? '#000' : '#fff'}>
              {room.label}
            </text>
          </g>
        ))}
        <circle cx="682" cy="72" r="8" fill="#ffd25a" />
        <text x="698" y="78" fontSize="18" fill="#fff">64°</text>
        <circle cx="764" cy="72" r="16" fill="#fff" fillOpacity="0.12" />
        <path d="M764 63 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" fill="#fff" />
        <circle cx="802" cy="72" r="16" fill="#fff" fillOpacity="0.12" />
        <circle cx="802" cy="72" r="6" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="3 2" />

        {/* Thermostat */}
        <rect x="156" y="114" width="196" height="160" rx="18" fill="#fff" fillOpacity="0.07" />
        <circle cx="254" cy="184" r="44" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="8" />
        <circle
          cx="254"
          cy="184"
          r="44"
          fill="none"
          stroke="#ff9f43"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform="rotate(-90 254 184)"
          style={play('dh-arc', T, { strokeDashoffset: 105 })}
        />
        <text x="254" y="193" fontSize="26" fontWeight="300" fill="#fff" textAnchor="middle" style={play('dh-t68', T, { opacity: 0 })}>68°</text>
        <text x="254" y="193" fontSize="26" fontWeight="300" fill="#fff" textAnchor="middle" style={play('dh-t70', T, { opacity: 1 })}>70°</text>
        <text x="254" y="252" fontSize="11" fontWeight="600" fill="#ff9f43" textAnchor="middle">HEATING</text>

        {/* Now playing */}
        <rect x="156" y="286" width="196" height="106" rx="18" fill="#fff" fillOpacity="0.07" />
        <rect x="172" y="302" width="48" height="48" rx="8" fill="url(#dh-art)" />
        <text x="232" y="320" fontSize="13" fontWeight="600" fill="#fff">Harbor Lights</text>
        <text x="232" y="338" fontSize="11" fill="#fff" fillOpacity="0.6">Apple Music</text>
        {[16, 22, 12, 20, 15, 18].map((h, i) => (
          <rect
            key={i}
            x={174 + i * 8}
            y={380 - h}
            width="5"
            height={h}
            rx="2"
            fill="#fff"
            fillOpacity="0.75"
            style={play('dh-eq', 0.7 + i * 0.13, { ...fromBottom, animationDelay: `${-i * 0.2}s` })}
          />
        ))}

        {/* Lights */}
        {lights.map((light, i) => {
          const { x, y } = tile(i);
          return (
            <g key={light.name}>
              <rect x={x} y={y} width="138" height="80" rx="16" fill="#fff" fillOpacity="0.07" />
              <circle cx={x + 24} cy={y + 24} r="9" fill="#fff" fillOpacity="0.22" />
              <g style={play(`dh-on${i}`, T, { opacity: 1 })}>
                <rect x={x} y={y} width="138" height="80" rx="16" fill={light.color} fillOpacity="0.22" stroke={light.color} strokeOpacity="0.55" />
                <circle cx={x + 24} cy={y + 24} r="16" fill={light.color} fillOpacity="0.25" />
                <circle cx={x + 24} cy={y + 24} r="9" fill={light.color} />
              </g>
              <text x={x + 16} y={y + 56} fontSize="13" fontWeight="600" fill="#fff">{light.name}</text>
              <text x={x + 16} y={y + 71} fontSize="11" fill="#fff" fillOpacity="0.6" style={play(`dh-off${i}`, T, { opacity: 0 })}>Off</text>
              <text x={x + 16} y={y + 71} fontSize="11" fill="#fff" fillOpacity="0.6" style={play(`dh-lv${i}`, T, { opacity: light.dimmed ? 0 : 1 })}>{light.level}</text>
              {light.dimmed && (
                <text x={x + 16} y={y + 71} fontSize="11" fill="#fff" fillOpacity="0.6" style={play(`dh-dm${i}`, T, { opacity: 1 })}>{light.dimmed}</text>
              )}
            </g>
          );
        })}

        {/* Scene buttons; Relax gets tapped to start the loop */}
        {scenesRow.map((name, i) => (
          <g key={name}>
            <rect x={368 + i * 112} y="300" width="104" height="36" rx="18" fill="#fff" fillOpacity="0.08" />
            {name === 'Relax' && (
              <rect x={368 + i * 112} y="300" width="104" height="36" rx="18" fill="#7dd3fc" style={play('dh-press', T, { opacity: 0 })} />
            )}
            <text x={368 + i * 112 + 52} y="322" fontSize="12" fill="#fff" textAnchor="middle">{name}</text>
          </g>
        ))}

        {/* The assistant */}
        <g style={play('dh-bubble', T, { opacity: 1 })}>
          <rect x="368" y="346" width="440" height="48" rx="24" fill="#fff" fillOpacity="0.1" />
          <path d="M390 356 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" fill="#7dd3fc" />
          <clipPath id="dh-typing">
            <rect x="410" y="352" width="200" height="20" style={play('dh-type', T, fromLeft)} />
          </clipPath>
          <text x="410" y="366" fontSize="12" fill="#fff" clipPath="url(#dh-typing)">“Dim the kitchen to 30%”</text>
          <text x="410" y="384" fontSize="11" fill="#86efac" style={play('dh-reply', T, { opacity: 1 })}>Adjusted Pendants and Under Cabinet.</text>
        </g>

        {/* Idle: the night clock */}
        <g style={play('dh-night', T, { opacity: 0 })}>
          <rect x="136" y="32" width="688" height="376" fill="#000" />
          <g style={play('dh-drift', T)}>
            <text x="480" y="246" fontSize="120" fontWeight="200" fill="#ff8c59" fillOpacity="0.65" textAnchor="middle">9:42</text>
            <text x="480" y="284" fontSize="16" fill="#ff8c59" fillOpacity="0.5" textAnchor="middle">Friday, October 9 · 64°</text>
          </g>
        </g>
      </g>
    </g>
  );
  return { css, svg };
}

// ---------------------------------------------------------------------------
// HumanAuth: landmarks on a face in the webcam feed, the six checks passing.
// ---------------------------------------------------------------------------

function humanAuth() {
  const T = 10;
  const ring = (cx: number, cy: number, rx: number, ry: number, n: number, start = 0, end = 2 * Math.PI) =>
    Array.from({ length: n }, (_, i) => {
      const t = start + ((end - start) * i) / (end - start === 2 * Math.PI ? n : n - 1);
      return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)] as [number, number];
    });
  const round = (points: [number, number][]) => points.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as [number, number]);

  const oval = round(ring(300, 222, 100, 128, 32));
  const leftEye = round(ring(262, 200, 20, 8, 8));
  const rightEye = round(ring(338, 200, 20, 8, 8));
  const leftBrow = round(ring(262, 192, 26, 14, 5, Math.PI * 1.1, Math.PI * 1.9));
  const rightBrow = round(ring(338, 192, 26, 14, 5, Math.PI * 1.1, Math.PI * 1.9));
  const nose: [number, number][] = [[300, 204], [300, 222], [300, 240], [288, 254], [300, 258], [312, 254]];
  const mouth = round(ring(300, 292, 32, 10, 10));
  const lips = round(ring(300, 292, 20, 3, 6));
  const mesh: [number, number][][] = [
    [leftBrow[0], oval[18]], [rightBrow[4], oval[30]],
    [leftEye[0], nose[0]], [rightEye[4], nose[0]],
    [nose[3], mouth[5]], [nose[5], mouth[0]],
    [mouth[5], oval[11]], [mouth[0], oval[5]],
    [leftEye[4], oval[17]], [rightEye[0], oval[31]],
    [nose[2], leftEye[2]], [nose[2], rightEye[2]],
    [mouth[7], oval[8]], [mouth[2], oval[8]],
  ];
  const poly = (points: [number, number][], closed: boolean) =>
    `M${points.map(([x, y]) => `${x} ${y}`).join(' L')}${closed ? 'Z' : ''}`;
  const contours = [
    poly(oval, true), poly(leftEye, true), poly(rightEye, true), poly(leftBrow, false), poly(rightBrow, false),
    poly(nose, false), poly(mouth, true), poly(lips, true), ...mesh.map((line) => poly(line, false)),
  ];
  const features = [...leftEye, ...rightEye];
  const rest = [...oval, ...leftBrow, ...rightBrow, ...nose, ...mouth];

  const checks = ['Micro-movement', '3D facial consistency', 'Blink pattern', 'Texture analysis', 'Gesture challenge', 'Hand tracking'];
  const css = [
    fade('ha-mesh', [2, 8, 92, 98]),
    keyframes('ha-scan', [[0, 'transform:translateY(0);opacity:0'], [3, 'opacity:1'], [42, 'transform:translateY(290px);opacity:1'], [46, 'transform:translateY(290px);opacity:0'], [100, 'transform:translateY(290px);opacity:0']]),
    keyframes('ha-blink', [[0, 'transform:scaleY(1)'], [34, 'transform:scaleY(1)'], [35.5, 'transform:scaleY(.1)'], [37, 'transform:scaleY(1)'], [100, 'transform:scaleY(1)']]),
    keyframes('ha-move', [[0, 'transform:translate(0,0)'], [20, 'transform:translate(3px,-2px)'], [45, 'transform:translate(-2px,2px)'], [70, 'transform:translate(2px,1px)'], [100, 'transform:translate(0,0)']]),
    fade('ha-pass', [70, 74, 92, 98]),
    ...checks.flatMap((_, i) => [fade(`ha-ok${i}`, [12 + i * 9, 14 + i * 9, 92, 98]), hide(`ha-wait${i}`, [12 + i * 9, 14 + i * 9, 92, 98])]),
  ];

  const svg = (
    <g>
      <defs>
        <clipPath id="ha-feed">
          <rect x="110" y="24" width="380" height="392" rx="20" />
        </clipPath>
        <linearGradient id="ha-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5eead4" stopOpacity="0" />
          <stop offset="1" stopColor="#5eead4" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Webcam feed */}
      <g clipPath="url(#ha-feed)">
        <rect x="110" y="24" width="380" height="392" fill="#0b0f14" />
        <g style={play('ha-move', T)}>
          {/* A soft silhouette under the landmarks */}
          <ellipse cx="300" cy="222" rx="100" ry="128" fill="#fff" fillOpacity="0.04" />
          <path d="M175 416 C190 352 238 340 300 340 C362 340 410 352 425 416Z" fill="#fff" fillOpacity="0.04" />
          <g style={play('ha-mesh', T, { opacity: 1 })}>
            {contours.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#5eead4" strokeOpacity={i < 8 ? 0.5 : 0.22} strokeWidth="1" />
            ))}
            {rest.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.2" fill="#5eead4" />
            ))}
            <g style={play('ha-blink', T, fromCenter)}>
              {features.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.2" fill="#5eead4" />
              ))}
            </g>
          </g>
        </g>
        <g style={play('ha-scan', T, { opacity: 0 })}>
          <rect x="110" y="42" width="380" height="40" fill="url(#ha-beam)" />
          <rect x="110" y="81" width="380" height="2" fill="#5eead4" />
        </g>
        <circle cx="136" cy="50" r="5" fill="#ef4444" />
        <text x="148" y="54" fontSize="11" fill="#fff" fillOpacity="0.7" letterSpacing="1">LIVE · WEBSOCKET</text>
      </g>
      {/* Viewfinder corners */}
      <path d="M180 76 v-20 h20 M420 56 h20 v20 M440 370 v20 h-20 M200 390 h-20 v-20" fill="none" stroke="var(--accent)" strokeWidth="3" />

      {/* Checks */}
      <rect x="520.5" y="24.5" width="329" height="391" rx="20" className="fill-card stroke-border" />
      <text x="548" y="62" fontSize="11" letterSpacing="1.5" className="fill-muted">LIVENESS CHECKS</text>
      {checks.map((check, i) => {
        const y = 100 + i * 44;
        return (
          <g key={check}>
            <circle cx="558" cy={y} r="9" fill="none" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-muted" style={play(`ha-wait${i}`, T, { opacity: 0 })} />
            <g style={play(`ha-ok${i}`, T, { opacity: 1 })}>
              <circle cx="558" cy={y} r="10" className="fill-signal" />
              <path d={`M553 ${y} l3.5 3.5 6.5 -7`} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-background" />
            </g>
            <text x="580" y={y + 5} fontSize="14" className="fill-foreground">{check}</text>
          </g>
        );
      })}
      <g style={play('ha-pass', T, { opacity: 1 })}>
        <rect x="548" y="360" width="274" height="36" rx="18" className="fill-signal" />
        <text x="685" y="383" fontSize="13" fontWeight="700" textAnchor="middle" className="fill-background">Human verified · 3.3s</text>
      </g>
    </g>
  );
  return { css, svg };
}

// ---------------------------------------------------------------------------
// Barcode WebApp: the camera finds a barcode, decodes it, and looks it up.
// ---------------------------------------------------------------------------

/** Encodes 13 digits as EAN-13 modules ("1" is a bar), so the bars are real. */
function ean13(code: string) {
  const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
  const G = L.map((bits) => [...bits].reverse().map((b) => (b === '1' ? '0' : '1')).join(''));
  const R = L.map((bits) => [...bits].map((b) => (b === '1' ? '0' : '1')).join(''));
  const parity = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLL', 'LGLLGL', 'LGLGGL'];
  const digits = [...code].map(Number);
  const left = digits.slice(1, 7).map((d, i) => (parity[digits[0]][i] === 'L' ? L : G)[d]).join('');
  const right = digits.slice(7).map((d) => R[d]).join('');
  return `101${left}01010${right}101`;
}

function barcode() {
  const T = 9;
  const code = '4006381333931';
  const modules = ean13(code);
  const guards = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);
  const bars: { x: number; width: number; long: boolean }[] = [];
  for (let i = 0; i < modules.length; i++) {
    if (modules[i] !== '1') continue;
    const last = bars[bars.length - 1];
    if (last && last.x + last.width === 235 + i * 2 && last.long === guards.has(i)) last.width += 2;
    else bars.push({ x: 235 + i * 2, width: 2, long: guards.has(i) });
  }

  const css = [
    keyframes('bc-laser', [[0, 'transform:translateY(0);opacity:1'], [10, 'transform:translateY(140px)'], [20, 'transform:translateY(0)'], [30, 'transform:translateY(140px)'], [38, 'transform:translateY(70px);opacity:1'], [40, 'transform:translateY(70px);opacity:0'], [100, 'transform:translateY(70px);opacity:0']]),
    fade('bc-box', [38, 41, 92, 97]),
    fade('bc-code', [42, 44, 92, 97]),
    type('bc-type', [44, 54]),
    fade('bc-valid', [55, 57, 92, 97]),
    fade('bc-item', [60, 64, 92, 97]),
  ];

  const rows = [
    ['Item', 'Sparkling Water, 12 pk'],
    ['Price', '$5.49'],
    ['Aisle', '7'],
    ['In stock', '24'],
  ];

  const svg = (
    <g>
      <defs>
        <clipPath id="bc-camera">
          <rect x="120" y="78" width="420" height="326" rx="12" />
        </clipPath>
      </defs>

      {/* Browser window */}
      <rect x="100.5" y="20.5" width="759" height="399" rx="14" className="fill-background stroke-border" />
      <circle cx="124" cy="42" r="5" fill="#ff5f57" />
      <circle cx="140" cy="42" r="5" fill="#febc2e" />
      <circle cx="156" cy="42" r="5" fill="#28c840" />
      <rect x="200" y="32" width="440" height="20" rx="10" className="fill-card" />
      <text x="216" y="46" fontSize="11" className="fill-muted">grocerybarcodescanner.onrender.com</text>
      <line x1="100" y1="62" x2="860" y2="62" className="stroke-border" />

      {/* Camera */}
      <g clipPath="url(#bc-camera)">
        <rect x="120" y="78" width="420" height="326" fill="#0b0f14" />
        <g transform="rotate(-6 330 240)">
          <rect x="215" y="170" width="230" height="140" rx="8" fill="#f4f3ec" />
          {bars.map((bar) => (
            <rect key={bar.x} x={bar.x} y="184" width={bar.width} height={bar.long ? 96 : 88} fill="#111" />
          ))}
          <text x="226" y="294" fontSize="12" fill="#111" fontFamily="var(--font-mono)">{code[0]}</text>
          <text x="283" y="294" fontSize="12" fill="#111" textAnchor="middle" letterSpacing="3" fontFamily="var(--font-mono)">{code.slice(1, 7)}</text>
          <text x="377" y="294" fontSize="12" fill="#111" textAnchor="middle" letterSpacing="3" fontFamily="var(--font-mono)">{code.slice(7)}</text>
          {/* Detection */}
          <g style={play('bc-box', T, { opacity: 1 })}>
            <rect x="219" y="178" width="218" height="124" rx="4" fill="#4ade80" fillOpacity="0.1" stroke="#4ade80" strokeWidth="3" />
            <rect x="219" y="156" width="104" height="20" rx="3" fill="#4ade80" />
            <text x="227" y="170" fontSize="11" fontWeight="700" fill="#0b0f14">barcode 0.93</text>
          </g>
        </g>
        <g style={play('bc-laser', T, { opacity: 0 })}>
          <rect x="140" y="160" width="380" height="2" fill="#ff3b30" />
          <rect x="140" y="156" width="380" height="10" fill="#ff3b30" fillOpacity="0.2" />
        </g>
        <circle cx="140" cy="98" r="5" fill="#ef4444" />
        <text x="152" y="102" fontSize="11" fill="#fff" fillOpacity="0.7" letterSpacing="1">CAMERA</text>
      </g>
      <path d="M190 150 v-20 h20 M450 130 h20 v20 M470 330 v20 h-20 M210 350 h-20 v-20" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" />

      {/* Result */}
      <text x="564" y="100" fontSize="11" letterSpacing="1.5" className="fill-muted">DECODED</text>
      <clipPath id="bc-typing">
        <rect x="564" y="106" width="272" height="32" style={play('bc-type', T, fromLeft)} />
      </clipPath>
      <g style={play('bc-code', T, { opacity: 1 })} clipPath="url(#bc-typing)">
        <text x="564" y="130" fontSize="22" fontWeight="700" className="fill-foreground">
          {`${code[0]} ${code.slice(1, 7)} ${code.slice(7)}`}
        </text>
      </g>
      <text x="564" y="152" fontSize="11" className="fill-signal" style={play('bc-valid', T, { opacity: 1 })}>EAN-13 · check digit valid</text>
      <g style={play('bc-item', T, { opacity: 1 })}>
        <rect x="564.5" y="176.5" width="271" height="160" rx="10" className="fill-card stroke-border" />
        <text x="582" y="202" fontSize="11" letterSpacing="1.5" className="fill-muted">INVENTORY MATCH</text>
        {rows.map(([label, value], i) => (
          <g key={label}>
            <text x="582" y={232 + i * 26} fontSize="13" className="fill-muted">{label}</text>
            <text x="818" y={232 + i * 26} fontSize="13" textAnchor="end" className="fill-foreground">{value}</text>
          </g>
        ))}
        <text x="564" y="360" fontSize="11" className="fill-muted">inventory.db · SQLite, loaded from Excel</text>
      </g>
    </g>
  );
  return { css, svg };
}
