/**
 * Theme Studio e2e (phase-4 · Group A, Verification §3).
 *
 * Proves the core flow: load a theme → edit a token value → the injected `<style>`
 * override takes effect via pure CSS cascade, observable BOTH on a token swatch and
 * on a real kit slide's `.c-accent` (the styled-render / CSS-closure forcing
 * function). Plus: clearing a required token surfaces a validation error, the export
 * is a `[data-theme]{…}` block with all 17 required tokens, and zero console errors.
 */
import { expect, test } from '@playwright/test';
import { captureErrors } from './support';

const REQUIRED = [
  '--bg',
  '--bg-card',
  '--bg-nav',
  '--text',
  '--text-dim',
  '--accent',
  '--accent-glow',
  '--border',
  '--red',
  '--red-dim',
  '--green',
  '--green-dim',
  '--yellow',
  '--yellow-dim',
  '--orange',
  '--blue',
  '--blue-dim',
];

const bg = (el: Element) => getComputedStyle(el).backgroundColor;
const color = (el: Element) => getComputedStyle(el).color;

test('edit a token → preview updates on swatch + real kit slide; validation + export; no errors', async ({
  page,
}) => {
  const errors = captureErrors(page);

  await page.goto('/theme');

  // Editor rendered — the accent token field is present.
  const accentInput = page.getByTestId('token---accent');
  await expect(accentInput).toBeVisible();

  // Baseline swatch color (whatever the base theme's accent resolves to).
  const swatch = page.getByTestId('preview-accent');
  const before = await swatch.evaluate(bg);

  // ≥2 kit slides render (real EXAMPLES inside themed <Slide> frames).
  const slides = page.locator('[data-preview-slide] [data-slide]');
  await expect(slides.first()).toBeVisible();
  expect(await slides.count()).toBeGreaterThanOrEqual(2);

  // Edit --accent → the debounced <style> override recolors, via pure CSS cascade,
  // BOTH the token swatch AND the cover slide's `.c-accent` span. The latter only
  // resolves if slide-base.css loaded (the CSS-closure forcing function) AND the
  // theme override reaches the real kit slide.
  const coverAccent = page.locator('[data-preview-slide="cover-slide"] .c-accent').first();
  await accentInput.fill('#ff00ff');

  await expect.poll(() => swatch.evaluate(bg)).toBe('rgb(255, 0, 255)');
  await expect.poll(() => coverAccent.evaluate(color)).toBe('rgb(255, 0, 255)');
  expect(before, 'baseline accent should differ from the edited color').not.toBe(
    'rgb(255, 0, 255)',
  );

  // Clearing a required token surfaces a missing-required validation error.
  await page.getByTestId('token---bg').fill('');
  await expect(page.getByTestId('validation')).toContainText('Missing required token --bg');

  // Export is a [data-theme]{…} block containing all 17 required tokens.
  const exportCss = (await page.getByTestId('export-css').textContent()) ?? '';
  expect(exportCss).toContain('[data-theme="');
  for (const token of REQUIRED) {
    expect(exportCss, `export missing ${token}`).toContain(`${token}:`);
  }

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});
