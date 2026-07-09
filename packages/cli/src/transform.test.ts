import { describe, expect, it } from 'vitest';
import type { ButaiAliases } from './config-types.js';
import type { FileImportMap } from './registry-types.js';
import {
  buildKitAggregator,
  hashRaw,
  normalizeImports,
  parseKitImports,
  parseRecordedSha,
  prependProvenance,
  rewriteImports,
  stripProvenance,
  unifiedDiff,
} from './transform.js';

const ALIASES: ButaiAliases = {
  slides: '@/components/butai/slides',
  primitives: '@/components/butai/primitives',
  styles: '@/styles/butai',
};

const IMPORT_MAP: FileImportMap = {
  '@butai/deck': { kind: 'external' },
  '../primitives/label.js': { kind: 'registry', item: 'label', alias: 'primitives' },
};

const SOURCE = [
  `import { Slide } from '@butai/deck';`,
  `import { Label } from '../primitives/label.js';`,
  ``,
  `export const x = 1;`,
].join('\n');

describe('rewriteImports', () => {
  it('rewrites a registry import to the alias, dropping .js (importExtensions=false)', () => {
    const out = rewriteImports(SOURCE, IMPORT_MAP, ALIASES, false);
    expect(out).toContain(`from '@/components/butai/primitives/label';`);
    expect(out).not.toContain(`../primitives/label.js`);
  });

  it('rewrites a registry import keeping .js (importExtensions=true)', () => {
    const out = rewriteImports(SOURCE, IMPORT_MAP, ALIASES, true);
    expect(out).toContain(`from '@/components/butai/primitives/label.js';`);
  });

  it('leaves external imports untouched', () => {
    const out = rewriteImports(SOURCE, IMPORT_MAP, ALIASES, false);
    expect(out).toContain(`import { Slide } from '@butai/deck';`);
  });

  it('handles double-quoted specifiers', () => {
    const dq = `import { Label } from "../primitives/label.js";`;
    const out = rewriteImports(dq, IMPORT_MAP, ALIASES, false);
    expect(out).toBe(`import { Label } from "@/components/butai/primitives/label";`);
  });
});

describe('normalizeImports is the inverse of rewriteImports (both modes)', () => {
  for (const importExtensions of [false, true]) {
    it(`round-trips with importExtensions=${importExtensions}`, () => {
      const rewritten = rewriteImports(SOURCE, IMPORT_MAP, ALIASES, importExtensions);
      const back = normalizeImports(rewritten, IMPORT_MAP, ALIASES);
      expect(back).toBe(SOURCE);
    });
  }

  it('normalizes BOTH .js and extensionless alias forms to the registry specifier', () => {
    const withExt = rewriteImports(SOURCE, IMPORT_MAP, ALIASES, true);
    const noExt = rewriteImports(SOURCE, IMPORT_MAP, ALIASES, false);
    expect(normalizeImports(withExt, IMPORT_MAP, ALIASES)).toBe(SOURCE);
    expect(normalizeImports(noExt, IMPORT_MAP, ALIASES)).toBe(SOURCE);
  });
});

describe('provenance header', () => {
  const sha = hashRaw(SOURCE);
  const stamp = { type: 'registry:slide', id: 'cover-slide', fromRegistry: '@butai/slide-kit' };

  it('prepends a header with the bare type, id, and sha (no timestamp)', () => {
    const out = prependProvenance(SOURCE, stamp, sha);
    expect(out).toContain('butai:slide cover-slide');
    expect(out).toContain(`source-sha256: ${sha}`);
    expect(out).not.toMatch(/\d{4}-\d{2}-\d{2}/); // no ISO date / timestamp
  });

  it('round-trips: strip(prepend(x)) === x', () => {
    const out = prependProvenance(SOURCE, stamp, sha);
    expect(stripProvenance(out)).toBe(SOURCE);
  });

  it('stripProvenance leaves a file without a provenance header untouched', () => {
    expect(stripProvenance(SOURCE)).toBe(SOURCE);
  });

  it('stripProvenance leaves an unrelated leading block comment in place', () => {
    const withDoc = `/**\n * just a normal doc comment\n */\n\n${SOURCE}`;
    expect(stripProvenance(withDoc)).toBe(withDoc);
  });

  it('parseRecordedSha reads the sha back out', () => {
    const out = prependProvenance(SOURCE, stamp, sha);
    expect(parseRecordedSha(out)).toBe(sha);
  });

  it('parseRecordedSha returns null when there is no header', () => {
    expect(parseRecordedSha(SOURCE)).toBeNull();
  });
});

describe('hashRaw', () => {
  it('is stable and deterministic', () => {
    expect(hashRaw(SOURCE)).toBe(hashRaw(SOURCE));
    expect(hashRaw(SOURCE)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes when the source changes', () => {
    expect(hashRaw(SOURCE)).not.toBe(hashRaw(`${SOURCE}\n// edit`));
  });
});

describe('buildKitAggregator (consumer CSS wiring, §0.5)', () => {
  it('slide-base imports first, the rest sorted', () => {
    const out = buildKitAggregator(null, ['quote-slide.css', 'slide-base.css', 'intro-slide.css']);
    const imports = out.split('\n').filter((l) => l.startsWith('@import'));
    expect(imports).toEqual([
      `@import "./slide-base.css";`,
      `@import "./intro-slide.css";`,
      `@import "./quote-slide.css";`,
    ]);
  });

  it('carries a butai: provenance header (recognized as generated)', () => {
    const out = buildKitAggregator(null, ['slide-base.css']);
    expect(out).toContain('butai:aggregator butai-kit');
    expect(out).not.toMatch(/\d{4}-\d{2}-\d{2}/); // no timestamp
  });

  it('is idempotent: re-running with the same inputs is byte-identical', () => {
    const first = buildKitAggregator(null, ['slide-base.css', 'quote-slide.css']);
    const second = buildKitAggregator(first, ['slide-base.css', 'quote-slide.css']);
    expect(second).toBe(first);
  });

  it('merges NEW css into an existing aggregator without dropping prior imports', () => {
    const first = buildKitAggregator(null, ['slide-base.css', 'quote-slide.css']);
    const merged = buildKitAggregator(first, ['slide-base.css', 'timeline-slide.css']);
    expect(parseKitImports(merged).sort()).toEqual([
      'quote-slide.css',
      'slide-base.css',
      'timeline-slide.css',
    ]);
  });

  it('does not duplicate an already-present import', () => {
    const first = buildKitAggregator(null, ['slide-base.css', 'quote-slide.css']);
    const again = buildKitAggregator(first, ['quote-slide.css']);
    const count = again.split('\n').filter((l) => l.includes('quote-slide.css')).length;
    expect(count).toBe(1);
  });
});

describe('unifiedDiff', () => {
  it('marks removed (-) and added (+) lines', () => {
    const d = unifiedDiff('a\nb\nc', 'a\nB\nc');
    expect(d).toContain('- b');
    expect(d).toContain('+ B');
    expect(d).toContain('  a');
  });
});
