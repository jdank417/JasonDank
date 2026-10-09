import { keyframes, fade, typeOut, play, fromLeft, type Scene } from './kit';

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

export default function barcode(): Scene {
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
    typeOut('bc-type', [44, 54]),
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
