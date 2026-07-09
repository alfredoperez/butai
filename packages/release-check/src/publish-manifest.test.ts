/**
 * Per-package manifest lint + publish-readiness (phase-10 D2, Verification 5).
 *
 * The 7 publishable packages were prepped for the 0.1.0-beta.0 release (user
 * opted into beta publish, 2026-07-08): private removed, publishConfig
 * public+beta, license MIT, version bumped, files arrays on patterns+themes.
 * This suite asserts they are READY (zero flip deltas) + that `create-butai`
 * stays private (its own follow-on beta) + that the dry-run packs all 7 without
 * publishing. The actual `npm publish` is the user's authenticated step.
 */

import { describe, it, expect } from 'vitest';
import { PUBLISHABLE, readPkg } from './manifests.js';
import { computeFlipDeltas, computeFlipDelta } from '../scripts/manifest-report.js';
import { runAll, packDryRun } from '../scripts/publish-dryrun.js';

describe('publishable set — structural invariants (must already hold)', () => {
  it('has exactly the 7 intended-public packages', () => {
    expect(PUBLISHABLE.map((p) => p.name)).toEqual([
      '@butai/patterns',
      '@butai/themes',
      '@butai/deck',
      '@butai/slide-kit',
      '@butai/scene-kit',
      '@butai/docs-kit',
      '@butai/cli',
    ]);
  });

  for (const entry of PUBLISHABLE) {
    it(`${entry.name} has name/version/main/types + an entry map`, () => {
      const pkg = readPkg(entry.dir);
      expect(pkg.name).toBe(entry.name);
      expect(pkg.version, 'version present').toBeTruthy();
      expect(pkg.main, 'main present').toBeTruthy();
      expect(pkg.types, 'types present').toBeTruthy();
      // cli exposes its entry via `bin` (no `exports` map); every other
      // publishable package uses an `exports` map.
      expect(pkg.exports ?? pkg.bin, 'exports or bin present').toBeTruthy();
    });
  }

  it('@butai/cli exposes the butai bin', () => {
    const cli = readPkg('cli');
    expect(cli.bin).toBeTruthy();
    expect((cli.bin as Record<string, string>).butai).toBe('./dist/cli.js');
  });
});

describe('publish-readiness — the 7 packages are prepped for 0.1.0-beta.0', () => {
  const deltas = computeFlipDeltas();

  it('produces a delta entry per package (7 public + create-butai)', () => {
    expect(deltas.length).toBe(PUBLISHABLE.length + 1);
  });

  it('none of the 7 publishable packages is private (all flipped)', () => {
    const stillPrivate = deltas
      .filter((d) => d.name !== '@butai/create-butai' && d.needsPrivateRemoved)
      .map((d) => d.name);
    expect(stillPrivate).toEqual([]);
  });

  it('every publishable package has publishConfig public + license + a beta version', () => {
    for (const entry of PUBLISHABLE) {
      const d = computeFlipDelta(entry);
      expect(d.needsPublishConfig, `${d.name} publishConfig.access=public`).toBe(false);
      expect(d.needsLicenseField, `${d.name} license`).toBe(false);
      expect(d.needsVersionBump, `${d.name} version off 0.0.1`).toBe(false);
      const pkg = readPkg(entry.dir);
      expect(pkg.version, `${d.name} beta version`).toBe('0.1.0-beta.0');
      expect((pkg.publishConfig as { tag?: string }).tag, `${d.name} beta dist-tag`).toBe('beta');
    }
  });

  it('patterns + themes now ship a files array (dist, not src)', () => {
    expect(computeFlipDelta({ dir: 'patterns', name: '@butai/patterns' }).needsFilesArray).toBe(false);
    expect(readPkg('patterns').files).toEqual(['dist']);
    expect(computeFlipDelta({ dir: 'themes', name: '@butai/themes' }).needsFilesArray).toBe(false);
    expect(readPkg('themes').files).toEqual(['dist', 'themes']);
  });

  it('create-butai stays private (its own follow-on beta, after the 7 publish)', () => {
    const cb = deltas.find((d) => d.name === '@butai/create-butai')!;
    expect(cb.needsPrivateRemoved).toBe(true);
  });

  it('inter-package deps are still workspace:* (pnpm rewrites them at publish)', () => {
    const deck = deltas.find((d) => d.name === '@butai/deck')!;
    expect(deck.workspaceDeps).toContain('@butai/themes');
    const slideKit = deltas.find((d) => d.name === '@butai/slide-kit')!;
    expect(slideKit.workspaceDeps).toEqual(expect.arrayContaining(['@butai/deck', '@butai/patterns']));
  });
});

describe('publish dry-run — npm pack --dry-run for all 7, NO publish', () => {
  it('packs every publishable package and lists tarball files', () => {
    const results = runAll();
    expect(results.length).toBe(7);
    for (const r of results) {
      expect(r.ok, `${r.name} pack --dry-run failed:\n${r.raw}`).toBe(true);
      expect(r.files.length, `${r.name} shipped no files`).toBeGreaterThan(0);
      // README.md is always shipped by npm even before Group A writes it — do
      // NOT assert its presence here (Group A owns READMEs); assert the code
      // surface instead.
      expect(r.files.some((f) => f.startsWith('dist') || f.startsWith('package.json')),
        `${r.name} tarball has no dist/package.json`).toBe(true);
    }
  }, 60_000);

  it('patterns tarball ships dist, not src (files array applied)', () => {
    const r = packDryRun('patterns');
    expect(r.ok).toBe(true);
    // With files:["dist"], the tarball no longer leaks src/tsconfig/fixtures.
    expect(r.files.some((f) => f.startsWith('dist'))).toBe(true);
    expect(r.files.some((f) => f.startsWith('src/'))).toBe(false);
  }, 30_000);
});
