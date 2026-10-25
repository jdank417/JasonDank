import type { CSSProperties, ReactNode } from 'react';
import { keyframes, fade, hide, typeOut, play, fromLeft, fromCenter, SYSTEM_FONT, type Scene } from './kit';

// ---------------------------------------------------------------------------
// Lime: a photo is Shift-dragged out of a Finder window, the glass wheel of
// formats opens under the pointer and Finder's big drag preview shrinks out of
// the way, the JPG slice lights up lime, and on the drop the island at the top
// of the screen fills its progress bar, says the file is ready, and the new
// JPG appears in Finder beside the original.
// ---------------------------------------------------------------------------

const WHEEL = { x: 640, y: 250 };
const FORMATS = ['PNG', 'JPG', 'AVIF', 'TIFF', 'GIF', 'BMP', 'PDF', 'SVG'];
const LIT = 1;
const INNER = 40;
const OUTER = 110;

/** A wheel slice, pulled in by `inset` on every side so a round stroke can give it round corners. */
function slice(index: number, inset: number) {
  const step = (2 * Math.PI) / FORMATS.length;
  const middle = -Math.PI / 2 + index * step;
  const r0 = INNER + inset;
  const r1 = OUTER - inset;
  const edge = 4 + inset;
  const a0 = (r: number) => middle - step / 2 + Math.asin(edge / r);
  const a1 = (r: number) => middle + step / 2 - Math.asin(edge / r);
  const at = (r: number, a: number) => `${(WHEEL.x + r * Math.cos(a)).toFixed(2)} ${(WHEEL.y + r * Math.sin(a)).toFixed(2)}`;
  return `M${at(r1, a0(r1))} A${r1} ${r1} 0 0 1 ${at(r1, a1(r1))} L${at(r0, a1(r0))} A${r0} ${r0} 0 0 0 ${at(r0, a0(r0))}Z`;
}

/** Where a slice's label sits. */
function labelAt(index: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / FORMATS.length;
  const r = (INNER + OUTER) / 2 + 2;
  return { x: WHEEL.x + r * Math.cos(angle), y: WHEEL.y + r * Math.sin(angle) };
}

export default function lime(): Scene {
  const T = 14;
  const file = { x: 236, y: 150 };
  const lit = labelAt(LIT);
  // The pointer: picks up the photo, carries it to the wheel's center, then out onto the JPG slice.
  const toWheel = `translate(${WHEEL.x - file.x}px,${WHEEL.y - file.y}px)`;
  const toSlice = `translate(${lit.x - file.x + 16}px,${lit.y - file.y + 12}px)`;
  const path = (name: string) =>
    keyframes(name, [
      [0, 'transform:translate(0,0)'],
      [6, 'transform:translate(0,0)'],
      [22, `transform:${toWheel}`],
      [28, `transform:${toWheel}`],
      [36, `transform:${toSlice}`],
      [90, `transform:${toSlice}`],
      [99, 'transform:translate(0,0)'],
      [100, 'transform:translate(0,0)'],
    ]);

  const css = [
    path('lm-cursor'),
    path('lm-carry'),
    fade('lm-ghost', [5, 7, 44, 46]),
    // Over the wheel, Finder's big preview shrinks to a small thumbnail.
    keyframes('lm-shrink', [[0, 'transform:scale(1)'], [22, 'transform:scale(1)'], [26, 'transform:scale(.42)'], [100, 'transform:scale(.42)']]),
    keyframes('lm-wheel', [
      [0, 'opacity:0;transform:scale(.6)'],
      [20, 'opacity:0;transform:scale(.6)'],
      [25, 'opacity:1;transform:scale(1)'],
      [44, 'opacity:1;transform:scale(1)'],
      [48, 'opacity:0;transform:scale(.92)'],
      [100, 'opacity:0;transform:scale(.92)'],
    ]),
    fade('lm-lit', [33, 36, 44, 47]),
    hide('lm-size', [33, 36, 95, 98]),
    fade('lm-target', [33, 36, 44, 47]),
    fade('lm-island', [48, 51, 86, 90]),
    fade('lm-working', [48, 50, 65, 67]),
    typeOut('lm-bar', [51, 65]),
    fade('lm-ready', [65, 67, 86, 90]),
    fade('lm-new', [66, 70, 93, 97]),
  ];

  const thumb = (x: number, y: number, w: number, h: number, id: string) => (
    <g>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx="7" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill="url(#lm-sky)" />
        <circle cx={x + w * 0.72} cy={y + h * 0.3} r={h * 0.12} fill="#fff6c8" />
        <path d={`M${x} ${y + h * 0.78} Q${x + w * 0.35} ${y + h * 0.5} ${x + w * 0.62} ${y + h * 0.72} T${x + w} ${y + h * 0.66} V${y + h} H${x}Z`} fill="#4f9a2a" />
        <circle cx={x + w * 0.3} cy={y + h * 0.58} r={h * 0.16} fill="#3f8a22" />
        <circle cx={x + w * 0.24} cy={y + h * 0.55} r={h * 0.05} fill="#9bdc3c" />
        <circle cx={x + w * 0.36} cy={y + h * 0.62} r={h * 0.05} fill="#9bdc3c" />
      </g>
    </g>
  );

  const fileIcon = (x: number, name: string, body: ReactNode, style?: CSSProperties) => (
    <g style={style}>
      {body}
      <text x={x + 32} y="232" fontSize="10.5" fill="#1d1d1f" textAnchor="middle">{name}</text>
    </g>
  );

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <clipPath id="lm-desktop">
          <rect x="40" y="20" width="880" height="400" rx="14" />
        </clipPath>
        <linearGradient id="lm-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff8a3d" />
          <stop offset="0.5" stopColor="#c9407a" />
          <stop offset="1" stopColor="#7b4fd1" />
        </linearGradient>
        <linearGradient id="lm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc4ff" />
          <stop offset="1" stopColor="#d6f0ff" />
        </linearGradient>
        <linearGradient id="lm-juice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7f06a" />
          <stop offset="1" stopColor="#7cc822" />
        </linearGradient>
        <clipPath id="lm-hub">
          <circle cx={WHEEL.x} cy={WHEEL.y} r={INNER - 6} />
        </clipPath>
      </defs>

      <g clipPath="url(#lm-desktop)">
        <rect x="40" y="20" width="880" height="400" fill="url(#lm-wall)" />

        {/* Menu bar, with Lime's slice at the right */}
        <rect x="40" y="20" width="880" height="22" fill="#fff" fillOpacity="0.28" />
        {['Finder', 'File', 'Edit', 'View', 'Go'].map((item, i) => (
          <text key={item} x={64 + i * 48} y="35" fontSize="11" fontWeight={i === 0 ? 700 : 400} fill="#fff">{item}</text>
        ))}
        <circle cx="772" cy="31" r="6.5" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="772" cy="31" r="3.5" fill="#fff" />
        <text x="904" y="35" fontSize="11" fill="#fff" textAnchor="end">Sun Oct 25  4:20 PM</text>

        {/* A Finder window */}
        <rect x="80" y="76" width="390" height="300" rx="12" fill="#f5f5f7" />
        <rect x="80" y="76" width="112" height="300" rx="12" fill="#e9e9ee" />
        <rect x="180" y="76" width="12" height="300" fill="#e9e9ee" />
        <circle cx="98" cy="92" r="5" fill="#ff5f57" />
        <circle cx="114" cy="92" r="5" fill="#febc2e" />
        <circle cx="130" cy="92" r="5" fill="#28c840" />
        {['Desktop', 'Documents', 'Downloads', 'Pictures'].map((item, i) => (
          <text key={item} x="98" y={130 + i * 22} fontSize="11" fill="#1d1d1f" fillOpacity={i === 3 ? 1 : 0.7} fontWeight={i === 3 ? 600 : 400}>{item}</text>
        ))}
        <text x="212" y="96" fontSize="12" fontWeight="700" fill="#1d1d1f">Pictures</text>

        {fileIcon(file.x - 32, 'photo.heic', thumb(file.x - 30, 124, 60, 92, 'lm-photo-a'))}
        {fileIcon(
          310,
          'Report.pdf',
          <g>
            <rect x="320" y="130" width="44" height="58" rx="4" fill="#fff" stroke="#000" strokeOpacity="0.12" />
            <rect x="320" y="130" width="44" height="12" rx="4" fill="#e5484d" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x="326" y={152 + i * 8} width={[32, 26, 30, 18][i]} height="3" rx="1.5" fill="#000" fillOpacity="0.18" />
            ))}
          </g>,
        )}
        {fileIcon(
          390,
          'clip.mov',
          <g>
            <rect x="394" y="138" width="56" height="42" rx="5" fill="#26262c" />
            <path d="M416 150 l14 9 -14 9z" fill="#fff" />
          </g>,
        )}
        {/* The converted photo arrives beside the original. */}
        <g style={play('lm-new', T, { opacity: 0 })}>
          {thumb(file.x - 30, 244, 60, 92, 'lm-photo-b')}
          <rect x={file.x - 30} y="244" width="60" height="92" rx="7" fill="none" stroke="#7cc822" strokeWidth="2.5" />
          <text x={file.x} y="352" fontSize="10.5" fill="#1d1d1f" textAnchor="middle">photo.jpg</text>
        </g>

        {/* The wheel: a glass rim around eight glass slices */}
        <g style={play('lm-wheel', T, { ...fromCenter, opacity: 1 })}>
          <circle cx={WHEEL.x} cy={WHEEL.y} r={OUTER + 8} fill="#fff" fillOpacity="0.14" stroke="#fff" strokeOpacity="0.55" />
          {FORMATS.map((format, i) => (
            <g key={format}>
              {/* Drawn as one translucent layer, so the rounding stroke doesn't double up the glass. */}
              <g opacity="0.42">
                <path d={slice(i, 7)} fill="#fff" stroke="#fff" strokeWidth="14" strokeLinejoin="round" />
              </g>
              {i === LIT && (
                <path d={slice(i, 7)} fill="url(#lm-juice)" stroke="url(#lm-juice)" strokeWidth="14" strokeLinejoin="round" style={play('lm-lit', T, { opacity: 1 })} />
              )}
              <text x={labelAt(i).x} y={labelAt(i).y + 4} fontSize="12" fontWeight="800" letterSpacing="0.4" fill="#1d1d1f" fillOpacity="0.82" textAnchor="middle">{format}</text>
            </g>
          ))}
          <g clipPath="url(#lm-hub)">{thumb(WHEEL.x - INNER, WHEEL.y - INNER, INNER * 2, INNER * 2, 'lm-photo-c')}</g>
          <circle cx={WHEEL.x} cy={WHEEL.y} r={INNER - 6} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" />
          <rect x={WHEEL.x - 26} y={WHEEL.y - 9} width="52" height="18" rx="9" fill="#fff" fillOpacity="0.8" />
          <text x={WHEEL.x} y={WHEEL.y + 4} fontSize="10" fontWeight="700" fill="#1d1d1f" textAnchor="middle" style={play('lm-size', T, { opacity: 0 })}>2.2 MB</text>
          <text x={WHEEL.x} y={WHEEL.y + 4} fontSize="10" fontWeight="800" fill="#1d1d1f" textAnchor="middle" style={play('lm-target', T, { opacity: 1 })}>JPG</text>
        </g>

        {/* What's being dragged: the photo, shrunk over the wheel, and the pointer */}
        <g style={play('lm-carry', T, { transform: toSlice })}>
          <g style={play('lm-ghost', T, { opacity: 1 })}>
            <g style={play('lm-shrink', T, { transformBox: 'view-box', transformOrigin: `${file.x}px ${file.y}px`, transform: 'scale(.42)' })}>
              <g opacity="0.85">{thumb(file.x + 8, file.y + 10, 60, 92, 'lm-photo-d')}</g>
            </g>
          </g>
        </g>
        <g style={play('lm-cursor', T, { transform: toSlice })}>
          <path
            d={`M${file.x} ${file.y} v20 l5 -4.5 3.6 8.2 3.2 -1.4 -3.6 -8 h6.6z`}
            fill="#111"
            stroke="#fff"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </g>

        {/* The island at the top of the screen: progress, then the result */}
        <g style={play('lm-island', T, { opacity: 0 })}>
          <g style={play('lm-working', T, { opacity: 0 })}>
            <rect x="330" y="48" width="300" height="58" rx="22" fill="#000" />
            <text x="350" y="70" fontSize="12" fontWeight="700" fill="#fff">Convert to JPG…</text>
            <text x="350" y="84" fontSize="10" fill="#fff" fillOpacity="0.6">photo.heic</text>
            <rect x="350" y="92" width="260" height="4" rx="2" fill="#7cc822" fillOpacity="0.25" />
            <rect x="350" y="92" width="260" height="4" rx="2" fill="url(#lm-juice)" style={play('lm-bar', T, { ...fromLeft, transform: 'scaleX(1)' }, 'linear')} />
          </g>
          <g style={play('lm-ready', T, { opacity: 0 })}>
            <rect x="330" y="48" width="300" height="40" rx="20" fill="#000" />
            <circle cx="353" cy="68" r="8" fill="#c7f06a" />
            <path d="M349 68.5 l3 3 5.5 -6" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="369" y="72" fontSize="12" fontWeight="700" fill="#fff">photo.jpg is ready</text>
            <rect x="564" y="56" width="56" height="24" rx="12" fill="#c7f06a" />
            <text x="592" y="72" fontSize="11" fontWeight="800" fill="#122a07" textAnchor="middle">Show</text>
          </g>
        </g>
      </g>
    </g>
  );
  return { css, svg };
}
