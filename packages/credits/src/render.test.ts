/**
 * Group A gate 1 — the PURE renderer:
 *   (a) determinism: renderCredits(fixture) twice is byte-identical, and contains
 *       no wallclock (render.ts is grepped separately, but we also assert no ISO
 *       date beyond the data-sourced last_checked appears);
 *   (b) coverage: every fixture entry's id-derived name renders, in the frozen
 *       group order, each exactly once;
 *   (c) excluded entries render their excluded_reason.
 *
 * This suite is PURE — it feeds renderCredits a hand-built ledger fixture (no fs),
 * so it proves the render contract independent of the real sources.yml.
 */
import { describe, expect, it } from 'vitest';
import { renderCredits } from './render.js';
import { HOW_ORDER, type SourceEntry, type SourcesLedger } from './types.js';

const entry = (over: Partial<SourceEntry> & Pick<SourceEntry, 'id' | 'how'>): SourceEntry => ({
  name: `Name ${over.id}`,
  url: `https://example.com/${over.id}`,
  license: 'MIT',
  what: `What ${over.id}.`,
  adopted: 'P1',
  last_checked: '2026-07-07',
  last_ref: null,
  ...over,
});

// One entry per `how`, deliberately out of group order + out of id order so the
// render has to regroup and re-sort.
const FIXTURE: SourcesLedger = {
  version: 1,
  sources: [
    entry({ id: 'z-runtime', how: 'runtime-dep' }),
    entry({ id: 'a-vendored', how: 'copied-in', repo: 'https://github.com/x/a' }),
    entry({ id: 'm-inspired', how: 'inspired-by', notes: 'a note' }),
    entry({ id: 'b-runtime', how: 'runtime-dep' }),
    entry({ id: 'tool', how: 'external-tool' }),
    entry({ id: 'ours', how: 'own-work' }),
    entry({
      id: 'nope',
      how: 'excluded',
      adopted: null,
      license: 'UNVERIFIED',
      excluded_reason: 'Non-free — deliberately not shipped.',
    }),
  ],
};

describe('renderCredits — determinism', () => {
  it('two renders of the same ledger are byte-identical', () => {
    expect(renderCredits(FIXTURE)).toBe(renderCredits(FIXTURE));
  });

  it('injects no date beyond the data-sourced last_checked', () => {
    const out = renderCredits({ version: 1, sources: [entry({ id: 'solo', how: 'own-work' })] });
    const dates = out.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
    expect(dates).toEqual(['2026-07-07']); // the only date is the one from the data
  });

  it('carries the constant generated header (no timestamp)', () => {
    const out = renderCredits(FIXTURE);
    expect(out.startsWith('<!-- generated from sources.yml by @butai/credits — do not edit by hand -->')).toBe(true);
    expect(out).not.toMatch(/generated at|generated on/i);
  });
});

describe('renderCredits — coverage', () => {
  const out = renderCredits(FIXTURE);

  it('renders every entry name exactly once', () => {
    for (const e of FIXTURE.sources) {
      const count = out.split(`[${e.name}]`).length - 1;
      expect(count, `${e.id} name occurrences`).toBe(1);
    }
  });

  it('links each entry name to its url', () => {
    for (const e of FIXTURE.sources) {
      expect(out, e.id).toContain(`[${e.name}](${e.url})`);
    }
  });

  it('renders excluded entries with their excluded_reason', () => {
    expect(out).toContain('**Why excluded:** Non-free — deliberately not shipped.');
  });

  it('renders groups in the frozen HOW_ORDER, omitting empty ones', () => {
    const titles = [
      'Vendored (copied in)',
      'Inspired by',
      'Runtime dependencies',
      'External tools',
      'Our own work',
      'Excluded (considered, not shipped)',
    ];
    const positions = titles.map((t) => out.indexOf(`## ${t}`));
    expect(positions.every((p) => p >= 0), 'all present').toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b)); // ascending = frozen order
    expect(titles).toHaveLength(HOW_ORDER.length);
  });

  it('sorts entries by id within a group', () => {
    // runtime group has b-runtime + z-runtime; b must precede z.
    expect(out.indexOf('[Name b-runtime]')).toBeLessThan(out.indexOf('[Name z-runtime]'));
  });

  it('omits a group with no entries', () => {
    const noExcluded: SourcesLedger = { version: 1, sources: [entry({ id: 'x', how: 'own-work' })] };
    expect(renderCredits(noExcluded)).not.toContain('## Excluded');
  });
});
