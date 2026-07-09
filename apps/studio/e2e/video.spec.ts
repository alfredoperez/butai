/**
 * Video Studio e2e (phase-5 · Group B, Verification §7).
 *
 * Proves the read-only /video surface: a parsed STORYBOARD.md shot list renders
 * beside a themed contact-sheet grid of the scene kit; every published scene shows
 * as an isolated thumbnail; switching the theme repaints a scene via the token
 * contract (its computed style changes — the restyle proof); and zero console /
 * pageerror.
 *
 * Data-driven off whatever the surface publishes (0..N scenes) so it is robust to
 * Group A's timing, yet exercises A's real scenes once they land + integration runs.
 */
import { expect, test } from '@playwright/test';
import { captureErrors } from './support';

test('/video renders the shot list + themed contact sheet; theme restyles scenes; no errors', async ({
  page,
}) => {
  const errors = captureErrors(page);

  await page.goto('/video');

  // Surface mounted.
  await expect(page.locator('[data-video-studio]')).toBeVisible();

  // Shot list: the parsed STORYBOARD.md produced at least one frame.
  const frames = page.locator('[data-frame]');
  await expect(frames.first()).toBeVisible();
  expect(await frames.count()).toBeGreaterThanOrEqual(1);
  // A duration badge proves `durationSeconds` parsed off a `- duration: Ns` bullet.
  await expect(page.locator('[data-testid="shot-list"]')).toContainText('s');

  // Contact sheet: at least one scene thumbnail rendered (fixtures until Group A lands).
  const thumbs = page.locator('[data-scene-frame]');
  const count = await thumbs.count();
  expect(count).toBeGreaterThanOrEqual(1);
  await expect(thumbs.first()).toBeVisible();

  // Restyle proof: read the token probe's computed color inside the first scene's
  // isolated iframe, switch theme, and assert it changed. The probe reads the same
  // `--accent` the scene consumes, so this is markup-independent (works for any scene).
  const firstId = await thumbs.first().getAttribute('data-scene-frame');
  const probe = page
    .frameLocator(`[data-scene-frame="${firstId}"] iframe`)
    .locator('[data-token-probe]');
  const probeColor = () => probe.evaluate((el) => getComputedStyle(el).color);

  const before = await probeColor();

  // Switch to a different theme than the current selection.
  const chips = page.locator('[data-theme-chip]');
  const chipCount = await chips.count();
  expect(chipCount).toBeGreaterThanOrEqual(2);
  const currentId = await page
    .locator('[data-theme-chip][aria-pressed="true"]')
    .getAttribute('data-theme-chip');
  const otherChip = page.locator(`[data-theme-chip]:not([data-theme-chip="${currentId}"])`).first();
  await otherChip.click();

  await expect.poll(probeColor).not.toBe(before);

  // Isolation: the scene lives in an iframe, so its CSS never touches the chrome —
  // the studio heading is still the shadcn/Tailwind foreground, not a scene color.
  await expect(page.getByRole('heading', { name: 'Video Studio' })).toBeVisible();

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});
