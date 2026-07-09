/**
 * @butai/docs-kit/node — Node-only surface (Playwright headless render).
 * Kept out of the root barrel so browser bundles never see node builtins
 * (the P2 architectural rule).
 */
export { renderPreviews } from './render-preview.js';
export type { RenderPreviewsOptions, RenderPreviewsResult } from './render-preview.js';
