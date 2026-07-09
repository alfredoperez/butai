/**
 * Kit gallery e2e (plan phase-3 · Group C, Verification §9). Data-driven off
 * the committed slide-kit catalog: /kit lists exactly `catalog.count` items,
 * and every archetype renders at /kit/:id with zero console errors — the same
 * console/pageerror capture P2 uses in deck.spec.ts.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

interface CatalogItem {
  id: string;
  name: string;
  category: string;
}
interface Catalog {
  count: number;
  items: CatalogItem[];
}

const catalog: Catalog = JSON.parse(
  readFileSync(
    fileURLToPath(
      new URL('../../../packages/slide-kit/catalog/catalog.json', import.meta.url),
    ),
    'utf8',
  ),
) as Catalog;

/** Console/pageerror capture — identical to deck.spec.ts (P2). */
function captureErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test('/kit lists exactly catalog.count archetypes, zero console errors', async ({ page }) => {
  const errors = captureErrors(page);

  await page.goto('/kit');
  await expect(page.locator('[data-kit-item]')).toHaveCount(catalog.count);

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});

// One data-driven test per cataloged id (loop bounded to the catalog).
for (const item of catalog.items) {
  test(`/kit/${item.id} renders its example, zero console errors`, async ({ page }) => {
    const errors = captureErrors(page);

    await page.goto(`/kit/${item.id}`);

    // The example renders exactly one <Slide> (its `.slide` / [data-slide] root),
    // forced visible by the gallery frame.
    const slide = page.locator('[data-slide]');
    await expect(slide).toHaveCount(1);
    await expect(slide).toBeVisible();

    expect(errors, `console errors for ${item.id}: ${errors.join(' | ')}`).toEqual([]);
  });
}
