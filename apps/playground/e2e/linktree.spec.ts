/**
 * Linktree e2e — verification contract item: /links renders fixture-only
 * content (plan phase-2.md §Verification contract).
 */
import { expect, test, type Page } from '@playwright/test';

function captureErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test('linktree route renders fixtures only', async ({ page }) => {
  const errors = captureErrors(page);

  await page.goto('/links');

  // Speaker + talk come straight from src/fixtures.ts.
  await expect(page.locator('.lt-speaker__name')).toHaveText('Playground Speaker');
  await expect(page.locator('.lt-talk__title')).toHaveText('Demo Talk');

  // ≥3 link rows, all pointing at example.com.
  const fixtureRows = page.locator('a.lt-row[href^="https://example.com"]');
  expect(await fixtureRows.count()).toBeGreaterThanOrEqual(3);

  // The deck CTA links back to the demo deck at /.
  await expect(page.locator('.lt-row--primary')).toHaveAttribute('href', '/');

  // Served page references only the fixture host (example.com) and the local
  // deck route — no external/personal content leaks into the served page.
  const externalLinks = await page
    .locator('a[href^="http"]:not([href^="https://example.com"])')
    .count();
  expect(externalLinks, 'unexpected external link in linktree').toBe(0);

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});
