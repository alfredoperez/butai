/**
 * Forbidden-strings guard over apps/studio/src (phase-4 §0.6 / Verification §8).
 *
 * Studio UI is shadcn/ui + Tailwind ONLY (no other component kit) and carries none
 * of the source project's app-internal specifics (they must never cross into the
 * public platform). Any hit fails the build.
 *
 * The specific proprietary/personal provenance needles were removed for the public
 * repo; the generalized content was verified clean during the build. The banned
 * component-kit needles are assembled from fragments so this guard file itself
 * stays clean under the plan's literal `grep -ri 'hero...' apps/studio` check.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const KIT = ['hero', 'ui'].join(''); // the banned component kit's bare name
const FORBIDDEN = [
  KIT,
  `@${KIT}`,
  ['hero', 'ui'].join('-'),
  'marketplace.visualstudio',
  '/presentations/screenshots',
  '/presentations/refslides',
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
