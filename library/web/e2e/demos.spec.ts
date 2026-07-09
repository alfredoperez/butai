import { expect, test } from '@playwright/test';

// Smoke for the recipe demo harness: catalog renders, a demo runs, console is clean.

test('index lists >= 50 recipes with zero console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto('/');
  await expect(page.locator('h1')).toContainText('GSAP recipe demos');

  const rows = page.locator('[data-recipe-id]');
  expect(await rows.count()).toBeGreaterThanOrEqual(50);

  // every category section rendered
  for (const category of ['svg-diagram', 'text', 'transitions', 'attention', 'background', 'utility']) {
    await expect(page.locator('h2.category', { hasText: category })).toBeVisible();
  }

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});

test('clicking Run on ui-13 mounts the counter demo into the stage', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto('/');
  const stage = page.locator('#stage');
  await expect(stage.locator('.counter')).toHaveCount(0);

  await page.locator('button[data-run="ui-13-counter-odometer"]').click();

  await expect(stage).toHaveAttribute('data-active-demo', 'ui-13-counter-odometer');
  await expect(stage.locator('.counter')).toBeVisible();
  // the tween lands on the exact formatted target value
  await expect(stage.locator('.counter')).toHaveText('12,847 installs', { timeout: 5_000 });

  expect(errors, `page errors: ${errors.join(' | ')}`).toEqual([]);
});

test('a second demo (draw-on) also mounts and mutates the stage', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[data-run="svg-01-stroke-draw-on"]').click();
  const stage = page.locator('#stage');
  await expect(stage).toHaveAttribute('data-active-demo', 'svg-01-stroke-draw-on');
  await expect(stage.locator('svg .draw')).toHaveCount(4);
});
