/**
 * Meta harvesting — read PatternMeta items out of a directory of markdown
 * files with YAML frontmatter (`id/name/kind/category/description` +
 * optional `engine/motion/tags`). The first fenced code block in the body
 * becomes the copy-ready `snippet`.
 *
 * Directory walking is sorted and `source.file` paths are normalized to
 * `/` separators so output is deterministic across runs and platforms.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';

import type { Diagnostic, PatternMeta } from '../types.js';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const FENCE_RE = /^```[^\n]*\r?\n([\s\S]*?)^```/m;

function walkMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  );
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdownFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

/** Recursively read `*.md` files under `dir` into PatternMeta items. */
export function metasFromMarkdownDir(dir: string): {
  items: PatternMeta[];
  diagnostics: Diagnostic[];
} {
  const items: PatternMeta[] = [];
  const diagnostics: Diagnostic[] = [];

  for (const file of walkMarkdownFiles(dir)) {
    const rel = relative(dir, file).split('\\').join('/');
    const src = readFileSync(file, 'utf8');

    const fm = FRONTMATTER_RE.exec(src);
    if (!fm) {
      diagnostics.push({
        level: 'warning',
        code: 'missing-id',
        message: `${rel}: no frontmatter — skipped`,
      });
      continue;
    }

    let data: Record<string, unknown>;
    try {
      const parsed: unknown = parseYaml(fm[1]);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('frontmatter is not a mapping');
      }
      data = parsed as Record<string, unknown>;
    } catch {
      diagnostics.push({
        level: 'warning',
        code: 'invalid-frontmatter',
        message: `${rel}: unparseable frontmatter — skipped`,
      });
      continue;
    }

    const id = asString(data.id);
    if (!id) {
      diagnostics.push({
        level: 'warning',
        code: 'missing-id',
        message: `${rel}: frontmatter has no id — skipped`,
      });
      continue;
    }

    const missing = ['name', 'kind', 'category', 'description'].filter((f) => !asString(data[f]));
    if (missing.length > 0) {
      diagnostics.push({
        level: 'warning',
        code: 'missing-field',
        message: `${rel}: missing frontmatter field(s): ${missing.join(', ')}`,
      });
    }

    const body = src.slice(fm[0].length);
    const fence = FENCE_RE.exec(body);
    const snippet = fence ? fence[1].replace(/\r?\n$/, '') : undefined;

    const tags = Array.isArray(data.tags)
      ? data.tags.filter((t): t is string => typeof t === 'string')
      : undefined;

    items.push({
      id,
      name: asString(data.name) ?? '',
      kind: (asString(data.kind) ?? '') as PatternMeta['kind'],
      category: asString(data.category) ?? '',
      description: asString(data.description) ?? '',
      ...(snippet !== undefined ? { snippet } : {}),
      ...(asString(data.motion) !== undefined ? { motion: asString(data.motion) } : {}),
      ...(asString(data.engine) !== undefined ? { engine: asString(data.engine) } : {}),
      ...(tags && tags.length > 0 ? { tags } : {}),
      source: { file: rel },
    });
  }

  return { items, diagnostics };
}
