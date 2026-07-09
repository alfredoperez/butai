import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { metasFromMarkdownDir } from './from-markdown';
import { generateCatalog, renderCatalogMd } from './generate';

const FIXTURES = fileURLToPath(new URL('../../fixtures/catalog', import.meta.url));

const tempDirs: string[] = [];
afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

describe('metasFromMarkdownDir — fixtures', () => {
  const { items, diagnostics } = metasFromMarkdownDir(FIXTURES);

  it('reads every fixture file with an id, recursively', () => {
    expect(items).toHaveLength(6);
    expect(items.map((i) => i.id).sort()).toEqual([
      'brief-cover',
      'dup-theme',
      'dup-theme',
      'hero-split',
      'svg-01-stroke-draw-on',
      'text-02-char-stagger',
    ]);
  });

  it('takes the FIRST fenced code block as snippet', () => {
    const draw = items.find((i) => i.id === 'svg-01-stroke-draw-on')!;
    expect(draw.snippet).toContain("gsap.registerPlugin(DrawSVGPlugin);");
    expect(draw.snippet).not.toContain('```');
    const hero = items.find((i) => i.id === 'hero-split')!;
    expect(hero.snippet).toContain('<section class="hero-split">');
  });

  it('carries frontmatter fields through (engine, motion, tags)', () => {
    const draw = items.find((i) => i.id === 'svg-01-stroke-draw-on')!;
    expect(draw.kind).toBe('motion');
    expect(draw.category).toBe('svg-diagram');
    expect(draw.engine).toBe('gsap/DrawSVG');
    expect(draw.motion).toBe('drive on active; duration 0 for reduced motion');
    expect(draw.tags).toEqual(['svg', 'draw', 'diagram']);
  });

  it('sets source.file relative to the dir with / separators', () => {
    const draw = items.find((i) => i.id === 'svg-01-stroke-draw-on')!;
    expect(draw.source).toEqual({ file: 'motion/svg-01-stroke-draw-on.md' });
    expect(items.every((i) => !i.source!.file.includes('\\'))).toBe(true);
  });

  it('warns (missing-field) on the fixture without a description', () => {
    const warn = diagnostics.find((d) => d.code === 'missing-field');
    expect(warn?.level).toBe('warning');
    expect(warn?.message).toContain('brief-cover');
    expect(warn?.message).toContain('description');
  });

  it('skips files without an id, with a warning', () => {
    const dir = mkdtempSync(join(tmpdir(), 'butai-catalog-'));
    tempDirs.push(dir);
    mkdirSync(join(dir, 'sub'));
    writeFileSync(join(dir, 'sub', 'no-id.md'), '---\nname: No Id\n---\n\nbody\n');
    writeFileSync(join(dir, 'no-frontmatter.md'), '# Just a doc\n');
    const res = metasFromMarkdownDir(dir);
    expect(res.items).toHaveLength(0);
    const codes = res.diagnostics.map((d) => d.code);
    expect(codes.filter((c) => c === 'missing-id')).toHaveLength(2);
  });
});

describe('metasFromMarkdownDir + generateCatalog — end to end', () => {
  it('surfaces the planted duplicate id as an error and excludes the later item', () => {
    const { items } = metasFromMarkdownDir(FIXTURES);
    const { catalog, diagnostics } = generateCatalog(items);
    expect(diagnostics.some((d) => d.code === 'duplicate-id' && d.level === 'error')).toBe(true);
    expect(catalog.items.filter((i) => i.id === 'dup-theme')).toHaveLength(1);
    // the missing-description fixture is excluded too
    expect(catalog.items.some((i) => i.id === 'brief-cover')).toBe(false);
    expect(catalog.count).toBe(4);
  });

  it('produces byte-identical JSON + MD across two full runs', () => {
    const run = () => {
      const { items } = metasFromMarkdownDir(FIXTURES);
      const { catalog } = generateCatalog(items);
      return { json: JSON.stringify(catalog, null, 2), md: renderCatalogMd(catalog) };
    };
    const a = run();
    const b = run();
    expect(a.json).toBe(b.json);
    expect(a.md).toBe(b.md);
  });

  it('renders the fixtures catalog.md snapshot', () => {
    const { items } = metasFromMarkdownDir(FIXTURES);
    const { catalog } = generateCatalog(items);
    expect(renderCatalogMd(catalog)).toMatchSnapshot();
  });
});
