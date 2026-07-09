/**
 * @butai/credits — the CREDITS.md generator workspace (phase-8).
 *
 * ROOT BARREL — ISOMORPHIC ONLY: the frozen ledger types + the PURE renderer.
 * The Node-only fs/yaml loader (`loadLedger` in `parse.ts`) is deliberately NOT
 * re-exported here; the `gen` script imports it directly (the single fs boundary).
 */

// ── Frozen sources.yml schema (§0.1) ──
export {
  HOW_ORDER,
  type SourceHow,
  type SourceEntry,
  type SourcesLedger,
} from './types.js';

// ── Pure CREDITS.md renderer — frozen signature; Group A fills the body (§0.3) ──
export { renderCredits } from './render.js';
