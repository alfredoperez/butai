import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Vite + React setup for a butai deck.
export default defineConfig({
  plugins: [react()],
});
