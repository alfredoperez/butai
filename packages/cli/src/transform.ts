/**
 * PURE, deterministic transform primitives for the copy-in pipeline (phase-3 §0.5–0.6).
 *
 * Everything here is string/crypto only — no filesystem, no clock, no randomness.
 * The CLI's `add`/`diff` commands compose these; the heavy unit tests live in
 * `transform.test.ts`. Determinism is load-bearing: the same inputs must always
 * yield byte-identical outputs so `diff` can compare copies against the registry.
 */

import { createHash } from 'node:crypto';
import type { ButaiAliases } from './config-types.js';
import type { FileImportMap } from './registry-types.js';

/** sha256 (hex) of the raw source — the drift anchor recorded in every header. */
export function hashRaw(source: string): string {
  return createHash('sha256').update(source, 'utf8').digest('hex');
}

/** Replace a quoted import specifier (both quote styles) exactly. Pure string ops,
 *  no regex — so specifier contents never need escaping and matches are exact. */
function replaceSpecifier(source: string, from: string, to: string): string {
  if (from === to) return source;
  return source
    .split(`'${from}'`)
    .join(`'${to}'`)
    .split(`"${from}"`)
    .join(`"${to}"`);
}

/** Resolve a registry import to its alias form: `<aliasDir>/<item>` (+ `.js` when
 *  the consumer keeps extensions). This is the single source of the forward rule. */
function aliasSpecifier(
  aliasDir: string,
  item: string,
  importExtensions: boolean,
): string {
  return importExtensions ? `${aliasDir}/${item}.js` : `${aliasDir}/${item}`;
}

/**
 * Rewrite a file's imports for the consumer (phase-3 §0.6 step 1).
 *
 * - `registry` imports → `<alias>/<item-id>` (drop or keep `.js` per `importExtensions`).
 * - `external` imports (`@butai/*`, npm) → left untouched.
 */
export function rewriteImports(
  source: string,
  importMap: FileImportMap,
  aliases: ButaiAliases,
  importExtensions: boolean,
): string {
  let out = source;
  for (const [spec, entry] of Object.entries(importMap)) {
    if (entry.kind !== 'registry') continue;
    const target = aliasSpecifier(aliases[entry.alias], entry.item, importExtensions);
    out = replaceSpecifier(out, spec, target);
  }
  return out;
}

/**
 * Reverse of `rewriteImports`: turn alias forms back into the registry's original
 * specifiers, regardless of `.js` presence. This is the NORMALIZATION used by
 * `diff` on BOTH sides so comparison is symmetric — the `.js` extension mode can
 * never make a freshly-added file look drifted (the top canary in the plan).
 */
export function normalizeImports(
  source: string,
  importMap: FileImportMap,
  aliases: ButaiAliases,
): string {
  let out = source;
  for (const [spec, entry] of Object.entries(importMap)) {
    if (entry.kind !== 'registry') continue;
    const aliasDir = aliases[entry.alias];
    // Collapse both the `.js` and extensionless alias forms back to the original.
    out = replaceSpecifier(out, `${aliasDir}/${entry.item}.js`, spec);
    out = replaceSpecifier(out, `${aliasDir}/${entry.item}`, spec);
  }
  return out;
}

/** What `prependProvenance` needs to stamp a header. */
export type ProvenanceStamp = {
  /** May be `registry:slide` or bare `slide`; the `registry:` prefix is stripped. */
  type: string;
  id: string;
  fromRegistry: string;
};

function bareType(type: string): string {
  return type.startsWith('registry:') ? type.slice('registry:'.length) : type;
}

/**
 * Prepend the provenance header (phase-3 §0.5). NO TIMESTAMP — `source-sha256`
 * is the only anchor. `sha` is the raw-source hash captured at copy time.
 */
export function prependProvenance(source: string, item: ProvenanceStamp, sha: string): string {
  const t = bareType(item.type);
  const header = [
    '/**',
    ` * butai:${t} ${item.id}`,
    ` * Added by \`butai add ${item.id}\` from ${item.fromRegistry}.`,
    ` * source-sha256: ${sha}`,
    ` * Edit freely. Run \`butai diff ${item.id}\` to see drift from the registry.`,
    ' */',
  ].join('\n');
  return `${header}\n\n${source}`;
}

/**
 * Consumer-side CSS aggregator (phase-4 §0.5, step 3).
 *
 * Because a copied `.tsx` can't `import "./x.css"` under slide-kit's plain-tsc
 * model (and injecting one would perturb `diff`), `add` instead maintains ONE
 * `butai-kit.css` in the consumer's styles dir that `@import`s slide-base + every
 * copied per-item CSS. This keeps component copies byte-faithful (drift detection
 * untouched) and matches shadcn's "one globals.css" mental model. The consumer
 * imports it once. Idempotent: re-adding merges the union of `@import`s.
 */
export const KIT_AGGREGATOR_FILE = 'butai-kit.css';

/** slide-base loads first so per-item CSS can override its base classes. */
const SLIDE_BASE_CSS = 'slide-base.css';

/** Pull the `./<name>.css` basenames out of an existing aggregator (idempotent merge). */
export function parseKitImports(content: string): string[] {
  const out: string[] = [];
  const re = /@import\s+["']\.\/([^"']+\.css)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) out.push(m[1]);
  return out;
}

/**
 * Build (or merge) the `butai-kit.css` aggregator. `existing` is the current file
 * contents (or null on first write); `cssFiles` are the copied CSS basenames from
 * the closure. Output is deterministic: slide-base first, then the remaining
 * basenames sorted, deduped. Provenance-headed so `diff` recognizes it as a
 * generated artifact (it is never one of a registry item's `files`, so per-item
 * `diff` already skips it).
 */
export function buildKitAggregator(existing: string | null, cssFiles: string[]): string {
  const set = new Set<string>(existing ? parseKitImports(existing) : []);
  for (const f of cssFiles) set.add(f);
  const all = [...set];
  const base = all.filter((f) => f === SLIDE_BASE_CSS);
  const rest = all.filter((f) => f !== SLIDE_BASE_CSS).sort();
  const ordered = [...base, ...rest];

  const header = [
    '/**',
    ' * butai:aggregator butai-kit',
    ' * Generated + maintained by `butai add` — imports every copied slide-kit style.',
    ' * Import this file ONCE in your app. Safe to regenerate; hand edits may be lost.',
    ' */',
  ].join('\n');
  const imports = ordered.map((f) => `@import "./${f}";`).join('\n');
  return `${header}\n\n${imports}\n`;
}

const BLOCK_COMMENT = /\/\*\*[\s\S]*?\*\//g;

/** The first non-empty content line of a block comment, stripped of comment syntax. */
function firstCommentLine(block: string): string {
  for (const line of block.split('\n')) {
    const cleaned = line.replace(/^\s*\/?\*+\/?/, '').trim();
    if (cleaned.length > 0) return cleaned;
  }
  return '';
}

const PROVENANCE_FIRST_LINE = /^butai:\S+\s+\S+/;

/**
 * Remove the first block comment whose first line matches `butai:<type> <id>`
 * (phase-3 §0.5), plus the blank line that follows. `stripProvenance(prepend(x))`
 * round-trips to `x` when `x` doesn't start with a newline (real source never does).
 */
export function stripProvenance(source: string): string {
  BLOCK_COMMENT.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = BLOCK_COMMENT.exec(source)) !== null) {
    if (!PROVENANCE_FIRST_LINE.test(firstCommentLine(m[0]))) continue;
    const start = m.index;
    let end = start + m[0].length;
    while (source[end] === '\n') end++;
    return source.slice(0, start) + source.slice(end);
  }
  return source;
}

/** Parse the recorded `source-sha256` out of a copied file's provenance header. */
export function parseRecordedSha(source: string): string | null {
  BLOCK_COMMENT.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = BLOCK_COMMENT.exec(source)) !== null) {
    if (!PROVENANCE_FIRST_LINE.test(firstCommentLine(m[0]))) continue;
    const sha = m[0].match(/source-sha256:\s*([0-9a-fA-F]+)/);
    return sha ? sha[1] : null;
  }
  return null;
}

/**
 * Minimal LCS-based line diff for `diff`'s report. Lines from the registry
 * (expected) are prefixed `-`, consumer (actual) `+`, context two spaces.
 */
export function unifiedDiff(expected: string, actual: string): string {
  const a = expected.split('\n');
  const b = actual.split('\n');
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push(`  ${a[i]}`);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push(`- ${a[i]}`);
      i++;
    } else {
      out.push(`+ ${b[j]}`);
      j++;
    }
  }
  while (i < n) out.push(`- ${a[i++]}`);
  while (j < m) out.push(`+ ${b[j++]}`);
  return out.join('\n');
}
