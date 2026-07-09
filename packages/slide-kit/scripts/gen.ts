/**
 * `pnpm --filter @butai/slide-kit gen`
 *
 * THREE committed, byte-deterministic outputs (no timestamps), mirroring
 * @butai/library-web:
 *   (a) catalog/  — metasFromMarkdownDir('src') → generateCatalog → renderCatalogMd
 *   (b) registry/index.json — the frozen registry contract (phase-3 §0.4):
 *       a two-pass import resolver computes each file's importMap +
 *       registryDependencies + dependencies + butaiDependencies, sha256s each
 *       RAW file, sorts everything, and hashes the sorted items.
 *       Phase-4 §0.5: every `registry:slide` additionally declares `slide-base`
 *       as a registryDependency so `add <slide>` pulls the shared base style into
 *       the copy closure (previously an orphan `registry:style`).
 *   (c) src/styles/index.css — a GENERATED aggregator that `@import`s slide-base
 *       first, then every per-item CSS sidecar (sorted), so a consumer/studio can
 *       load all kit styles with one import (`@butai/slide-kit/styles/index.css`).
 *
 * The build steps are exported as pure functions (they read the committed src
 * tree and return strings) so the vitest can re-run them and assert byte
 * determinism without shelling out. Writing only happens when run as the entry.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import type { Catalog, Diagnostic } from "@butai/patterns";
import { generateCatalog, metasFromMarkdownDir, renderCatalogMd } from "@butai/patterns/node";
import type {
  FileImportMap,
  ImportMapEntry,
  RegistryFile,
  RegistryFileTarget,
  RegistryIndex,
  RegistryItem,
  RegistryItemType,
} from "../src/registry-types.js";

const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(pkgRoot, "src");
const catalogDir = join(pkgRoot, "catalog");
const registryDir = join(pkgRoot, "registry");

const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8")) as {
  name: string;
  version: string;
};

/** Posix, package-root-relative path, e.g. "src/slides/cover-slide.tsx". */
const rel = (abs: string) => relative(pkgRoot, abs).split("\\").join("/");

/** react/react-dom are peer/assumed in every consumer — never a copy `dependency`. */
const ASSUMED_NPM = new Set(["react", "react-dom"]);

/** "codehike/code" → "codehike"; "@scope/pkg/sub" → "@scope/pkg" — `dependencies`
 *  records installable package NAMES, not import subpaths. */
const npmPackageName = (spec: string) =>
  spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];

/** The shared base style every slide references — closured into every slide (§0.5). */
const SLIDE_BASE_ID = "slide-base";

/** The GENERATED styles aggregator basename — excluded from registry discovery. */
const STYLES_AGGREGATOR = "index.css";

// ── (a) catalog ──────────────────────────────────────────────────────────────
export function buildCatalog(): { json: string; md: string; catalog: Catalog; diagnostics: Diagnostic[] } {
  const { items, diagnostics: readDiag } = metasFromMarkdownDir(srcDir);
  const { catalog, diagnostics: genDiag } = generateCatalog(items);
  return {
    json: JSON.stringify(catalog, null, 2) + "\n",
    md: renderCatalogMd(catalog),
    catalog,
    diagnostics: [...readDiag, ...genDiag],
  };
}

// ── (b) registry index ────────────────────────────────────────────────────────
type DiscoveredItem = {
  id: string;
  type: RegistryItemType;
  tsx?: string;
  css?: string;
};

function targetFor(absPath: string, itemType: RegistryItemType): RegistryFileTarget {
  if (absPath.endsWith(".css")) return "styles";
  return itemType === "registry:primitive" ? "primitives" : "slides";
}

function discover(): DiscoveredItem[] {
  const out: DiscoveredItem[] = [];
  const scanTsx = (sub: string, type: RegistryItemType) => {
    const dir = join(srcDir, sub);
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir).sort()) {
      if (!name.endsWith(".tsx")) continue;
      const id = name.replace(/\.tsx$/, "");
      const cssPath = join(dir, `${id}.css`);
      out.push({ id, type, tsx: join(dir, name), css: existsSync(cssPath) ? cssPath : undefined });
    }
  };
  scanTsx("primitives", "registry:primitive");
  scanTsx("slides", "registry:slide");
  const stylesDir = join(srcDir, "styles");
  if (existsSync(stylesDir)) {
    for (const name of readdirSync(stylesDir).sort()) {
      if (!name.endsWith(".css")) continue;
      // The generated aggregator is a package convenience export, not a
      // shippable registry item — never let `add index` copy a broken tree.
      if (name === STYLES_AGGREGATOR) continue;
      out.push({
        id: name.replace(/\.css$/, ""),
        type: "registry:style",
        css: join(stylesDir, name),
      });
    }
  }
  return out;
}

/**
 * Optional per-item frontmatter extras, declared in the item's `<id>.meta.md`:
 * npm `dependencies` and extra `registryDependencies` that static import
 * scanning cannot see — e.g. an optional copy-in enhancement wired through a
 * prop rather than an import (the code archetypes' Code Hike seam).
 */
function metaExtras(it: DiscoveredItem): { dependencies: string[]; registryDependencies: string[] } {
  const none = { dependencies: [], registryDependencies: [] };
  if (!it.tsx) return none;
  const metaPath = it.tsx.replace(/\.tsx$/, ".meta.md");
  if (!existsSync(metaPath)) return none;
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(metaPath, "utf8"));
  if (!fm) return none;
  let data: unknown;
  try {
    data = parseYaml(fm[1]);
  } catch {
    return none;
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) return none;
  const strings = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  const record = data as Record<string, unknown>;
  return {
    dependencies: strings(record.dependencies),
    registryDependencies: strings(record.registryDependencies),
  };
}

function importSpecifiers(source: string): string[] {
  const specs = new Set<string>();
  const fromRe = /\b(?:import|export)\b[^;]*?\bfrom\s*["']([^"']+)["']/g;
  const sideRe = /\bimport\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = fromRe.exec(source))) specs.add(m[1]);
  while ((m = sideRe.exec(source))) specs.add(m[1]);
  return [...specs];
}

export function buildRegistryIndex(): { json: string; index: RegistryIndex; errors: string[] } {
  const discovered = discover();
  const metaById = new Map(metasFromMarkdownDir(srcDir).items.map((m) => [m.id, m]));

  // Pass 1 — register every item's files so imports can resolve to an owner.
  // A relative `.js`/extensionless import always targets a TS module, never a
  // sibling `.css` — so only TS files claim the extensionless resolution key
  // (otherwise a co-located label.css would shadow label.tsx and mis-alias).
  const fileOwner = new Map<string, { itemId: string; target: RegistryFileTarget }>();
  for (const it of discovered) {
    for (const abs of [it.tsx, it.css].filter((x): x is string => !!x)) {
      const target = targetFor(abs, it.type);
      fileOwner.set(rel(abs), { itemId: it.id, target });
      if (abs.endsWith(".tsx") || abs.endsWith(".ts")) {
        fileOwner.set(rel(abs).replace(/\.(tsx|ts)$/, ""), { itemId: it.id, target });
      }
    }
  }

  const resolveRelative = (fromAbs: string, spec: string) =>
    fileOwner.get(rel(join(dirname(fromAbs), spec)).replace(/\.(js|tsx|ts|css)$/, ""));

  const errors: string[] = [];
  const items: RegistryItem[] = [];

  for (const it of discovered) {
    const files: RegistryFile[] = [];
    const importMap: Record<string, FileImportMap> = {};
    const registryDeps = new Set<string>();
    const npmDeps = new Set<string>();
    const butaiDeps = new Set<string>();

    for (const abs of [it.tsx, it.css].filter((x): x is string => !!x)) {
      const path = rel(abs);
      files.push({
        path,
        target: targetFor(abs, it.type),
        sha256: createHash("sha256").update(readFileSync(abs)).digest("hex"),
      });
      if (!abs.endsWith(".tsx")) continue;

      const perFile: FileImportMap = {};
      for (const spec of importSpecifiers(readFileSync(abs, "utf8"))) {
        let entry: ImportMapEntry;
        if (spec.startsWith(".")) {
          const owner = resolveRelative(abs, spec);
          if (!owner) {
            errors.push(`${path}: relative import "${spec}" resolves to no migrated item`);
            continue;
          }
          entry = { kind: "registry", item: owner.itemId, alias: owner.target };
          registryDeps.add(owner.itemId);
        } else {
          entry = { kind: "external" };
          if (spec.startsWith("@butai/")) butaiDeps.add(spec);
          else if (!ASSUMED_NPM.has(spec)) npmDeps.add(npmPackageName(spec));
        }
        perFile[spec] = entry;
      }
      importMap[path] = Object.fromEntries(
        Object.keys(perFile)
          .sort()
          .map((k) => [k, perFile[k]]),
      );
    }

    // §0.5: every slide additionally closures the shared base style, so a
    // `butai add <slide>` carries slide-base.css (previously an orphan style).
    if (it.type === "registry:slide") registryDeps.add(SLIDE_BASE_ID);

    // Frontmatter-declared extras (deps invisible to import scanning).
    const extras = metaExtras(it);
    for (const dep of extras.dependencies) npmDeps.add(dep);
    for (const dep of extras.registryDependencies) registryDeps.add(dep);

    const meta = metaById.get(it.id);
    const title =
      meta?.name ??
      it.id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    const category = meta?.category ?? (it.type === "registry:primitive" ? "primitive" : "style");

    items.push({
      id: it.id,
      type: it.type,
      title,
      category,
      files: files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)),
      registryDependencies: [...registryDeps].sort(),
      dependencies: [...npmDeps].sort(),
      butaiDependencies: [...butaiDeps].sort(),
      importMap,
    });
  }

  items.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const index: RegistryIndex = {
    name: pkg.name,
    version: pkg.version,
    registryVersion: 1,
    contentHash: createHash("sha256").update(JSON.stringify(items)).digest("hex"),
    items,
  };

  return { json: JSON.stringify(index, null, 2) + "\n", index, errors };
}

// ── (c) styles aggregator ─────────────────────────────────────────────────────
/**
 * Deterministic `src/styles/index.css`: `@import "./slide-base.css";` first, then
 * every per-item CSS sidecar sorted by id. Byte-stable, no timestamps. Relative
 * specifiers are resolved from `src/styles/` so Vite (and any bundler) can walk
 * them: `./slide-base.css`, `../primitives/<id>.css`, `../slides/<id>.css`.
 */
export function buildStylesAggregator(): string {
  const stylesDir = join(srcDir, "styles");
  const withCss = discover().filter((it): it is DiscoveredItem & { css: string } => !!it.css);

  const base = withCss.filter((it) => it.type === "registry:style");
  const rest = withCss
    .filter((it) => it.type !== "registry:style")
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const specFor = (abs: string) => {
    const r = relative(stylesDir, abs).split("\\").join("/");
    return r.startsWith(".") ? r : `./${r}`;
  };

  const lines = [...base, ...rest].map((it) => `@import "${specFor(it.css)}";`);
  const header = [
    "/**",
    " * butai slide-kit — aggregated styles (GENERATED by `pnpm --filter @butai/slide-kit gen`).",
    " * slide-base first, then every per-item CSS sidecar. Import once to load all",
    " * kit styles: `@butai/slide-kit/styles/index.css`. Do not edit by hand.",
    " */",
  ].join("\n");

  return `${header}\n\n${lines.join("\n")}\n`;
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
    console.error("[gen] failed: unresolved relative imports (closure incomplete)");
    process.exit(1);
  }

  mkdirSync(catalogDir, { recursive: true });
  writeFileSync(join(catalogDir, "catalog.json"), cat.json);
  writeFileSync(join(catalogDir, "catalog.md"), cat.md);
  mkdirSync(registryDir, { recursive: true });
  writeFileSync(join(registryDir, "index.json"), reg.json);

  const stylesAgg = buildStylesAggregator();
  writeFileSync(join(srcDir, "styles", STYLES_AGGREGATOR), stylesAgg);

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
