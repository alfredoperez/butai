/**
 * Group A gates: the scene catalog + registry are byte-deterministic (two
 * builds identical, committed output current), every scene is cataloged as
 * `kind: scene`, the registry is well-formed, and every `frame.md` design spec
 * parses via the frozen `parseDesignSpec` with ZERO error diagnostics (the
 * render-valid smoke gate, no credits spent).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseDesignSpec } from "@butai/patterns";
import type { SceneRegistryIndex } from "../src/registry-types.js";
import { buildCatalog, buildRegistryIndex, buildScenesModule } from "./gen.js";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const catalogDir = join(pkgRoot, "catalog");
const registryDir = join(pkgRoot, "registry");
const srcDir = join(pkgRoot, "src");
const scenesDir = join(srcDir, "scenes");

const SCENE_IDS = ["code-reveal", "feature-callout", "outro-scene", "quote-scene", "title-card"];

describe("scene catalog generation", () => {
  const { catalog, diagnostics } = buildCatalog();

  it("has no error diagnostics", () => {
    expect(diagnostics.filter((d) => d.level === "error")).toEqual([]);
  });

  it("catalogs exactly 5 scenes, all kind:scene", () => {
    expect(catalog.count).toBe(5);
    expect(catalog.kinds).toEqual({ scene: 5 });
    expect(catalog.items.every((i) => i.kind === "scene")).toBe(true);
    expect(catalog.contentHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("contains every seed scene id", () => {
    const ids = new Set(catalog.items.map((i) => i.id));
    for (const id of SCENE_IDS) expect(ids, `missing ${id}`).toContain(id);
  });

  it("sorts items kind → category → id", () => {
    const cats = catalog.items.map((i) => i.category);
    expect(cats).toEqual([...cats].sort());
  });

  it("matches the committed catalog/catalog.json and catalog.md", () => {
    const { json, md } = buildCatalog();
    expect(readFileSync(join(catalogDir, "catalog.json"), "utf8")).toBe(json);
    expect(readFileSync(join(catalogDir, "catalog.md"), "utf8")).toBe(md);
  });
});

describe("scene registry generation", () => {
  const { index, errors } = buildRegistryIndex();

  it("has no pairing errors (every scene has its frame.md)", () => {
    expect(errors).toEqual([]);
  });

  it("lists 5 registry:scene items", () => {
    expect(index.items).toHaveLength(5);
    for (const it of index.items) expect(it.type).toBe("registry:scene");
    expect(index.items.map((i) => i.id)).toEqual([...SCENE_IDS].sort());
  });

  it("gives each scene its .html (scenes) + .frame.md (specs), sha256'd", () => {
    for (const it of index.items) {
      const byTarget = Object.fromEntries(it.files.map((f) => [f.target, f]));
      expect(byTarget.scenes?.path, `${it.id} html`).toBe(`src/scenes/${it.id}.html`);
      expect(byTarget.specs?.path, `${it.id} frame`).toBe(`src/scenes/${it.id}.frame.md`);
      for (const f of it.files) expect(f.sha256, f.path).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("keeps scenes standalone: empty dependencies + registryDependencies", () => {
    for (const it of index.items) {
      expect(it.dependencies, `${it.id} deps`).toEqual([]);
      expect(it.registryDependencies, `${it.id} registryDeps`).toEqual([]);
    }
  });

  it("carries registryVersion + a top-level contentHash", () => {
    expect(index.registryVersion).toBe(1);
    expect(index.contentHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("matches the committed registry/index.json", () => {
    const { json } = buildRegistryIndex();
    expect(readFileSync(join(registryDir, "index.json"), "utf8")).toBe(json);
  });
});

describe("SCENES barrel module", () => {
  it("matches the committed src/scenes.generated.ts", () => {
    expect(readFileSync(join(srcDir, "scenes.generated.ts"), "utf8")).toBe(buildScenesModule());
  });
});

describe("every frame.md is render-valid (parseDesignSpec-clean, no credits)", () => {
  it.each(SCENE_IDS)("%s.frame.md parses with zero error diagnostics", (id) => {
    const src = readFileSync(join(scenesDir, `${id}.frame.md`), "utf8");
    const { spec, diagnostics } = parseDesignSpec(src);
    expect(diagnostics.filter((d) => d.level === "error"), `${id} errors`).toEqual([]);
    expect(spec.name.length, `${id} name`).toBeGreaterThan(0);
    expect(Object.keys(spec.colors).length, `${id} colors`).toBeGreaterThan(0);
    expect(Object.keys(spec.typography).length, `${id} typography`).toBeGreaterThan(0);
  });
});

describe("determinism", () => {
  it("two catalog builds are byte-identical", () => {
    expect(buildCatalog().json).toBe(buildCatalog().json);
    expect(buildCatalog().md).toBe(buildCatalog().md);
  });

  it("two registry builds are byte-identical", () => {
    expect(buildRegistryIndex().json).toBe(buildRegistryIndex().json);
  });

  it("two SCENES-module builds are byte-identical", () => {
    expect(buildScenesModule()).toBe(buildScenesModule());
  });

  it("committed index parses back to the same contentHash", () => {
    const committed = JSON.parse(
      readFileSync(join(registryDir, "index.json"), "utf8"),
    ) as SceneRegistryIndex;
    expect(committed.contentHash).toBe(buildRegistryIndex().index.contentHash);
  });
});
