/**
 * Render-smoke (OPTIONAL, NON-BLOCKING) — proves each seed doc pattern is
 * render-VALID for FREE (phase-6.md § Group C, Verification 5):
 *
 *   1. the ONE shared `docs.frame.md` parses via the FROZEN `parseDesignSpec`
 *      with zero `error` diagnostics (the page design-spec is render-valid), AND
 *   2. every pattern HTML paints in headless Chromium — a non-empty region — the
 *      preview screenshot PROXY.
 *
 * ZERO credits, ZERO network, ZERO external service, ZERO mp4: nothing is
 * fetched, no paid render is invoked. Just a local parse plus a headless
 * bounding-box check. (The page's own `page.route` guard in render-preview.ts
 * aborts http(s); here we assert paint on `setContent` HTML with no external
 * resources, so there is nothing to fetch.)
 *
 * NON-BLOCKING — it SKIPS gracefully instead of failing when its inputs are
 * absent, so it never blocks the build:
 *   - if `docs.frame.md` is not authored yet (Group A owns it), the parse block
 *     skips;
 *   - if `src/patterns` has no patterns yet (Group A authors them in parallel),
 *     the paint block skips; and
 *   - if Playwright/Chromium is unavailable in this environment, only the paint
 *     block skips (the parse block still runs).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseDesignSpec } from '@butai/patterns';
import type { Browser } from '@playwright/test';
import { afterAll, describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const patternsDir = join(here, 'patterns');
const frameSpecPath = join(here, 'docs.frame.md');

const haveFrame = existsSync(frameSpecPath);
const patternHtml = existsSync(patternsDir)
  ? readdirSync(patternsDir)
      .filter((f) => f.endsWith('.html'))
      .sort()
  : [];

// ── 1. The shared docs.frame.md is render-valid via the frozen parser (no credits) ──
describe.skipIf(!haveFrame)('render-smoke · docs.frame.md is render-valid', () => {
  it('parses with zero error diagnostics', () => {
    const src = readFileSync(frameSpecPath, 'utf8');
    const { diagnostics } = parseDesignSpec(src);
    const errors = diagnostics.filter((d) => d.level === 'error');
    expect(errors).toEqual([]);
  });
});

// ── 2. Each pattern HTML paints headless (the preview proxy, no fetch) ──
// Launch is attempted only when there is something to render; if Chromium is not
// installed the launch throws and we leave `browser` null so the block SKIPS.
let browser: Browser | null = null;
if (patternHtml.length > 0) {
  try {
    const { chromium } = await import('@playwright/test');
    browser = await chromium.launch();
  } catch {
    browser = null; // Chromium unavailable → paint block skips, build not blocked.
  }
}

describe.skipIf(browser === null)('render-smoke · pattern HTML paints headless', () => {
  afterAll(async () => {
    await browser?.close();
  });

  it.each(patternHtml)('%s paints a non-empty region', async (file) => {
    const html = readFileSync(join(patternsDir, file), 'utf8');
    const page = await browser!.newPage({ viewport: { width: 1000, height: 700 } });
    try {
      // HARD no-network guard: abort every external request so the paint proves
      // the fragment renders offline (no CDN, no font fetch, no external service).
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith('http://') || url.startsWith('https://')) return route.abort();
        return route.continue();
      });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      // The fragment's first top-level element must paint a non-empty box.
      const box = await page.locator('body > *').first().boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    } finally {
      await page.close();
    }
  });
});
