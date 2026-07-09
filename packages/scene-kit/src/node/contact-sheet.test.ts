/**
 * `renderContactSheet` pipeline test (Group B). Proves the headless screenshot
 * proxy runs end-to-end WITHOUT Group A's scenes and WITHOUT any network / npx /
 * mp4 / credit spend: it renders a couple of throwaway token-contract scenes from
 * a temp dir and asserts per-scene PNGs + a composed grid land in a temp output.
 *
 * Skips gracefully when the Playwright Chromium binary is absent (CI without
 * `playwright install` — the standing gap), so it never fails the phase.
 */
import { existsSync, mkdtempSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { afterAll, describe, expect, it } from 'vitest';

import { renderContactSheet } from './contact-sheet.js';

function chromiumAvailable(): boolean {
  try {
    const p = chromium.executablePath();
    return !!p && existsSync(p);
  } catch {
    return false;
  }
}

const SCENE_A = `<!doctype html><html><head><meta charset="utf-8"><style>
  :root { --bg:#0F0F13; --accent:#60A5FA; --text:#E8E8F0; --font-display: system-ui, sans-serif; }
  html,body{margin:0;height:100%}
  .scene{height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--text);font-family:var(--font-display)}
  .accent{color:var(--accent)}
</style></head><body><section class="scene"><h1>Alpha <span class="accent">one</span></h1></section></body></html>`;

const SCENE_B = SCENE_A.replace('Alpha', 'Beta').replace('>one<', '>two<');

const available = chromiumAvailable();
const outDirs: string[] = [];

describe.skipIf(!available)('renderContactSheet — headless proxy', () => {
  afterAll(() => {
    // temp dirs are OS-managed; nothing committed. No cleanup required.
    outDirs.length = 0;
  });

  it('renders per-scene PNGs + a grid, offline, from a temp scenes dir', async () => {
    const scenesDir = mkdtempSync(join(tmpdir(), 'butai-scenes-'));
    writeFileSync(join(scenesDir, 'alpha.html'), SCENE_A);
    writeFileSync(join(scenesDir, 'beta.html'), SCENE_B);

    const res = await renderContactSheet({
      scenesDir,
      theme: 'dark',
      width: 120,
      height: 200,
    });
    outDirs.push(res.outDir);

    expect(res.sceneIds).toEqual(['alpha', 'beta']);
    expect(res.screenshots).toHaveLength(2);
    for (const shot of res.screenshots) {
      expect(existsSync(shot)).toBe(true);
      expect(statSync(shot).size).toBeGreaterThan(0);
    }
    expect(res.contactSheet).toBeDefined();
    expect(existsSync(res.contactSheet!)).toBe(true);
    expect(statSync(res.contactSheet!).size).toBeGreaterThan(0);
  }, 60_000);

  it('returns empty (no throw) when the scenes dir is absent — robust to Group A timing', async () => {
    const res = await renderContactSheet({
      scenesDir: join(tmpdir(), `butai-nonexistent-${process.pid}`),
    });
    expect(res.screenshots).toEqual([]);
    expect(res.sceneIds).toEqual([]);
    expect(res.contactSheet).toBeUndefined();
  });
});
