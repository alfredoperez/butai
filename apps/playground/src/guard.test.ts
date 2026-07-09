/**
 * Decoupling guard over apps/playground/src (plan Q4, mirrored from
 * @butai/deck's forbidden-strings guard).
 *
 * Deliberate difference from the deck package's list: `react-router` is NOT
 * forbidden here — plan Q3 puts the router in the app on purpose ("router
 * lives in the APP, proving the engine doesn't need it").
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const FORBIDDEN = [
  'gsap',
  'marketplace.visualstudio',
];

const SRC_DIR = fileURLToPath(new URL('.', import.meta.url));

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

describe('forbidden strings guard (src/)', () => {
  // This file names the forbidden strings, so it skips itself.
  const files = walk(SRC_DIR).filter((f) => !f.endsWith('guard.test.ts'));

  it('scans a real set of source files', () => {
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  it.each(files)('%s carries no forbidden strings', (file) => {
    const content = readFileSync(file, 'utf8').toLowerCase();
    for (const needle of FORBIDDEN) {
      expect(content, `"${needle}" found in ${file}`).not.toContain(needle);
    }
  });
});
