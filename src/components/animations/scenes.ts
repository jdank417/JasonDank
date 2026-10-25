import barcode from './barcode';
import bartender from './bartender';
import bullbar from './bullbar';
import chatbot from './chatbot';
import compute from './compute';
import dankHome from './dankhome';
import finetune from './finetune';
import humanAuth from './humanauth';
import type { Scene } from './kit';
import lime from './lime';
import liveBoston from './liveboston';
import monitor from './monitor';
import regatta from './regatta';
import stocks from './stocks';

/*
 * An animated sketch for every project: full size at the top of its case study,
 * and in miniature on its card in the project list. Each one is an SVG scene on
 * a single loop: every element's keyframes are written against the same cycle,
 * so nothing drifts out of step however long the page stays open. The resting
 * style on each element is the finished frame, which is what shows when someone
 * prefers reduced motion (see .project-anim in globals.css).
 */

export interface SceneEntry {
  label: string;
  render: () => Scene;
  /** Fraction of the loop where a paused thumbnail rests: a frame with everything in it. */
  still: number;
}

export const scenes: Record<string, SceneEntry> = {
  humanauth: {
    label: 'Face landmarks tracked from the webcam while the six liveness checks pass one by one',
    still: 0.85,
    render: humanAuth,
  },
  regattatrack: {
    label: 'The night’s course plotted mark to mark, then sailed leg by leg with true and magnetic headings',
    still: 0.5,
    render: regatta,
  },
  dankhome: {
    label: 'A scene lights the house on the iPad and iPhone, one sentence turns off the kitchen and locks the door instantly, the assistant switches the background, and the iPad drifts into its night clock',
    still: 0.7,
    render: dankHome,
  },
  lime: {
    label: 'A photo Shift-dragged out of Finder opens the glass wheel of formats, the JPG slice lights up lime, and after the drop the island at the top of the screen fills its progress bar and the new JPG appears beside the original',
    still: 0.4,
    render: lime,
  },
  bullbar: {
    label: 'A strip of live quotes floating above every window, fed through a Cloudflare Worker',
    still: 0.5,
    render: bullbar,
  },
  'bartender-gpt': {
    label: 'Stock the liquor cabinet, see what you can make, and add what’s missing to the grocery list',
    still: 0.85,
    render: bartender,
  },
  'barcode-scanner': {
    label: 'The camera finds a barcode, decodes it and looks the item up in the inventory',
    still: 0.85,
    render: barcode,
  },
  'sailing-rules-assistant': {
    label: 'Instruction records flow forward through the network, backprop updates the weights layer by layer, the loss comes down, and the assistant answers a rules question',
    still: 0.88,
    render: finetune,
  },
  'live-boston': {
    label: 'Downtown Boston from North Station to South Station, drawn from the MBTA’s own track and station data: each train runs its real track at its true length and eases into every stop while the commute counts down to leaving, a closed station and a freight delay come up in the alerts, then a ride along on the Red Line out over the Longfellow Bridge',
    still: 0.45,
    render: liveBoston,
  },
  'remote-gpu-server': {
    label: 'SSH over Tailscale into WSL2 on the ZBook, where a container trains on the GPU',
    still: 0.85,
    render: compute,
  },
  'huit-chatbot': {
    label: 'A question runs through fuzzy search, BERT embeddings and entity recognition to the right knowledge base article',
    still: 0.6,
    render: chatbot,
  },
  'stock-prediction': {
    label: 'Actual price against the CNN-LSTM’s prediction, with Bollinger Bands and RSI, and the forecast running ahead',
    still: 0.85,
    render: stocks,
  },
  'linux-device-monitor': {
    label: 'A tile per Linux host, refreshed over SSH: CPU, memory, disk and uptime, and a host dropping off and coming back',
    still: 0.3,
    render: monitor,
  },
};

