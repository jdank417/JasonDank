import { keyframes, play, SYSTEM_FONT, type Scene } from './kit';

// ---------------------------------------------------------------------------
// BullBar: a Mac desktop with the quote strip floating over every window, and
// the Cloudflare Worker that fetches the quotes so no one needs an API key.
// ---------------------------------------------------------------------------

const QUOTES: [string, string, number][] = [
  ['AAPL', '227.48', 0.84],
  ['MSFT', '431.12', -0.32],
  ['NVDA', '138.07', 2.15],
  ['TSLA', '251.44', -1.27],
  ['AMZN', '186.90', 0.41],
  ['GOOGL', '165.33', 0.18],
  ['META', '582.71', -0.55],
  ['SPY', '571.20', 0.37],
];
const ITEM = 170;

export default function bullbar(): Scene {
  const MARQUEE = 24;
  const PING = 5;
  const width = QUOTES.length * ITEM;

  const css = [
    keyframes('bb-marquee', [[0, 'transform:translateX(0)'], [100, `transform:translateX(-${width}px)`]]),
    // A request goes Mac → Worker → market data, and the quotes come back.
    keyframes('bb-req', [[0, 'transform:translateX(0);opacity:0'], [5, 'opacity:1'], [40, 'transform:translateX(170px);opacity:1'], [44, 'opacity:0'], [100, 'transform:translateX(170px);opacity:0']]),
    keyframes('bb-res', [[0, 'transform:translateX(0);opacity:0'], [48, 'transform:translateX(0);opacity:0'], [52, 'opacity:1'], [88, 'transform:translateX(-170px);opacity:1'], [92, 'opacity:0'], [100, 'transform:translateX(-170px);opacity:0']]),
    keyframes('bb-node', [[0, 'opacity:.35'], [40, 'opacity:.35'], [46, 'opacity:1'], [56, 'opacity:.35'], [100, 'opacity:.35']]),
  ];

  const quote = ([symbol, price, change]: [string, string, number], x: number) => (
    <g key={`${symbol}-${x}`} transform={`translate(${x} 0)`}>
      <text x="0" y="64" fontSize="13" fontWeight="700" fill="#fff">{symbol}</text>
      <text x={symbol.length * 9 + 10} y="64" fontSize="13" fill="#fff" fillOpacity="0.85">{price}</text>
      <text x={symbol.length * 9 + 66} y="64" fontSize="12" fontWeight="600" fill={change >= 0 ? '#4ade80' : '#f87171'}>
        {`${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`}
      </text>
    </g>
  );

  const node = (x: number, label: string, detail: string, name?: string) => (
    <g>
      <rect x={x - 48} y="352" width="96" height="40" rx="10" fill="#fff" fillOpacity="0.9" stroke="#000" strokeOpacity="0.1" />
      {/* The Worker lights up as each request passes through it. */}
      {name && <rect x={x - 48} y="352" width="96" height="40" rx="10" fill="#f6821f" style={play(name, PING, { opacity: 0.35 })} />}
      <text x={x} y="369" fontSize="11" fontWeight="700" fill="#111" textAnchor="middle">{label}</text>
      <text x={x} y="384" fontSize="9" fill="#111" fillOpacity="0.6" textAnchor="middle">{detail}</text>
    </g>
  );

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <clipPath id="bb-desktop">
          <rect x="40" y="20" width="880" height="400" rx="14" />
        </clipPath>
        <linearGradient id="bb-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d3b8f" />
          <stop offset="0.55" stopColor="#5b3ea8" />
          <stop offset="1" stopColor="#d4658a" />
        </linearGradient>
        <clipPath id="bb-strip">
          <rect x="40" y="42" width="880" height="34" />
        </clipPath>
      </defs>

      <g clipPath="url(#bb-desktop)">
        <rect x="40" y="20" width="880" height="400" fill="url(#bb-wall)" />

        {/* Menu bar */}
        <rect x="40" y="20" width="880" height="22" fill="#fff" fillOpacity="0.28" />
        <circle cx="60" cy="31" r="5" fill="#fff" />
        {['Finder', 'File', 'Edit', 'View', 'Window'].map((item, i) => (
          <text key={item} x={78 + i * 48} y="35" fontSize="11" fontWeight={i === 0 ? 700 : 400} fill="#fff">{item}</text>
        ))}
        <text x="904" y="35" fontSize="11" fill="#fff" textAnchor="end">Fri Oct 9  9:41 AM</text>

        {/* Windows the strip floats above */}
        <g>
          <rect x="96" y="112" width="430" height="270" rx="12" fill="#1e1f26" />
          <circle cx="114" cy="128" r="5" fill="#ff5f57" />
          <circle cx="130" cy="128" r="5" fill="#febc2e" />
          <circle cx="146" cy="128" r="5" fill="#28c840" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <rect key={i} x={120 + (i % 3) * 18} y={152 + i * 22} width={[180, 120, 220, 90, 160, 200, 110, 170, 140][i]} height="8" rx="4" fill={['#7dd3fc', '#c4b5fd', '#fda4af', '#86efac'][i % 4]} fillOpacity="0.55" />
          ))}
        </g>
        <g>
          <rect x="450" y="150" width="380" height="250" rx="12" fill="#f5f5f7" />
          <circle cx="468" cy="166" r="5" fill="#ff5f57" />
          <circle cx="484" cy="166" r="5" fill="#febc2e" />
          <circle cx="500" cy="166" r="5" fill="#28c840" />
          <rect x="530" y="160" width="220" height="12" rx="6" fill="#000" fillOpacity="0.06" />
          <rect x="474" y="194" width="160" height="14" rx="4" fill="#000" fillOpacity="0.7" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="474" y={222 + i * 18} width={[320, 290, 310, 200][i]} height="8" rx="4" fill="#000" fillOpacity="0.12" />
          ))}
        </g>

        {/* How the quotes arrive */}
        <rect x="560" y="300" width="340" height="104" rx="16" fill="#fff" fillOpacity="0.55" />
        <text x="580" y="326" fontSize="10" fontWeight="700" letterSpacing="1.2" fill="#111" fillOpacity="0.6">NO API KEY ON THE MAC</text>
        <line x1="645" y1="372" x2="815" y2="372" stroke="#111" strokeOpacity="0.25" strokeDasharray="3 4" />
        {node(626, 'BullBar', 'macOS app')}
        {node(730, 'Worker', 'Cloudflare', 'bb-node')}
        {node(834, 'Quotes', 'market data')}
        <circle cx="655" cy="372" r="4" fill="#5b3ea8" style={play('bb-req', PING, { opacity: 0 }, 'linear')} />
        <circle cx="805" cy="372" r="4" fill="#16a34a" style={play('bb-res', PING, { opacity: 0 }, 'linear')} />

        {/* The strip, always on top */}
        <rect x="40" y="42" width="880" height="34" fill="#0b0b10" fillOpacity="0.92" />
        <g clipPath="url(#bb-strip)">
          <g style={play('bb-marquee', MARQUEE, {}, 'linear')}>
            {[0, 1].flatMap((copy) => QUOTES.map((q, i) => quote(q, 60 + copy * width + i * ITEM)))}
          </g>
        </g>
        <rect x="40" y="76" width="880" height="10" fill="#000" fillOpacity="0.12" />
      </g>
    </g>
  );
  return { css, svg };
}
