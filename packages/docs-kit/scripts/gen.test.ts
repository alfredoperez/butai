/**
 * Group A gates: the doc-pattern catalog + registry are byte-deterministic (two
 * builds identical, committed output current), every pattern is cataloged as
 * `kind: page`, the registry is well-formed, and the shared `docs.frame.md`
 * design spec parses via the frozen `parseDesignSpec` with ZERO error
 * diagnostics (the render-valid smoke gate, no credits spent).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseDesignSpec } from "@butai/patterns";
import type { DocRegistryIndex } from "../src/registry-types.js";
import { buildCatalog, buildPatternsModule, buildRegistryIndex } from "./gen.js";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const catalogDir = join(pkgRoot, "catalog");
const registryDir = join(pkgRoot, "registry");
const srcDir = join(pkgRoot, "src");

const PATTERN_IDS = [
  "callout",
  "card-grid",
  "code-block",
  "comparison",
  "data-table",
  "decisions",
  "doc-footer",
  "doc-hero",
  "metric-grid",
  "quote-band",
  "section-header",
  "timeline",
];

describe("doc-pattern catalog generation", () => {
  const { catalog, diagnostics } = buildCatalog();

  it("has no error diagnostics", () => {
    expect(diagnostics.filter((d) => d.level === "error")).toEqual([]);
  });

  it("catalogs exactly 12 patterns, all kind:page", () => {
    expect(catalog.count).toBe(12);
    expect(catalog.kinds).toEqual({ page: 12 });
    expect(catalog.items.every((i) => i.kind === "page")).toBe(true);
    expect(catalog.contentHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("contains every seed pattern id", () => {
    const ids = new Set(catalog.items.map((i) => i.id));
    for (const id of PATTERN_IDS) expect(ids, `missing ${id}`).toContain(id);
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

describe("doc-pattern registry generation", () => {
  const { index } = buildRegistryIndex();

  it("lists 12 registry:doc-pattern items", () => {
    expect(index.items).toHaveLength(12);
    for (const it of index.items) expect(it.type).toBe("registry:doc-pattern");
    expect(index.items.map((i) => i.id)).toEqual([...PATTERN_IDS].sort());
  });

  it("gives each pattern its .html (target pages), sha256'd", () => {
    for (const it of index.items) {
      expect(it.files, `${it.id} files`).toHaveLength(1);
      const [file] = it.files;
      expect(file.target, `${it.id} target`).toBe("pages");
      expect(file.path, `${it.id} path`).toBe(`src/patterns/${it.id}.html`);
      expect(file.sha256, `${it.id} sha`).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("keeps patterns standalone: empty dependencies + registryDependencies", () => {
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

describe("PATTERNS barrel module", () => {
  it("matches the committed src/patterns.generated.ts", () => {
    expect(readFileSync(join(srcDir, "patterns.generated.ts"), "utf8")).toBe(buildPatternsModule());
  });
});

describe("the shared docs.frame.md is render-valid (parseDesignSpec-clean, no credits)", () => {
  it("parses with zero error diagnostics", () => {
    const src = readFileSync(join(srcDir, "docs.frame.md"), "utf8");
    const { spec, diagnostics } = parseDesignSpec(src);
    expect(diagnostics.filter((d) => d.level === "error")).toEqual([]);
    expect(spec.name.length).toBeGreaterThan(0);
    expect(Object.keys(spec.colors).length).toBeGreaterThan(0);
    expect(Object.keys(spec.typography).length).toBeGreaterThan(0);
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

  it("two PATTERNS-module builds are byte-identical", () => {
    expect(buildPatternsModule()).toBe(buildPatternsModule());
  });

  it("committed index parses back to the same contentHash", () => {
    const committed = JSON.parse(
      readFileSync(join(registryDir, "index.json"), "utf8"),
    ) as DocRegistryIndex;
    expect(committed.contentHash).toBe(buildRegistryIndex().index.contentHash);
  });
});
