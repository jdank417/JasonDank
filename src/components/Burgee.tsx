'use client';

import { useId, type ReactNode } from 'react';

interface FlagSpec {
  label: string;
  /** Real burgee artwork, drawn on the 60x40 field before the pennant clip. */
  art: ReactNode;
}

/**
 * Burgee artwork and the pennant silhouette are ported from the Regatta
 * Positioning System's `burgee.util.ts` — same 60x40 field, same
 * `M0,0 L60,20 L0,40 Z` clip. Only clubs whose real artwork we have appear
 * here; there is deliberately no generic fallback.
 */
const flags: Record<string, FlagSpec> = {
  byc: {
    label: 'Boston Yacht Club',
    art: (
      <>
        <rect width="60" height="40" fill="#fff" />
        <rect x="0" y="16" width="60" height="8" fill="#12356f" />
        <rect x="12" y="0" width="8" height="40" fill="#cc142b" />
        <polygon
          points="16.00,14.80 17.17,18.39 20.95,18.39 17.89,20.61 19.06,24.21 16.00,21.99 12.94,24.21 14.11,20.61 11.05,18.39 14.83,18.39"
          fill="#fff"
        />
      </>
    ),
  },
  eyc: {
    label: 'Eastern Yacht Club',
    art: (
      <>
        <rect width="60" height="40" fill="#12356f" />
        <polygon points="0,0 14.4,4.8 42.5,25.9 21.2,32.9 0,17" fill="#cc142b" />
        <polygon
          points="18.00,13.60 19.44,18.02 24.09,18.02 20.33,20.76 21.76,25.18 18.00,22.44 14.24,25.18 15.67,20.76 11.91,18.02 16.56,18.02"
          fill="#fff"
        />
      </>
    ),
  },
  cyc: {
    label: 'Corinthian Yacht Club',
    art: (
      <>
        <rect width="60" height="40" fill="#fff" />
        <polygon points="0,40 16,5.33 40,13.33" fill="#cc142b" />
        <polygon points="0,40 40,13.33 60,20" fill="#12356f" />
        <polygon
          points="7.00,3.90 8.03,7.08 11.37,7.08 8.67,9.04 9.70,12.22 7.00,10.26 4.30,12.22 5.33,9.04 2.63,7.08 5.97,7.08"
          fill="#12356f"
        />
      </>
    ),
  },

  pjyc: {
    label: 'Port Jefferson Yacht Club',
    art: (
      <>
        <rect width="60" height="40" fill="#12356f" />
        {/* Twin gold arrows — parallel, identical length, one above the other */}
        <path d="M7,14 H22" stroke="#f2c230" strokeWidth="3.4" fill="none" />
        <path d="M21,9.5 L31,14 L21,18.5 Z" fill="#f2c230" />
        <path d="M7,26 H22" stroke="#f2c230" strokeWidth="3.4" fill="none" />
        <path d="M21,21.5 L31,26 L21,30.5 Z" fill="#f2c230" />
      </>
    ),
  },
  wys: {
    label: 'Westhampton Yacht Squadron',
    art: (
      <>
        {/* Two black triangles at the hoist, one above the other, and a red
            diamond filling the rest — the diamond's area is exactly the two
            triangles combined. */}
        <polygon points="0,20 30,10 60,20 30,30" fill="#d6242c" />
        <polygon points="0,0 30,10 0,20" fill="#141414" />
        <polygon points="0,20 30,30 0,40" fill="#141414" />
      </>
    ),
  },
  wit: {
    label: 'Wentworth Sailing',
    art: (
      <>
        <rect width="60" height="40" fill="#141414" />
        {/* Two chevrons, each a pair of lines meeting at a point, running out
            to the edges of the flag (the pennant clip trims them). */}
        <path
          d="M-4,-5 L32,20 L-4,45"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinejoin="miter"
        />
        <path
          d="M14,0 L50,20 L14,40"
          fill="none"
          stroke="#f2c230"
          strokeWidth="5"
          strokeLinejoin="miter"
        />
      </>
    ),
  },

  syc: {
    label: 'Squantum Yacht Club',
    art: (
      <>
        <rect width="60" height="40" fill="#1b2a6b" />
        {/* White tomahawk */}
        <path d="M15,11 L30,12.5 L30,17.5 L15,16 Z" fill="#ffffff" />
        <path d="M13,29 L22,11" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" />
      </>
    ),
  },
  cbi: {
    label: 'Community Boating Inc.',
    art: (
      <>
        <rect width="60" height="40" fill="#efede5" />
        {/* Green above and red below, both tapering out before the fly */}
        <polygon points="0,0 40,13.33 0,13" fill="#1e7a3c" />
        <polygon points="0,40 38,27.33 0,27" fill="#a32b25" />
        <text
          x="28"
          y="25"
          fontSize="13"
          fontWeight="700"
          fill="#12356f"
          textAnchor="middle"
          fontFamily="Georgia, serif"
        >
          C
        </text>
      </>
    ),
  },
};

export type BurgeeKey = keyof typeof flags;

export const burgeeLabel = (name: BurgeeKey) => flags[name]?.label ?? '';

export default function Burgee({
  name,
  className = '',
}: {
  name: BurgeeKey;
  className?: string;
}) {
  const spec = flags[name];
  const clipId = useId();

  if (!spec) return null;

  return (
    <svg
      viewBox="0 0 60 40"
      role="img"
      aria-label={`${spec.label} burgee`}
      className={`flex-shrink-0 rounded-[2px] ${className || 'h-5 w-[30px]'}`}
    >
      <title>{spec.label}</title>
      <defs>
        <clipPath id={clipId}>
          <path d="M0,0 L60,20 L0,40 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {spec.art}
      </g>
      <path
        d="M0,0 L60,20 L0,40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}
