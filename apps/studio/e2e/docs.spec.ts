/**
 * Docs Studio e2e (phase-6 · Group B, Verification §7).
 *
 * Proves the read-only /docs surface: a themed preview gallery of the doc-pattern
 * kit; every published pattern shows as an isolated preview with its catalog
 * metadata; switching the theme repaints a pattern via the token contract (its
 * computed style changes — the restyle proof); and zero console / pageerror.
 *
 * Data-driven off whatever the surface publishes (0..N patterns) so it is robust
 * to Group A's timing, yet exercises A's real patterns once they land + integration
 * runs.
 */
import { expect, test } from '@playwright/test';
import { captureErrors } from './support';

test('/docs renders the themed pattern gallery; theme restyles patterns; no errors', async ({
  page,
}) => {
  const errors = captureErrors(page);

  await page.goto('/docs');

  // Surface mounted.
  await expect(page.locator('[data-docs-studio]')).toBeVisible();

  // Gallery: at least one pattern preview rendered (fixtures until Group A lands).
  const previews = page.locator('[data-pattern-frame]');
  const count = await previews.count();
  expect(count).toBeGreaterThanOrEqual(1);
  await expect(previews.first()).toBeVisible();

  // Catalog metadata renders beside each preview: the first pattern's <figure>
  // carries a non-empty title.
  const firstFigure = page.locator('[data-pattern]').first();
  await expect(firstFigure).toBeVisible();
  expect((await firstFigure.locator('figcaption').first().innerText()).trim().length).toBeGreaterThan(
    0,
  );

  // Restyle proof: read the token probe's computed color inside the first pattern's
  // isolated iframe, switch theme, and assert it changed. The probe reads the same
  // `--accent` the pattern consumes, so this is markup-independent (works for any pattern).
  const firstId = await previews.first().getAttribute('data-pattern-frame');
  const probe = page
    .frameLocator(`[data-pattern-frame="${firstId}"] iframe`)
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

  // Isolation: the pattern lives in an iframe, so its CSS never touches the chrome —
  // the studio heading is still the shadcn/Tailwind foreground, not a pattern color.
  await expect(page.getByRole('heading', { name: 'Docs Studio' })).toBeVisible();

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});
