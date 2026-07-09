/**
 * @butai/patterns — design-spec contract, parser, and token contract.
 * ISOMORPHIC ONLY: safe for browser bundles. Node-only pieces (spec file
 * resolution, catalog generation: fs/crypto) live in '@butai/patterns/node'.
 */
export type { Catalog, DesignSpec, Diagnostic, PatternMeta } from './types.js';
export const BUTAI = 'butai';
export { catalogVersion } from './version.js';
// Group A · design-spec parser (pure)
export { parseDesignSpec } from './spec/parse.js';
// Group C · theme token contract (pure)
export { TOKEN_CONTRACT, extractThemes, tokensFromSpec, validateThemeTokens } from './tokens/contract.js';
export type { ExtractedTheme } from './tokens/contract.js';
