/**
 * Registry resolution (phase-3 §0.7).
 *
 * Only the `file:` resolver is built this phase — it reads `index.json` and the
 * raw source files straight off disk. `npm`/`github` resolvers are typed stubs
 * that throw `not-implemented` (a P10/publish concern); they exist so the seam is
 * real without pulling in a network/publish surface now.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { RegistryIndex } from './registry-types.js';

/** The one seam the CLI needs: read the index + any raw source file by its path. */
export interface RegistryResolver {
  readIndex(): RegistryIndex;
  readFileRaw(filePath: string): string;
}

export class NotImplementedError extends Error {
  readonly code = 'not-implemented';
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

/**
 * Reads a registry off the local filesystem. The `file:` spec points at the dir
 * that CONTAINS `index.json`; file paths in the index (`src/slides/…`) are
 * resolved against the package root — the parent of that dir (mirrors
 * `node_modules/@butai/slide-kit/registry` + `src/…`).
 */
export class FileRegistry implements RegistryResolver {
  private readonly registryDir: string;
  private readonly packageRoot: string;

  constructor(registryDir: string) {
    this.registryDir = registryDir;
    this.packageRoot = path.dirname(registryDir);
  }

  readIndex(): RegistryIndex {
    const p = path.join(this.registryDir, 'index.json');
    if (!existsSync(p)) {
      throw new Error(`Registry index not found: ${p}`);
    }
    return JSON.parse(readFileSync(p, 'utf8')) as RegistryIndex;
  }

  readFileRaw(filePath: string): string {
    return readFileSync(path.join(this.packageRoot, filePath), 'utf8');
  }
}

/**
 * Resolve a `butai.json` `registry` spec to a resolver. `file:` only; everything
 * else throws a clear `not-implemented` error.
 */
export function resolveRegistry(spec: string, consumerRoot: string): RegistryResolver {
  if (spec.startsWith('file:')) {
    const raw = spec.slice('file:'.length);
    const dir = path.isAbsolute(raw) ? raw : path.resolve(consumerRoot, raw);
    return new FileRegistry(dir);
  }
  if (spec.startsWith('http://') || spec.startsWith('https://') || spec.startsWith('github:')) {
    throw new NotImplementedError(
      `GitHub/HTTP registry resolution is not implemented yet (registry: "${spec}"). ` +
        `Use a "file:" registry for now. Tracked as a P10/publish concern.`,
    );
  }
  // Bare package specifier like "@butai/slide-kit" — future node_modules resolver.
  throw new NotImplementedError(
    `npm registry resolution is not implemented yet (registry: "${spec}"). ` +
      `Use a "file:" registry for now. Tracked as a P10/publish concern.`,
  );
}

/** Resolve an item's copy closure: transitive `registryDependencies`, deduped,
 *  dependencies-first (post-order DFS). Throws on an unknown/dangling id. */
export function resolveClosure(index: RegistryIndex, rootId: string): RegistryIndex['items'] {
  const byId = new Map(index.items.map((it) => [it.id, it]));
  const ordered: RegistryIndex['items'] = [];
  const visited = new Set<string>();

  const visit = (id: string): void => {
    if (visited.has(id)) return;
    visited.add(id);
    const item = byId.get(id);
    if (!item) {
      throw new Error(`Unknown registry item: "${id}"`);
    }
    for (const dep of item.registryDependencies) visit(dep);
    ordered.push(item);
  };

  visit(rootId);
  return ordered;
}
