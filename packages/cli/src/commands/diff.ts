/**
 * `butai diff <item>` — report drift between a consumer copy and the registry
 * (phase-3 §0.5, step 3). TWO independent channels:
 *
 *   1. UPSTREAM DRIFT — the header's recorded `source-sha256` no longer matches
 *      the registry file's current raw hash ("registry updated since copy").
 *   2. LOCAL EDITS — the consumer body (header stripped, imports normalized back
 *      to registry form) differs from the registry source normalized the SAME
 *      way. Same normalization on both sides = symmetric, so a freshly-added
 *      file is never falsely flagged (the `.js`-extension canary).
 *
 * Exits non-zero on any drift (script-friendly). `--quiet` suppresses detail.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { aliasToDir, readConfig, readTsconfigPaths } from '../config.js';
import { resolveRegistry } from '../registry.js';
import {
  hashRaw,
  normalizeImports,
  parseRecordedSha,
  rewriteImports,
  stripProvenance,
  unifiedDiff,
} from '../transform.js';
import { defaultLogger, type Logger } from '../io.js';

export type DiffOptions = {
  cwd: string;
  item: string;
  quiet?: boolean;
  logger?: Logger;
};

export async function runDiff(opts: DiffOptions): Promise<number> {
  const log = opts.logger ?? defaultLogger;
  const config = readConfig(opts.cwd);
  if (!config) {
    log.err('No butai.json found. Run `butai init` first.');
    return 1;
  }

  const registry = resolveRegistry(config.registry, opts.cwd);
  const index = registry.readIndex();
  const tsconfigPaths = readTsconfigPaths(opts.cwd);

  const item = index.items.find((i) => i.id === opts.item);
  if (!item) {
    log.err(`Unknown registry item: "${opts.item}"`);
    return 1;
  }

  let drift = false;

  for (const file of item.files) {
    const targetDir = aliasToDir(config.aliases[file.target], opts.cwd, tsconfigPaths);
    const targetPath = path.join(targetDir, path.basename(file.path));
    const label = rel(opts.cwd, targetPath);
    const importMap = item.importMap[file.path] ?? {};

    if (!existsSync(targetPath)) {
      drift = true;
      if (!opts.quiet) log.log(`MISSING: ${label} — not copied yet (run \`butai add ${item.id}\`).`);
      else log.log(`MISSING ${label}`);
      continue;
    }

    const consumer = readFileSync(targetPath, 'utf8');
    const raw = registry.readFileRaw(file.path);

    // Channel 1: upstream drift via the recorded sha anchor.
    const recordedSha = parseRecordedSha(consumer);
    const currentSha = hashRaw(raw);
    const upstream = recordedSha !== null && recordedSha !== currentSha;

    // Channel 2: local edits via symmetric normalization.
    const consumerNorm = normalizeImports(stripProvenance(consumer), importMap, config.aliases);
    const registryNorm = normalizeImports(
      rewriteImports(raw, importMap, config.aliases, config.importExtensions),
      importMap,
      config.aliases,
    );
    const bodyDiffers = consumerNorm !== registryNorm;

    if (upstream) {
      drift = true;
      if (opts.quiet) {
        log.log(`UPSTREAM ${label}`);
      } else {
        log.log(`UPSTREAM DRIFT: ${label} — registry updated since copy.`);
        log.log(indent(unifiedDiff(registryNorm, consumerNorm)));
      }
    } else if (bodyDiffers) {
      drift = true;
      if (opts.quiet) {
        log.log(`LOCAL ${label}`);
      } else {
        log.log(`LOCAL EDITS: ${label}`);
        log.log(indent(unifiedDiff(registryNorm, consumerNorm)));
      }
    } else if (!opts.quiet) {
      log.log(`in sync: ${label}`);
    }
  }

  if (!drift && !opts.quiet) log.log(`${item.id}: in sync with the registry.`);
  return drift ? 1 : 0;
}

function indent(text: string): string {
  return text
    .split('\n')
    .map((l) => `    ${l}`)
    .join('\n');
}

function rel(root: string, p: string): string {
  const r = path.relative(root, p);
  return r.startsWith('..') ? p : r;
}
