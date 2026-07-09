/**
 * `pnpm --filter @butai/scene-kit gen`
 *
 * THREE committed, byte-deterministic outputs (no timestamps), mirroring
 * @butai/slide-kit / @butai/library-web:
 *   (a) catalog/  — metasFromMarkdownDir('src') → generateCatalog → renderCatalogMd.
 *       Only the `*.meta.md` files carry PatternMeta; the co-located `*.frame.md`
 *       design specs have no `id`, so the meta harvester skips them (a benign
 *       `missing-id` warning we filter out here — they are render inputs, not
 *       catalog metas). Every scene is `kind: scene` (the frozen enum accepts it).
 *   (b) registry/index.json — the frozen SceneRegistryIndex (phase-5 §0.7): each
 *       scene's `.html` (target `scenes`) + `.frame.md` (target `specs`), sha256'd
 *       RAW, sorted, hashed into a top-level `contentHash`. Scenes are
 *       framework-free and standalone, so `dependencies` /
 *       `registryDependencies` are always empty.
 *   (c) src/scenes.generated.ts — the `SCENES: PatternMeta[]` array the root
 *       barrel re-exports (populated from the catalog). Isomorphic, no fs.
 *
 * The build steps are pure functions (they read the committed src tree and
 * return strings) so the vitest can re-run them and assert byte determinism
 * without shelling out. Writing only happens when run as the entry.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join, relative } from "node:path";
import type { Catalog, Diagnostic, PatternMeta } from "@butai/patterns";
import { generateCatalog, metasFromMarkdownDir, renderCatalogMd } from "@butai/patterns/node";
import type {
  SceneRegistryFile,
  SceneRegistryFileTarget,
  SceneRegistryIndex,
  SceneRegistryItem,
} from "../src/registry-types.js";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(pkgRoot, "src");
const scenesDir = join(srcDir, "scenes");
const catalogDir = join(pkgRoot, "catalog");
const registryDir = join(pkgRoot, "registry");

const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8")) as {
  name: string;
  version: string;
};

/** Posix, package-root-relative path, e.g. "src/scenes/title-card.html". */
const rel = (abs: string) => relative(pkgRoot, abs).split("\\").join("/");

// ── (a) catalog ──────────────────────────────────────────────────────────────
export function buildCatalog(): { json: string; md: string; catalog: Catalog; diagnostics: Diagnostic[] } {
  const { items, diagnostics: readDiag } = metasFromMarkdownDir(srcDir);
  // Only `*.meta.md` files are catalog metas. The harvester also walks the
  // co-located `*.frame.md` design specs (and any Group-B `*.md` fixtures under
  // src), which carry no `id` and yield a benign `missing-id` warning — drop
  // those. Real problems in a `.meta.md` still surface.
  const filteredReadDiag = readDiag.filter((d) => {
    const m = /^([^\s:]+\.md):/.exec(d.message);
    return !m || m[1].endsWith(".meta.md");
  });
  const { catalog, diagnostics: genDiag } = generateCatalog(items);
  return {
    json: JSON.stringify(catalog, null, 2) + "\n",
    md: renderCatalogMd(catalog),
    catalog,
    diagnostics: [...filteredReadDiag, ...genDiag],
  };
}

// ── (b) registry index ────────────────────────────────────────────────────────
type DiscoveredScene = { id: string; html: string; frame: string };

/** Scan `src/scenes` for `<id>.html`, pairing each with its `<id>.frame.md`. */
function discover(): { scenes: DiscoveredScene[]; errors: string[] } {
  const scenes: DiscoveredScene[] = [];
  const errors: string[] = [];
  if (!existsSync(scenesDir)) return { scenes, errors };
  for (const name of readdirSync(scenesDir).sort()) {
    if (!name.endsWith(".html")) continue;
    const id = name.replace(/\.html$/, "");
    const frame = join(scenesDir, `${id}.frame.md`);
    if (!existsSync(frame)) {
      errors.push(`src/scenes/${name}: no matching ${id}.frame.md (scene spec missing)`);
      continue;
    }
    scenes.push({ id, html: join(scenesDir, name), frame });
  }
  return { scenes, errors };
}

function targetFor(absPath: string): SceneRegistryFileTarget {
  return absPath.endsWith(".frame.md") ? "specs" : "scenes";
}

function sha256(abs: string): string {
  return createHash("sha256").update(readFileSync(abs)).digest("hex");
}

export function buildRegistryIndex(): { json: string; index: SceneRegistryIndex; errors: string[] } {
  const { scenes, errors } = discover();
  const metaById = new Map(metasFromMarkdownDir(srcDir).items.map((m) => [m.id, m]));

  const items: SceneRegistryItem[] = [];
  for (const sc of scenes) {
    const files: SceneRegistryFile[] = [sc.html, sc.frame].map((abs) => ({
      path: rel(abs),
      target: targetFor(abs),
      sha256: sha256(abs),
    }));

    const meta = metaById.get(sc.id);
    const title =
      meta?.name ??
      sc.id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    const category = meta?.category ?? "scene";

    items.push({
      id: sc.id,
      type: "registry:scene",
      title,
      category,
      files: files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)),
      dependencies: [],
      registryDependencies: [],
    });
  }

  items.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const index: SceneRegistryIndex = {
    name: pkg.name,
    version: pkg.version,
    registryVersion: 1,
    contentHash: createHash("sha256").update(JSON.stringify(items)).digest("hex"),
    items,
  };

  return { json: JSON.stringify(index, null, 2) + "\n", index, errors };
}

// ── (c) SCENES barrel module ──────────────────────────────────────────────────
/**
 * Deterministic `src/scenes.generated.ts`: the catalog's scene metas as a typed
 * `PatternMeta[]`. The root barrel re-exports this so `import { SCENES } from
 * "@butai/scene-kit"` exposes the scene metadata. Isomorphic (no fs), byte-stable.
 */
export function buildScenesModule(): string {
  const { catalog } = buildCatalog();
  const header = [
    "/**",
    " * @butai/scene-kit — scene catalog metadata (GENERATED by",
    " * `pnpm --filter @butai/scene-kit gen`). Do not edit by hand.",
    " *",
    " * Isomorphic: a plain data array re-exported from the root barrel so browser",
    " * bundles get the scene metas without touching `@butai/patterns/node`.",
    " */",
    'import type { PatternMeta } from "@butai/patterns";',
    "",
  ].join("\n");
  const body = `export const SCENES: PatternMeta[] = ${JSON.stringify(catalog.items, null, 2)};\n`;
  return `${header}\n${body}`;
}

// ── entry: write the committed outputs ────────────────────────────────────────
function main() {
  const cat = buildCatalog();
  for (const d of cat.diagnostics) {
    console[d.level === "error" ? "error" : "warn"](`[gen] ${d.level} ${d.code}: ${d.message}`);
  }

  const reg = buildRegistryIndex();
  if (reg.errors.length > 0) {
    for (const e of reg.errors) console.error(`[gen] error: ${e}`);
    console.error("[gen] failed: scene/spec pairing incomplete");
    process.exit(1);
  }

  mkdirSync(catalogDir, { recursive: true });
  writeFileSync(join(catalogDir, "catalog.json"), cat.json);
  writeFileSync(join(catalogDir, "catalog.md"), cat.md);
  mkdirSync(registryDir, { recursive: true });
  writeFileSync(join(registryDir, "index.json"), reg.json);
  writeFileSync(join(srcDir, "scenes.generated.ts"), buildScenesModule());

  console.log(
    `[gen] catalog: ${cat.catalog.count} items, kinds=${JSON.stringify(cat.catalog.kinds)}; ` +
      `registry: ${reg.index.items.length} items, hash=${reg.index.contentHash.slice(0, 12)}…`,
  );

  if (cat.diagnostics.some((d) => d.level === "error")) {
    console.error("[gen] failed: catalog error diagnostics above");
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
