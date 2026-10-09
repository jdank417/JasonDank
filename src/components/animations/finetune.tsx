import { draw, drawn, fade, hide, keyframes, play, typeOut, fromLeft, type Scene } from './kit';

// ---------------------------------------------------------------------------
// Flan-T5 fine-tuning: instruction records stream into the model, the loss
// comes down over three epochs, and the rules assistant answers a question.
// ---------------------------------------------------------------------------

const RECORDS = [
  ['Who keeps clear?', 'Port vs starboard', 'Port. Rule 10'],
  ['Who gets mark-room?', 'Overlapped at zone', 'Inside boat. Rule 18'],
  ['Same tack, overlap?', 'Windward/leeward', 'Windward. Rule 11'],
  ['I touched a mark?', 'Rounding the mark', 'One turn. Rule 31'],
];
const ANSWER = ['Rule 10: on opposite tacks, a', 'port-tack boat shall keep clear', 'of a starboard-tack boat.'];

export default function finetune(): Scene {
  const T = 14;
  const SCROLL = 12;
  const lineHeight = 17;
  const lines = RECORDS.flatMap(([instruction, context, output]) => [
    '{',
    `  "instruction": "${instruction}",`,
    `  "context": "${context}",`,
    `  "output": "${output}"`,
    '},',
  ]);
  const block = lines.length * lineHeight;

  // A decaying, slightly noisy loss curve across the chart.
  const points = Array.from({ length: 49 }, (_, i) => {
    const t = i / 48;
    const loss = 0.12 + 0.82 * Math.exp(-3.4 * t) + 0.035 * Math.sin(i * 1.9) * (1 - t);
    return [372 + t * 232, 392 - loss * 118] as const;
  });
  const curve = `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`;

  const css = [
    keyframes('ft-scroll', [[0, 'transform:translateY(0)'], [100, `transform:translateY(-${block}px)`]]),
    draw('ft-loss', [4, 58, 94, 99]),
    hide('ft-e1', [22, 24, 98, 100]),
    fade('ft-e2', [22, 24, 40, 42]),
    fade('ft-e3', [40, 42, 94, 98]),
    keyframes('ft-layer', [[0, 'opacity:.25'], [12, 'opacity:1'], [30, 'opacity:.25'], [100, 'opacity:.25']]),
    fade('ft-q', [60, 62, 94, 98]),
    fade('ft-thinking', [62, 63, 66, 67]),
    fade('ft-a', [66, 67, 94, 98]),
    ...ANSWER.map((_, i) => typeOut(`ft-type${i}`, [67 + i * 5, 72 + i * 5])),
    fade('ft-done', [59, 61, 94, 98]),
  ];

  const svg = (
    <g>
      <defs>
        <clipPath id="ft-json">
          <rect x="40" y="62" width="280" height="340" />
        </clipPath>
        {ANSWER.map((_, i) => (
          <clipPath key={i} id={`ft-line${i}`}>
            <rect x="676" y={222 + i * 20} width="230" height="20" style={play(`ft-type${i}`, T, fromLeft)} />
          </clipPath>
        ))}
      </defs>

      {/* Training data */}
      <rect x="40.5" y="24.5" width="279" height="391" rx="16" className="fill-background stroke-border" />
      <text x="60" y="50" fontSize="11" letterSpacing="1.2" className="fill-muted">train.json</text>
      <line x1="40" x2="320" y1="62" y2="62" className="stroke-border" />
      <g clipPath="url(#ft-json)">
        <g style={play('ft-scroll', SCROLL, {}, 'linear')}>
          {[0, 1].flatMap((copy) =>
            lines.map((line, i) => {
              const [key, ...rest] = line.split(':');
              const y = 84 + (copy * lines.length + i) * lineHeight;
              return rest.length ? (
                <text key={`${copy}-${i}`} x="56" y={y} fontSize="10" xmlSpace="preserve">
                  <tspan fill="var(--accent)">{key}:</tspan>
                  <tspan className="fill-foreground">{rest.join(':')}</tspan>
                </text>
              ) : (
                <text key={`${copy}-${i}`} x="56" y={y} fontSize="10" className="fill-muted">{line}</text>
              );
            }),
          )}
        </g>
      </g>

      {/* Model and loss */}
      <path d="M320 140 H352" strokeWidth="2" strokeDasharray="4 4" className="stroke-muted" />
      <rect x="352.5" y="24.5" width="271" height="391" rx="16" className="fill-card stroke-border" />
      <text x="372" y="50" fontSize="11" letterSpacing="1.2" className="fill-muted">FINE-TUNING FLAN-T5</text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={372 + (i % 2) * 6}
          y={70 + i * 20}
          width="226"
          height="14"
          rx="4"
          fill="var(--accent)"
          style={play('ft-layer', 2.4, { opacity: 0.25, animationDelay: `${i * 0.18}s` })}
        />
      ))}
      <text x="372" y="214" fontSize="10" letterSpacing="1.2" className="fill-muted">TRAINING LOSS</text>
      <g fontSize="12" fontWeight="700" className="fill-foreground">
        <text x="604" y="214" textAnchor="end" style={play('ft-e1', T, { opacity: 0 })}>epoch 1/3</text>
        <text x="604" y="214" textAnchor="end" style={play('ft-e2', T, { opacity: 0 })}>epoch 2/3</text>
        <text x="604" y="214" textAnchor="end" style={play('ft-e3', T, { opacity: 1 })}>epoch 3/3</text>
      </g>
      <line x1="372" x2="604" y1="392" y2="392" className="stroke-border" />
      <line x1="372" x2="372" y1="230" y2="392" className="stroke-border" />
      {[449, 527].map((x) => (
        <line key={x} x1={x} x2={x} y1="230" y2="392" strokeDasharray="2 4" className="stroke-border" />
      ))}
      <path d={curve} pathLength={1} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" style={drawn('ft-loss', T)} />

      {/* The assistant */}
      <path d="M624 140 H656" strokeWidth="2" strokeDasharray="4 4" className="stroke-muted" />
      <rect x="656.5" y="24.5" width="267" height="391" rx="16" className="fill-background stroke-border" />
      <text x="676" y="50" fontSize="11" letterSpacing="1.2" className="fill-muted">SAILING RULES ASSISTANT</text>
      <text x="676" y="68" fontSize="10" className="fill-muted">Racing Rules of Sailing 2025–2028</text>
      <g style={play('ft-done', T, { opacity: 1 })}>
        <rect x="676" y="84" width="96" height="20" rx="10" className="fill-signal" fillOpacity="0.18" />
        <text x="724" y="98" fontSize="10" fontWeight="700" textAnchor="middle" className="fill-signal">model ready</text>
      </g>
      <g style={play('ft-q', T, { opacity: 1 })}>
        <rect x="700" y="120" width="208" height="72" rx="14" fill="var(--accent)" fillOpacity="0.18" />
        <text x="714" y="142" fontSize="11" className="fill-foreground">I’m on port, they’re on</text>
        <text x="714" y="160" fontSize="11" className="fill-foreground">starboard and converging.</text>
        <text x="714" y="178" fontSize="11" className="fill-foreground">Who keeps clear?</text>
      </g>
      <g style={play('ft-thinking', T, { opacity: 0 })}>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={692 + i * 12} cy="226" r="3.5" className="fill-muted" />
        ))}
      </g>
      <g style={play('ft-a', T, { opacity: 1 })}>
        <rect x="668" y="210" width="240" height="84" rx="14" className="fill-card stroke-border" />
        {ANSWER.map((line, i) => (
          <text key={i} x="682" y={236 + i * 20} fontSize="11" className="fill-foreground" clipPath={`url(#ft-line${i})`}>
            {line}
          </text>
        ))}
      </g>
    </g>
  );
  return { css, svg };
}
