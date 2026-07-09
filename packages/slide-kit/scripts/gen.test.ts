import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { RegistryIndex, RegistryItemType } from "../src/registry-types.js";
import { buildCatalog, buildRegistryIndex, buildStylesAggregator } from "./gen.js";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const catalogDir = join(pkgRoot, "catalog");
const registryDir = join(pkgRoot, "registry");
const stylesDir = join(pkgRoot, "src", "styles");

const ARCHETYPE_IDS = [
  "agenda-slide",
  "big-statement-slide",
  "bento-grid-slide",
  "code-scrolly-slide",
  "code-slideshow-slide",
  "code-spotlight-slide",
  "cold-open-slide",
  "comparison-table-slide",
  "concept-slide",
  "cover-slide",
  "demo-cue-slide",
  "full-bleed-slide",
  "image-caption-slide",
  "image-text-split-slide",
  "quote-portrait-slide",
  "quote-slide",
  "recap-slide",
  "section-divider-slide",
  "speaker-intro-slide",
  "stat-row-slide",
  "timeline-slide",
];

const VALID_TYPES: RegistryItemType[] = ["registry:slide", "registry:primitive", "registry:style"];

describe("catalog generation", () => {
  const { catalog, diagnostics } = buildCatalog();

  it("has no error diagnostics", () => {
    expect(diagnostics.filter((d) => d.level === "error")).toEqual([]);
  });

  it("has count >= 16 with kinds.slide >= 16, all kind slide", () => {
    expect(catalog.count).toBeGreaterThanOrEqual(16);
    expect(catalog.kinds.slide).toBeGreaterThanOrEqual(16);
    expect(catalog.count).toBe(catalog.items.length);
    expect(catalog.items.every((i) => i.kind === "slide")).toBe(true);
    expect(catalog.contentHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("contains every archetype id", () => {
    const ids = new Set(catalog.items.map((i) => i.id));
    for (const id of ARCHETYPE_IDS) expect(ids, `missing ${id}`).toContain(id);
  });

  it("contains no primitive/style items (catalog is slides-only)", () => {
    const ids = catalog.items.map((i) => i.id);
    expect(ids).not.toContain("label");
    expect(ids).not.toContain("slide-base");
  });

  it("matches the committed catalog/catalog.json and catalog.md", () => {
    const { json, md } = buildCatalog();
    expect(readFileSync(join(catalogDir, "catalog.json"), "utf8")).toBe(json);
    expect(readFileSync(join(catalogDir, "catalog.md"), "utf8")).toBe(md);
  });
});

describe("registry index generation", () => {
  const { index, errors } = buildRegistryIndex();

  it("has zero unresolved relative imports (closure complete, fails loud)", () => {
    expect(errors).toEqual([]);
  });

  it("lists every archetype as registry:slide", () => {
    const byId = new Map(index.items.map((i) => [i.id, i]));
    for (const id of ARCHETYPE_IDS) {
      expect(byId.get(id)?.type, `${id} type`).toBe("registry:slide");
    }
  });

  it("lists the migrated primitives as registry:primitive", () => {
    const byId = new Map(index.items.map((i) => [i.id, i]));
    for (const id of [
      "label",
      "subheading",
      "subtitle",
      "intro-slide",
      "icon",
      "badge",
      "code-panel",
      "code-hike-highlighter",
    ]) {
      expect(byId.get(id)?.type, `${id} type`).toBe("registry:primitive");
    }
  });

  it("declares codehike on the code archetypes and closures the copy-in adapter", () => {
    const byId = new Map(index.items.map((i) => [i.id, i]));
    for (const id of ["code-scrolly-slide", "code-spotlight-slide", "code-slideshow-slide"]) {
      expect(byId.get(id)?.dependencies, `${id} deps`).toEqual(["codehike"]);
      expect(byId.get(id)?.registryDependencies, `${id} closure`).toContain(
        "code-hike-highlighter",
      );
    }
    // The adapter derives "codehike" (package name, not the import subpath)
    // from its own static import.
    expect(byId.get("code-hike-highlighter")?.dependencies).toEqual(["codehike"]);
  });

  it("uses only the three allowed item types", () => {
    for (const it of index.items) expect(VALID_TYPES).toContain(it.type);
  });

  it("gives every archetype a populated importMap", () => {
    for (const id of ARCHETYPE_IDS) {
      const it = index.items.find((i) => i.id === id)!;
      const specs = Object.values(it.importMap).flatMap((m) => Object.keys(m));
      expect(specs.length, `${id} importMap`).toBeGreaterThan(0);
    }
  });

  it("closures slide-base into every registry:slide (§0.5 CSS-closure fix)", () => {
    const slides = index.items.filter((i) => i.type === "registry:slide");
    expect(slides.length).toBeGreaterThanOrEqual(16);
    for (const it of slides) {
      expect(it.registryDependencies, `${it.id} → slide-base`).toContain("slide-base");
    }
  });

  it("keeps slide-base a real registry:style item (closure resolves)", () => {
    const base = index.items.find((i) => i.id === "slide-base");
    expect(base?.type).toBe("registry:style");
    expect(base?.files.map((f) => f.path)).toContain("src/styles/slide-base.css");
  });

  it("does NOT register the generated aggregator as an item", () => {
    expect(index.items.find((i) => i.id === "index")).toBeUndefined();
  });

  it("resolves every registryDependency to another index item (no dangling closures)", () => {
    const ids = new Set(index.items.map((i) => i.id));
    for (const it of index.items) {
      for (const dep of it.registryDependencies) {
        expect(ids, `${it.id} → ${dep}`).toContain(dep);
      }
    }
  });

  it("marks @butai/deck as a butaiDependency on slides that import it", () => {
    const cover = index.items.find((i) => i.id === "concept-slide")!;
    expect(cover.butaiDependencies).toContain("@butai/deck");
  });

  it("hashes each file with a sha256 and carries a top-level contentHash", () => {
    expect(index.contentHash).toMatch(/^[0-9a-f]{64}$/);
    for (const it of index.items) {
      for (const f of it.files) expect(f.sha256, `${f.path}`).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("matches the committed registry/index.json", () => {
    const { json } = buildRegistryIndex();
    expect(readFileSync(join(registryDir, "index.json"), "utf8")).toBe(json);
  });
});

describe("styles aggregator (§0.5)", () => {
  const css = buildStylesAggregator();

  it("matches the committed src/styles/index.css", () => {
    expect(readFileSync(join(stylesDir, "index.css"), "utf8")).toBe(css);
  });

  it("@imports slide-base first", () => {
    const imports = css.split("\n").filter((l) => l.startsWith("@import"));
    expect(imports[0]).toBe(`@import "./slide-base.css";`);
  });

  it("@imports every per-item CSS sidecar (slides + primitives)", () => {
    expect(css).toContain(`@import "../slides/quote-slide.css";`);
    expect(css).toContain(`@import "../primitives/label.css";`);
    expect(css).toContain(`@import "../primitives/intro-slide.css";`);
  });

  it("does not import the aggregator itself", () => {
    const imports = css.split("\n").filter((l) => l.startsWith("@import"));
    expect(imports.some((l) => l.includes("index.css"))).toBe(false);
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

  it("two styles-aggregator builds are byte-identical", () => {
    expect(buildStylesAggregator()).toBe(buildStylesAggregator());
  });

  it("committed index parses back to the same contentHash", () => {
    const committed = JSON.parse(
      readFileSync(join(registryDir, "index.json"), "utf8"),
    ) as RegistryIndex;
    expect(committed.contentHash).toBe(buildRegistryIndex().index.contentHash);
  });
});
