/**
 * Design-spec resolution — which file to read in a directory.
 *
 * Precedence: `frame.md` → `design.md` → `DESIGN.md`, first existing wins.
 * `frame.md` is lowercase only (no FRAME.md variant). Matching is done
 * against the directory's actual entry names so behavior is identical on
 * case-sensitive and case-insensitive filesystems.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { DesignSpec, Diagnostic } from '../types.js';
import { parseDesignSpec } from './parse.js';

const SPEC_PRECEDENCE = ['frame.md', 'design.md', 'DESIGN.md'] as const;

/**
 * Resolve the design-spec path inside `dir`, or null when none of the
 * candidate filenames exist (exact-name match, so `FRAME.md` never resolves).
 */
export function resolveSpecPath(dir: string): string | null {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return null;
  }
  const names = new Set(entries);
  for (const candidate of SPEC_PRECEDENCE) {
    if (names.has(candidate)) return join(dir, candidate);
  }
  return null;
}

/**
 * Resolve + read + parse the design spec in `dir`.
 * Returns null when no spec file exists.
 */
export function loadDesignSpec(
  dir: string,
): { path: string; spec: DesignSpec; diagnostics: Diagnostic[] } | null {
  const path = resolveSpecPath(dir);
  if (!path) return null;
  const src = readFileSync(path, 'utf8');
  const { spec, diagnostics } = parseDesignSpec(src);
  return { path, spec, diagnostics };
}
