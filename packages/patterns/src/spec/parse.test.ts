import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { parseDesignSpec } from './parse';

const FIXTURES = fileURLToPath(new URL('../../fixtures/spec', import.meta.url));

function fixture(rel: string): string {
  return readFileSync(join(FIXTURES, rel), 'utf8');
}

describe('parseDesignSpec — blueprint-dark fixture', () => {
  const { spec, diagnostics } = parseDesignSpec(fixture('blueprint-dark/frame.md'));

  it('has no error-level diagnostics', () => {
    expect(diagnostics.filter((d) => d.level === 'error')).toEqual([]);
  });

  it('parses ≥5 colors with exact hex passthrough (trailing YAML comments stripped, casing kept)', () => {
    expect(Object.keys(spec.colors).length).toBeGreaterThanOrEqual(5);
    // Verbatim: exact casing, no normalization, comment after the value gone.
    expect(spec.colors.bg).toBe('#0F0F13');
    expect(spec.colors.blue).toBe('#60A5FA');
    expect(spec.colors.yellow).toBe('#FACC15');
    expect(spec.colors.ink).toBe('#E9E9F2');
    expect(spec.colors.emerald).toBe('#34D399');
  });

  it('parses exactly 3 typography entries verbatim', () => {
    expect(Object.keys(spec.typography)).toHaveLength(3);
    expect(spec.typography.display).toBe('Archivo');
    expect(spec.typography.body).toBe('Inter');
    expect(spec.typography.mono).toBe('JetBrains Mono');
  });

  it('extracts ≥5 sections with headings and levels', () => {
    expect(spec.sections.length).toBeGreaterThanOrEqual(5);
    const headings = spec.sections.map((s) => s.heading);
    expect(headings).toEqual([
      'The Frame',
      'Typography',
      'Composition rules',
      'Motion feel',
      'Do',
      "Don't",
    ]);
    expect(spec.sections.every((s) => s.level === 2)).toBe(true);
    expect(spec.sections[0].body).toContain('#0F0F13');
  });

  it('keeps spacing/components and the raw layers', () => {
    expect(spec.name).toBe('Blueprint Dark');
    expect(spec.spacing?.radius).toBe('12px');
    expect(spec.components?.card).toContain('panel bg');
    expect(spec.raw.frontmatter.name).toBe('Blueprint Dark');
    expect(spec.raw.body).toContain('# Blueprint Dark');
  });
});

describe('parseDesignSpec — hex passthrough', () => {
  it('never lowercases or rounds hex values, even with a trailing YAML comment', () => {
    const { spec } = parseDesignSpec(
      ['---', 'name: T', 'colors:', '  bg: "#0F0F13"   # near-black', '---', ''].join('\n'),
    );
    expect(spec.colors.bg).toBe('#0F0F13');
    expect(spec.colors.bg).not.toBe('#0f0f13');
  });
});

describe('parseDesignSpec — minimal fixture', () => {
  const { spec, diagnostics } = parseDesignSpec(fixture('minimal/design.md'));

  it('parses name + colors + one section', () => {
    expect(spec.name).toBe('Minimal');
    expect(Object.keys(spec.colors)).toHaveLength(2);
    expect(spec.sections).toHaveLength(1);
    expect(spec.sections[0].heading).toBe('Overview');
  });

  it('warns missing-typography but not missing-name/missing-colors', () => {
    const codes = diagnostics.map((d) => d.code);
    expect(codes).toContain('missing-typography');
    expect(codes).not.toContain('missing-name');
    expect(codes).not.toContain('missing-colors');
    expect(diagnostics.every((d) => d.level === 'warning')).toBe(true);
  });
});

describe('parseDesignSpec — broken fixture', () => {
  const { spec, diagnostics } = parseDesignSpec(fixture('broken/design.md'));

  it('emits a single error diagnostic for the unparseable YAML', () => {
    const errors = diagnostics.filter((d) => d.level === 'error');
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe('invalid-frontmatter');
  });

  it('still returns a best-effort body-only spec', () => {
    expect(spec.colors).toEqual({});
    expect(spec.sections.map((s) => s.heading)).toEqual(['Still Readable']);
  });
});

describe('parseDesignSpec — diagnostics on inline sources', () => {
  it('warns missing-name / missing-colors / missing-typography on an empty frontmatter', () => {
    const { diagnostics } = parseDesignSpec('---\nfoo: bar\n---\n\n## A\n\nbody\n');
    const codes = diagnostics.map((d) => d.code);
    expect(codes).toContain('missing-name');
    expect(codes).toContain('missing-colors');
    expect(codes).toContain('missing-typography');
  });

  it('warns on duplicate section headings', () => {
    const src = '---\nname: D\n---\n\n## Twice\n\na\n\n## Twice\n\nb\n';
    const { spec, diagnostics } = parseDesignSpec(src);
    expect(spec.sections).toHaveLength(2);
    const dup = diagnostics.find((d) => d.code === 'duplicate-section');
    expect(dup?.level).toBe('warning');
    expect(dup?.message).toContain('Twice');
  });

  it('handles a body with no frontmatter at all', () => {
    const { spec, diagnostics } = parseDesignSpec('## Only Body\n\ntext\n');
    expect(spec.sections).toHaveLength(1);
    expect(diagnostics.some((d) => d.level === 'error')).toBe(false);
    expect(diagnostics.map((d) => d.code)).toContain('missing-name');
  });

  it('captures deeper headings with their level', () => {
    const { spec } = parseDesignSpec('---\nname: L\n---\n\n## Top\n\n### Nested\n\nx\n');
    expect(spec.sections.map((s) => [s.heading, s.level])).toEqual([
      ['Top', 2],
      ['Nested', 3],
    ]);
  });
});
