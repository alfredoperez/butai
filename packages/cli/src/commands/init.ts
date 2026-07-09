/**
 * `butai init` — write/merge a `butai.json` into a consumer (phase-3 §0.3, step 2).
 *
 * Idempotent: re-running merges in any missing defaults but NEVER clobbers a
 * hand-edited value unless `--force`. Prompts for the alias base + importExtensions
 * when interactive; `--yes` (and non-TTY) takes the defaults.
 */

import { existsSync, writeFileSync } from 'node:fs';
import type { ButaiConfig, ButaiAliases } from '../config-types.js';
import {
  DEFAULT_ALIASES,
  aliasesFromBase,
  configPath,
  defaultConfig,
  readConfig,
} from '../config.js';
import { defaultLogger, promptYesNo, type Logger } from '../io.js';

export type InitOptions = {
  cwd: string;
  yes?: boolean;
  force?: boolean;
  registry?: string;
  aliasBase?: string;
  aliases?: Partial<ButaiAliases>;
  importExtensions?: boolean;
  tsx?: boolean;
  logger?: Logger;
};

export async function runInit(opts: InitOptions): Promise<number> {
  const log = opts.logger ?? defaultLogger;
  const p = configPath(opts.cwd);
  const exists = existsSync(p);

  // Resolve the intended aliases: explicit > base > defaults.
  const baseAliases: ButaiAliases = opts.aliasBase
    ? aliasesFromBase(opts.aliasBase)
    : { ...DEFAULT_ALIASES };
  const aliases: ButaiAliases = { ...baseAliases, ...(opts.aliases ?? {}) };

  let importExtensions = opts.importExtensions ?? false;
  if (!opts.yes && opts.importExtensions === undefined && process.stdin.isTTY) {
    importExtensions = await promptYesNo(
      'Keep .js extensions on rewritten imports (NodeNext consumers)?',
      false,
    );
  }

  const desired = defaultConfig({
    registry: opts.registry,
    tsx: opts.tsx ?? true,
    aliases,
    importExtensions,
  });

  if (!exists) {
    writeConfig(p, desired);
    log.log(`Wrote ${relative(opts.cwd, p)} (registry: ${desired.registry}).`);
    return 0;
  }

  const existing = readConfig(opts.cwd) as ButaiConfig;

  if (opts.force) {
    writeConfig(p, desired);
    log.log(`Reset ${relative(opts.cwd, p)} (--force).`);
    return 0;
  }

  // Merge: keep every hand-edited value, fill only what is missing.
  const merged: ButaiConfig = {
    ...desired,
    ...existing,
    aliases: { ...desired.aliases, ...existing.aliases },
  };
  if (JSON.stringify(merged) === JSON.stringify(existing)) {
    log.log(`Already initialized; ${relative(opts.cwd, p)} is up to date (use --force to reset).`);
    return 0;
  }
  writeConfig(p, merged);
  log.log(
    `Already initialized; merged in missing defaults without clobbering your edits (use --force to reset).`,
  );
  return 0;
}

function writeConfig(p: string, config: ButaiConfig): void {
  writeFileSync(p, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

function relative(root: string, p: string): string {
  return p.startsWith(root) ? p.slice(root.length).replace(/^[/\\]/, '') : p;
}
