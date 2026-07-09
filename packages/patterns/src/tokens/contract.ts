/**
 * Token contract — defines the NAMES and ROLES every butai theme must fill.
 * No values live here; a brand (a theme CSS file, a frame.md) supplies them
 * from outside.
 */
import type { DesignSpec, Diagnostic } from '../types.js';

export const TOKEN_CONTRACT = {
  required: [
    '--bg',
    '--bg-card',
    '--bg-nav',
    '--text',
    '--text-dim',
    '--accent',
    '--accent-glow',
    '--border',
    '--red',
    '--red-dim',
    '--green',
    '--green-dim',
    '--yellow',
    '--yellow-dim',
    '--orange',
    '--blue',
    '--blue-dim',
  ],
  recommended: ['--font-display', '--font-body', '--font-mono'],
  optionalPrefixes: ['--grad-'],
} as const;

export type ExtractedTheme = { theme: string; tokens: Record<string, string> };

/**
 * Parse every `[data-theme="x"]` block out of a CSS string via a light scan
 * (no heavy CSS parser dep). Custom-property declarations from all blocks
 * targeting the same theme name (e.g. `[data-theme="x"]` and
 * `html[data-theme="x"] body`) are merged into one entry per theme, in
 * first-seen order. Values are passed through verbatim (trimmed only).
 */
export function extractThemes(css: string): ExtractedTheme[] {
  // Strip comments first so `[data-theme="…"]` mentions in prose never match.
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const byTheme = new Map<string, Record<string, string>>();
  const selectorRe = /\[data-theme="([^"]+)"\]/g;

  let match: RegExpExecArray | null;
  while ((match = selectorRe.exec(source)) !== null) {
    const theme = match[1];
    const open = source.indexOf('{', match.index);
    if (open === -1) continue;
    const close = source.indexOf('}', open);
    if (close === -1) continue;
    const block = source.slice(open + 1, close);

    const tokens = byTheme.get(theme) ?? {};
    const declRe = /(--[A-Za-z0-9-]+)\s*:\s*([^;}]+)/g;
    let decl: RegExpExecArray | null;
    while ((decl = declRe.exec(block)) !== null) {
      tokens[decl[1]] = decl[2].trim();
    }
    byTheme.set(theme, tokens);
    // Continue scanning after this selector occurrence (not after the block:
    // a comma-separated selector list may name another theme before `{`).
  }

  return [...byTheme.entries()].map(([theme, tokens]) => ({ theme, tokens }));
}

/**
 * Validate a theme's token set against the contract.
 * - Every required token must be present → error `missing-token`.
 * - Any `--var` not in the contract (required + recommended) and not matching
 *   an optional prefix → warning `unknown-token`.
 */
export function validateThemeTokens(tokens: Record<string, string>): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  for (const name of TOKEN_CONTRACT.required) {
    if (!(name in tokens)) {
      diagnostics.push({
        level: 'error',
        code: 'missing-token',
        message: `Missing required token ${name}`,
      });
    }
  }

  const known = new Set<string>([...TOKEN_CONTRACT.required, ...TOKEN_CONTRACT.recommended]);
  for (const name of Object.keys(tokens)) {
    if (known.has(name)) continue;
    if (TOKEN_CONTRACT.optionalPrefixes.some((prefix) => name.startsWith(prefix))) continue;
    diagnostics.push({
      level: 'warning',
      code: 'unknown-token',
      message: `Token ${name} is not part of the contract`,
    });
  }

  return diagnostics;
}

/** Spec color key → contract token. First key wins where two map to one role. */
const SPEC_COLOR_ROLES: { token: string; keys: string[] }[] = [
  { token: '--bg', keys: ['bg'] },
  { token: '--bg-card', keys: ['panel'] },
  { token: '--text', keys: ['ink'] },
  { token: '--text-dim', keys: ['muted'] },
  { token: '--accent', keys: ['accent', 'blue'] },
  { token: '--border', keys: ['grid', 'border'] },
];

const SPEC_TYPOGRAPHY_ROLES: { token: string; key: string }[] = [
  { token: '--font-display', key: 'display' },
  { token: '--font-body', key: 'body' },
  { token: '--font-mono', key: 'mono' },
];

/**
 * Bridge a parsed design spec (frame.md / design.md) into contract tokens.
 * Default mapping: bg→--bg, panel→--bg-card, ink→--text, muted→--text-dim,
 * accent|blue→--accent, grid|border→--border. Spec colors nothing consumes
 * surface as `unmapped-color` warnings. Explicit overrides always win.
 */
export function tokensFromSpec(
  spec: DesignSpec,
  overrides?: Record<string, string>,
): { tokens: Record<string, string>; diagnostics: Diagnostic[] } {
  const tokens: Record<string, string> = {};
  const diagnostics: Diagnostic[] = [];
  const consumed = new Set<string>();

  for (const role of SPEC_COLOR_ROLES) {
    for (const key of role.keys) {
      const value = spec.colors[key];
      if (value !== undefined) {
        tokens[role.token] = value;
        consumed.add(key);
        break;
      }
    }
  }

  for (const key of Object.keys(spec.colors)) {
    if (consumed.has(key)) continue;
    diagnostics.push({
      level: 'warning',
      code: 'unmapped-color',
      message: `Spec color "${key}" has no default token mapping`,
    });
  }

  for (const role of SPEC_TYPOGRAPHY_ROLES) {
    const value = spec.typography[role.key];
    if (value !== undefined) tokens[role.token] = value;
  }

  if (overrides) Object.assign(tokens, overrides);

  return { tokens, diagnostics };
}
