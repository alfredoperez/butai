/**
 * Render-smoke (OPTIONAL, NON-BLOCKING) — proves each seed scene is
 * render-VALID without spending a cent (phase-5.md § Group C, Verification 5):
 *
 *   1. its `frame.md` parses via the FROZEN `parseDesignSpec` with zero `error`
 *      diagnostics (the design-spec is render-valid), AND
 *   2. its HTML paints in headless Chromium — a non-empty `.scene` region — the
 *      contact-sheet PROXY.
 *
 * ZERO credits, ZERO network, ZERO mp4: HyperFrames is never invoked here — no
 * `hyperframes render`, no `npx` fetch, no external render-service call. Just a
 * local parse plus a headless screenshot bound check.
 *
 * NON-BLOCKING — it SKIPS gracefully instead of failing when its inputs are
 * absent, so it never blocks the build:
 *   - if `src/scenes` has no scenes yet (Group A authors them in parallel), every
 *     block skips; and
 *   - if Playwright/Chromium is unavailable in this environment, only the paint
 *     block skips (the parse block still runs on whatever scenes exist).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseDesignSpec } from '@butai/patterns';
import type { Browser } from '@playwright/test';
import { afterAll, describe, expect, it } from 'vitest';

const scenesDir = join(dirname(fileURLToPath(import.meta.url)), 'scenes');
const haveScenes = existsSync(scenesDir);

const frameSpecs = haveScenes
  ? readdirSync(scenesDir).filter((f) => f.endsWith('.frame.md'))
  : [];
const sceneHtml = haveScenes ? readdirSync(scenesDir).filter((f) => f.endsWith('.html')) : [];

// ── 1. Each frame.md is render-valid via the frozen parser (no credits) ──
describe.skipIf(frameSpecs.length === 0)('render-smoke · frame.md is render-valid', () => {
  it.each(frameSpecs)('%s parses with zero error diagnostics', (file) => {
    const src = readFileSync(join(scenesDir, file), 'utf8');
    const { diagnostics } = parseDesignSpec(src);
    const errors = diagnostics.filter((d) => d.level === 'error');
    expect(errors).toEqual([]);
  });
});

// ── 2. Each scene HTML paints headless (the contact-sheet proxy) ──
// Launch is attempted only when there is something to render; if Chromium is not
// installed the launch throws and we leave `browser` null so the block SKIPS.
let browser: Browser | null = null;
if (sceneHtml.length > 0) {
  try {
    const { chromium } = await import('@playwright/test');
    browser = await chromium.launch();
  } catch {
    browser = null; // Chromium unavailable → paint block skips, build not blocked.
  }
}

describe.skipIf(browser === null)('render-smoke · scene HTML paints headless', () => {
  afterAll(async () => {
    await browser?.close();
  });

  it.each(sceneHtml)('%s paints a non-empty .scene region', async (file) => {
    const html = readFileSync(join(scenesDir, file), 'utf8');
    const page = await browser!.newPage({ viewport: { width: 1080, height: 1920 } });
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const box = await page.locator('.scene').first().boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    } finally {
      await page.close();
    }
  });
});
