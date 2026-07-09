/**
 * Slide Studio data layer (Group B). Reads the two FROZEN slide-kit artifacts as
 * JSON — the committed catalog (what to browse) and the registry index (how to
 * resolve a `butai add` closure) — and exposes pure helpers over them. No package
 * is imported for its runtime here; these are plain data files.
 */
import catalogJson from '../../../../packages/slide-kit/catalog/catalog.json';
import registryJson from '../../../../packages/slide-kit/registry/index.json';

export interface CatalogItem {
  id: string;
  name: string;
  kind: string;
  category: string;
  description: string;
  snippet: string;
  tags: string[];
}

interface CatalogFile {
  count: number;
  items: CatalogItem[];
}

interface RegistryItem {
  id: string;
  type: string;
  registryDependencies: string[];
}

const CATALOG = catalogJson as unknown as CatalogFile;
const REGISTRY_ITEMS = (registryJson as unknown as { items: RegistryItem[] }).items;

const REGISTRY_BY_ID = new Map<string, RegistryItem>(
  REGISTRY_ITEMS.map((item) => [item.id, item]),
);

export const CATALOG_COUNT = CATALOG.count;
export const CATALOG_ITEMS: CatalogItem[] = CATALOG.items;

/** Catalog is pre-sorted by category; contiguous grouping preserves that order. */
export function groupByCategory(items: CatalogItem[]): Array<[string, CatalogItem[]]> {
  const groups: Array<[string, CatalogItem[]]> = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last[0] === item.category) last[1].push(item);
    else groups.push([item.category, [item]]);
  }
  return groups;
}

/** Free-text filter over name / id / description / tags. */
export function filterItems(items: CatalogItem[], query: string): CatalogItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) =>
    [item.name, item.id, item.description, item.tags.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(q),
  );
}

/**
 * Resolve the transitive `registryDependencies` closure for an archetype — the
 * set of items `butai add <id>` would also copy in. Excludes the item itself.
 *
 * Every slide's closure pulls the shared `slide-base` style: that is the exact
 * CSS-closure fix Group D wires into the registry in parallel. We add it here
 * defensively so the closure is correct whether or not D's regen has landed yet
 * — once it has, `slide-base` is already in `registryDependencies` and the Set
 * simply dedupes it.
 */
export function resolveClosure(id: string): string[] {
  const item = REGISTRY_BY_ID.get(id);
  const seen = new Set<string>();

  const visit = (depId: string): void => {
    if (seen.has(depId)) return;
    seen.add(depId);
    REGISTRY_BY_ID.get(depId)?.registryDependencies.forEach(visit);
  };

  item?.registryDependencies.forEach(visit);

  if (item?.type === 'registry:slide' && REGISTRY_BY_ID.has('slide-base')) {
    visit('slide-base');
  }

  return [...seen].sort();
}

/** The copy-in command a user runs to vendor this archetype into their project. */
export function addCommand(id: string): string {
  return `butai add ${id}`;
}
