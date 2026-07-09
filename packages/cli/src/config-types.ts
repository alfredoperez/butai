/**
 * FROZEN contract for the CLI's local types (phase-3.md §0.3 + §0.5).
 *
 * The CLI RE-DECLARES its own types on purpose: the only cross-package coupling
 * is the `registry/index.json` file read at runtime (the JSON is the seam).
 * There is deliberately NO TypeScript import of `@butai/slide-kit` types here.
 *
 * Extend only via additive OPTIONAL fields; never rename an existing field.
 */

/** Alias keys a consumer maps to real directories (see `ButaiAliases`). */
export type ButaiAliasKey = 'slides' | 'primitives' | 'styles';

export type ButaiAliases = {
  slides: string; // e.g. "@/components/butai/slides"
  primitives: string; // e.g. "@/components/butai/primitives"
  styles: string; // e.g. "@/styles/butai"
};

/**
 * `butai.json` — consumer config written by `butai init` (§0.3).
 */
export type ButaiConfig = {
  /** Aspirational schema URL, not fetched. */
  $schema?: string;
  /** Registry location. Dev default: `file:node_modules/@butai/slide-kit/registry`
   *  (or the workspace path). Later: `@butai/slide-kit` | github URL. */
  registry: string;
  /** Whether the consumer uses `.tsx` sources. */
  tsx: boolean;
  aliases: ButaiAliases;
  /** Rewritten relative imports: `false` strips the `.js` extension
   *  (Vite/bundler consumers); `true` keeps it (NodeNext consumers). */
  importExtensions: boolean;
};

/**
 * Provenance header prepended to every copied file (§0.5).
 *
 * The on-disk header is a leading block comment whose first line matches
 * `butai:<type> <id>`. It carries NO timestamp — `source-sha256` is the anchor
 * `diff` compares against the registry's current raw hash. This shape is the
 * parsed/structured view of that header.
 */
export type ProvenanceHeader = {
  /** Bare item type without the `registry:` prefix, e.g. `slide` | `primitive` | `style`. */
  type: string;
  /** Item id, e.g. `cover-slide`. */
  id: string;
  /** Registry package the item came from, e.g. `@butai/slide-kit`. */
  fromRegistry: string;
  /** Raw sha256 of the registry source at copy time — the drift anchor. */
  sourceSha256: string;
};
