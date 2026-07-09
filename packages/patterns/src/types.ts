/**
 * Shared types for P1 — the contract all groups (spec parser, catalog
 * generator, token contract, recipe library) code against.
 * Groups may extend these types but must not rename them.
 */

export type Diagnostic = { level: 'error' | 'warning'; code: string; message: string };

export type DesignSpec = {
  name: string;
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing?: Record<string, string>;
  components?: Record<string, string>;
  sections: { heading: string; level: number; body: string }[];
  raw: { frontmatter: Record<string, unknown>; body: string };
};

export type PatternMeta = {
  id: string; // kebab-case, unique within a catalog
  name: string;
  kind: 'slide' | 'motion' | 'page' | 'scene' | 'theme';
  category: string;
  description: string;
  snippet?: string; // copy-ready code
  motion?: string; // motion recommendation (from upstream SlideMeta.motion)
  engine?: string; // e.g. 'gsap', 'gsap/DrawSVG', 'css', 'none'
  tags?: string[];
  source?: { file: string }; // relative path of the data file it came from
};

export type Catalog = {
  version: string; // catalogVersion()
  contentHash: string; // sha256 of sorted items — deterministic, NO timestamps
  count: number;
  kinds: Record<string, number>;
  items: PatternMeta[]; // sorted by kind, then category, then id
};
