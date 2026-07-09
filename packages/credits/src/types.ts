/**
 * @butai/credits — FROZEN ledger contract (phase-8 §0.1).
 *
 * These types are the frozen schema for the repo-root `sources.yml` upstream
 * ledger. Group A's parser (`parse.ts`) enforces them and Group A's renderer
 * (`render.ts`) reads them; Group B's sync skill teaches against the same shape.
 * EXTEND ONLY via additive optional fields — never remove or rename a frozen
 * field (the sync skill keys off `id`; the tests assert the required set).
 */

/**
 * How a source relates to butai (frozen enum, §0.1):
 * - `copied-in`     — code was vendored/hand-copied into the repo.
 * - `inspired-by`   — a concept/idiom was reimplemented, no code taken.
 * - `runtime-dep`   — shipped as a runtime dependency (tied to an adopted story).
 * - `external-tool` — consumed as an external tool (e.g. via npx), never vendored.
 * - `own-work`      — the maintainer's own prior work.
 * - `excluded`      — considered but deliberately NOT shipped (requires a reason).
 */
export type SourceHow =
  | 'copied-in'
  | 'inspired-by'
  | 'runtime-dep'
  | 'external-tool'
  | 'own-work'
  | 'excluded';

/** The frozen, canonical order `how` groups render in CREDITS.md (§0.4). */
export const HOW_ORDER: readonly SourceHow[] = [
  'copied-in',
  'inspired-by',
  'runtime-dep',
  'external-tool',
  'own-work',
  'excluded',
] as const;

/**
 * One ledger entry (frozen, §0.1).
 *
 * Required on every entry: `id`, `name`, `url`, `license`, `what`, `how`,
 * `adopted`, `last_checked`, `last_ref`. `repo` and `notes` are optional.
 * When `how === 'excluded'`, `excluded_reason` is REQUIRED (and `adopted` /
 * `last_ref` MAY be `null`).
 */
export interface SourceEntry {
  /** Stable kebab-case id, unique across the file; never reuse or renumber. */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Canonical URL. */
  url: string;
  /** Source repo, if distinct from `url`. Optional. */
  repo?: string;
  /** SPDX id or short license name; `"UNVERIFIED"` allowed for excluded rows. */
  license: string;
  /** What was taken/adopted, in plain language. */
  what: string;
  /** Relationship to butai (frozen enum). */
  how: SourceHow;
  /** Phase tag (`P1`..`P7`) or ISO date (`YYYY-MM-DD`); MAY be `null` when excluded. */
  adopted: string | null;
  /** ISO date string in the DATA (never a generation-time stamp); the sync skill updates it. */
  last_checked: string;
  /** Commit SHA or release tag if known, else `null`. */
  last_ref: string | null;
  /** Free-text notes (e.g. a secondary relationship). Optional. */
  notes?: string;
  /** REQUIRED when `how === 'excluded'` — why the source was not shipped. */
  excluded_reason?: string;
}

/** The whole ledger (frozen, §0.1): a version + the sources array. */
export interface SourcesLedger {
  /** Schema version (currently `1`). */
  version: number;
  /** Every tracked source. */
  sources: SourceEntry[];
}
