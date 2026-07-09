/**
 * `pnpm --filter @butai/docs-kit gen`
 *
 * TWO committed, byte-deterministic outputs (no timestamps), mirroring
 * @butai/scene-kit / @butai/slide-kit:
 *   (a) catalog/  — metasFromMarkdownDir('src') → generateCatalog → renderCatalogMd.
 *       Only the `*.meta.md` files carry PatternMeta; the shared `docs.frame.md`
 *       design spec has no `id`, so the meta harvester skips it (a benign
 *       `missing-id` warning we filter out here — it is a render input, not a
 *       catalog meta). Every pattern is `kind: page` (the frozen enum accepts it).
 *   (b) registry/index.json — the frozen DocRegistryIndex (phase-6 §0.6): each
 *       pattern's `.html` (target `pages`), sha256'd RAW, sorted, hashed into a
 *       top-level `contentHash`. Doc patterns are framework-free and standalone,
 *       so `dependencies` / `registryDependencies` are always empty.
 *
 * Plus (c) src/patterns.generated.ts — the `PATTERNS: PatternMeta[]` array the
 * root barrel re-exports (populated from the catalog). Isomorphic, no fs.
 *
 * The build steps are pure functions (they read the committed src tree and
 * return strings) so the vitest can re-run them and assert byte determinism
 * without shelling out. Writing only happens when run as the entry.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join, relative } from "node:path";
import type { Catalog, Diagnostic } from "@butai/patterns";
import { generateCatalog, metasFromMarkdownDir, renderCatalogMd } from "@butai/patterns/node";
import type {
  DocRegistryFile,
  DocRegistryIndex,
  DocRegistryItem,
} from "../src/registry-types.js";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(pkgRoot, "src");
const patternsDir = join(srcDir, "patterns");
const catalogDir = join(pkgRoot, "catalog");
const registryDir = join(pkgRoot, "registry");

const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8")) as {
  name: string;
  version: string;
};

/** Posix, package-root-relative path, e.g. "src/patterns/doc-hero.html". */
const rel = (abs: string) => relative(pkgRoot, abs).split("\\").join("/");

// ── (a) catalog ──────────────────────────────────────────────────────────────
export function buildCatalog(): { json: string; md: string; catalog: Catalog; diagnostics: Diagnostic[] } {
  const { items, diagnostics: readDiag } = metasFromMarkdownDir(srcDir);
  // Only `*.meta.md` files are catalog metas. The harvester also walks the
  // shared `docs.frame.md` design spec (and any `*.md` under src), which carries
  // no `id` and yields a benign `missing-id` warning — drop those. Real problems
  // in a `.meta.md` still surface.
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
type DiscoveredPattern = { id: string; html: string };

/** Scan `src/patterns` for `<id>.html`. Doc patterns are standalone (no paired
 *  design spec — the `docs.frame.md` is shared), so each `.html` is one item. */
function discover(): DiscoveredPattern[] {
  const patterns: DiscoveredPattern[] = [];
  if (!existsSync(patternsDir)) return patterns;
  for (const name of readdirSync(patternsDir).sort()) {
    if (!name.endsWith(".html")) continue;
    const id = name.replace(/\.html$/, "");
    patterns.push({ id, html: join(patternsDir, name) });
  }
  return patterns;
}

function sha256(abs: string): string {
  return createHash("sha256").update(readFileSync(abs)).digest("hex");
}

export function buildRegistryIndex(): { json: string; index: DocRegistryIndex } {
  const patterns = discover();
  const metaById = new Map(metasFromMarkdownDir(srcDir).items.map((m) => [m.id, m]));

  const items: DocRegistryItem[] = [];
  for (const p of patterns) {
    const files: DocRegistryFile[] = [
      { path: rel(p.html), target: "pages", sha256: sha256(p.html) },
    ];

    const meta = metaById.get(p.id);
    const title =
      meta?.name ??
      p.id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    const category = meta?.category ?? "page";

    items.push({
      id: p.id,
      type: "registry:doc-pattern",
      title,
      category,
      files,
      dependencies: [],
      registryDependencies: [],
    });
  }

  items.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const index: DocRegistryIndex = {
    name: pkg.name,
    version: pkg.version,
    registryVersion: 1,
    contentHash: createHash("sha256").update(JSON.stringify(items)).digest("hex"),
    items,
  };

  return { json: JSON.stringify(index, null, 2) + "\n", index };
}

// ── (c) PATTERNS barrel module ────────────────────────────────────────────────
/**
 * Deterministic `src/patterns.generated.ts`: the catalog's page metas as a typed
 * `PatternMeta[]`. The root barrel re-exports this so `import { PATTERNS } from
 * "@butai/docs-kit"` exposes the pattern metadata. Isomorphic (no fs), byte-stable.
 */
export function buildPatternsModule(): string {
  const { catalog } = buildCatalog();
  const header = [
    "/**",
    " * @butai/docs-kit — doc-pattern catalog metadata (GENERATED by",
    " * `pnpm --filter @butai/docs-kit gen`). Do not edit by hand.",
    " *",
    " * Isomorphic: a plain data array re-exported from the root barrel so browser",
    " * bundles get the pattern metas without touching `@butai/patterns/node`.",
    " */",
    'import type { PatternMeta } from "@butai/patterns";',
    "",
  ].join("\n");
  const body = `export const PATTERNS: PatternMeta[] = ${JSON.stringify(catalog.items, null, 2)};\n`;
  return `${header}\n${body}`;
}

// ── entry: write the committed outputs ────────────────────────────────────────
function main() {
  const cat = buildCatalog();
  for (const d of cat.diagnostics) {
    console[d.level === "error" ? "error" : "warn"](`[gen] ${d.level} ${d.code}: ${d.message}`);
  }

  const reg = buildRegistryIndex();

  mkdirSync(catalogDir, { recursive: true });
  writeFileSync(join(catalogDir, "catalog.json"), cat.json);
  writeFileSync(join(catalogDir, "catalog.md"), cat.md);
  mkdirSync(registryDir, { recursive: true });
  writeFileSync(join(registryDir, "index.json"), reg.json);
  writeFileSync(join(srcDir, "patterns.generated.ts"), buildPatternsModule());

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
