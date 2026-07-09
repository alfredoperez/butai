/**
 * Provenance guard (Group A) — proves the generalized seed doc patterns carry
 * ZERO leakage from the sources they were generalized from: a proprietary house
 * design system AND private personal briefs/reports. None of that provenance,
 * palette, handle, or product copy may cross into the kit (this repo goes
 * public).
 *
 * Scope: the Group-A doc-pattern artifacts (the leakage surface) —
 * `src/patterns/**` plus the generated `PATTERNS` module.
 *
 * The specific proprietary/personal provenance needles were removed for the
 * public repo; the generalized content was verified clean during the build.
 * The remaining generic needles assert no external component-kit provenance
 * leaks into the seed docs.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = dirname(fileURLToPath(import.meta.url));
const patternsDir = join(srcDir, "patterns");
const generatedModule = join(srcDir, "patterns.generated.ts");

/** Case-insensitive substring needles (assembled from fragments). */
const FORBIDDEN_CI: string[] = [
  ["hero", "ui"].join(""),
  ["@hero", "ui"].join(""),
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe("forbidden strings (doc-pattern provenance guard)", () => {
  const files = [...walk(patternsDir), generatedModule];

  it("scans a plausible file set (12 patterns × 2 + generated)", () => {
    expect(files.length).toBeGreaterThanOrEqual(25);
  });

  it.each(files)("%s carries no forbidden design-system/personal string", (file) => {
    const raw = readFileSync(file, "utf8");
    const lower = raw.toLowerCase();
    for (const needle of FORBIDDEN_CI) {
      expect(lower.includes(needle.toLowerCase()), `"${needle}" found in ${file}`).toBe(false);
    }
  });
});
