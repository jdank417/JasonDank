import { scenes } from './scenes';

/** A scene's keyframes and SVG, sized to its container. */
export function SceneSvg({ id, className }: { id: string; className?: string }) {
  const scene = scenes[id];
  if (!scene) return null;
  const { css, svg } = scene.render();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css.join('') }} />
      <svg viewBox="0 0 960 440" role="img" aria-label={scene.label} className={className}>
        {svg}
      </svg>
    </>
  );
}

/** The animation at the top of a case study. */
export default function ProjectAnimation({ id }: { id: string }) {
  const scene = scenes[id];
  if (!scene) return null;
  return (
    <section className="project-anim border-b border-border bg-card/60" aria-label="Illustration">
      <figure className="mx-auto m-0 max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <SceneSvg id={id} className="mx-auto block h-auto w-full max-w-4xl" />
        <figcaption className="mx-auto mt-3 max-w-4xl text-xs leading-snug text-muted">{scene.label}</figcaption>
      </figure>
    </section>
  );
}
