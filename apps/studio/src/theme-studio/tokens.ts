/**
 * Theme Studio token model (phase-4 · Group A). Loads the 13 shipped themes'
 * token values by reading each theme CSS as raw text and running the frozen
 * `extractThemes()` from @butai/patterns, then groups the contract tokens into
 * editor sections. READ-ONLY over @butai/themes — we never write those files.
 */
import { TOKEN_CONTRACT, extractThemes, type ExtractedTheme } from '@butai/patterns';
import { THEMES, type ThemeManifestEntry } from '@butai/themes';

// Raw text of every theme CSS (Vite `?raw`), keyed by absolute-ish module path.
// The manifest's `file` is `themes/<id>.css`; we match on the basename.
const RAW_CSS = import.meta.glob('../../../../packages/themes/themes/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function basename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

/** All 13 themes with their extracted token maps, in manifest order. */
export function loadThemes(): { manifest: ThemeManifestEntry; tokens: Record<string, string> }[] {
  const byBasename = new Map<string, string>();
  for (const [path, css] of Object.entries(RAW_CSS)) byBasename.set(basename(path), css);

  return THEMES.map((manifest) => {
    const css = byBasename.get(basename(manifest.file)) ?? '';
    const extracted: ExtractedTheme[] = extractThemes(css);
    const match = extracted.find((e) => e.theme === manifest.id) ?? extracted[0];
    return { manifest, tokens: match ? { ...match.tokens } : {} };
  });
}

export type TokenKind = 'color' | 'font';

export type TokenSection = {
  label: string;
  /** Token names in this section, in display order. */
  tokens: string[];
  kind: TokenKind;
};

const REQUIRED = TOKEN_CONTRACT.required as readonly string[];
const RECOMMENDED = TOKEN_CONTRACT.recommended as readonly string[];

/**
 * Group the contract tokens (+ any extras present on the base theme) into
 * editor sections: surfaces / text / accent / semantic colors / fonts / grad.
 * `extras` are token names present on the theme but not in the fixed groups
 * (e.g. `--orange-dim`, `--grad-*`) — surfaced so they stay editable/exportable.
 */
export function sectionsFor(tokenNames: string[]): TokenSection[] {
  const seen = new Set<string>();
  const take = (names: readonly string[]) => {
    const out: string[] = [];
    for (const n of names) {
      if (tokenNames.includes(n) || REQUIRED.includes(n)) {
        out.push(n);
        seen.add(n);
      }
    }
    return out;
  };

  const surfaces = take(['--bg', '--bg-card', '--bg-nav', '--border']);
  const text = take(['--text', '--text-dim']);
  const accent = take(['--accent', '--accent-glow']);
  const semantic = take([
    '--red',
    '--red-dim',
    '--green',
    '--green-dim',
    '--yellow',
    '--yellow-dim',
    '--orange',
    '--orange-dim',
    '--blue',
    '--blue-dim',
  ]);
  const fonts = take(RECOMMENDED);

  // Any remaining tokens on the theme (grads, unknowns) — keep them editable.
  const grad = tokenNames.filter((n) => n.startsWith('--grad-') && !seen.has(n));
  grad.forEach((n) => seen.add(n));
  const other = tokenNames.filter((n) => !seen.has(n));

  const sections: TokenSection[] = [
    { label: 'Surfaces', tokens: surfaces, kind: 'color' },
    { label: 'Text', tokens: text, kind: 'color' },
    { label: 'Accent', tokens: accent, kind: 'color' },
    { label: 'Semantic colors', tokens: semantic, kind: 'color' },
    { label: 'Fonts', tokens: fonts, kind: 'font' },
  ];
  if (grad.length) sections.push({ label: 'Gradients', tokens: grad, kind: 'color' });
  if (other.length) sections.push({ label: 'Other', tokens: other, kind: 'color' });

  return sections.filter((s) => s.tokens.length > 0);
}

/** Best-effort `#rrggbb` for an `<input type="color">`. Non-hex values → null. */
export function toHexColor(value: string): string | null {
  const v = value.trim();
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
  return null;
}

/**
 * The non-empty token set used for validation. Emptying a field drops the key
 * so `validateThemeTokens` reports it missing (the "cleared required" flow).
 */
export function nonEmptyTokens(draft: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(draft)) {
    if (v.trim() !== '') out[k] = v.trim();
  }
  return out;
}

/**
 * Build the exportable `[data-theme="<name>"]{…}` CSS block. All 17 required
 * tokens are always emitted (falling back to the base theme value when the
 * draft field is empty) so the export is a complete, valid theme block.
 */
export function exportCss(
  name: string,
  draft: Record<string, string>,
  base: Record<string, string>,
): string {
  const emitted = new Set<string>();
  const lines: string[] = [];
  const push = (token: string, value: string) => {
    lines.push(`  ${token}: ${value};`);
    emitted.add(token);
  };

  // Required first (guaranteed present), in contract order.
  for (const token of REQUIRED) {
    const value = (draft[token] ?? '').trim() || (base[token] ?? '').trim();
    push(token, value);
  }
  // Recommended + any other non-empty draft tokens, in draft order.
  for (const [token, raw] of Object.entries(draft)) {
    if (emitted.has(token)) continue;
    const value = raw.trim();
    if (value === '') continue;
    push(token, value);
  }

  const safeName = name.trim() || 'custom-theme';
  return `[data-theme="${safeName}"] {\n${lines.join('\n')}\n}\n`;
}
