'use client';

import { useCallback, useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Phone-only collapsing for long lists (Work, Leadership, Racing, Clubs).
 *
 * The collapse is CSS-driven so phones get the collapsed layout in the very
 * first paint — no flash of expanded content before hydration. From `sm` up the
 * panel is always open and the toggle doesn't render, so tablet and desktop
 * layouts are exactly what they were.
 */
export function useDisclosure(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const toggle = useCallback(() => setOpen((o) => !o), []);
  return { open, toggle, panelId };
}

/**
 * A transparent button stretched over the whole card, so the entire card is
 * the tap target on phones, plus a chevron in its top-right corner. Its
 * nearest positioned ancestor (the card) must be `relative`; any link inside
 * the card needs `relative z-[1]` to stay tappable above it.
 */
export function ExpandOverlay({
  open,
  onToggle,
  controls,
  label,
}: {
  open: boolean;
  onToggle: () => void;
  controls: string;
  label: string;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={controls}
        aria-label={`${open ? 'Hide' : 'Show'} details: ${label}`}
        className="absolute inset-0 rounded-[inherit] sm:hidden"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted sm:hidden"
      >
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </span>
    </>
  );
}

/**
 * The collapsible body. Animates height with the grid-rows 0fr→1fr technique,
 * and is `invisible` while collapsed so its content leaves the tab order and
 * the accessibility tree.
 */
export function CollapsePanel({
  open,
  id,
  className = '',
  children,
}: {
  open: boolean;
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out sm:visible sm:grid-rows-[1fr] ${
        open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
      } ${className}`}
    >
      <div className="min-h-0 overflow-hidden sm:overflow-visible">{children}</div>
    </div>
  );
}
