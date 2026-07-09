/**
 * `butai.json` read/write + consumer path resolution (phase-3 §0.3, §0.6 step 3).
 *
 * Node builtins only. Alias → real directory is resolved against the consumer's
 * tsconfig `paths` (e.g. `@/*` → `./src/*`); when no mapping exists we fall back
 * to a documented `--cwd`-relative rule: strip the leading `@/` and resolve under
 * the consumer root.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { ButaiConfig, ButaiAliases } from './config-types.js';

export const CONFIG_FILE = 'butai.json';

/** Default aliases, verbatim from phase-3 §0.3. */
export const DEFAULT_ALIASES: ButaiAliases = {
  slides: '@/components/butai/slides',
  primitives: '@/components/butai/primitives',
  styles: '@/styles/butai',
};

/** Default `file:` registry location for a published consumer (dev overrides it). */
export const DEFAULT_REGISTRY = 'file:node_modules/@butai/slide-kit/registry';

export function defaultConfig(overrides: Partial<ButaiConfig> = {}): ButaiConfig {
  const { aliases, ...rest } = overrides;
  return {
    $schema: 'https://butai.dev/schema/butai.json',
    registry: DEFAULT_REGISTRY,
    tsx: true,
    aliases: { ...DEFAULT_ALIASES, ...(aliases ?? {}) },
    importExtensions: false,
    ...rest,
  };
}

/** Aliases derived from a single base, e.g. `@/components/butai`. Styles sit under it too. */
export function aliasesFromBase(base: string): ButaiAliases {
  const trimmed = base.replace(/\/+$/, '');
  return {
    slides: `${trimmed}/slides`,
    primitives: `${trimmed}/primitives`,
    styles: `${trimmed}/styles`,
  };
}

export function configPath(consumerRoot: string): string {
  return path.join(consumerRoot, CONFIG_FILE);
}

export function readConfig(consumerRoot: string): ButaiConfig | null {
  const p = configPath(consumerRoot);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8')) as ButaiConfig;
}

/** Strip `//` and `/* *\/` comments so a JSONC tsconfig still parses. Cheap + good enough. */
function stripJsonComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

type TsconfigPaths = Record<string, string[]>;

/** Read `compilerOptions.paths` from the consumer's tsconfig, if any. */
export function readTsconfigPaths(consumerRoot: string): TsconfigPaths {
  const p = path.join(consumerRoot, 'tsconfig.json');
  if (!existsSync(p)) return {};
  const raw = readFileSync(p, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = JSON.parse(stripJsonComments(raw));
  }
  const opts = (parsed as { compilerOptions?: { paths?: TsconfigPaths } }).compilerOptions;
  return opts?.paths ?? {};
}

/**
 * Map an alias value (e.g. `@/components/butai/slides`) to an absolute directory
 * under the consumer, using tsconfig `paths` when available, else the documented
 * `@/`-strip fallback.
 */
export function aliasToDir(
  aliasValue: string,
  consumerRoot: string,
  paths: TsconfigPaths,
): string {
  for (const [key, targets] of Object.entries(paths)) {
    const target = targets[0];
    if (!target) continue;
    if (key.endsWith('/*')) {
      const prefix = key.slice(0, -1); // "@/*" -> "@/"
      if (aliasValue.startsWith(prefix)) {
        const rest = aliasValue.slice(prefix.length);
        const targetPrefix = target.slice(0, -1); // "./src/*" -> "./src/"
        return path.resolve(consumerRoot, targetPrefix + rest);
      }
    } else if (aliasValue === key) {
      return path.resolve(consumerRoot, target);
    }
  }
  // Fallback: strip a leading "@/" and resolve under the consumer root.
  const fallback = aliasValue.replace(/^@\//, '');
  return path.resolve(consumerRoot, fallback);
}
