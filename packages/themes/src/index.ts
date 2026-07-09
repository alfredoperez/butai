/** @butai/themes — theme CSS + manifest (P1 group C). */
// The token contract lives at its planned home in @butai/patterns
// (src/tokens/contract.ts) since P1 iter 2; re-exported here so the
// @butai/themes API is unchanged.
export { TOKEN_CONTRACT, extractThemes, validateThemeTokens, tokensFromSpec } from '@butai/patterns';
export type { ExtractedTheme } from '@butai/patterns';

export type ThemeManifestEntry = { id: string; label: string; mode: 'dark' | 'light'; file: string };

/** Theme manifest — one entry per CSS file under `themes/`. */
export const THEMES: ThemeManifestEntry[] = [
  // Ported originals (provenance: THEMES-PROVENANCE.md)
  { id: 'brand', label: 'Brand', mode: 'light', file: 'themes/brand.css' },
  { id: 'dark', label: 'Dark', mode: 'dark', file: 'themes/dark.css' },
  { id: 'light', label: 'Light', mode: 'light', file: 'themes/light.css' },
  { id: 'aurora', label: 'Aurora', mode: 'dark', file: 'themes/aurora.css' },
  { id: 'glassmorphism', label: 'Glassmorphism', mode: 'dark', file: 'themes/glassmorphism.css' },
  { id: 'neon', label: 'Neon', mode: 'dark', file: 'themes/neon.css' },
  { id: 'warm-noir', label: 'Warm Noir', mode: 'dark', file: 'themes/warm-noir.css' },
  { id: 'brutalist', label: 'Brutalist', mode: 'dark', file: 'themes/brutalist.css' },
  { id: 'midnight-coral', label: 'Midnight Coral', mode: 'dark', file: 'themes/midnight-coral.css' },
  // butai originals (authored fresh for P1)
  { id: 'blueprint', label: 'Blueprint', mode: 'dark', file: 'themes/blueprint.css' },
  { id: 'atelier', label: 'Atelier', mode: 'light', file: 'themes/atelier.css' },
  { id: 'stage', label: 'Stage', mode: 'dark', file: 'themes/stage.css' },
  { id: 'marker', label: 'Marker', mode: 'light', file: 'themes/marker.css' },
];
