import { describe, expect, it } from 'vitest';

import type { PatternMeta } from '../types';
import { generateCatalog, renderCatalogMd } from './generate';

function meta(overrides: Partial<PatternMeta> & { id: string }): PatternMeta {
  return {
    name: overrides.id,
    kind: 'motion',
    category: 'text',
    description: `Description for ${overrides.id}.`,
    ...overrides,
  } as PatternMeta;
}

describe('generateCatalog — validation', () => {
  it('flags a duplicate id as an error and excludes the later item', () => {
    const { catalog, diagnostics } = generateCatalog([
      meta({ id: 'twice', name: 'First' }),
      meta({ id: 'twice', name: 'Second' }),
    ]);
    const dup = diagnostics.find((d) => d.code === 'duplicate-id');
    expect(dup?.level).toBe('error');
    expect(catalog.count).toBe(1);
    expect(catalog.items[0].name).toBe('First');
  });

  it('flags non-kebab-case ids as bad-id errors and excludes them', () => {
    for (const bad of ['CamelCase', 'has_underscore', 'trailing-', '-leading', 'a--b']) {
      const { catalog, diagnostics } = generateCatalog([meta({ id: bad })]);
      expect(diagnostics.some((d) => d.code === 'bad-id' && d.level === 'error')).toBe(true);
      expect(catalog.count).toBe(0);
    }
  });

  it('flags missing required fields and excludes the item', () => {
    const { catalog, diagnostics } = generateCatalog([meta({ id: 'no-desc', description: '' })]);
    const err = diagnostics.find((d) => d.code === 'missing-field');
    expect(err?.level).toBe('error');
    expect(err?.message).toContain('description');
    expect(catalog.count).toBe(0);
  });

  it('flags an unknown kind and excludes the item', () => {
    const { catalog, diagnostics } = generateCatalog([
      meta({ id: 'weird', kind: 'sticker' as PatternMeta['kind'] }),
    ]);
    expect(diagnostics.some((d) => d.code === 'bad-kind' && d.level === 'error')).toBe(true);
    expect(catalog.count).toBe(0);
  });
});

describe('generateCatalog — shape + determinism', () => {
  const items: PatternMeta[] = [
    meta({ id: 'z-last', kind: 'theme', category: 'dark' }),
    meta({ id: 'b-mid', kind: 'motion', category: 'text' }),
    meta({ id: 'a-first', kind: 'motion', category: 'svg-diagram', engine: 'gsap' }),
    meta({ id: 'c-slide', kind: 'slide', category: 'hero', motion: 'fade in' }),
  ];

  it('sorts items by kind, then category, then id', () => {
    const { catalog } = generateCatalog(items);
    expect(catalog.items.map((i) => i.id)).toEqual(['a-first', 'b-mid', 'c-slide', 'z-last']);
  });

  it('computes count and per-kind counts', () => {
    const { catalog } = generateCatalog(items);
    expect(catalog.count).toBe(4);
    expect(catalog.kinds).toEqual({ motion: 2, slide: 1, theme: 1 });
  });

  it('is byte-identical across runs regardless of input order (no timestamps)', () => {
    const a = generateCatalog(items).catalog;
    const b = generateCatalog([...items].reverse()).catalog;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(a)).not.toMatch(/generatedAt|timestamp/i);
  });

  it('changes contentHash when items change', () => {
    const a = generateCatalog(items).catalog;
    const b = generateCatalog(items.slice(1)).catalog;
    expect(a.contentHash).not.toBe(b.contentHash);
  });
});

describe('renderCatalogMd', () => {
  const { catalog } = generateCatalog([
    meta({ id: 'a-first', kind: 'motion', category: 'svg-diagram', name: 'A First', engine: 'gsap' }),
    meta({ id: 'c-slide', kind: 'slide', category: 'hero', name: 'C Slide', motion: 'fade in' }),
  ]);

  it('renders header, kind/category headings, and item lines', () => {
    const md = renderCatalogMd(catalog);
    expect(md).toContain('# Butai pattern catalog');
    expect(md).toContain(`- count: 2\n- version: ${catalog.version}\n- contentHash: ${catalog.contentHash}`);
    expect(md).toContain('## motion');
    expect(md).toContain('### svg-diagram');
    expect(md).toContain('## slide');
    expect(md).toContain('### hero');
    expect(md).toContain('- **A First** (`a-first`) · engine: gsap — Description for a-first.');
    expect(md).toContain('  - motion: fade in');
  });

  it('is deterministic across runs', () => {
    expect(renderCatalogMd(catalog)).toBe(renderCatalogMd(generateCatalog(catalog.items).catalog));
  });

  it('matches the snapshot', () => {
    expect(renderCatalogMd(catalog)).toMatchSnapshot();
  });
});
