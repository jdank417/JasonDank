import type { CSSProperties, ReactNode } from 'react';

/*
 * Animated stand-ins for case studies that have no screenshots. Each one is an
 * SVG scene on a single loop: every element's keyframes are written against the
 * same cycle, so nothing drifts out of step however long the page stays open.
 * The static styles on each element are the "finished" frame, which is what
 * shows when someone prefers reduced motion (see .project-anim in globals.css).
 */

export type Stop = [number, string];

export const keyframes = (name: string, stops: Stop[]) =>
  `@keyframes ${name}{${stops.map(([at, style]) => `${at}%{${style}}`).join('')}}`;

/** In over a→b, out over c→d, as percentages of the loop. */
export const fade = (name: string, [a, b, c, d]: number[], peak = 1) =>
  keyframes(name, [
    [0, 'opacity:0'],
    [a, 'opacity:0'],
    [b, `opacity:${peak}`],
    [c, `opacity:${peak}`],
    [d, 'opacity:0'],
    [100, 'opacity:0'],
  ]);

/** The opposite of fade: shown, then hidden over a→b…c→d. */
export const hide = (name: string, [a, b, c, d]: number[]) =>
  keyframes(name, [
    [0, 'opacity:1'],
    [a, 'opacity:1'],
    [b, 'opacity:0'],
    [c, 'opacity:0'],
    [d, 'opacity:1'],
    [100, 'opacity:1'],
  ]);

/** Grows from the left edge over a→b: as a clip, it types text out. */
export const typeOut = (name: string, [a, b]: number[]) =>
  keyframes(name, [
    [0, 'transform:scaleX(0)'],
    [a, 'transform:scaleX(0)'],
    [b, 'transform:scaleX(1)'],
    [100, 'transform:scaleX(1)'],
  ]);

/** Draws a stroke with pathLength="1" over a→b, and erases it over c→d. */
export const draw = (name: string, [a, b, c, d]: number[]) =>
  keyframes(name, [
    [0, 'stroke-dashoffset:1'],
    [a, 'stroke-dashoffset:1'],
    [b, 'stroke-dashoffset:0'],
    [c, 'stroke-dashoffset:0'],
    [d, 'stroke-dashoffset:1'],
    [100, 'stroke-dashoffset:1'],
  ]);

/** Static style for a pathLength="1" stroke that draws itself with `draw`. */
export const drawn = (name: string, seconds: number): CSSProperties =>
  play(name, seconds, { strokeDasharray: 1, strokeDashoffset: 0 });

export const play = (name: string, seconds: number, style: CSSProperties = {}, timing = 'ease-in-out'): CSSProperties => ({
  animation: `${name} ${seconds}s ${timing} infinite`,
  ...style,
});

export const fromLeft: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'left center' };
export const fromCenter: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center' };
export const fromBottom: CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center bottom' };

export const SYSTEM_FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

/** A scene: its keyframes and its SVG, drawn in a 960×440 viewBox. */
export interface Scene {
  css: string[];
  svg: ReactNode;
}
