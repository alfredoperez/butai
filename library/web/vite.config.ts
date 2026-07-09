import { defineConfig } from 'vite';

// Demo harness app (vanilla TS, no React). The library itself builds with tsc.
export default defineConfig({
  root: 'demos',
  build: {
    outDir: '../dist-demos',
    emptyOutDir: true,
  },
});
