import { fade, hide, fromBottom, fromLeft, keyframes, play, typeOut, SYSTEM_FONT, type Scene } from './kit';

// ---------------------------------------------------------------------------
// Remote compute: a laptop anywhere reaches the ZBook over Tailscale, into
// WSL2, where a container trains on the GPU, and nothing shuts down idle.
// ---------------------------------------------------------------------------

const TERMINAL: { text: string; prompt?: boolean; dim?: boolean }[] = [
  { text: 'ssh jason@zbook', prompt: true },
  { text: 'Welcome to Ubuntu on WSL2 · reached over Tailscale', dim: true },
  { text: 'nvidia-smi --query-gpu=name,utilization.gpu --format=csv', prompt: true },
  { text: 'NVIDIA RTX A3000 Laptop GPU, 0 %', dim: true },
  { text: 'docker compose run --gpus all trainer', prompt: true },
];

export default function compute(): Scene {
  const T = 14;
  const TUNNEL = 2.4;
  const lineAt = (i: number) => 4 + i * 11;
  const css = [
    keyframes('rc-packet', [[0, 'transform:translateX(0);opacity:0'], [10, 'opacity:1'], [90, 'opacity:1'], [100, 'transform:translateX(300px);opacity:0']]),
    ...TERMINAL.flatMap((line, i) => [
      fade(`rc-line${i}`, [lineAt(i), lineAt(i) + 0.5, 94, 98]),
      typeOut(`rc-type${i}`, [lineAt(i), lineAt(i) + (line.prompt ? 6 : 1)]),
    ]),
    fade('rc-train', [60, 61, 94, 98]),
    keyframes('rc-progress', [[0, 'transform:scaleX(0)'], [61, 'transform:scaleX(0)'], [93, 'transform:scaleX(1)'], [100, 'transform:scaleX(1)']]),
    keyframes('rc-gpu', [[0, 'transform:scaleY(.15)'], [60, 'transform:scaleY(.15)'], [65, 'transform:scaleY(.97)'], [94, 'transform:scaleY(.97)'], [98, 'transform:scaleY(.15)'], [100, 'transform:scaleY(.15)']]),
    keyframes('rc-bar', [[0, 'transform:scaleY(.5)'], [50, 'transform:scaleY(1)'], [100, 'transform:scaleY(.5)']]),
    fade('rc-active', [60, 62, 94, 98]),
    hide('rc-idle', [60, 62, 94, 98]),
  ];

  const svg = (
    <g>
      <defs>
        {TERMINAL.map((_, i) => (
          <clipPath key={i} id={`rc-clip${i}`}>
            <rect x="80" y={276 + i * 22} width="820" height="20" style={play(`rc-type${i}`, T, fromLeft)} />
          </clipPath>
        ))}
      </defs>

      {/* The laptop */}
      <g fontFamily={SYSTEM_FONT}>
        <rect x="70" y="58" width="150" height="96" rx="8" className="fill-card stroke-border" strokeWidth="2" />
        <rect x="80" y="68" width="130" height="76" rx="3" fill="#0b0f14" />
        <text x="90" y="88" fontSize="9" fill="#5eead4" fontFamily="var(--font-mono)">$ ssh zbook</text>
        <path d="M52 154 H238 L226 166 H64 Z" className="fill-border" />
        <text x="145" y="194" fontSize="12" textAnchor="middle" className="fill-muted">Anywhere</text>
      </g>

      {/* The tunnel */}
      <rect x="252" y="96" width="320" height="28" rx="14" fill="var(--accent)" fillOpacity="0.12" />
      <line x1="262" x2="562" y1="110" y2="110" strokeDasharray="6 6" strokeWidth="2" stroke="var(--accent)" strokeOpacity="0.6" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="258"
          y="105"
          width="14"
          height="10"
          rx="3"
          fill="var(--accent)"
          style={play('rc-packet', TUNNEL, { opacity: 0, animationDelay: `${(-i * TUNNEL) / 3}s` }, 'linear')}
        />
      ))}
      <text x="412" y="150" fontSize="12" textAnchor="middle" className="fill-foreground">Tailscale · WireGuard tunnel</text>
      <text x="412" y="168" fontSize="11" textAnchor="middle" className="fill-muted">persistent SSH, no open ports</text>

      {/* The ZBook */}
      <rect x="590.5" y="24.5" width="329" height="220" rx="14" className="fill-card stroke-border" />
      <text x="608" y="48" fontSize="11" letterSpacing="1.2" className="fill-muted">HP ZBOOK FURY · WINDOWS</text>
      <rect x="606.5" y="60.5" width="297" height="168" rx="10" className="fill-background stroke-border" />
      <text x="622" y="82" fontSize="11" letterSpacing="1.2" className="fill-muted">WSL2 · UBUNTU</text>
      <g>
        <rect x="622" y="94" width="150" height="56" rx="8" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeOpacity="0.5" />
        <text x="634" y="116" fontSize="12" fontWeight="700" className="fill-foreground">docker: trainer</text>
        <text x="634" y="134" fontSize="11" className="fill-muted" style={play('rc-idle', T, { opacity: 0 })}>idle</text>
        <text x="634" y="134" fontSize="11" className="fill-signal" style={play('rc-active', T, { opacity: 1 })}>training…</text>
      </g>
      <g>
        <rect x="786" y="94" width="104" height="120" rx="8" fill="#76b900" fillOpacity="0.12" stroke="#76b900" strokeOpacity="0.6" />
        <text x="838" y="114" fontSize="11" fontWeight="700" textAnchor="middle" className="fill-foreground">RTX A3000</text>
        <rect x="806" y="124" width="64" height="70" rx="4" className="fill-border" />
        <rect x="806" y="124" width="64" height="70" rx="4" fill="#76b900" style={play('rc-gpu', T, { ...fromBottom, transform: 'scaleY(.97)' })} />
        <text x="838" y="208" fontSize="10" textAnchor="middle" className="fill-muted">CUDA</text>
      </g>
      <g>
        <text x="622" y="174" fontSize="11" className="fill-muted">idle shutdowns</text>
        <text x="772" y="174" fontSize="11" fontWeight="700" textAnchor="end" className="fill-signal">0</text>
        <text x="622" y="194" fontSize="11" className="fill-muted">keep-alive</text>
        <text x="772" y="194" fontSize="11" fontWeight="700" textAnchor="end" className="fill-signal">on</text>
        <text x="622" y="214" fontSize="11" className="fill-muted">GPU passthrough</text>
        <text x="772" y="214" fontSize="11" fontWeight="700" textAnchor="end" className="fill-signal">ready</text>
      </g>

      {/* Terminal */}
      <rect x="60" y="256" width="860" height="168" rx="12" fill="#0b0f14" />
      {TERMINAL.map((line, i) => (
        <text
          key={i}
          x="80"
          y={290 + i * 22}
          fontSize="13"
          fill={line.dim ? '#94a3b8' : '#e2e8f0'}
          clipPath={`url(#rc-clip${i})`}
          style={play(`rc-line${i}`, T, { opacity: 1 })}
          xmlSpace="preserve"
        >
          {line.prompt && <tspan fill="#5eead4">$ </tspan>}
          {line.text}
        </text>
      ))}
      <g style={play('rc-train', T, { opacity: 1 })}>
        <text x="80" y="402" fontSize="13" fill="#e2e8f0">epoch 2/3</text>
        <rect x="170" y="392" width="600" height="12" rx="6" fill="#fff" fillOpacity="0.1" />
        <rect x="170" y="392" width="600" height="12" rx="6" fill="#5eead4" style={play('rc-progress', T, { ...fromLeft, transform: 'scaleX(.64)' })} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={790 + i * 10} y="390" width="6" height="16" rx="2" fill="#76b900" style={play('rc-bar', 0.6 + i * 0.15, { ...fromBottom, animationDelay: `${-i * 0.2}s` })} />
        ))}
      </g>
    </g>
  );
  return { css, svg };
}
