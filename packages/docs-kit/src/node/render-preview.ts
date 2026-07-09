/**
 * `renderPreviews` — the render-smoke PROXY (phase-6.md §0.5). Loads each doc
 * pattern HTML in headless Chromium (Playwright), optionally injects a theme's
 * token block into `:root`, and screenshots per pattern.
 *
 * NODE-ONLY: this file lives under `src/node/**` and is exported only from
 * `@butai/docs-kit/node` — never from the root barrel (which must stay
 * browser-safe, the P2 rule). Output is written to a git-ignored / OS-temp path
 * — screenshots are NEVER committed (not byte-deterministic across font
 * stacks/machines).
 *
 * HARD GUARDRAILS, enforced here in code:
 *   - NO network: every http(s) request is aborted (`page.route`). Patterns must
 *     paint offline with system-font fallbacks + pure-CSS motion.
 *   - NO paid render, NO external service, NO mp4. Pure local headless
 *     screenshot — a screenshot PROXY, not any billed render.
 *   - OS-temp output only; returns empty (no throw) when the patterns dir is
 *     absent (robust to Group A not having landed yet).
 */
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import { extractThemes } from '@butai/patterns';

export type RenderPreviewsOptions = {
  /** Patterns dir (default the package's `src/patterns`). */
  patternsDir?: string;
  /** Target theme id (default `dark`). */
  theme?: string;
  /** Output dir (git-ignored / OS-temp — never committed). Default: a fresh temp dir. */
  outDir?: string;
  /** Preview viewport width. */
  width?: number;
  /** Preview viewport height. */
  height?: number;
};

export type RenderPreviewsResult = {
  /** Absolute paths of the per-pattern PNGs written. */
  screenshots: string[];
  /** The pattern ids rendered, in order. */
  patternIds: string[];
  /** The output directory (temp / git-ignored). */
  outDir: string;
};

const require = createRequire(import.meta.url);

/** The package's own `src/patterns` dir (Group A's doc patterns land here). */
function defaultPatternsDir(): string {
  // render-preview.ts is at src/node/ (source) → patterns at ../patterns;
  // at runtime dist/node → ../../src/patterns (HTML fragments ship as src, never built).
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(here, '../patterns'), // src/node → src/patterns
    resolve(here, '../../src/patterns'), // dist/node → src/patterns
    resolve(here, '../../../src/patterns'),
  ];
  return candidates.find((c) => existsSync(c)) ?? resolve(here, '../patterns');
}

/** Read a theme's token map from `@butai/themes/themes/<id>.css` (verbatim values). */
function themeRootBlock(theme: string): string {
  let css = '';
  try {
    const cssPath = require.resolve(`@butai/themes/themes/${theme}.css`);
    css = readFileSync(cssPath, 'utf8');
  } catch {
    return ''; // unknown theme → the pattern keeps its built-in fallback :root
  }
  const extracted = extractThemes(css);
  const match = extracted.find((e) => e.theme === theme) ?? extracted[0];
  if (!match) return '';
  const decls = Object.entries(match.tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `:root {\n${decls}\n}`;
}

export async function renderPreviews(opts: RenderPreviewsOptions = {}): Promise<RenderPreviewsResult> {
  const patternsDir = opts.patternsDir ?? defaultPatternsDir();
  const theme = opts.theme ?? 'dark';
  const width = opts.width ?? 1000;
  const height = opts.height ?? 700;
  const outDir = opts.outDir ?? mkdtempSync(join(tmpdir(), 'butai-doc-preview-'));

  mkdirSync(outDir, { recursive: true });

  const patternFiles = existsSync(patternsDir)
    ? readdirSync(patternsDir)
        .filter((f) => f.endsWith('.html'))
        .sort()
    : [];

  const result: RenderPreviewsResult = {
    screenshots: [],
    patternIds: [],
    outDir,
  };
  if (patternFiles.length === 0) return result; // robust to Group A not having landed yet

  const themeBlock = themeRootBlock(theme);
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });

    for (const file of patternFiles) {
      const id = file.replace(/\.html$/, '');
      const html = readFileSync(join(patternsDir, file), 'utf8');

      const page = await context.newPage();
      // HARD no-network guard: abort every external request. data:/about: pass.
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith('http://') || url.startsWith('https://')) return route.abort();
        return route.continue();
      });

      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      // Inject the theme's tokens LAST so its `:root` wins over the pattern's fallback.
      if (themeBlock) await page.addStyleTag({ content: themeBlock });

      const out = join(outDir, `${id}.png`);
      await page.screenshot({ path: out });
      await page.close();

      result.screenshots.push(out);
      result.patternIds.push(id);
    }
  } finally {
    await browser.close();
  }

  return result;
}
