#!/usr/bin/env node
/**
 * create-butai — the `npm create butai` / `npx create-butai <dir>` starter
 * (phase-10 D3 + §0.4).
 *
 * Scaffolds a minimal CONSUMER deck project: a tiny deck that imports
 * SlideEngine/Slide from @butai/deck, applies a @butai/themes theme, and ships
 * a valid butai.json so `butai add <slide>` works out of the box.
 *
 * NOTE (architecture pivot): this is a CONSUMER starter, not a Studio. The
 * visual authoring app (the old Storyboard/Video studio) was removed from the
 * repo — authoring now lives in the maintainer's separate private app. So the
 * starter only wires up deck consumption + copy-in.
 *
 * Pure fs copy + string token substitution. No network, no install, no
 * interactive prompts required (positional dir arg + --yes defaults).
 */

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * Overnight placeholder for the `@butai/*` version range the template pins.
 * The real launch version is set at publish time (a PUBLIC-FLIP-CHECKLIST
 * step). The generator does NOT read workspace versions — they are 0.0.1,
 * pre-launch. For local development against a workspace checkout, swap these
 * to `file:` / `link:` specs (documented in the scaffolded README).
 */
export const DEFAULT_BUTAI_VERSION = '^0.1.0';

export type ScaffoldOptions = {
  /** project name substituted for __PROJECT_NAME__ (default: target basename) */
  projectName?: string;
  /** version range substituted for __BUTAI_VERSION__ */
  butaiVersion?: string;
  /** overwrite a non-empty target dir (default false) */
  force?: boolean;
};

export type ScaffoldResult = {
  targetDir: string;
  projectName: string;
  files: string[];
};

/** Absolute path to the bundled template dir (works from both src/ and dist/). */
export function templateDir(): string {
  return path.resolve(HERE, '..', 'template');
}

const TOKEN_RE = /__PROJECT_NAME__|__BUTAI_VERSION__/g;

function substitute(text: string, projectName: string, butaiVersion: string): string {
  return text.replace(TOKEN_RE, (m) => (m === '__PROJECT_NAME__' ? projectName : butaiVersion));
}

/** Files copied verbatim (binary-safe) — none today, but the hook is here. */
const VERBATIM_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2']);

/** template filename -> scaffolded filename (dotfile un-shadowing). */
function destName(name: string): string {
  if (name === 'gitignore') return '.gitignore';
  return name;
}

function walk(dir: string, base = ''): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const abs = path.join(dir, entry);
    const rel = path.join(base, entry);
    if (statSync(abs).isDirectory()) out.push(...walk(abs, rel));
    else out.push(rel);
  }
  return out;
}

/**
 * Scaffold the consumer template into `targetDir`. Deterministic + offline.
 * Returns the list of written files (relative to targetDir).
 */
export function scaffold(targetDir: string, opts: ScaffoldOptions = {}): ScaffoldResult {
  const abs = path.resolve(targetDir);
  const projectName = opts.projectName ?? path.basename(abs);
  const butaiVersion = opts.butaiVersion ?? DEFAULT_BUTAI_VERSION;

  if (existsSync(abs) && statSync(abs).isDirectory() && readdirSync(abs).length > 0 && !opts.force) {
    throw new Error(`Target directory is not empty: ${abs} (pass force to overwrite).`);
  }
  mkdirSync(abs, { recursive: true });

  const tpl = templateDir();
  const written: string[] = [];
  for (const rel of walk(tpl)) {
    const srcPath = path.join(tpl, rel);
    const outRel = path.join(path.dirname(rel), destName(path.basename(rel)));
    const outPath = path.join(abs, outRel);
    mkdirSync(path.dirname(outPath), { recursive: true });
    if (VERBATIM_EXT.has(path.extname(rel))) {
      cpSync(srcPath, outPath);
    } else {
      const raw = readFileSync(srcPath, 'utf8');
      writeFileSync(outPath, substitute(raw, projectName, butaiVersion));
    }
    written.push(outRel);
  }

  return { targetDir: abs, projectName, files: written.sort() };
}

function parseArgs(argv: string[]): { dir?: string; yes: boolean; force: boolean; help: boolean } {
  let dir: string | undefined;
  let yes = false;
  let force = false;
  let help = false;
  for (const a of argv) {
    if (a === '--yes' || a === '-y') yes = true;
    else if (a === '--force') force = true;
    else if (a === '-h' || a === '--help') help = true;
    else if (!a.startsWith('-') && !dir) dir = a;
  }
  return { dir, yes, force, help };
}

const USAGE = `create-butai — scaffold a minimal butai consumer deck

Usage:
  npm create butai <dir>
  npx create-butai <dir> [--yes] [--force]

Scaffolds a tiny deck that consumes @butai/deck + a @butai/themes theme, with a
butai.json ready for \`butai add <slide>\`. No install is run — cd in and install.
`;

function main(argv: string[]): number {
  const { dir, help, force } = parseArgs(argv);
  if (help || !dir) {
    process.stdout.write(USAGE);
    return dir ? 0 : 1;
  }
  try {
    const res = scaffold(dir, { force });
    process.stdout.write(`\nScaffolded "${res.projectName}" into ${res.targetDir}\n`);
    process.stdout.write(`  ${res.files.length} files written.\n\n`);
    process.stdout.write('Next steps:\n');
    process.stdout.write(`  cd ${dir}\n`);
    process.stdout.write('  pnpm install     # or npm install\n');
    process.stdout.write('  pnpm dev         # start Vite\n');
    process.stdout.write('  npx butai add cover-slide   # copy a slide from the registry\n\n');
    return 0;
  } catch (err) {
    process.stderr.write(`create-butai: ${(err as Error).message}\n`);
    return 1;
  }
}

// Run directly (the bin), not when imported by the test.
if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main(process.argv.slice(2)));
}
