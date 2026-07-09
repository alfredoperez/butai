import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { loadDesignSpec, resolveSpecPath } from './resolve';

const FIXTURES = fileURLToPath(new URL('../../fixtures/spec', import.meta.url));

const tempDirs: string[] = [];
function makeDir(files: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), 'butai-spec-'));
  tempDirs.push(dir);
  for (const f of files) writeFileSync(join(dir, f), `---\nname: ${f}\n---\n\n## S\n\nbody\n`);
  return dir;
}

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

describe('resolveSpecPath — precedence', () => {
  it('resolves frame.md when all three candidates exist', () => {
    const dir = makeDir(['frame.md', 'design.md', 'DESIGN.md']);
    expect(basename(resolveSpecPath(dir) ?? '')).toBe('frame.md');
  });

  it('resolves design.md over DESIGN.md', () => {
    const dir = makeDir(['design.md', 'DESIGN.md']);
    expect(basename(resolveSpecPath(dir) ?? '')).toBe('design.md');
  });

  it('resolves DESIGN.md when it is the only candidate', () => {
    const dir = makeDir(['DESIGN.md', 'other.md']);
    expect(basename(resolveSpecPath(dir) ?? '')).toBe('DESIGN.md');
  });

  it('returns null on a dir with no spec file', () => {
    const dir = makeDir(['README.md']);
    expect(resolveSpecPath(dir)).toBeNull();
  });

  it('returns null on a missing dir', () => {
    expect(resolveSpecPath(join(tmpdir(), 'butai-spec-does-not-exist'))).toBeNull();
  });

  it('never resolves uppercase FRAME.md (frame.md is lowercase only)', () => {
    const dir = makeDir(['FRAME.md']);
    // Exact-name matching: FRAME.md is not a spec candidate on any filesystem.
    expect(resolveSpecPath(dir)).toBeNull();
  });
});

describe('loadDesignSpec', () => {
  it('resolves + reads + parses the blueprint-dark fixture', () => {
    const loaded = loadDesignSpec(join(FIXTURES, 'blueprint-dark'));
    expect(loaded).not.toBeNull();
    expect(basename(loaded!.path)).toBe('frame.md');
    expect(loaded!.spec.name).toBe('Blueprint Dark');
    expect(loaded!.spec.colors.bg).toBe('#0F0F13');
    expect(loaded!.diagnostics.filter((d) => d.level === 'error')).toEqual([]);
  });

  it('returns null when the dir has no spec', () => {
    const dir = makeDir([]);
    expect(loadDesignSpec(dir)).toBeNull();
  });
});
