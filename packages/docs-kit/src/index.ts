/**
 * @butai/docs-kit — framework-free doc-pattern kit (phase-6).
 *
 * ROOT BARREL — ISOMORPHIC ONLY: safe for browser bundles. The Studio (browser)
 * imports the doc-pattern metadata + registry types from here. Node-only pieces
 * (Playwright headless render: fs/crypto/chromium) live in
 * `@butai/docs-kit/node` and must NEVER be reachable from this barrel (the P2
 * rule).
 */

// ── Frozen doc-pattern registry-format contract (§0.6) ──
export type {
  DocRegistryIndex,
  DocRegistryItem,
  DocRegistryItemType,
  DocRegistryFile,
  DocRegistryFileTarget,
} from './registry-types.js';

// ── Doc-pattern catalog metadata (GENERATED from the committed catalog by `gen`) ──
export { PATTERNS } from './patterns.generated.js';
