/**
 * Scaffold-consistency test (phase-10 §0.4, Verification 4).
 *
 * Scaffolds the template into an OS temp dir and asserts consistency STATICALLY
 * (no install, no build): files exist; package.json + butai.json parse; the
 * deck entry imports @butai/deck + a @butai/themes theme; .gitignore created;
 * all __…__ tokens substituted. Deterministic, offline, fast.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { scaffold, DEFAULT_BUTAI_VERSION } from './index.js';

const created: string[] = [];
function tempTarget(name: string): string {
  const base = mkdtempSync(path.join(tmpdir(), 'create-butai-'));
  created.push(base);
  return path.join(base, name);
}

afterEach(() => {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function allFiles(dir: string, base = ''): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const abs = path.join(dir, e);
    const rel = path.join(base, e);
    if (statSync(abs).isDirectory()) out.push(...allFiles(abs, rel));
    else out.push(rel);
  }
  return out;
}

describe('create-butai scaffold', () => {
  it('writes the expected consumer files', () => {
    const target = tempTarget('my-deck');
    const res = scaffold(target);
    const files = new Set(res.files);
    for (const expected of [
      'package.json',
      'butai.json',
      'index.html',
      'vite.config.ts',
      'tsconfig.json',
      '.gitignore',
      path.join('src', 'main.tsx'),
      path.join('src', 'App.tsx'),
      'README.md',
    ]) {
      expect(files.has(expected), `missing ${expected}`).toBe(true);
    }
    // gitignore is un-shadowed to .gitignore; the raw template name is gone.
    expect(files.has('gitignore')).toBe(false);
    expect(existsSync(path.join(target, '.gitignore'))).toBe(true);
  });

  it('produces a parseable package.json depending on @butai/deck + @butai/themes', () => {
    const target = tempTarget('deps-deck');
    scaffold(target);
    const pkg = JSON.parse(readFileSync(path.join(target, 'package.json'), 'utf8'));
    expect(pkg.name).toBe('deps-deck');
    expect(pkg.dependencies['@butai/deck']).toBe(DEFAULT_BUTAI_VERSION);
    expect(pkg.dependencies['@butai/themes']).toBe(DEFAULT_BUTAI_VERSION);
    expect(pkg.dependencies.react).toBeTruthy();
    expect(pkg.scripts.dev).toBe('vite');
  });

  it('produces a parseable butai.json with a valid ButaiConfig shape', () => {
    const target = tempTarget('cfg-deck');
    scaffold(target);
    const cfg = JSON.parse(readFileSync(path.join(target, 'butai.json'), 'utf8'));
    expect(typeof cfg.registry).toBe('string');
    expect(cfg.tsx).toBe(true);
    expect(cfg.aliases).toMatchObject({
      slides: expect.any(String),
      primitives: expect.any(String),
      styles: expect.any(String),
    });
    expect(typeof cfg.importExtensions).toBe('boolean');
  });

  it('the deck entry imports SlideEngine/Slide from @butai/deck and a themes CSS', () => {
    const target = tempTarget('imports-deck');
    scaffold(target);
    const app = readFileSync(path.join(target, 'src', 'App.tsx'), 'utf8');
    const main = readFileSync(path.join(target, 'src', 'main.tsx'), 'utf8');
    expect(app).toMatch(/from '@butai\/deck'/);
    expect(app).toMatch(/SlideEngine/);
    expect(app).toMatch(/Slide\b/);
    expect(main).toMatch(/@butai\/deck\/styles\/engine\.css/);
    expect(main).toMatch(/@butai\/themes\/themes\/[a-z-]+\.css/);
    expect(main).toMatch(/data-theme/);
  });

  it('substitutes every token — no __…__ left, project name applied', () => {
    const target = tempTarget('token-deck');
    scaffold(target, { projectName: 'MyTalk' });
    for (const rel of allFiles(target)) {
      const raw = readFileSync(path.join(target, rel), 'utf8');
      expect(raw.includes('__PROJECT_NAME__'), `${rel} still has __PROJECT_NAME__`).toBe(false);
      expect(raw.includes('__BUTAI_VERSION__'), `${rel} still has __BUTAI_VERSION__`).toBe(false);
    }
    const html = readFileSync(path.join(target, 'index.html'), 'utf8');
    expect(html).toContain('<title>MyTalk</title>');
  });

  it('refuses to overwrite a non-empty dir unless forced', () => {
    const target = tempTarget('twice-deck');
    scaffold(target);
    expect(() => scaffold(target)).toThrow(/not empty/i);
    expect(() => scaffold(target, { force: true })).not.toThrow();
  });
});
