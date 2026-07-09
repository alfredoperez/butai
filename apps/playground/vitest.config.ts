import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // e2e/ belongs to Playwright, not vitest (library-web pattern).
    include: ['src/**/*.test.ts'],
  },
});
