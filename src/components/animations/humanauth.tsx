import { keyframes, fade, hide, play, fromCenter, type Scene } from './kit';

// ---------------------------------------------------------------------------
// HumanAuth: landmarks on a face in the webcam feed, the six checks passing.
// ---------------------------------------------------------------------------

export default function humanAuth(): Scene {
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

