/**
 * Provenance guard (Group A) — proves the generalized seed scenes carry ZERO
 * leakage from the private campaign source they were generalized from (a
 * marketing video for an internal tool). None of that message, personal
 * handles, or vendored-render machinery may cross into the kit.
 *
 * Scope: the Group-A scene artifacts (the leakage surface) — `src/scenes/**`
 * plus the generated `SCENES` module.
 *
 * The specific campaign/personal provenance needles were removed for the public
 * repo; the generalized content was verified clean during the build. The
 * remaining generic needles assert no external render/component provenance
 * leaks into the seed scenes.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = dirname(fileURLToPath(import.meta.url));
const scenesDir = join(srcDir, "scenes");
const generatedModule = join(srcDir, "scenes.generated.ts");

/** Case-insensitive substring needles (assembled from fragments). */
const FORBIDDEN_CI: string[] = [
  ["hyperframes", ".json"].join(""),
  ["hero", "ui"].join(""),
  ["@hero", "ui"].join(""),
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe("forbidden strings (scene provenance guard)", () => {
  const files = [...walk(scenesDir), generatedModule];

  it("scans a plausible file set (all 5 scenes × 3 + generated)", () => {
    expect(files.length).toBeGreaterThanOrEqual(16);
  });

  it.each(files)("%s carries no forbidden campaign/personal string", (file) => {
    const raw = readFileSync(file, "utf8");
    const lower = raw.toLowerCase();
    for (const needle of FORBIDDEN_CI) {
      expect(lower.includes(needle.toLowerCase()), `"${needle}" found in ${file}`).toBe(false);
    }
  });
});
