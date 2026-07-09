/**
 * `renderContactSheet` — the render-smoke PROXY (§0.5). Loads each scene HTML in
 * headless Chromium (Playwright), injects a theme's token block into `:root`,
 * screenshots per scene, and optionally composes a grid.
 *
 * NODE-ONLY: this file lives under `src/node/**` and is exported only from
 * `@butai/scene-kit/node` — never from the root barrel (which must stay
 * browser-safe). Output is written to a git-ignored / OS-temp path — screenshots
 * are NEVER committed (not byte-deterministic across font stacks/machines).
 *
 * HARD GUARDRAILS, enforced here in code:
 *   - NO network: every http(s) request is aborted (`page.route`). Scenes must
 *     paint offline with system-font fallbacks + guarded GSAP.
 *   - NO npx, NO `hyperframes render`, NO paid render service, NO mp4. Pure headless
 *     screenshot. A real video render is a manual / Morning-Queue step.
 */
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import { extractThemes } from '@butai/patterns';

export type RenderContactSheetOptions = {
  /** Scenes dir (default the package's `src/scenes`). */
  scenesDir?: string;
  /** Target theme id (default `dark`). */
  theme?: string;
  /** Output dir (git-ignored / OS-temp — never committed). Default: a fresh temp dir. */
  outDir?: string;
  /** Thumbnail viewport (9:16 portrait by default; kept small so the proxy is bounded). */
  width?: number;
  height?: number;
  /** Compose the per-scene PNGs into a single grid image (default true). */
  grid?: boolean;
};

export type RenderContactSheetResult = {
  /** Absolute paths of the per-scene PNGs written. */
  screenshots: string[];
  /** Absolute path of the composed grid image, if produced. */
  contactSheet?: string;
  /** The scene ids rendered, in order. */
  sceneIds: string[];
  /** The output directory (temp / git-ignored). */
  outDir: string;
};

const require = createRequire(import.meta.url);

/** The package's own `src/scenes` dir (Group A's scenes land here). */
function defaultScenesDir(): string {
  // contact-sheet.ts is at src/node/ → scenes at ../scenes (source) at runtime dist/node → ../../src/scenes
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(here, '../scenes'), // dist/node → dist/scenes (not used; scenes ship as src)
    resolve(here, '../../src/scenes'), // dist/node → src/scenes
    resolve(here, '../../../src/scenes'),
  ];
  return candidates.find((c) => existsSync(c)) ?? resolve(here, '../scenes');
}

/** Read a theme's token map from `@butai/themes/themes/<id>.css` (verbatim values). */
function themeRootBlock(theme: string): string {
  let css = '';
  try {
    const cssPath = require.resolve(`@butai/themes/themes/${theme}.css`);
    css = readFileSync(cssPath, 'utf8');
  } catch {
    return ''; // unknown theme → the scene keeps its built-in fallback :root
  }
  const extracted = extractThemes(css);
  const match = extracted.find((e) => e.theme === theme) ?? extracted[0];
  if (!match) return '';
  const decls = Object.entries(match.tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `:root {\n${decls}\n}`;
}

export async function renderContactSheet(
  opts?: RenderContactSheetOptions,
): Promise<RenderContactSheetResult> {
  const scenesDir = opts?.scenesDir ?? defaultScenesDir();
  const theme = opts?.theme ?? 'dark';
  const width = opts?.width ?? 360;
  const height = opts?.height ?? 640;
  const outDir = opts?.outDir ?? mkdtempSync(join(tmpdir(), 'butai-contact-sheet-'));
  const wantGrid = opts?.grid ?? true;

  mkdirSync(outDir, { recursive: true });

  const sceneFiles = existsSync(scenesDir)
    ? readdirSync(scenesDir)
        .filter((f) => f.endsWith('.html'))
        .sort()
    : [];

  const result: RenderContactSheetResult = {
    screenshots: [],
    sceneIds: [],
    outDir,
  };
  if (sceneFiles.length === 0) return result; // robust to Group A not having landed yet

  const themeBlock = themeRootBlock(theme);
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });

    for (const file of sceneFiles) {
      const id = file.replace(/\.html$/, '');
      const html = readFileSync(join(scenesDir, file), 'utf8');

      const page = await context.newPage();
      // HARD no-network guard: abort every external request. data:/about: pass.
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith('http://') || url.startsWith('https://')) return route.abort();
        return route.continue();
      });

      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      // Inject the theme's tokens LAST so its `:root` wins over the scene's fallback.
      if (themeBlock) await page.addStyleTag({ content: themeBlock });

      const out = join(outDir, `${id}.png`);
      await page.screenshot({ path: out });
      await page.close();

      result.screenshots.push(out);
      result.sceneIds.push(id);
    }

    if (wantGrid && result.screenshots.length > 0) {
      const cols = Math.ceil(Math.sqrt(result.screenshots.length));
      const cells = result.screenshots
        .map((p, i) => {
          const data = readFileSync(p).toString('base64');
          return `<figure><img src="data:image/png;base64,${data}" width="${width}" height="${height}"/><figcaption>${result.sceneIds[i]}</figcaption></figure>`;
        })
        .join('');
      const gridHtml = `<!doctype html><meta charset="utf-8"><style>
        body{margin:0;background:#111;font-family:system-ui,sans-serif}
        .grid{display:grid;grid-template-columns:repeat(${cols},max-content);gap:12px;padding:12px}
        figure{margin:0}img{display:block;border:1px solid #333}
        figcaption{color:#ccc;font-size:12px;padding:4px 0;text-align:center}
      </style><div class="grid">${cells}</div>`;

      const page = await context.newPage();
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith('http://') || url.startsWith('https://')) return route.abort();
        return route.continue();
      });
      await page.setContent(gridHtml, { waitUntil: 'domcontentloaded' });
      const gridEl = page.locator('.grid');
      const sheetPath = join(outDir, 'contact-sheet.png');
      await gridEl.screenshot({ path: sheetPath });
      await page.close();
      result.contactSheet = sheetPath;
    }
  } finally {
    await browser.close();
  }

  return result;
}
