/**
 * `pnpm --filter @butai/library-web gen`
 * recipes/**.md → catalog/catalog.json + catalog/catalog.md (committed output;
 * regeneration is byte-identical — no timestamps anywhere in the pipeline).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { generateCatalog, metasFromMarkdownDir, renderCatalogMd } from '@butai/patterns/node';

const pkgRoot = fileURLToPath(new URL('..', import.meta.url));
const recipesDir = join(pkgRoot, 'recipes');
const catalogDir = join(pkgRoot, 'catalog');

const { items, diagnostics: readDiagnostics } = metasFromMarkdownDir(recipesDir);
const { catalog, diagnostics: genDiagnostics } = generateCatalog(items);
const diagnostics = [...readDiagnostics, ...genDiagnostics];

for (const d of diagnostics) {
  console[d.level === 'error' ? 'error' : 'warn'](`[gen] ${d.level} ${d.code}: ${d.message}`);
}

mkdirSync(catalogDir, { recursive: true });
writeFileSync(join(catalogDir, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
writeFileSync(join(catalogDir, 'catalog.md'), renderCatalogMd(catalog));

console.log(`[gen] catalog written: ${catalog.count} items, kinds=${JSON.stringify(catalog.kinds)}, hash=${catalog.contentHash.slice(0, 12)}…`);

if (diagnostics.some((d) => d.level === 'error')) {
  console.error('[gen] failed: error diagnostics above');
  process.exit(1);
}
