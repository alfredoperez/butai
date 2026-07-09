/**
 * @butai/scene-kit/node — Node-only surface (Playwright headless render).
 * Kept out of the root barrel so browser bundles never see node builtins
 * (the P2 architectural rule).
 */
export { renderContactSheet } from './contact-sheet.js';
export type { RenderContactSheetOptions, RenderContactSheetResult } from './contact-sheet.js';
