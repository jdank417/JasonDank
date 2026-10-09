import { fade, keyframes, play, SYSTEM_FONT, type Scene } from './kit';

// ---------------------------------------------------------------------------
// HUIT ChatBot: a new hire asks a question in the customtkinter window, and it
// runs through fuzzy search, BERT embeddings and entity recognition to the
// right knowledge base article.
// ---------------------------------------------------------------------------

const STAGES = [
  { name: 'Fuzzy search', detail: 'catches typos and near-matches' },
  { name: 'BERT embeddings', detail: 'matches meaning, not just words' },
  { name: 'Named entities', detail: 'DELL · ORG' },
];
const ARTICLES = ['Printer setup', 'VPN setup', 'Dell repairs', 'Password resets', 'Imaging a Mac'];
const MATCH = 2;

export default function chatbot(): Scene {
  const T = 12;
  const stageAt = (i: number) => 16 + i * 6;
  const css = [
    keyframes('hc-ask', [
      [0, 'opacity:0;transform:translateY(10px)'],
      [6, 'opacity:0;transform:translateY(10px)'],
      [9, 'opacity:1;transform:translateY(0)'],
      [93, 'opacity:1;transform:translateY(0)'],
      [97, 'opacity:0;transform:translateY(0)'],
      [100, 'opacity:0;transform:translateY(10px)'],
    ]),
    fade('hc-typing', [11, 12, 37, 38]),
    keyframes('hc-dot', [[0, 'opacity:.25'], [30, 'opacity:1'], [60, 'opacity:.25'], [100, 'opacity:.25']]),
    keyframes('hc-flow', [[0, 'transform:translateY(0);opacity:0'], [12, 'opacity:0'], [13, 'opacity:1'], [34, 'transform:translateY(222px);opacity:1'], [36, 'transform:translateY(222px);opacity:0'], [100, 'transform:translateY(222px);opacity:0']]),
    ...STAGES.map((_, i) => fade(`hc-stage${i}`, [stageAt(i), stageAt(i) + 2, 93, 97])),
    fade('hc-match', [36, 38, 93, 97]),
    keyframes('hc-answer', [
      [0, 'opacity:0;transform:translateY(10px)'],
      [38, 'opacity:0;transform:translateY(10px)'],
      [41, 'opacity:1;transform:translateY(0)'],
      [93, 'opacity:1;transform:translateY(0)'],
      [97, 'opacity:0;transform:translateY(0)'],
      [100, 'opacity:0;transform:translateY(10px)'],
    ]),
  ];

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      {/* The chat window, customtkinter dark */}
      <rect x="40" y="24" width="480" height="392" rx="12" fill="#242424" />
      <rect x="40" y="24" width="480" height="34" rx="12" fill="#2f2f2f" />
      <rect x="40" y="46" width="480" height="12" fill="#2f2f2f" />
      <text x="280" y="46" fontSize="12" fontWeight="600" fill="#dce4ee" textAnchor="middle">HUIT Training ChatBot</text>
      <rect x="56" y="70" width="448" height="282" rx="8" fill="#1d1e1e" />

      <g style={play('hc-ask', T, { opacity: 1 })}>
        <rect x="244" y="86" width="244" height="40" rx="12" fill="#1f6aa5" />
        <text x="260" y="111" fontSize="13" fill="#fff">Where do I send Dell repairs?</text>
      </g>
      <g style={play('hc-typing', T, { opacity: 0 })}>
        <rect x="72" y="142" width="64" height="32" rx="12" fill="#333" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={90 + i * 14} cy="158" r="4" fill="#dce4ee" style={play('hc-dot', 1, { opacity: 0.25, animationDelay: `${i * 0.2}s` })} />
        ))}
      </g>
      <g style={play('hc-answer', T, { opacity: 1 })}>
        <rect x="72" y="142" width="300" height="40" rx="12" fill="#333" />
        <text x="88" y="167" fontSize="13" fill="#dce4ee">Here’s the Dell repair process:</text>
        <rect x="72" y="192" width="300" height="78" rx="12" fill="#2b2b2b" stroke="#1f6aa5" strokeWidth="1.5" />
        <text x="88" y="214" fontSize="10" fontWeight="700" letterSpacing="1.2" fill="#8fb8de">KNOWLEDGE BASE</text>
        <text x="88" y="236" fontSize="14" fontWeight="700" fill="#fff">Dell repair process</text>
        <text x="88" y="256" fontSize="11" fill="#9aa4ae">written up by past technicians</text>
      </g>

      <rect x="56" y="364" width="370" height="36" rx="8" fill="#343638" stroke="#565b5e" />
      <text x="70" y="387" fontSize="12" fill="#9aa4ae">Ask a question…</text>
      <rect x="434" y="364" width="70" height="36" rx="8" fill="#1f6aa5" />
      <text x="469" y="387" fontSize="12" fontWeight="600" fill="#fff" textAnchor="middle">Send</text>

      {/* The pipeline */}
      <text x="560" y="44" fontSize="11" letterSpacing="1.2" className="fill-muted">HOW IT FINDS THE ANSWER</text>
      <line x1="580" x2="580" y1="72" y2="300" strokeDasharray="3 5" strokeWidth="2" className="stroke-border" />
      <circle cx="580" cy="78" r="6" style={play('hc-flow', T, { opacity: 0 })} fill="var(--accent)" />
      {STAGES.map((stage, i) => {
        const y = 66 + i * 70;
        return (
          <g key={stage.name}>
            <rect x="560.5" y={y + 0.5} width="359" height="56" rx="12" className="fill-card stroke-border" />
            <rect x="560.5" y={y + 0.5} width="359" height="56" rx="12" fill="var(--accent)" fillOpacity="0.14" stroke="var(--accent)" style={play(`hc-stage${i}`, T, { opacity: 1 })} />
            <circle cx="580" cy={y + 28} r="7" className="fill-background stroke-border" />
            <circle cx="580" cy={y + 28} r="4" fill="var(--accent)" style={play(`hc-stage${i}`, T, { opacity: 1 })} />
            <text x="600" y={y + 25} fontSize="14" fontWeight="700" className="fill-foreground">{stage.name}</text>
            <text x="600" y={y + 43} fontSize="11" className="fill-muted">{stage.detail}</text>
          </g>
        );
      })}
      <text x="560" y="294" fontSize="11" letterSpacing="1.2" className="fill-muted">KNOWLEDGE BASE</text>
      {ARTICLES.map((article, i) => {
        const x = 560 + (i % 3) * 122;
        const y = 306 + Math.floor(i / 3) * 52;
        return (
          <g key={article}>
            <rect x={x + 0.5} y={y + 0.5} width="113" height="42" rx="8" className="fill-card stroke-border" />
            {i === MATCH && (
              <g style={play('hc-match', T, { opacity: 1 })}>
                <rect x={x + 0.5} y={y + 0.5} width="113" height="42" rx="8" className="fill-signal" fillOpacity="0.16" stroke="var(--signal)" strokeWidth="2" />
                <text x={x + 106} y={y + 15} fontSize="9" fontWeight="700" textAnchor="end" className="fill-signal">best match</text>
              </g>
            )}
            <text x={x + 10} y={y + 31} fontSize="10.5" className="fill-foreground">{article}</text>
          </g>
        );
      })}
    </g>
  );
  return { css, svg };
}
