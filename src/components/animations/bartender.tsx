import { fade, keyframes, play, SYSTEM_FONT, type Scene } from './kit';

// ---------------------------------------------------------------------------
// Bartender-GPT: stock the liquor cabinet, see what you can make, pour it, and
// put what another drink is missing on the grocery list.
// ---------------------------------------------------------------------------

const BOTTLES = [
  { name: 'Tequila', color: '#f5d77a' },
  { name: 'Gin', color: '#bfe3f2' },
  { name: 'Vodka', color: '#e5e7eb' },
  { name: 'Rum', color: '#c58b4e' },
  { name: 'Bourbon', color: '#a5531f' },
];
const DRINKS = [
  { name: 'Margarita', detail: 'Tequila · triple sec · lime' },
  { name: 'Old Fashioned', detail: 'Bourbon · bitters · sugar' },
  { name: 'Negroni', detail: 'Needs Campari', missing: true },
];
const POURS = [
  { label: '2 oz tequila', level: 86, at: 34 },
  { label: '1 oz lime juice', level: 46, at: 44 },
  { label: '¾ oz triple sec', level: 14, at: 54 },
];

export default function bartender(): Scene {
  const T = 13;
  const css = [
    ...BOTTLES.map((_, i) => fade(`bt-has${i}`, [3 + i * 3, 5 + i * 3, 93, 97])),
    ...DRINKS.map((_, i) => keyframes(`bt-drink${i}`, [
      [0, 'opacity:0;transform:translateY(10px)'],
      [20 + i * 3, 'opacity:0;transform:translateY(10px)'],
      [23 + i * 3, 'opacity:1;transform:translateY(0)'],
      [93, 'opacity:1;transform:translateY(0)'],
      [97, 'opacity:0;transform:translateY(0)'],
      [100, 'opacity:0;transform:translateY(10px)'],
    ])),
    fade('bt-pick', [29, 31, 93, 97]),
    keyframes('bt-fill', [
      [0, 'transform:translateY(130px)'],
      ...POURS.flatMap(({ level, at }, i): [number, string][] => [
        [at, `transform:translateY(${i === 0 ? 130 : POURS[i - 1].level}px)`],
        [at + 7, `transform:translateY(${level}px)`],
      ]),
      [93, `transform:translateY(${POURS[2].level}px)`],
      [98, 'transform:translateY(130px)'],
      [100, 'transform:translateY(130px)'],
    ]),
    ...POURS.flatMap(({ at }, i) => [fade(`bt-pour${i}`, [at - 1, at, at + 7, at + 8]), fade(`bt-step${i}`, [at, at + 2, 93, 97])]),
    fade('bt-garnish', [64, 67, 93, 97]),
    keyframes('bt-chip', [
      [0, 'opacity:0;transform:translateY(12px)'],
      [70, 'opacity:0;transform:translateY(12px)'],
      [74, 'opacity:1;transform:translateY(0)'],
      [93, 'opacity:1;transform:translateY(0)'],
      [97, 'opacity:0;transform:translateY(0)'],
      [100, 'opacity:0;transform:translateY(12px)'],
    ]),
  ];

  const bowl = 'M500 120 H700 C690 196 642 240 600 246 C558 240 510 196 500 120 Z';

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <clipPath id="bt-screen">
          <rect x="158" y="22" width="184" height="396" rx="26" />
        </clipPath>
        <clipPath id="bt-bowl">
          <path d={bowl} />
        </clipPath>
        <linearGradient id="bt-drink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9f7a4" />
          <stop offset="1" stopColor="#b7d96a" />
        </linearGradient>
      </defs>

      {/* The phone */}
      <rect x="150" y="14" width="200" height="412" rx="34" fill="#101010" />
      <g clipPath="url(#bt-screen)">
        <rect x="158" y="22" width="184" height="396" fill="#15151b" />
        <rect x="222" y="30" width="56" height="16" rx="8" fill="#000" />
        <text x="172" y="78" fontSize="17" fontWeight="800" fill="#fff">Liquor Cabinet</text>
        <text x="172" y="96" fontSize="10" fill="#fff" fillOpacity="0.55">Tap what you have</text>
        {BOTTLES.map((bottle, i) => {
          const x = 178 + i * 33;
          return (
            <g key={bottle.name}>
              <rect x={x + 6} y="110" width="8" height="12" rx="2" fill={bottle.color} fillOpacity="0.8" />
              <rect x={x} y="120" width="20" height="40" rx="6" fill={bottle.color} fillOpacity="0.85" />
              <rect x={x + 3} y="134" width="14" height="12" rx="2" fill="#fff" fillOpacity="0.55" />
              <text x={x + 10} y="174" fontSize="7.5" fill="#fff" fillOpacity="0.7" textAnchor="middle">{bottle.name}</text>
              <g style={play(`bt-has${i}`, T, { opacity: 1 })}>
                <circle cx={x + 18} cy="118" r="6.5" fill="#22c55e" stroke="#15151b" strokeWidth="2" />
                <path d={`M${x + 15} 118 l2 2 4 -4.5`} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          );
        })}
        <text x="172" y="208" fontSize="13" fontWeight="800" fill="#fff">Cocktails</text>
        {DRINKS.map((drink, i) => (
          <g key={drink.name} style={play(`bt-drink${i}`, T, { opacity: 1 })}>
            <rect x="170" y={220 + i * 56} width="160" height="46" rx="12" fill="#fff" fillOpacity="0.08" />
            {i === 0 && <rect x="170" y="220" width="160" height="46" rx="12" fill="none" stroke="#a3e635" strokeWidth="2" style={play('bt-pick', T, { opacity: 1 })} />}
            <text x="182" y={240 + i * 56} fontSize="12" fontWeight="700" fill="#fff">{drink.name}</text>
            <text x="182" y={256 + i * 56} fontSize="9" fill={drink.missing ? '#fb923c' : '#fff'} fillOpacity={drink.missing ? 1 : 0.55}>{drink.detail}</text>
          </g>
        ))}
        <rect x="200" y="400" width="100" height="4" rx="2" fill="#fff" fillOpacity="0.5" />
      </g>

      {/* The glass */}
      <g>
        {POURS.map((pour, i) => (
          <rect key={i} x="597" y="20" width="6" height="104" rx="3" fill={['#f5d77a', '#c6e86f', '#fde7b0'][i]} style={play(`bt-pour${i}`, T, { opacity: 0 })} />
        ))}
        <g clipPath="url(#bt-bowl)">
          <rect x="500" y="120" width="200" height="130" fill="url(#bt-drink)" style={play('bt-fill', T, { transform: `translateY(${POURS[2].level}px)` })} />
        </g>
        <path d={bowl} fill="#fff" fillOpacity="0.08" strokeWidth="3" className="stroke-foreground" strokeOpacity="0.55" />
        {Array.from({ length: 24 }, (_, i) => (
          <circle key={i} cx={504 + i * 8.4} cy={119 + (i % 2) * 2} r="1.8" className="fill-foreground" fillOpacity="0.45" />
        ))}
        <path d="M600 246 V340" strokeWidth="5" strokeLinecap="round" className="stroke-foreground" strokeOpacity="0.55" />
        <ellipse cx="600" cy="346" rx="58" ry="8" fill="none" strokeWidth="3" className="stroke-foreground" strokeOpacity="0.55" />
        <g style={play('bt-garnish', T, { opacity: 1 })}>
          <circle cx="692" cy="118" r="24" fill="#84cc16" />
          <circle cx="692" cy="118" r="19" fill="#d9f99d" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <line key={k} x1="692" y1="118" x2={692 + 18 * Math.cos((k * Math.PI) / 3)} y2={118 + 18 * Math.sin((k * Math.PI) / 3)} stroke="#84cc16" strokeWidth="1.5" />
          ))}
        </g>
        {POURS.map((pour, i) => (
          <g key={pour.label} style={play(`bt-step${i}`, T, { opacity: 1 })}>
            <circle cx="752" cy={180 + i * 34} r="4" fill="var(--accent)" />
            <text x="766" y={185 + i * 34} fontSize="15" className="fill-foreground">{pour.label}</text>
          </g>
        ))}
        <text x="600" y="390" fontSize="20" fontWeight="800" textAnchor="middle" className="fill-foreground">Margarita</text>
      </g>

      {/* What's missing goes on the list */}
      <g style={play('bt-chip', T, { opacity: 1 })}>
        <rect x="740" y="300" width="190" height="56" rx="14" className="fill-background stroke-border" />
        <text x="756" y="322" fontSize="10" fontWeight="700" letterSpacing="1.2" className="fill-muted">GROCERY LIST</text>
        <text x="756" y="342" fontSize="14" className="fill-foreground">+ Campari, for Negroni</text>
      </g>
    </g>
  );
  return { css, svg };
}
