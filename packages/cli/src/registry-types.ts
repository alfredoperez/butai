/**
 * The CLI's RUNTIME view of `registry/index.json` (phase-3.md §0.4).
 *
 * These are re-declared here ON PURPOSE — the JSON on disk is the ONLY seam
 * between `@butai/slide-kit` (which generates the index) and `@butai/cli`
 * (which reads it). There is deliberately NO TypeScript import of
 * `@butai/slide-kit`; keeping the shapes local avoids a build-time coupling.
 *
 * Mirrors `packages/slide-kit/src/registry-types.ts`. Extend only via additive
 * optional fields; never rename an existing field.
 */

export type RegistryItemType = 'registry:slide' | 'registry:primitive' | 'registry:style';

export type RegistryFileTarget = 'slides' | 'primitives' | 'styles';

export type RegistryFile = {
  path: string; // package-root-relative, e.g. "src/slides/cover-slide.tsx"
  target: RegistryFileTarget;
  sha256: string;
};

export type ImportMapEntry =
  | { kind: 'registry'; item: string; alias: RegistryFileTarget }
  | { kind: 'external' };

/** Per-file rewrite table: original import specifier → how to rewrite it. */
export type FileImportMap = Record<string, ImportMapEntry>;

export type RegistryItem = {
  id: string;
  type: RegistryItemType;
  title: string;
  category: string;
  files: RegistryFile[];
  registryDependencies: string[];
  dependencies: string[];
  butaiDependencies: string[];
  importMap: Record<string, FileImportMap>;
};

export type RegistryIndex = {
  name: string;
  version: string;
  registryVersion: number;
  contentHash: string;
  items: RegistryItem[];
};
