// Shared helpers for the canvas-drawn pieces of the site (the rhumb-line
// backdrop and the sailing chart). Both draw from the CSS theme tokens, so they
// need to read those tokens and redraw whenever the theme changes.

export function cssToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** The site's monospace face, as resolved by next/font, for canvas text. */
export function monoFont(weight: number, size: number): string {
  const family = cssToken('--font-jbmono') || 'ui-monospace';
  return `${weight} ${size}px ${family}, ui-monospace, SFMono-Regular, Menlo, monospace`;
}

/**
 * Matches the canvas backing store to its CSS size at the device pixel ratio
 * (capped at 2) and returns a context already scaled to CSS pixels.
 */
export function sizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  const bw = Math.round(w * dpr);
  const bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

/**
 * Calls `cb` when the resolved theme changes — either the OS preference or the
 * site's own toggle, which writes `data-theme` on <html>. Returns an unsubscribe.
 */
export function onThemeChange(cb: () => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', cb);
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => {
    media.removeEventListener('change', cb);
    observer.disconnect();
  };
}

/** `#rrggbb` (or `#rgb`) token plus an alpha, as an rgba() string for canvas gradients. */
export function withAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '');
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return color;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
