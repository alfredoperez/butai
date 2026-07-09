/**
 * @butai/scene-kit — framework-free HyperFrames scene kit (phase-5).
 *
 * ROOT BARREL — ISOMORPHIC ONLY: safe for browser bundles. The Studio (browser)
 * imports `parseStoryboard` + the storyboard types from here. Node-only pieces
 * (Playwright contact-sheet render: fs/crypto/chromium) live in
 * `@butai/scene-kit/node` and must NEVER be reachable from this barrel (the P2
 * rule).
 */

// ── Frozen STORYBOARD.md schema (§0.4) ──
export {
  STORYBOARD_MD_VERSION,
  type SceneStoryboard,
  type StoryboardScene,
  type SceneStatus,
  type TransitionKind,
} from './storyboard-types.js';

// ── Frozen scene registry-format contract (§0.7) ──
export type {
  SceneRegistryIndex,
  SceneRegistryItem,
  SceneRegistryItemType,
  SceneRegistryFile,
  SceneRegistryFileTarget,
} from './registry-types.js';

// ── STORYBOARD.md parser (isomorphic; Group B fills the impl) ──
export { parseStoryboard } from './storyboard.js';

// ── Scene catalog metadata (GENERATED from the committed catalog by `gen`) ──
export { SCENES } from './scenes.generated.js';
