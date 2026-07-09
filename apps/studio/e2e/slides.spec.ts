/**
 * Slide Studio e2e (phase-4 · Group B / Verification §4). Data-driven off the
 * committed slide-kit catalog. Proves the core flow:
 *   • /slides browses all catalog.count archetypes, grouped, with search
 *   • picking one renders it STYLED inside the themed deck frame — a computed-style
 *     assertion proves the theme cascade + slide-base apply, not browser defaults
 *     (the CSS-closure forcing-function proof, studio side; styled via the
 *     `@butai/slide-kit/styles/index.css` aggregator)
 *   • editing a scalar prop updates the live preview
 *   • the `butai add <id>` command + its resolved closure (incl. slide-base) show
 *   • zero console errors throughout (same capture pattern as playground specs)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

interface CatalogItem {
  id: string;
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

/** Console/pageerror capture — identical to the playground specs (P2/P3). */
function captureErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test('/slides browses all cataloged archetypes, zero console errors', async ({ page }) => {
  const errors = captureErrors(page);

  await page.goto('/slides');
  await expect(page.locator('[data-catalog-item]')).toHaveCount(catalog.count);

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});

test('search narrows the browse list', async ({ page }) => {
  await page.goto('/slides');
  await page.locator('[data-archetype-search]').fill('cover');
  const count = await page.locator('[data-catalog-item]').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(catalog.count);
});

test('picking an archetype renders it STYLED in the themed preview frame', async ({
  page,
}) => {
  const errors = captureErrors(page);

  await page.goto('/slides');

  // (1) Theme cascade — concept-slide renders `.c-accent`. Under the brand theme
  // the --accent token (#d30800) reaches it; a browser default would be an
  // inherited near-black, never this red. Proves the theme CSS is loaded + scoped.
  await page.locator('[data-archetype-id="concept-slide"]').click();

  const stage = page.locator('[data-slide-preview]');
  await expect(stage).toHaveAttribute('data-theme', 'brand');

  const slide = stage.locator('[data-slide]');
  await expect(slide).toHaveCount(1);
  await expect(slide).toBeVisible();

  const accentColor = await slide
    .locator('.c-accent')
    .first()
    .evaluate((el) => getComputedStyle(el).color);
  expect(accentColor).toBe('rgb(211, 8, 0)');

  // (2) slide-base loaded — image-caption-slide renders an `img.screenshot-full`,
  // and `.screenshot-full { border-radius: 8px }` is a rule defined ONLY in
  // slide-base.css (no engine/theme rule touches it). Browser default is `0px`,
  // so this passes only when the slide-base closure style is present.
  await page.locator('[data-archetype-id="image-caption-slide"]').click();
  const shot = stage.locator('.screenshot-full').first();
  await expect(shot).toBeVisible();
  const radius = await shot.evaluate((el) => getComputedStyle(el).borderRadius);
  expect(radius).toBe('8px');

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});

test('editing a scalar prop updates the live preview', async ({ page }) => {
  await page.goto('/slides');
  await page.locator('[data-archetype-id="concept-slide"]').click();

  const slide = page.locator('[data-slide-preview] [data-slide]');
  await expect(slide).toContainText('The Concept'); // canonical eyebrow

  await page.locator('[data-prop-input="eyebrow"]').fill('Reframed Idea');
  await expect(slide).toContainText('Reframed Idea');
  await expect(slide).not.toContainText('The Concept');
});

test('the butai add command + resolved closure (incl. slide-base) show', async ({
  page,
}) => {
  await page.goto('/slides');
  await page.locator('[data-archetype-id="concept-slide"]').click();

  await expect(page.locator('[data-add-command]')).toHaveText('butai add concept-slide');

  // concept-slide's registryDependencies are label + subtitle; every slide's
  // closure also pulls slide-base (the CSS-closure fix).
  await expect(page.locator('[data-closure-item="slide-base"]')).toBeVisible();
  await expect(page.locator('[data-closure-item="label"]')).toBeVisible();
  await expect(page.locator('[data-closure-item="subtitle"]')).toBeVisible();

  await expect(page.locator('[data-copy-command]')).toBeVisible();
});
