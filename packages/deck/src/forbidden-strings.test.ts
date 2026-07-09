/**
 * Decoupling guard (P2 Q4) — the deck package must carry zero traces of the
 * source app: no router imports and no animation-library deps. Mirrors P1's
 * provenance-enforcement pattern.
 *
 * The specific personal/campaign provenance needles were removed for the public
 * repo; the generalized content was verified clean during the build. The
 * remaining decoupling needles are assembled from fragments so this file never
 * trips its own scan.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const FORBIDDEN: string[] = [
  ['react', 'router'].join('-'),
  ['g', 'sap'].join(''),
  ['marketplace', 'visualstudio'].join('.'),
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe('forbidden strings (decoupling guard)', () => {
  const files = [...walk(join(pkgRoot, 'src')), ...walk(join(pkgRoot, 'styles'))];

  it('scans a plausible file set', () => {
    expect(files.length).toBeGreaterThanOrEqual(13);
  });

  it.each(FORBIDDEN)('no file under src/ or styles/ contains %s', (needle) => {
    const offenders = files.filter((f) =>
      readFileSync(f, 'utf8').toLowerCase().includes(needle.toLowerCase()),
    );
    expect(offenders).toEqual([]);
  });
});
