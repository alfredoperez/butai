/**
 * Shared e2e helpers. The per-surface specs (theme/slides/video/docs) import from here.
 */
import type { Page } from '@playwright/test';

/** Console/pageerror capture (library-web / playground pattern). */
export function captureErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}
