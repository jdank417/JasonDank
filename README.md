# jasondank.com

The portfolio of Jason Dank, a full-stack software engineer at Fidelity Investments. Live at **[jasondank.com](https://jasondank.com)**.

Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4, exported as a static site and deployed to GitHub Pages.

## What's here

- **Home**: work, projects, skills, education and recommendations, over a portolan-chart backdrop of Boston Harbor whose compass needle follows the pointer (or real north, on a phone).
- **Case studies** (`/projects/<id>`): one per project. Each opens with an animated SVG scene of the project, followed by the write-up and any screenshots. Each also has its own link-preview image.
- **Sailing** (`/sailing`): racing and leadership on the water, with live Boston Harbor tide, wind and water temperature from NOAA and Open-Meteo, a map of where I've sailed, and a printable sailing résumé.
- **Résumé** (`/resume`): a page that prints to a two-page PDF.
- **Terminal** (`/terminal`) and a **command palette** (⌘K / Ctrl K) for getting around the site from the keyboard.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
npm run lint
```

Pushes to `main` build and deploy to GitHub Pages through `.github/workflows/nextjs.yml`.

## How it's put together

- **Content** lives in `src/data/`: projects, work history, skills, education, sailing and contact links. Most changes to the site are edits there.
- **Project animations** are in `src/components/animations/`, one file per project, registered in `scenes.ts`. Each is an SVG scene on a single CSS-keyframe loop, so every part stays in step however long the page is open. Each element's resting style is the scene's finished frame, which is what shows with reduced motion and on paused project cards.
- **Link previews** for the case studies (`public/og/<id>.png`) are drawn from those scenes. After changing a scene or a project's title, regenerate and commit them:

  ```bash
  npm run build && npm run og   # needs Chrome, or set CHROME_PATH
  ```

- **Charts**: the coastlines in `public/charts/` come from GSHHS shoreline data via `scripts/build-charts.py`, and `scripts/route-tracks.py` routes the boat on the sailing map over water. See the top of each script for setup.
