import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { loadDesignSpec } from '../spec/resolve';
import { TOKEN_CONTRACT, extractThemes, tokensFromSpec, validateThemeTokens } from './contract';

// The shipped theme CSS lives in @butai/themes; the contract validates it from here.
const themesDir = fileURLToPath(new URL('../../../themes/themes/', import.meta.url));
const read = (name: string) => readFileSync(`${themesDir}${name}`, 'utf8');

describe('extractThemes', () => {
  it('extracts a real ported theme file with verbatim values', () => {
    const themes = extractThemes(read('brand.css'));
    expect(themes).toHaveLength(1);
    expect(themes[0].theme).toBe('brand');
    expect(themes[0].tokens['--bg']).toBe('#fbefd9');
    expect(themes[0].tokens['--accent']).toBe('#d30800');
    expect(themes[0].tokens['--border']).toBe('rgba(26, 19, 16, 0.14)');
  });

  it('merges multiple [data-theme] blocks for the same theme into one entry', () => {
    // neon.css has the token block plus many html[data-theme="neon"] rules
    const themes = extractThemes(read('neon.css'));
    expect(themes).toHaveLength(1);
    expect(themes[0].theme).toBe('neon');
    expect(themes[0].tokens['--accent']).toBe('#00ff88');
  });

  it('ignores [data-theme] mentions inside comments', () => {
    const css = `/* [data-theme="ghost"] { --bg: #000; } */\n[data-theme="real"] { --bg: #111111; }`;
    const themes = extractThemes(css);
    expect(themes).toHaveLength(1);
    expect(themes[0].theme).toBe('real');
  });

  it('preserves exact value casing (no lowercasing or normalization)', () => {
    const themes = extractThemes(`[data-theme="x"] { --bg: #0F0F13; --accent-glow: color-mix(in srgb, var(--accent) 18%, transparent); }`);
    expect(themes[0].tokens['--bg']).toBe('#0F0F13');
    expect(themes[0].tokens['--accent-glow']).toBe('color-mix(in srgb, var(--accent) 18%, transparent)');
  });
});

describe('validateThemeTokens', () => {
  it('is green (zero errors) for a shipped theme', () => {
    const [{ tokens }] = extractThemes(read('blueprint.css'));
    const errors = validateThemeTokens(tokens).filter((d) => d.level === 'error');
    expect(errors).toEqual([]);
  });

  it('is red for a theme missing --accent', () => {
    const [{ tokens }] = extractThemes(read('brand.css'));
    delete tokens['--accent'];
    const diags = validateThemeTokens(tokens);
    expect(diags).toContainEqual(
      expect.objectContaining({ level: 'error', code: 'missing-token', message: expect.stringContaining('--accent') }),
    );
  });

  it('warns on unknown tokens but allows optional prefixes', () => {
    const [{ tokens }] = extractThemes(read('aurora.css'));
    // aurora ships --grad-purple / --grad-teal: allowed via optionalPrefixes
    const gradWarnings = validateThemeTokens(tokens).filter((d) => d.message.includes('--grad-'));
    expect(gradWarnings).toEqual([]);

    const diags = validateThemeTokens({ ...tokens, '--mystery': 'red' });
    expect(diags).toContainEqual(expect.objectContaining({ level: 'warning', code: 'unknown-token' }));
  });

  it('reports one missing-token error per absent required token', () => {
    const diags = validateThemeTokens({});
    const missing = diags.filter((d) => d.code === 'missing-token');
    expect(missing).toHaveLength(TOKEN_CONTRACT.required.length);
    expect(missing.every((d) => d.level === 'error')).toBe(true);
  });
});

describe('tokensFromSpec', () => {
  // The bridge maps group A's real blueprint-dark fixture spec (plan C1).
  const fixtureDir = fileURLToPath(new URL('../../fixtures/spec/blueprint-dark', import.meta.url));
  const loaded = loadDesignSpec(fixtureDir);
  if (!loaded) throw new Error('blueprint-dark fixture spec not found');
  const { spec } = loaded;

  it('loads the blueprint-dark fixture via frame.md with no error diagnostics', () => {
    expect(loaded.path.endsWith('frame.md')).toBe(true);
    expect(loaded.diagnostics.filter((d) => d.level === 'error')).toEqual([]);
    expect(spec.name).toBe('Blueprint Dark');
  });

  it('maps spec roles onto contract tokens verbatim', () => {
    const { tokens } = tokensFromSpec(spec);
    expect(tokens['--bg']).toBe('#0F0F13');
    expect(tokens['--bg-card']).toBe('#16161D');
    expect(tokens['--text']).toBe('#E9E9F2');
    expect(tokens['--text-dim']).toBe('#8A8A9C');
    expect(tokens['--accent']).toBe('#60A5FA'); // accent|blue → --accent
    expect(tokens['--border']).toBe('#2A2A3A'); // grid|border → --border
    expect(tokens['--font-display']).toBe('Archivo');
    expect(tokens['--font-body']).toBe('Inter');
    expect(tokens['--font-mono']).toBe('JetBrains Mono');
  });

  it('prefers an explicit accent over blue', () => {
    const { tokens } = tokensFromSpec({ ...spec, colors: { ...spec.colors, accent: '#FF00AA' } });
    expect(tokens['--accent']).toBe('#FF00AA');
  });

  it('surfaces unmapped spec colors as warnings', () => {
    const { diagnostics } = tokensFromSpec(spec);
    const codes = diagnostics.map((d) => d.code);
    expect(codes).toContain('unmapped-color');
    // fixture colors nothing consumes: panel2, dim, blue2, yellow, emerald
    for (const key of ['panel2', 'dim', 'blue2', 'yellow', 'emerald']) {
      expect(diagnostics).toContainEqual(
        expect.objectContaining({ level: 'warning', code: 'unmapped-color', message: expect.stringContaining(`"${key}"`) }),
      );
    }
    // mapped keys never warn
    expect(diagnostics.some((d) => d.message.includes('"bg"'))).toBe(false);
  });

  it('lets overrides win over the default mapping', () => {
    const { tokens } = tokensFromSpec(spec, { '--accent': '#123456', '--red': '#ff0000' });
    expect(tokens['--accent']).toBe('#123456');
    expect(tokens['--red']).toBe('#ff0000');
  });
});
