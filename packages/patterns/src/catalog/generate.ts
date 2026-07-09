/**
 * Catalog generator — validates PatternMeta items and produces the
 * deterministic Catalog (JSON shape) plus a human-readable markdown view.
 *
 * Determinism is the contract: no timestamps, stable key order, stable
 * sorting (kind → category → id), so regenerating over unchanged inputs
 * is byte-identical.
 */
import { createHash } from 'node:crypto';

import type { Catalog, Diagnostic, PatternMeta } from '../types.js';
import { catalogVersion } from '../version.js';

const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const KINDS: readonly PatternMeta['kind'][] = ['slide', 'motion', 'page', 'scene', 'theme'];
const REQUIRED_FIELDS = ['id', 'name', 'kind', 'category', 'description'] as const;

/** Rebuild a meta with a fixed key order so hashing/serialization is stable. */
function normalizeMeta(item: PatternMeta): PatternMeta {
  return {
    id: item.id,
    name: item.name,
    kind: item.kind,
    category: item.category,
    description: item.description,
    ...(item.snippet !== undefined ? { snippet: item.snippet } : {}),
    ...(item.motion !== undefined ? { motion: item.motion } : {}),
    ...(item.engine !== undefined ? { engine: item.engine } : {}),
    ...(item.tags !== undefined ? { tags: item.tags } : {}),
    ...(item.source !== undefined ? { source: { file: item.source.file } } : {}),
  };
}

function compareMeta(a: PatternMeta, b: PatternMeta): number {
  if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
  if (a.category !== b.category) return a.category < b.category ? -1 : 1;
  if (a.id !== b.id) return a.id < b.id ? -1 : 1;
  return 0;
}

/**
 * Validate + sort items into a Catalog. Invalid items (bad/duplicate id,
 * missing required field, unknown kind) surface as `error` diagnostics and
 * are excluded from the output.
 */
export function generateCatalog(items: PatternMeta[]): {
  catalog: Catalog;
  diagnostics: Diagnostic[];
} {
  const diagnostics: Diagnostic[] = [];
  const seen = new Set<string>();
  const valid: PatternMeta[] = [];

  for (const item of items) {
    const label = item.id || item.name || '(unnamed)';

    const missing = REQUIRED_FIELDS.filter((f) => !item[f]);
    if (missing.length > 0) {
      diagnostics.push({
        level: 'error',
        code: 'missing-field',
        message: `Item "${label}" is missing required field(s): ${missing.join(', ')} — excluded`,
      });
      continue;
    }
    if (!KEBAB_RE.test(item.id)) {
      diagnostics.push({
        level: 'error',
        code: 'bad-id',
        message: `Item id "${item.id}" is not kebab-case — excluded`,
      });
      continue;
    }
    if (!KINDS.includes(item.kind)) {
      diagnostics.push({
        level: 'error',
        code: 'bad-kind',
        message: `Item "${item.id}" has unknown kind "${String(item.kind)}" — excluded`,
      });
      continue;
    }
    if (seen.has(item.id)) {
      diagnostics.push({
        level: 'error',
        code: 'duplicate-id',
        message: `Duplicate id "${item.id}" — later item excluded`,
      });
      continue;
    }
    seen.add(item.id);
    valid.push(normalizeMeta(item));
  }

  valid.sort(compareMeta);

  const kinds: Record<string, number> = {};
  for (const item of valid) kinds[item.kind] = (kinds[item.kind] ?? 0) + 1;

  const contentHash = createHash('sha256').update(JSON.stringify(valid)).digest('hex');

  const catalog: Catalog = {
    version: catalogVersion(),
    contentHash,
    count: valid.length,
    kinds,
    items: valid,
  };

  return { catalog, diagnostics };
}

/**
 * Render the human-readable catalog.md. Deterministic — mirrors catalog order.
 * Format is byte-compatible with the committed `library/web/catalog/catalog.md`
 * (originally produced by library/web's local pipeline, retired in P1 iter 2).
 */
export function renderCatalogMd(catalog: Catalog): string {
  const lines: string[] = [
    '# Butai pattern catalog',
    '',
    `- count: ${catalog.count}`,
    `- version: ${catalog.version}`,
    `- contentHash: ${catalog.contentHash}`,
    '',
  ];

  let kind: string | null = null;
  let category: string | null = null;
  for (const item of catalog.items) {
    if (item.kind !== kind) {
      kind = item.kind;
      category = null;
      lines.push(`## ${kind}`, '');
    }
    if (item.category !== category) {
      category = item.category;
      lines.push(`### ${category}`, '');
    }
    const engine = item.engine ? ` · engine: ${item.engine}` : '';
    lines.push(`- **${item.name}** (\`${item.id}\`)${engine} — ${item.description}`);
    if (item.motion) lines.push(`  - motion: ${item.motion}`);
  }
  lines.push('');

  return lines.join('\n');
}
