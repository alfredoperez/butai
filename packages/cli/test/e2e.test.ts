/**
 * End-to-end CLI test against the hand-authored fixture registry
 * (packages/cli/fixtures). Exercises init -> add (closure) -> overwrite-warning
 * -> diff across BOTH drift channels, including the "add then diff = in sync"
 * canary. Integration later swaps the fixture for the REAL @butai/slide-kit
 * registry (see the report notes).
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInit } from '../src/commands/init.js';
import { runAdd } from '../src/commands/add.js';
import { runDiff } from '../src/commands/diff.js';
import { collectLogger } from '../src/io.js';

const FIXTURES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures');

let root: string;
let consumer: string;
let registrySrc: string;
let registrySpec: string;

const slidesDir = () => path.join(consumer, 'src/components/butai/slides');
const primitivesDir = () => path.join(consumer, 'src/components/butai/primitives');
const stylesDir = () => path.join(consumer, 'src/styles/butai');

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'butai-cli-'));
  consumer = path.join(root, 'consumer');
  registrySrc = path.join(root, 'registry-src');
  cpSync(FIXTURES, registrySrc, { recursive: true });
  registrySpec = `file:${path.join(registrySrc, 'registry')}`;
  mkdirSync(consumer, { recursive: true });
  // A consumer tsconfig with the @/* -> ./src/* path mapping the CLI resolves against.
  writeFileSync(
    path.join(consumer, 'tsconfig.json'),
    JSON.stringify({ compilerOptions: { paths: { '@/*': ['./src/*'] } } }, null, 2),
  );
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('init', () => {
  it('writes a butai.json with the resolved registry + default aliases', async () => {
    const log = collectLogger();
    const code = await runInit({ cwd: consumer, yes: true, registry: registrySpec, logger: log });
    expect(code).toBe(0);
    const config = JSON.parse(readFileSync(path.join(consumer, 'butai.json'), 'utf8'));
    expect(config.registry).toBe(registrySpec);
    expect(config.aliases.slides).toBe('@/components/butai/slides');
    expect(config.importExtensions).toBe(false);
  });

  it('is idempotent: re-init merges without clobbering hand edits', async () => {
    await runInit({ cwd: consumer, yes: true, registry: registrySpec, logger: collectLogger() });
    const p = path.join(consumer, 'butai.json');
    const edited = JSON.parse(readFileSync(p, 'utf8'));
    edited.aliases.slides = '@/custom/slides';
    writeFileSync(p, JSON.stringify(edited, null, 2));
    await runInit({ cwd: consumer, yes: true, registry: registrySpec, logger: collectLogger() });
    const after = JSON.parse(readFileSync(p, 'utf8'));
    expect(after.aliases.slides).toBe('@/custom/slides'); // hand edit preserved
    expect(after.aliases.primitives).toBe('@/components/butai/primitives'); // default kept
  });
});

async function init() {
  await runInit({ cwd: consumer, yes: true, registry: registrySpec, logger: collectLogger() });
}

describe('add', () => {
  it('copies the WHOLE closure, rewrites imports, stamps headers, prints npm deps', async () => {
    await init();
    const log = collectLogger();
    const code = await runAdd({ cwd: consumer, items: ['quote-slide'], logger: log });
    expect(code).toBe(0);

    // Closure: label (primitive) + cover-slide + quote-slide.
    expect(existsSync(path.join(primitivesDir(), 'label.tsx'))).toBe(true);
    expect(existsSync(path.join(slidesDir(), 'cover-slide.tsx'))).toBe(true);
    expect(existsSync(path.join(slidesDir(), 'quote-slide.tsx'))).toBe(true);
    // CSS companion lands in the styles dir.
    expect(existsSync(path.join(stylesDir(), 'cover-slide.css'))).toBe(true);

    const cover = readFileSync(path.join(slidesDir(), 'cover-slide.tsx'), 'utf8');
    const quote = readFileSync(path.join(slidesDir(), 'quote-slide.tsx'), 'utf8');
    const label = readFileSync(path.join(primitivesDir(), 'label.tsx'), 'utf8');
    const css = readFileSync(path.join(stylesDir(), 'cover-slide.css'), 'utf8');

    // Provenance headers present with the right type + id.
    expect(cover).toContain('butai:slide cover-slide');
    expect(quote).toContain('butai:slide quote-slide');
    expect(label).toContain('butai:primitive label');
    expect(css).toContain('butai:slide cover-slide'); // header valid as a CSS comment too
    expect(cover).toMatch(/source-sha256: [0-9a-f]{64}/);

    // Imports rewritten to the configured alias; no registry-relative imports left.
    expect(cover).toContain(`from '@/components/butai/primitives/label';`);
    expect(quote).toContain(`from '@/components/butai/slides/cover-slide';`);
    expect(cover).not.toContain('../primitives/label.js');
    expect(quote).not.toContain('../slides/cover-slide.js');
    // External imports untouched.
    expect(cover).toContain(`from '@butai/deck';`);
    expect(quote).toContain(`from 'qrcode.react';`);

    // Single install summary lists the npm + workspace deps.
    const out = log.text();
    expect(out).toContain('npm install qrcode.react');
    expect(out).toContain('@butai/deck');
  });

  it('wires copied CSS via an idempotent butai-kit.css aggregator (§0.5)', async () => {
    await init();
    const log = collectLogger();
    await runAdd({ cwd: consumer, items: ['cover-slide'], logger: log });

    // The consumer aggregator lands in the styles dir + @imports the copied CSS.
    const aggPath = path.join(stylesDir(), 'butai-kit.css');
    expect(existsSync(aggPath)).toBe(true);
    const agg = readFileSync(aggPath, 'utf8');
    expect(agg).toContain('butai:aggregator butai-kit');
    expect(agg).toContain(`@import "./cover-slide.css";`);
    // add prints the one-time import hint.
    expect(log.text()).toContain('butai-kit.css');
    expect(log.text()).toContain('import "@/styles/butai/butai-kit.css" once');

    // Idempotent: re-adding (overwrite) does not duplicate the import.
    await runAdd({ cwd: consumer, items: ['cover-slide'], overwrite: true, logger: collectLogger() });
    const after = readFileSync(aggPath, 'utf8');
    expect(after).toBe(agg);
    expect(after.split('\n').filter((l) => l.includes('cover-slide.css')).length).toBe(1);
  });

  it('--dry-run does not write the aggregator', async () => {
    await init();
    await runAdd({ cwd: consumer, items: ['cover-slide'], dryRun: true, logger: collectLogger() });
    expect(existsSync(path.join(stylesDir(), 'butai-kit.css'))).toBe(false);
  });

  it('re-add without --overwrite warns + skips, leaving files unchanged', async () => {
    await init();
    await runAdd({ cwd: consumer, items: ['quote-slide'], logger: collectLogger() });
    const target = path.join(slidesDir(), 'cover-slide.tsx');
    const before = readFileSync(target, 'utf8');

    const log = collectLogger();
    const code = await runAdd({ cwd: consumer, items: ['quote-slide'], logger: log });
    expect(code).toBe(0);
    expect(log.text()).toContain('skipped');
    expect(readFileSync(target, 'utf8')).toBe(before); // untouched
  });

  it('--dry-run writes nothing', async () => {
    await init();
    const log = collectLogger();
    await runAdd({ cwd: consumer, items: ['quote-slide'], dryRun: true, logger: log });
    expect(existsSync(path.join(slidesDir(), 'quote-slide.tsx'))).toBe(false);
    expect(log.text()).toContain('Would add');
  });
});

describe('diff — both drift channels + the in-sync canary', () => {
  it('CANARY: add then diff = in sync (no false drift under .js normalization)', async () => {
    await init();
    await runAdd({ cwd: consumer, items: ['cover-slide'], logger: collectLogger() });
    const log = collectLogger();
    const code = await runDiff({ cwd: consumer, item: 'cover-slide', logger: log });
    expect(code).toBe(0);
    expect(log.text()).toContain('in sync');
    expect(log.text()).not.toContain('LOCAL EDITS');
    expect(log.text()).not.toContain('UPSTREAM');
  });

  it('CANARY holds when the consumer keeps .js extensions (importExtensions=true)', async () => {
    await runInit({
      cwd: consumer,
      yes: true,
      registry: registrySpec,
      importExtensions: true,
      logger: collectLogger(),
    });
    await runAdd({ cwd: consumer, items: ['cover-slide'], logger: collectLogger() });
    const cover = readFileSync(path.join(slidesDir(), 'cover-slide.tsx'), 'utf8');
    expect(cover).toContain(`from '@/components/butai/primitives/label.js';`); // .js kept
    const code = await runDiff({ cwd: consumer, item: 'cover-slide', logger: collectLogger() });
    expect(code).toBe(0); // still in sync
  });

  it('reports LOCAL EDITS after editing a copied file', async () => {
    await init();
    await runAdd({ cwd: consumer, items: ['cover-slide'], logger: collectLogger() });
    const target = path.join(slidesDir(), 'cover-slide.tsx');
    writeFileSync(target, `${readFileSync(target, 'utf8')}\n// a local tweak\n`);

    const log = collectLogger();
    const code = await runDiff({ cwd: consumer, item: 'cover-slide', logger: log });
    expect(code).toBe(1);
    expect(log.text()).toContain('LOCAL EDITS');
    expect(log.text()).toContain('+ // a local tweak');
    expect(log.text()).not.toContain('UPSTREAM');
  });

  it('reports UPSTREAM DRIFT after the registry source is bumped', async () => {
    await init();
    await runAdd({ cwd: consumer, items: ['cover-slide'], logger: collectLogger() });

    // Mutate the registry's raw source (registry moved on).
    const regFile = path.join(registrySrc, 'src/slides/cover-slide.tsx');
    writeFileSync(regFile, `${readFileSync(regFile, 'utf8')}\n// upstream change\n`);

    const log = collectLogger();
    const code = await runDiff({ cwd: consumer, item: 'cover-slide', logger: log });
    expect(code).toBe(1);
    expect(log.text()).toContain('UPSTREAM DRIFT');
    expect(log.text()).toContain('registry updated since copy');
  });

  it('--quiet stays silent when in sync (exit 0)', async () => {
    await init();
    await runAdd({ cwd: consumer, items: ['cover-slide'], logger: collectLogger() });
    const log = collectLogger();
    const code = await runDiff({ cwd: consumer, item: 'cover-slide', quiet: true, logger: log });
    expect(code).toBe(0);
    expect(log.out.length).toBe(0);
  });
});

describe('registry resolver stubs', () => {
  it('add against an npm registry throws not-implemented', async () => {
    await runInit({ cwd: consumer, yes: true, registry: '@butai/slide-kit', logger: collectLogger() });
    await expect(runAdd({ cwd: consumer, items: ['cover-slide'], logger: collectLogger() })).rejects.toThrow(
      /not implemented/i,
    );
  });
});
