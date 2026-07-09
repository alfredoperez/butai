/**
 * Shared release-check seam (phase-10 §0.3).
 *
 * The single source of truth both the manifest lint and the publish dry-run
 * read: the intended-PUBLIC package set, the intended-PRIVATE set, and small
 * fs helpers. Frozen so Group A (readme.test.ts) and Group B (publish-manifest
 * + checklist-coverage) can run in parallel against the same lists.
 *
 * Node builtins only. This package emits nothing (noEmit) — it exists to run
 * the ship-ready assertions in vitest and to host the dry-run scripts.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Repo root — two levels up from packages/release-check/src. */
export function repoRoot(): string {
  return path.resolve(HERE, '..', '..', '..');
}

/** Absolute path to a package dir under packages/. */
export function packageDir(dir: string): string {
  return path.join(repoRoot(), 'packages', dir);
}

export type PackageJson = {
  name?: string;
  version?: string;
  private?: boolean;
  main?: string;
  types?: string;
  license?: string;
  files?: string[];
  bin?: Record<string, string> | string;
  exports?: Record<string, unknown>;
  publishConfig?: { access?: string };
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [k: string]: unknown;
};

/** Read+parse a package.json under packages/<dir>. */
export function readPkg(dir: string): PackageJson {
  const p = path.join(packageDir(dir), 'package.json');
  return JSON.parse(readFileSync(p, 'utf8')) as PackageJson;
}

export type PublishablePkg = {
  /** dir name under packages/ */
  dir: string;
  /** expected npm name */
  name: string;
};

/**
 * The 7 intended-PUBLIC packages (phase-10 D1): the engine + kits + cli — the
 * reusable surface a consumer installs. `create-butai` is a separate publish
 * (see CREATE_BUTAI), listed on its own in the checklist.
 */
export const PUBLISHABLE: readonly PublishablePkg[] = [
  { dir: 'patterns', name: '@butai/patterns' },
  { dir: 'themes', name: '@butai/themes' },
  { dir: 'deck', name: '@butai/deck' },
  { dir: 'slide-kit', name: '@butai/slide-kit' },
  { dir: 'scene-kit', name: '@butai/scene-kit' },
  { dir: 'docs-kit', name: '@butai/docs-kit' },
  { dir: 'cli', name: '@butai/cli' },
];

/** The starter — its own publish, kept private overnight (a morning item). */
export const CREATE_BUTAI: PublishablePkg = { dir: 'create-butai', name: '@butai/create-butai' };

/**
 * Intended-PRIVATE / never-published (phase-10 D1). These correctly keep
 * `private: true` — the dry-run must NOT publish them and the checklist must
 * not flip them.
 */
export const PRIVATE_EXPECTED: readonly string[] = [
  'apps/studio', // name: studio
  'apps/playground', // name: playground
  'library/web', // @butai/library-web (internal recipe demo)
  'packages/credits', // @butai/credits (internal generator)
  'plugins/butai-skills', // @butai/skills-plugin (ships via marketplace)
  'packages/release-check', // @butai/release-check (internal, this phase)
];

/** Dependency-safe publish order (leaves first) for `pnpm -r publish`. */
export const PUBLISH_ORDER: readonly string[] = [
  '@butai/patterns',
  '@butai/themes',
  '@butai/deck',
  '@butai/slide-kit',
  '@butai/scene-kit',
  '@butai/docs-kit',
  '@butai/cli',
];
