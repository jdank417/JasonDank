// Link-preview images for the case studies: public/og/<project id>.png.
//
// Each one is the project's name beside its scene, paused on the scene's still
// frame, in the same light chart style as the site's own preview image. They're
// drawn from the built site, so run this after a build and commit the PNGs:
//
//   npm run build && npm run og
//
// It needs Chrome or Chromium: an installed Google Chrome is used by default, or
// set CHROME_PATH to another browser's executable.

import { createReadStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const OUT = resolve('out');
const DEST = resolve('public/og');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain' };

if (!existsSync(join(OUT, 'projects'))) {
  console.error('No build found in out/. Run `npm run build` first.');
  process.exit(1);
}

// A small static server for out/, so the pages load their fonts and styles.
const server = createServer((req, res) => {
  let path = join(OUT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!path.startsWith(OUT) || !existsSync(path)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(res);
});
await new Promise((done) => server.listen(0, done));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, colorScheme: 'light' });
mkdirSync(DEST, { recursive: true });

const ids = readdirSync(join(OUT, 'projects')).filter((id) => existsSync(join(OUT, 'projects', id, 'index.html')));
for (const id of ids) {
  await page.goto(`${base}/projects/${id}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const drawn = await page.evaluate(() => {
    const scene = document.querySelector('section.project-anim');
    if (!scene) return false;
    const still = Number(scene.dataset.still ?? 0.8);
    // Non-breaking hyphens, so "Fine-Tuning" doesn't split across lines.
    const name = (document.querySelector('h1')?.textContent ?? '').replace(/-/g, '\u2011');
    const subtitle = document.querySelector('h1 + p')?.textContent ?? '';
    const crumb = document.querySelector('main p')?.textContent ?? '';
    const year = crumb.match(/\d{4}/)?.[0] ?? '';
    const style = scene.querySelector('style');
    const svg = scene.querySelector('svg');

    // Always the light palette, like the site's own preview.
    document.documentElement.dataset.theme = 'light';
    // Laid over the page, not in place of it, so React keeps the nodes it owns.
    document.body.insertAdjacentHTML('beforeend', `
      <div id="card" style="position:fixed;inset:0;z-index:2147483647;width:1200px;height:630px;overflow:hidden;background:var(--background);
           background-image:radial-gradient(900px 500px at 100% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)">
        <div style="position:absolute;left:72px;top:72px;width:430px">
          <div style="display:inline-flex;gap:10px;font-size:15px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)">
            <span style="border:1px solid var(--border);background:var(--card);border-radius:999px;padding:7px 16px">Case study</span>
            <span style="border:1px solid var(--border);background:var(--card);border-radius:999px;padding:7px 16px">${year}</span>
          </div>
          <div id="name" class="font-display" style="margin-top:28px;font-size:64px;line-height:1.02;font-weight:800;letter-spacing:-.02em;color:var(--foreground)">${name}</div>
          <div style="margin-top:16px;font-size:22px;line-height:1.35;font-style:italic;color:var(--muted)">${subtitle}</div>
        </div>
        <div id="scene" style="position:absolute;left:540px;top:136px;width:600px;padding:14px;border:1px solid var(--border);border-radius:18px;background:var(--card)"></div>
        <div style="position:absolute;left:72px;right:72px;bottom:56px;padding-top:22px;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-size:20px">
          <span style="font-weight:700;color:var(--foreground)">jasondank.com</span>
          <span style="color:var(--muted)">/projects/${location.pathname.split('/')[2]}</span>
        </div>
      </div>`);
    // Shrink the name until it fits its column: no overflowing words, at most three lines.
    const title = document.getElementById('name');
    for (let size = 64; size > 34 && (title.scrollWidth > title.clientWidth || title.offsetHeight > 200); size -= 2) {
      title.style.fontSize = `${size - 2}px`;
    }
    const holder = document.getElementById('scene');
    holder.className = 'project-anim';
    const copy = svg.cloneNode(true);
    holder.append(style.cloneNode(true), copy);
    copy.removeAttribute('class');
    copy.style.cssText = 'display:block;width:100%;height:auto';
    // The copy's clip paths share ids with the original; drop it so they resolve to the copy.
    scene.remove();
    // Pause every animation on the scene's still frame.
    for (const animation of holder.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = Number(animation.effect?.getTiming().duration ?? 0) * still;
    }
    return true;
  });
  if (!drawn) {
    console.warn(`  skipped ${id}: no scene`);
    continue;
  }
  await page.locator('#card').screenshot({ path: join(DEST, `${id}.png`) });
  console.log(`  public/og/${id}.png`);
}

await browser.close();
server.close();
