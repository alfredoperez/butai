/**
 * Group A gate 2 — the REAL ledger + the generator:
 *   (a) the repo-root sources.yml loads, is schema-complete, ids are unique, every
 *       how ∈ the frozen enum, every excluded row has an excluded_reason;
 *   (b) all 13 surveyed upstream ids (§0.2 + iter-2 disclosure) are present;
 *   (c) loadLedger REJECTS a malformed ledger (missing field / bad how /
 *       duplicate id / excluded-without-reason);
 *   (d) the committed CREDITS.md is CURRENT + BYTE-STABLE: generateCredits() twice
 *       is identical AND equals the committed file (the git diff --exit-code proof),
 *       and every id + name (incl. excluded) appears in it.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadLedger } from './parse.js';
import { HOW_ORDER } from './types.js';
import { LEDGER_PATH, generateCredits, readCommittedCredits } from '../scripts/gen.js';

const EXPECTED_IDS = [
  'frontend-slides',
  'shadcn-ui',
  'radix-ui',
  'tailwindcss',
  'lucide-react',
  'gsap',
  'gsap-recipe-reference',
  'butai-themes',
  'slide-kit-code-archetypes',
  'hyperframes',
  'frontend-slides-theme-presets',
  'bold-template-pack',
  'greensock-club-plugins',
  'house-design-system',
];

const HOW_SET = new Set<string>(HOW_ORDER);

function writeTmp(yaml: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'credits-schema-'));
  const path = join(dir, 'sources.yml');
  writeFileSync(path, yaml);
  return path;
}

describe('sources.yml — schema completeness', () => {
  const ledger = loadLedger(LEDGER_PATH);

  it('is version 1 with a non-empty sources array', () => {
    expect(ledger.version).toBe(1);
    expect(ledger.sources.length).toBeGreaterThan(0);
  });

  it('has all 13 surveyed upstream ids (§0.2 + iter-2) plus the own-work rows', () => {
    const ids = new Set(ledger.sources.map((s) => s.id));
    for (const id of EXPECTED_IDS) expect(ids, `missing ${id}`).toContain(id);
    expect(ledger.sources).toHaveLength(EXPECTED_IDS.length);
  });

  it('every entry is schema-complete with a valid how', () => {
    for (const s of ledger.sources) {
      for (const f of ['id', 'name', 'url', 'license', 'what', 'how', 'last_checked'] as const) {
        expect(typeof s[f], `${s.id}.${f}`).toBe('string');
        expect((s[f] as string).length, `${s.id}.${f}`).toBeGreaterThan(0);
      }
      expect(HOW_SET.has(s.how), `${s.id} how`).toBe(true);
    }
  });

  it('every excluded row has a non-empty excluded_reason', () => {
    for (const s of ledger.sources.filter((e) => e.how === 'excluded')) {
      expect(s.excluded_reason, `${s.id} reason`).toBeTruthy();
      expect(s.adopted, `${s.id} adopted`).toBeNull();
    }
  });

  it('has exactly 4 excluded (non-free / disclosed) rows', () => {
    expect(ledger.sources.filter((s) => s.how === 'excluded').map((s) => s.id).sort()).toEqual([
      'bold-template-pack',
      'frontend-slides-theme-presets',
      'greensock-club-plugins',
      'house-design-system',
    ]);
  });

  it('ids are unique', () => {
    const ids = ledger.sources.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no adopted (non-excluded) row carries a copyleft/non-free license', () => {
    const banned = /\b(GPL|AGPL|LGPL|SSPL|proprietary)\b/i;
    for (const s of ledger.sources.filter((e) => e.how !== 'excluded' && e.how !== 'external-tool')) {
      expect(banned.test(s.license), `${s.id} license "${s.license}"`).toBe(false);
    }
  });
});

describe('loadLedger — rejects malformed ledgers (fail loud)', () => {
  it('rejects an excluded entry missing excluded_reason', () => {
    const path = writeTmp(
      `version: 1
sources:
  - id: bad
    name: Bad
    url: https://x
    license: UNVERIFIED
    what: thing
    how: excluded
    adopted: null
    last_checked: 2026-07-07
    last_ref: null
`,
    );
    expect(() => loadLedger(path)).toThrow(/excluded_reason/);
  });

  it('rejects a missing required field', () => {
    const path = writeTmp(
      `version: 1
sources:
  - id: bad
    name: Bad
    url: https://x
    how: own-work
    what: thing
    adopted: P1
    last_checked: 2026-07-07
    last_ref: null
`,
    );
    expect(() => loadLedger(path)).toThrow(/license/);
  });

  it('rejects an unknown how', () => {
    const path = writeTmp(
      `version: 1
sources:
  - id: bad
    name: Bad
    url: https://x
    license: MIT
    what: thing
    how: borrowed
    adopted: P1
    last_checked: 2026-07-07
    last_ref: null
`,
    );
    expect(() => loadLedger(path)).toThrow(/unknown how/);
  });

  it('rejects duplicate ids', () => {
    const path = writeTmp(
      `version: 1
sources:
  - id: dup
    name: A
    url: https://a
    license: MIT
    what: a
    how: own-work
    adopted: P1
    last_checked: 2026-07-07
    last_ref: null
  - id: dup
    name: B
    url: https://b
    license: MIT
    what: b
    how: own-work
    adopted: P1
    last_checked: 2026-07-07
    last_ref: null
`,
    );
    expect(() => loadLedger(path)).toThrow(/duplicate id/);
  });
});

describe('CREDITS.md — deterministic + current + complete', () => {
  it('generateCredits() is byte-identical across two runs', () => {
    expect(generateCredits()).toBe(generateCredits());
  });

  it('matches the committed repo-root CREDITS.md (git diff --exit-code proof)', () => {
    expect(readCommittedCredits()).toBe(generateCredits());
  });

  it('renders every id + name (incl. all 4 excluded) exactly once', () => {
    const out = generateCredits();
    const ledger = loadLedger(LEDGER_PATH);
    for (const s of ledger.sources) {
      const count = out.split(`[${s.name}]`).length - 1;
      expect(count, `${s.id} (${s.name})`).toBe(1);
    }
  });

  it('renders each excluded entry with its excluded_reason', () => {
    const out = generateCredits();
    for (const s of loadLedger(LEDGER_PATH).sources.filter((e) => e.how === 'excluded')) {
      expect(out, s.id).toContain('**Why excluded:**');
      // a distinctive slice of each reason survives into the doc
      expect(out, s.id).toContain(s.excluded_reason!.slice(0, 24));
    }
  });
});
