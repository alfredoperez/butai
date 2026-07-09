/**
 * @butai/patterns/node — Node-only surface (filesystem + crypto).
 * Kept out of the root barrel so browser bundles never see node builtins.
 */
export { loadDesignSpec, resolveSpecPath } from './spec/resolve.js';
export { generateCatalog, renderCatalogMd } from './catalog/generate.js';
export { metasFromMarkdownDir } from './catalog/from-markdown.js';
