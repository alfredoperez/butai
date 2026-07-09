/**
 * Trademark / personal-data guard — the headline gate of the phase. Scans the
 * whole packaged plugin surface (all seven SKILL.md + the README + both manifests)
 * and fails on any app-internal path or proprietary vendor/font string that must
 * never ship in a public plugin.
 *
 * Two classes of needle:
 *   - BLANKET substrings — must appear NOWHERE (app-internal paths, generic
 *     build/provenance markers).
 *   - NAME-ONLY — a trademarked external tool (consumed via npx in prose, which
 *     is allowed) must never be used as a skill/plugin `name:` value.
 *
 * The specific proprietary/personal provenance needles were removed for the
 * public repo; the generalized content was verified clean during the build. The
 * remaining needles are assembled from fragments so this guard file never trips
 * its own scan.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = dirname(fileURLToPath(import.meta.url));
const pluginRoot = join(srcDir, "..");
const repoRoot = join(pluginRoot, "..", "..");
const skillsDir = join(pluginRoot, "skills");
const readmePath = join(pluginRoot, "README.md");
const pluginManifestPath = join(pluginRoot, ".claude-plugin", "plugin.json");
const marketplacePath = join(repoRoot, ".claude-plugin", "marketplace.json");

/** Case-insensitive substrings — forbidden ANYWHERE (assembled from fragments). */
const FORBIDDEN_CI: string[] = [
  // app-internal paths
  ["Projects/Content/", "Talks"].join(""),
  ["apps/", "presentations"].join(""),
  // component kit + generic build artifacts
  ["hero", "ui"].join(""),
  ["@hero", "ui"].join(""),
  ["frontend-", "slides"].join(""),
  ["bold ", "pack"].join(""),
  ["localhost:", "5173"].join(""),
  ["qa", "/"].join(""),
];

/** Trademarked external tools — allowed in prose (consumed via npx), forbidden
 *  as a skill/plugin `name:` value. */
const FORBIDDEN_NAME = new Set(
  [
    ["hyper", "frames"].join(""),
    ["remo", "tion"].join(""),
  ].map((s) => s.toLowerCase()),
);

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

/** Every `name:` (YAML frontmatter) or "name": (JSON) value declared in a file. */
function declaredNames(raw: string): string[] {
  const names: string[] = [];
  for (const m of raw.matchAll(/^name:\s*(\S+)/gm)) names.push(m[1]);
  for (const m of raw.matchAll(/"name"\s*:\s*"([^"]+)"/g)) names.push(m[1]);
  return names;
}

describe("forbidden strings (plugin trademark/personal-data guard)", () => {
  const files = [...walk(skillsDir), readmePath, pluginManifestPath, marketplacePath].filter(
    (f) => existsSync(f),
  );

  it("scans a plausible packaged file set (skills + README + both manifests)", () => {
    expect(files.length).toBeGreaterThanOrEqual(6);
  });

  it.each(files)("%s carries no forbidden personal/proprietary string", (file) => {
    const raw = readFileSync(file, "utf8");
    const lower = raw.toLowerCase();
    for (const needle of FORBIDDEN_CI) {
      expect(lower.includes(needle.toLowerCase()), `"${needle}" found in ${file}`).toBe(false);
    }
    for (const name of declaredNames(raw)) {
      expect(
        FORBIDDEN_NAME.has(name.toLowerCase()),
        `trademarked tool "${name}" used as a name in ${file}`,
      ).toBe(false);
    }
  });
});
