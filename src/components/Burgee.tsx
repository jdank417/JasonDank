'use client';

import { useId, type ReactNode } from 'react';

interface FlagSpec {
  label: string;
  /** Real burgee artwork, drawn on the 60x40 field before the pennant clip. */
  art?: ReactNode;
  /** Monogram shown when there is no artwork for this club or fleet. */
  initials?: string;
}

/**
 * Burgee artwork and the pennant silhouette are ported from the Regatta
 * Positioning System's `burgee.util.ts` — same 60x40 field, same
 * `M0,0 L60,20 L0,40 Z` clip, and the same initials-monogram fallback for
 * entries whose real burgee we don't have.
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

  syc: { label: 'Squantum Yacht Club', initials: 'SYC' },
  cbi: { label: 'Community Boating Inc.', initials: 'CBI' },
  wit: { label: 'Wentworth Sailing', initials: 'WIT' },
  pjyc: { label: 'Port Jefferson Yacht Club', initials: 'PJ' },
  wys: { label: 'Westhampton Yacht Squadron', initials: 'WYS' },
  mra: { label: 'Marblehead Racing Association', initials: 'MRA' },
  mbsa: { label: 'Massachusetts Bay Sailing Association', initials: 'MBS' },
  iod: { label: 'International One Design class', initials: 'IOD' },
  figawi: { label: 'Figawi', initials: 'FIG' },
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

  const initials = spec.initials ?? '?';

  return (
    <svg
      viewBox="0 0 60 40"
      role="img"
      aria-label={`${spec.label} burgee`}
      className={`h-5 w-[30px] flex-shrink-0 rounded-[2px] ${className}`}
    >
      <title>{spec.label}</title>
      <defs>
        <clipPath id={clipId}>
          <path d="M0,0 L60,20 L0,40 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {spec.art ?? (
          <>
            <rect width="60" height="40" fill="#1d6fa5" />
            <text
              x="22"
              y="25"
              fontSize={initials.length > 2 ? 13 : 16}
              fontWeight="800"
              fill="#fff"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {initials}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
