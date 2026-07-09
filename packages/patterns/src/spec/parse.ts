/**
 * Design-spec parser — `frame.md` / `design.md`.
 *
 * A spec is YAML frontmatter (the normative, machine layer: colors,
 * typography, spacing, components) plus a markdown body whose `##` sections
 * carry prose context. Frontmatter values are passed through VERBATIM —
 * exact hex casing and font strings, never normalized, rounded, or
 * lowercased. Parsing never throws on content: problems surface as
 * diagnostics and the parser returns a best-effort spec.
 */
import { parse as parseYaml } from 'yaml';

import type { DesignSpec, Diagnostic } from '../types.js';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Coerce a frontmatter map into Record<string, string>, keeping values verbatim. */
function toStringRecord(value: unknown): Record<string, string> | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== 'object' || Array.isArray(value)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (v === null || v === undefined) continue;
    // Strings pass through untouched; scalars are stringified as-is.
    out[k] = typeof v === 'string' ? v : String(v);
  }
  return out;
}

/** Split a markdown body into sections at `##`(+) headings. */
function extractSections(body: string): DesignSpec['sections'] {
  const sections: DesignSpec['sections'] = [];
  const lines = body.split('\n');
  let current: { heading: string; level: number; bodyLines: string[] } | null = null;
  for (const line of lines) {
    const m = /^(#{2,6})\s+(.*)$/.exec(line);
    if (m) {
      if (current) {
        sections.push({
          heading: current.heading,
          level: current.level,
          body: current.bodyLines.join('\n').trim(),
        });
      }
      current = { heading: m[2].trim(), level: m[1].length, bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    }
  }
  if (current) {
    sections.push({
      heading: current.heading,
      level: current.level,
      body: current.bodyLines.join('\n').trim(),
    });
  }
  return sections;
}

/**
 * Parse a design-spec source string into a DesignSpec plus diagnostics.
 * Never throws on content — malformed YAML yields a single `error`
 * diagnostic and a best-effort body-only spec.
 */
export function parseDesignSpec(src: string): { spec: DesignSpec; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];

  let frontmatter: Record<string, unknown> = {};
  let body = src;

  const fm = FRONTMATTER_RE.exec(src);
  if (fm) {
    body = src.slice(fm[0].length);
    try {
      const parsed: unknown = parseYaml(fm[1]);
      if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        frontmatter = parsed as Record<string, unknown>;
      } else if (parsed !== null && parsed !== undefined) {
        diagnostics.push({
          level: 'error',
          code: 'invalid-frontmatter',
          message: 'Frontmatter is not a YAML mapping — spec is body-only',
        });
      }
    } catch (err) {
      diagnostics.push({
        level: 'error',
        code: 'invalid-frontmatter',
        message: `Unparseable YAML frontmatter — spec is body-only (${err instanceof Error ? err.message.split('\n')[0] : 'unknown error'})`,
      });
    }
  }

  const name = typeof frontmatter.name === 'string' ? frontmatter.name : '';
  if (!name) {
    diagnostics.push({
      level: 'warning',
      code: 'missing-name',
      message: 'Spec frontmatter has no name',
    });
  }

  const colors = toStringRecord(frontmatter.colors) ?? {};
  if (Object.keys(colors).length === 0) {
    diagnostics.push({
      level: 'warning',
      code: 'missing-colors',
      message: 'Spec frontmatter has no colors',
    });
  }

  const typography = toStringRecord(frontmatter.typography) ?? {};
  if (Object.keys(typography).length === 0) {
    diagnostics.push({
      level: 'warning',
      code: 'missing-typography',
      message: 'Spec frontmatter has no typography',
    });
  }

  const spacing = toStringRecord(frontmatter.spacing);
  const components = toStringRecord(frontmatter.components);

  const sections = extractSections(body);
  const seen = new Set<string>();
  for (const s of sections) {
    if (seen.has(s.heading)) {
      diagnostics.push({
        level: 'warning',
        code: 'duplicate-section',
        message: `Duplicate section heading: "${s.heading}"`,
      });
    }
    seen.add(s.heading);
  }

  const spec: DesignSpec = {
    name,
    colors,
    typography,
    ...(spacing ? { spacing } : {}),
    ...(components ? { components } : {}),
    sections,
    raw: { frontmatter, body },
  };

  return { spec, diagnostics };
}
