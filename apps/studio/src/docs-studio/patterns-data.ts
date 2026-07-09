/*
 * Data seam for the Docs Studio (phase-6 · Group B). Read-only. Resolves two
 * things, both robust to Group A's timing (0..N real doc patterns):
 *
 *   1. Doc-pattern HTML — the framework-free pattern fragments. Prefers
 *      `@butai/docs-kit`'s committed `src/patterns/*.html` (Vite `?raw` glob →
 *      [] until Group A lands them); falls back to this studio's own bundled
 *      fixture patterns so the surface is never empty and the e2e always has
 *      something to exercise.
 *   2. Pattern metadata — from the kit's `PATTERNS` barrel (PatternMeta[], `[]`
 *      until Group A fills it from the generated `kind: page` catalog); falls
 *      back to id-derived titles.
 *
 * Theme token maps reuse the exact video-studio approach: the 13 shipped themes'
 * `[data-theme]` blocks, read as raw CSS and parsed with the frozen
 * `extractThemes` (the theme-studio pattern). Same-shaped `patternSrcdoc` builds
 * an isolated iframe document with a LATE `:root` theme override + a hidden token
 * probe, so a theme switch repaints the pattern via the token contract.
 */
import { extractThemes } from '@butai/patterns';
import { PATTERNS } from '@butai/docs-kit';
import { THEMES } from '@butai/themes';

// ── Doc-pattern HTML (raw) ────────────────────────────────────────────────────
// Real kit patterns win when Group A has landed them; else the bundled fixtures.
const KIT_PATTERNS = import.meta.glob('../../../../packages/docs-kit/src/patterns/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const FIXTURE_PATTERNS = import.meta.glob('./fixture-patterns/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// ── Theme CSS (raw) → token maps ──────────────────────────────────────────────
const RAW_THEME_CSS = import.meta.glob('../../../../packages/themes/themes/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function basename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

function idFromPath(path: string): string {
  return basename(path).replace(/\.html$/, '');
}

/** Title-case an id like `doc-hero` → `Doc Hero` when no metadata exists. */
function titleFromId(id: string): string {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export type DocPattern = {
  id: string;
  title: string;
  category: string;
  description?: string;
  html: string;
  /** True when this is a bundled fallback (Group A's real patterns not present yet). */
  fixture: boolean;
};

type PatternMetaLite = { id: string; name?: string; category?: string; description?: string };

const META_BY_ID: Record<string, PatternMetaLite> = Object.fromEntries(
  (PATTERNS as PatternMetaLite[]).map((m) => [m.id, m]),
);

/**
 * The doc patterns to render. Real kit patterns win when present; otherwise the
 * bundled fixtures keep the surface (and the e2e) meaningful. Sorted by id for
 * stability.
 */
export function loadPatterns(): DocPattern[] {
  const kitEntries = Object.entries(KIT_PATTERNS);
  const usingFixtures = kitEntries.length === 0;
  const entries = usingFixtures ? Object.entries(FIXTURE_PATTERNS) : kitEntries;

  return entries
    .map(([path, html]) => {
      const id = idFromPath(path);
      const meta = META_BY_ID[id];
      return {
        id,
        title: meta?.name ?? titleFromId(id),
        category: meta?.category ?? (usingFixtures ? 'fixture' : 'page'),
        description: meta?.description,
        html,
        fixture: usingFixtures,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** Theme id → token map (verbatim values), in manifest order. */
export function loadThemeTokens(): { id: string; label: string; tokens: Record<string, string> }[] {
  const byBasename = new Map<string, string>();
  for (const [path, css] of Object.entries(RAW_THEME_CSS)) byBasename.set(basename(path), css);

  return THEMES.map((manifest) => {
    const css = byBasename.get(basename(manifest.file)) ?? '';
    const extracted = extractThemes(css);
    const match = extracted.find((e) => e.theme === manifest.id) ?? extracted[0];
    return { id: manifest.id, label: manifest.label, tokens: match ? { ...match.tokens } : {} };
  });
}

/**
 * Build the `srcdoc` for a doc-pattern iframe: the pattern fragment, plus a LATE
 * `:root` override carrying the selected theme's tokens (so it wins over the
 * pattern's built-in fallback `:root`), plus a hidden token probe. The probe
 * reads the same `--accent`/`--bg` the pattern consumes, giving the e2e a
 * markup-independent restyle assertion (robust to whatever HTML Group A's
 * patterns ship).
 */
export function patternSrcdoc(html: string, tokens: Record<string, string>): string {
  const decls = Object.entries(tokens)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
  const inject =
    `<style data-theme-override>:root { ${decls} }</style>` +
    `<div data-token-probe aria-hidden="true" ` +
    `style="position:fixed;left:-9999px;top:0;color:var(--accent);background:var(--bg)"></div>`;

  // Insert just before </body> so the override lands after the pattern's head styles.
  const idx = html.lastIndexOf('</body>');
  if (idx !== -1) return html.slice(0, idx) + inject + html.slice(idx);
  return html + inject;
}
