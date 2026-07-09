import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// shadcn/ui + Tailwind demo site (phase-4 §0.2). `@tailwindcss/vite` is Tailwind v4's
// first-class plugin — no PostCSS config. Read-only explore surface: no persistence.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
