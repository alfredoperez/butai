/**
 * Manifest-validation test — the installable-integrity proof for the
 * butai-skills plugin. Pure Node fs + `yaml`; no network, no `claude` CLI
 * dependency, so it runs anywhere `pnpm check` runs.
 *
 * It asserts, deterministically and offline:
 *   1. plugin.json parses + has the frozen required fields + name === "butai-skills".
 *   2. skills/ contains EXACTLY the seven expected dirs, each with a SKILL.md.
 *   3. Each SKILL.md frontmatter parses with a non-empty name + description, and
 *      `name` EQUALS the folder name (the invocation-name contract).
 *   4. Repo-root marketplace.json parses; its single plugin entry's name equals
 *      plugin.json's name and its source resolves to ./plugins/butai-skills.
 *
 * NOTE: the seven-skill roster is the six content skills plus the P8 maintainer
 * skill (butai-sync-upstreams). If a dir is authored in parallel and has not yet
 * landed, the exact-seven assertion fails transiently; it resolves at integration.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";

const srcDir = dirname(fileURLToPath(import.meta.url));
const pluginRoot = join(srcDir, "..");
const repoRoot = join(pluginRoot, "..", "..");
const pluginManifestPath = join(pluginRoot, ".claude-plugin", "plugin.json");
const marketplacePath = join(repoRoot, ".claude-plugin", "marketplace.json");
const skillsDir = join(pluginRoot, "skills");

/** The frozen seven-skill roster (six content skills + the P8 maintainer skill). */
const EXPECTED_SKILLS = [
  "butai-scene-author",
  "butai-storyboard-to-video",
  "butai-html-page",
  "butai-talk-plan",
  "butai-theme-author",
  "butai-deck-compose",
  "butai-sync-upstreams",
].sort();

const SEMVER = /^\d+\.\d+\.\d+/;

/** Read a SKILL.md and return its parsed YAML frontmatter (between the first
 *  two `---` fences). */
function readFrontmatter(file: string): Record<string, unknown> {
  const raw = readFileSync(file, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  expect(match, `no frontmatter fence in ${file}`).not.toBeNull();
  return parseYaml(match![1]) as Record<string, unknown>;
}

describe("plugin.json manifest", () => {
  const manifest = JSON.parse(readFileSync(pluginManifestPath, "utf8"));

  it("parses and is named butai-skills", () => {
    expect(manifest.name).toBe("butai-skills");
  });

  it("carries the frozen recommended fields", () => {
    expect(typeof manifest.version).toBe("string");
    expect(manifest.version).toMatch(SEMVER);
    expect(typeof manifest.description).toBe("string");
    expect(manifest.description.length).toBeGreaterThan(0);
    expect(manifest.license).toBe("MIT");
    expect(manifest.author?.name).toBeTruthy();
    expect(Array.isArray(manifest.keywords)).toBe(true);
  });
});

describe("marketplace.json", () => {
  const marketplace = JSON.parse(readFileSync(marketplacePath, "utf8"));
  const manifest = JSON.parse(readFileSync(pluginManifestPath, "utf8"));

  it("parses and lists exactly one plugin", () => {
    expect(Array.isArray(marketplace.plugins)).toBe(true);
    expect(marketplace.plugins.length).toBe(1);
  });

  it("cross-references plugin.json by name", () => {
    expect(marketplace.plugins[0].name).toBe(manifest.name);
  });

  it("sources the plugin from ./plugins/butai-skills", () => {
    expect(marketplace.plugins[0].source).toBe("./plugins/butai-skills");
  });

  it("carries no personal identity in owner.name", () => {
    // generic, trademark-clean owner (asserted precisely by the guard test)
    expect(marketplace.owner?.name).toBeTruthy();
  });
});

describe("all seven skills resolve (folder === frontmatter name)", () => {
  const present = existsSync(skillsDir)
    ? readdirSync(skillsDir).filter((n) => statSync(join(skillsDir, n)).isDirectory())
    : [];

  it("skills/ contains exactly the seven expected dirs", () => {
    expect(present.slice().sort()).toEqual(EXPECTED_SKILLS);
  });

  it.each(EXPECTED_SKILLS)("%s has a SKILL.md whose name equals the folder", (skill) => {
    const skillMd = join(skillsDir, skill, "SKILL.md");
    expect(existsSync(skillMd), `missing ${skill}/SKILL.md`).toBe(true);
    const fm = readFrontmatter(skillMd);
    expect(fm.name, `${skill} frontmatter name`).toBe(skill);
    expect(typeof fm.description).toBe("string");
    expect((fm.description as string).length).toBeGreaterThan(0);
  });
});
