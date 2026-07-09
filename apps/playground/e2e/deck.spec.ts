/**
 * Deck e2e — verification contract items: deck renders · keyboard
 * advance/steps · presenter/help overlays · print computed styles ·
 * theme token flip (plan phase-2.md §Verification contract).
 */
import { expect, test, type Page } from '@playwright/test';

/** Console/pageerror capture, library-web pattern. */
function captureErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

const counter = (page: Page) => page.locator('.slide-counter');

test('deck renders: cover h1, counter 1 / 3, zero console errors', async ({ page }) => {
  const errors = captureErrors(page);

  await page.goto('/');
  await expect(page.locator('.slide.active h1')).toHaveText('Butai Demo');
  await expect(counter(page)).toHaveText('1 / 3');

  expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([]);
});

test('deep link /2 lands directly on slide 2', async ({ page }) => {
  await page.goto('/2');
  await expect(counter(page)).toHaveText('2 / 3');
});

test('keyboard: steps reveal before the slide advances; arrows + Space navigate', async ({
  page,
}) => {
  await page.goto('/');
  await expect(counter(page)).toHaveText('1 / 3');

  // Cover has no steps → ArrowRight goes straight to slide 2.
  await page.keyboard.press('ArrowRight');
  await expect(counter(page)).toHaveText('2 / 3');

  const steps = page.locator('.slide.active [data-step]');
  await expect(steps).toHaveCount(2);
  await expect(steps.nth(0)).not.toHaveClass(/step-visible/);

  // Two advances reveal the two steps — the slide must NOT change yet.
  await page.keyboard.press('ArrowRight');
  await expect(steps.nth(0)).toHaveClass(/step-visible/);
  await expect(steps.nth(1)).not.toHaveClass(/step-visible/);
  await expect(counter(page)).toHaveText('2 / 3');

  await page.keyboard.press('ArrowRight');
  await expect(steps.nth(1)).toHaveClass(/step-visible/);
  await expect(counter(page)).toHaveText('2 / 3');

  // Steps exhausted → now the slide advances.
  await page.keyboard.press('ArrowRight');
  await expect(counter(page)).toHaveText('3 / 3');

  // ArrowLeft returns.
  await page.keyboard.press('ArrowLeft');
  await expect(counter(page)).toHaveText('2 / 3');

  // Space also advances (steps on slide 2 are already revealed).
  await page.keyboard.press('Space');
  await expect(counter(page)).toHaveText('3 / 3');
});

test('presenter overlay: position, fixture note, next title; Esc closes', async ({ page }) => {
  await page.goto('/');
  // Wait for the engine to mount (its keydown listener registers in an
  // effect) — a keystroke fired before that is silently lost.
  await expect(counter(page)).toHaveText('1 / 3');

  await page.keyboard.press('p');
  const pv = page.locator('.eng-panel--pv');
  await expect(pv).toBeVisible();
  await expect(pv).toContainText('1 / 3');
  await expect(pv).toContainText('Welcome note for presenter view');
  await expect(pv).toContainText('Next →');

  await page.keyboard.press('Escape');
  await expect(pv).toHaveCount(0);
});

test('help overlay: lists shortcuts, no Cursor row', async ({ page }) => {
  await page.goto('/');
  // Same mount wait as the presenter test — key presses before the engine's
  // keydown effect runs are lost.
  await expect(counter(page)).toHaveText('1 / 3');

  await page.keyboard.press('?');
  const help = page.locator('.eng-panel--help');
  await expect(help).toBeVisible();
  await expect(help).toContainText('Next step / slide');
  await expect(help).toContainText('Theme picker');
  await expect(help).toContainText('Fullscreen');
  // The engine binds no cursor/laser key (kit territory, P3) — the help
  // overlay must not advertise one (plan Q4 cut 5).
  await expect(help).not.toContainText('Cursor');

  await page.keyboard.press('Escape');
  await expect(help).toHaveCount(0);
});

test('grid overview: G shows the contact sheet, click jumps, Esc closes', async ({ page }) => {
  await page.goto('/');
  // Engine mount wait (keydown listener registers in an effect).
  await expect(counter(page)).toHaveText('1 / 3');

  await page.keyboard.press('g');
  const sheet = page.locator('.deck-ov');
  await expect(sheet).toBeVisible();

  // One cell per slide; the current slide is highlighted.
  const cells = page.locator('.deck-ov__cell');
  await expect(cells).toHaveCount(3);
  await expect(cells.nth(0)).toHaveClass(/is-current/);

  // The REAL slides are forced visible and scaled into their cells
  // (mode class on the area + an inline translate/scale per slide).
  await expect(page.locator('.slide-area.is-overview')).toHaveCount(1);
  const slide2 = page.locator('[data-slide]').nth(1);
  await expect(slide2).toBeVisible();
  const inline = await slide2.evaluate((el) => (el as HTMLElement).style.transform);
  expect(inline, 'slide 2 carries an inline overview transform').toContain('scale(');

  // Clicking a cell jumps there and exits overview.
  await cells.nth(2).click();
  await expect(sheet).toHaveCount(0);
  await expect(counter(page)).toHaveText('3 / 3');

  // The mode fully restores: class gone, inline transform cleared.
  await expect(page.locator('.slide-area.is-overview')).toHaveCount(0);
  const restored = await slide2.evaluate((el) => (el as HTMLElement).style.transform);
  expect(restored, 'overview transform cleared on exit').toBe('');

  // G re-opens; Escape closes without changing the slide.
  await page.keyboard.press('g');
  await expect(sheet).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCount(0);
  await expect(counter(page)).toHaveText('3 / 3');
});

test('print CSS: every slide paginates as a flex page, chrome hidden', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });

  const slides = page.locator('[data-slide]');
  await expect(slides).toHaveCount(3);

  for (let i = 0; i < 3; i++) {
    const style = await slides.nth(i).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { display: cs.display, breakAfter: cs.breakAfter };
    });
    expect(style.display, `slide ${i + 1} display in print`).toBe('flex');
    expect(style.breakAfter, `slide ${i + 1} break-after in print`).toBe(
      i === 2 ? 'auto' : 'page',
    );
  }

  for (const selector of ['.slide-toolbar', '.progress-bar', '.slide-dots']) {
    const display = await page
      .locator(selector)
      .evaluate((el) => getComputedStyle(el).display);
    expect(display, `${selector} hidden in print`).toBe('none');
  }
});

test('theme picker: lists the 13 manifest themes; selecting flips tokens', async ({ page }) => {
  await page.goto('/');

  const readBg = () =>
    page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
    );

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const bgBefore = await readBg();
  expect(bgBefore).not.toBe('');

  const buttonsBefore = await page.locator('button').count();
  await page.keyboard.press('t');

  // Target `light` for the token flip: its --bg (#fafaf8) genuinely differs
  // from dark's. (blueprint deliberately shares dark's #0f0f13 ground, so it
  // cannot prove the flip even though its other tokens change.)
  const light = page.getByRole('button', { name: /light/i });
  await expect(light).toBeVisible();
  await expect(page.getByRole('button', { name: /blueprint/i })).toBeVisible();

  // Picker lists exactly the 13 manifest themes (button delta vs deck chrome).
  const buttonsAfter = await page.locator('button').count();
  expect(buttonsAfter - buttonsBefore).toBe(13);
  await expect(page.getByRole('button', { name: /atelier/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /warm.noir/i })).toBeVisible();

  await light.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const bgAfter = await readBg();
  expect(bgAfter).not.toBe('');
  expect(bgAfter, '--bg must change when the theme changes').not.toBe(bgBefore);
});
