/*
 * Data seam for the Video Studio (Group B). Read-only. Resolves three things,
 * all robust to Group A's timing (0..N real scenes):
 *
 *   1. Scene documents — the framework-free scene HTML. Prefers `@butai/scene-kit`'s
 *      committed `src/scenes/*.html` (Vite `?raw` glob → [] until Group A lands
 *      them); falls back to this studio's own bundled fixture scenes so the surface
 *      is never empty and the e2e always has something to exercise.
 *   2. Scene metadata — from the kit's `SCENES` barrel (PatternMeta[], `[]` until
 *      Group A fills it); falls back to id-derived titles.
 *   3. Theme token maps — the 13 shipped themes' `[data-theme]` blocks, read as raw
 *      CSS and parsed with the frozen `extractThemes` (the theme-studio pattern).
 */
import { extractThemes } from '@butai/patterns';
import { SCENES } from '@butai/scene-kit';
import { THEMES } from '@butai/themes';

// ── Scene HTML (raw) ──────────────────────────────────────────────────────────
const KIT_SCENES = import.meta.glob('../../../../packages/scene-kit/src/scenes/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const FIXTURE_SCENES = import.meta.glob('./fixture-scenes/*.html', {
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

/** Title-case an id like `title-card` → `Title Card` when no metadata exists. */
function titleFromId(id: string): string {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export type SceneDoc = {
  id: string;
  title: string;
  category: string;
  description?: string;
  html: string;
  /** True when this is a bundled fallback (Group A's real scenes not present yet). */
  fixture: boolean;
};

type SceneMeta = { id: string; name?: string; category?: string; description?: string };

const META_BY_ID: Record<string, SceneMeta> = Object.fromEntries(
  (SCENES as SceneMeta[]).map((m) => [m.id, m]),
);

/**
 * The scenes to render. Real kit scenes win when present; otherwise the bundled
 * fixtures keep the surface (and the e2e) meaningful. Sorted by id for stability.
 */
export function loadScenes(): SceneDoc[] {
  const kitEntries = Object.entries(KIT_SCENES);
  const usingFixtures = kitEntries.length === 0;
  const entries = usingFixtures ? Object.entries(FIXTURE_SCENES) : kitEntries;

  return entries
    .map(([path, html]) => {
      const id = idFromPath(path);
      const meta = META_BY_ID[id];
      return {
        id,
        title: meta?.name ?? titleFromId(id),
        category: meta?.category ?? (usingFixtures ? 'fixture' : 'scene'),
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
 * Build the `srcdoc` for a scene iframe: the scene document, plus a LATE `:root`
 * override carrying the selected theme's tokens (so it wins over the scene's
 * built-in fallback `:root`), plus a hidden token probe. The probe reads the same
 * `--accent`/`--bg` the scene consumes, giving the e2e a markup-independent
 * restyle assertion (robust to whatever HTML Group A's scenes ship).
 */
export function sceneSrcdoc(html: string, tokens: Record<string, string>): string {
  const decls = Object.entries(tokens)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
  const inject =
    `<style data-theme-override>:root { ${decls} }</style>` +
    `<div data-token-probe aria-hidden="true" ` +
    `style="position:fixed;left:-9999px;top:0;color:var(--accent);background:var(--bg)"></div>`;

  // Insert just before </body> so the override lands after the scene's head styles.
  const idx = html.lastIndexOf('</body>');
  if (idx !== -1) return html.slice(0, idx) + inject + html.slice(idx);
  return html + inject;
}
