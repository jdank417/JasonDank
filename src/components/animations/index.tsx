import barcode from './barcode';
import bartender from './bartender';
import bullbar from './bullbar';
import chatbot from './chatbot';
import compute from './compute';
import dankHome from './dankhome';
import finetune from './finetune';
import humanAuth from './humanauth';
import type { Scene } from './kit';
import monitor from './monitor';
import regatta from './regatta';
import stocks from './stocks';

/*
 * An animated sketch at the top of every case study. Each one is an SVG scene on
 * a single loop: every element's keyframes are written against the same cycle,
 * so nothing drifts out of step however long the page stays open. The resting
 * style on each element is the finished frame, which is what shows when someone
 * prefers reduced motion (see .project-anim in globals.css).
 */

const scenes: Record<string, { label: string; render: () => Scene }> = {
  humanauth: {
    label: 'Face landmarks tracked from the webcam while the six liveness checks pass one by one',
    render: humanAuth,
  },
  'regatta-positioning-system': {
    label: 'The night’s course plotted mark to mark, then sailed leg by leg with true and magnetic headings',
    render: regatta,
  },
  dankhome: {
    label: 'A scene button and then the assistant run the lights on a wall-mounted iPad, before the idle night clock takes over',
    render: dankHome,
  },
  bullbar: {
    label: 'A strip of live quotes floating above every window, fed through a Cloudflare Worker',
    render: bullbar,
  },
  'bartender-gpt': {
    label: 'Stock the liquor cabinet, see what you can make, and add what’s missing to the grocery list',
    render: bartender,
  },
  'barcode-scanning-webapp': {
    label: 'The camera finds a barcode, decodes it and looks the item up in the inventory',
    render: barcode,
  },
  'ai-model-fine-tuning': {
    label: 'Instruction records fine-tune Flan-T5, the loss comes down, and the assistant answers a rules question',
    render: finetune,
  },
  'remote-compute-environment': {
    label: 'SSH over Tailscale into WSL2 on the ZBook, where a container trains on the GPU',
    render: compute,
  },
  'huit-chatbot': {
    label: 'A question runs through fuzzy search, BERT embeddings and entity recognition to the right knowledge base article',
    render: chatbot,
  },
  'stock-price-prediction': {
    label: 'Actual price against the CNN-LSTM’s prediction, with Bollinger Bands and RSI, and the forecast running ahead',
    render: stocks,
  },
  'linux-device-monitor': {
    label: 'A tile per Linux host, refreshed over SSH: CPU, memory, disk and uptime, and a host dropping off and coming back',
    render: monitor,
  },
};

export default function ProjectAnimation({ id }: { id: string }) {
  const scene = scenes[id];
  if (!scene) return null;
  const { css, svg } = scene.render();
  return (
    <section className="project-anim border-b border-border bg-card/60" aria-label="Illustration">
      <figure className="mx-auto m-0 max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <style dangerouslySetInnerHTML={{ __html: css.join('') }} />
        <svg viewBox="0 0 960 440" role="img" aria-label={scene.label} className="mx-auto block h-auto w-full max-w-4xl">
          {svg}
        </svg>
        <figcaption className="mx-auto mt-3 max-w-4xl text-xs leading-snug text-muted">{scene.label}</figcaption>
      </figure>
    </section>
  );
}
