/**
 * `butai add <item…>` — copy a registry item's closure into the consumer
 * (phase-3 §0.6). Pure string rewrite via the precomputed `importMap`; no TS
 * resolver, fully deterministic. The CLI does NOT run a package manager — it
 * PRINTS the deps to install.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { RegistryItem } from '../registry-types.js';
import { aliasToDir, readConfig, readTsconfigPaths } from '../config.js';
import { resolveClosure, resolveRegistry } from '../registry.js';
import {
  KIT_AGGREGATOR_FILE,
  buildKitAggregator,
  hashRaw,
  prependProvenance,
  rewriteImports,
} from '../transform.js';
import { defaultLogger, type Logger } from '../io.js';

export type AddOptions = {
  cwd: string;
  items: string[];
  overwrite?: boolean;
  backup?: boolean;
  dryRun?: boolean;
  logger?: Logger;
};

type PlannedFile = {
  itemId: string;
  from: string; // registry file path
  to: string; // absolute consumer path
  exists: boolean;
};

export async function runAdd(opts: AddOptions): Promise<number> {
  const log = opts.logger ?? defaultLogger;
  const config = readConfig(opts.cwd);
  if (!config) {
    log.err('No butai.json found. Run `butai init` first.');
    return 1;
  }

  const registry = resolveRegistry(config.registry, opts.cwd);
  const index = registry.readIndex();
  const tsconfigPaths = readTsconfigPaths(opts.cwd);

  // Resolve the union closure across every requested item (deps-first, deduped).
  const closure: RegistryItem[] = [];
  const seen = new Set<string>();
  for (const requested of opts.items) {
    for (const item of resolveClosure(index, requested)) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      closure.push(item);
    }
  }

  const written: PlannedFile[] = [];
  const skipped: PlannedFile[] = [];
  const npmDeps = new Set<string>();
  const workspaceDeps = new Set<string>();

  for (const item of closure) {
    for (const dep of item.dependencies) npmDeps.add(dep);
    for (const dep of item.butaiDependencies) workspaceDeps.add(dep);

    for (const file of item.files) {
      const targetDir = aliasToDir(config.aliases[file.target], opts.cwd, tsconfigPaths);
      const targetPath = path.join(targetDir, path.basename(file.path));
      const exists = existsSync(targetPath);
      const planned: PlannedFile = { itemId: item.id, from: file.path, to: targetPath, exists };

      if (exists && !opts.overwrite) {
        skipped.push(planned);
        continue;
      }

      if (!opts.dryRun) {
        const raw = registry.readFileRaw(file.path);
        const sha = hashRaw(raw);
        const rewritten = rewriteImports(
          raw,
          item.importMap[file.path] ?? {},
          config.aliases,
          config.importExtensions,
        );
        const content = prependProvenance(
          rewritten,
          { type: item.type, id: item.id, fromRegistry: index.name },
          sha,
        );
        mkdirSync(targetDir, { recursive: true });
        if (exists && opts.backup) copyFileSync(targetPath, `${targetPath}.bak`);
        writeFileSync(targetPath, content, 'utf8');
      }
      written.push(planned);
    }
  }

  // §0.5 step 3: wire the copied CSS via a single idempotent consumer aggregator,
  // so the copied .tsx render styled without an injected `import './x.css'` (which
  // would perturb per-item `diff`). The aggregator is NOT a registry item file, so
  // `diff <item>` never inspects it.
  const cssBasenames = [
    ...new Set(
      closure.flatMap((item) =>
        item.files.filter((f) => f.target === 'styles').map((f) => path.basename(f.path)),
      ),
    ),
  ];
  let aggregator: { path: string; importSpec: string } | undefined;
  if (cssBasenames.length > 0) {
    const stylesDir = aliasToDir(config.aliases.styles, opts.cwd, tsconfigPaths);
    const aggPath = path.join(stylesDir, KIT_AGGREGATOR_FILE);
    const importSpec = `${config.aliases.styles}/${KIT_AGGREGATOR_FILE}`;
    if (!opts.dryRun) {
      const existing = existsSync(aggPath) ? readFileSync(aggPath, 'utf8') : null;
      const next = buildKitAggregator(existing, cssBasenames);
      if (existing !== next) {
        mkdirSync(stylesDir, { recursive: true });
        writeFileSync(aggPath, next, 'utf8');
      }
    }
    aggregator = { path: aggPath, importSpec };
  }

  printSummary(log, opts, { closure, written, skipped, npmDeps, workspaceDeps, aggregator });
  return 0;
}

function printSummary(
  log: Logger,
  opts: AddOptions,
  data: {
    closure: RegistryItem[];
    written: PlannedFile[];
    skipped: PlannedFile[];
    npmDeps: Set<string>;
    workspaceDeps: Set<string>;
    aggregator?: { path: string; importSpec: string };
  },
): void {
  const verb = opts.dryRun ? 'Would add' : 'Added';
  const closureIds = data.closure.map((i) => i.id).join(', ');
  log.log(`${verb} ${opts.items.join(', ')} (closure: ${closureIds})`);

  if (data.written.length > 0) {
    log.log(`  ${opts.dryRun ? 'would write' : 'written'} (${data.written.length}):`);
    for (const f of data.written) log.log(`    ${f.from} -> ${rel(opts.cwd, f.to)}`);
  }
  if (data.skipped.length > 0) {
    log.log(`  skipped — already exist (use --overwrite to replace):`);
    for (const f of data.skipped) log.log(`    ${rel(opts.cwd, f.to)}`);
  }
  if (data.npmDeps.size > 0) {
    log.log(`  install npm deps:`);
    log.log(`    npm install ${[...data.npmDeps].sort().join(' ')}`);
  }
  if (data.workspaceDeps.size > 0) {
    log.log(`  ensure workspace deps present:`);
    log.log(`    ${[...data.workspaceDeps].sort().join(', ')}`);
  }
  if (data.aggregator) {
    const verb = opts.dryRun ? 'would wire' : 'wired';
    log.log(`  ${verb} styles → ${rel(opts.cwd, data.aggregator.path)}`);
    log.log(`    import "${data.aggregator.importSpec}" once`);
  }
}

function rel(root: string, p: string): string {
  const r = path.relative(root, p);
  return r.startsWith('..') ? p : r;
}
