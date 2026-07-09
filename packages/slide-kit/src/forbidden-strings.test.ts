/**
 * Provenance guard — the migrated kit must carry zero personal data and zero
 * gsap-business-plugin source. Mirrors P2's deck guard.
 *
 * The specific personal/campaign provenance needles were removed for the public
 * repo; the generalized content was verified clean during the build. The
 * remaining gsap-business-plugin needles are assembled from fragments so this
 * file never trips its own scan.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcRoot = join(dirname(fileURLToPath(import.meta.url)));

const FORBIDDEN: string[] = [
  ["/presentations", "/screenshots"].join(""),
  ["DrawSVG", "Plugin"].join(""),
  ["Physics2D", "Plugin"].join(""),
  ["Morph", "SVG"].join(""),
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe("forbidden strings (provenance guard)", () => {
  const files = walk(srcRoot).filter((f) => !f.endsWith("forbidden-strings.test.ts"));

  it("scans a plausible file set", () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
  });

  it.each(FORBIDDEN)("no file under src/ contains %s", (needle) => {
    const offenders = files.filter((f) =>
      readFileSync(f, "utf8").toLowerCase().includes(needle.toLowerCase()),
    );
    expect(offenders).toEqual([]);
  });
});
