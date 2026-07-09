import { readFileSync, readdirSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { THEMES, extractThemes, validateThemeTokens } from './index';

const themesDir = fileURLToPath(new URL('../themes/', import.meta.url));
const cssFiles = readdirSync(themesDir).filter((f) => f.endsWith('.css')).sort();

/** Theme ids that must never appear: the zarazhangrui/frontend-slides bulk imports. */
const EXCLUDED_THEME_IDS = [
  // frontend-slides.css (12 style presets)
  'bold-signal', 'electric-studio', 'creative-voltage', 'dark-botanical',
  'notebook-tabs', 'pastel-geometry', 'split-pastel', 'vintage-editorial',
  'neon-cyber', 'terminal-green', 'swiss-modern', 'paper-ink',
  // frontend-slides-bold.css (34 bold-template-pack themes)
  '8-bit-orbit', 'biennale-yellow', 'block-frame', 'blue-professional',
  'bold-poster', 'broadside', 'capsule', 'cartesian', 'cobalt-grid', 'coral',
  'creative-mode', 'daisy-days', 'editorial-forest', 'editorial-tri-tone',
  'emerald-editorial', 'grove', 'long-table', 'mat', 'monochrome',
  'neo-grid-bold', 'peoples-platform', 'pin-and-paper', 'pink-script',
  'playful', 'raw-grid', 'retro-windows', 'retro-zine', 'sakura-chroma',
  'scatterbrain', 'signal', 'soft-editorial', 'stencil-tablet', 'studio',
  'vellum',
];

describe('shipped theme CSS files', () => {
  it('ships between 11 and 14 theme files', () => {
    expect(cssFiles.length).toBeGreaterThanOrEqual(11);
    expect(cssFiles.length).toBeLessThanOrEqual(14);
  });

  it.each(cssFiles)('%s defines exactly one theme matching its filename', (file) => {
    const themes = extractThemes(readFileSync(`${themesDir}${file}`, 'utf8'));
    expect(themes).toHaveLength(1);
    expect(themes[0].theme).toBe(basename(file, '.css'));
  });

  it.each(cssFiles)('%s passes the token contract with zero errors', (file) => {
    const [{ tokens }] = extractThemes(readFileSync(`${themesDir}${file}`, 'utf8'));
    const errors = validateThemeTokens(tokens).filter((d) => d.level === 'error');
    expect(errors).toEqual([]);
  });

  it('contains no excluded frontend-slides theme ids or attribution strings', () => {
    for (const file of cssFiles) {
      const css = readFileSync(`${themesDir}${file}`, 'utf8');
      expect(css).not.toContain('frontend-slides');
      for (const id of EXCLUDED_THEME_IDS) {
        expect(css).not.toContain(`[data-theme="${id}"]`);
      }
    }
  });

  it('keeps the manifest and the themes/ directory in one-to-one sync', () => {
    const manifestFiles = THEMES.map((t) => basename(t.file)).sort();
    expect(manifestFiles).toEqual(cssFiles);
  });

  it('gives every butai original the recommended font tokens and an authored header', () => {
    for (const id of ['blueprint', 'atelier', 'stage', 'marker']) {
      const css = readFileSync(`${themesDir}${id}.css`, 'utf8');
      expect(css).toContain('butai original — authored for butai P1');
      const [{ tokens }] = extractThemes(css);
      for (const font of ['--font-display', '--font-body', '--font-mono']) {
        expect(tokens[font]).toBeDefined();
      }
    }
  });
});
