/**
 * /kit gallery (plan phase-3 · Group C). A read-only grid of every cataloged
 * slide archetype, each rendered live via the kit's EXAMPLES map inside a
 * scaled 16:9 frame. No studio controls / editors — those are P4.
 *
 *   /kit      → all archetypes, grouped by category (committed catalog order)
 *   /kit/:id  → a single archetype, deep-linked
 */
import type { JSX } from 'react';
import { useParams } from 'react-router-dom';
import { EXAMPLES } from '@butai/slide-kit';
import catalog from '../../../packages/slide-kit/catalog/catalog.json';
import './kit-gallery.css';

// Load every kit stylesheet (side-effect) so the framed examples render styled.
// The engine + theme CSS are already loaded by index.tsx.
void import.meta.glob('../../../packages/slide-kit/src/**/*.css', { eager: true });

interface CatalogItem {
  id: string;
  name: string;
  category: string;
}

const ITEMS = catalog.items as CatalogItem[];

/** One framed, live example. The example itself renders a `<Slide>`. */
function Frame({ item }: { item: CatalogItem }): JSX.Element {
  const Example = EXAMPLES[item.id];
  return (
    <figure className="kit-card" data-kit-item data-kit-id={item.id}>
      <div className="kit-frame">
        <div className="kit-canvas">
          {Example ? (
            <Example />
          ) : (
            <div className="kit-missing">No example registered for {item.id}</div>
          )}
        </div>
      </div>
      <figcaption className="kit-card__label">
        <span className="kit-card__name">{item.name}</span>
        <span className="kit-card__id">{item.id}</span>
      </figcaption>
    </figure>
  );
}

/** Catalog is pre-sorted by category, so contiguous grouping preserves order. */
function groupByCategory(items: CatalogItem[]): Array<[string, CatalogItem[]]> {
  const groups: Array<[string, CatalogItem[]]> = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last[0] === item.category) last[1].push(item);
    else groups.push([item.category, [item]]);
  }
  return groups;
}

export function KitGallery(): JSX.Element {
  const { id } = useParams<{ id?: string }>();

  if (id) {
    const item = ITEMS.find((entry) => entry.id === id);
    return (
      <main className="kit-page kit-page--single">
        <header className="kit-header">
          <a className="kit-header__back" href="/kit">
            &larr; Kit gallery
          </a>
          <h1 className="kit-header__title">{item ? item.name : id}</h1>
        </header>
        {item ? (
          <div className="kit-single">
            <Frame item={item} />
          </div>
        ) : (
          <p className="kit-notfound">No archetype "{id}" in the catalog.</p>
        )}
      </main>
    );
  }

  return (
    <main className="kit-page">
      <header className="kit-header">
        <h1 className="kit-header__title">Slide Kit</h1>
        <p className="kit-header__count">{ITEMS.length} archetypes</p>
      </header>
      {groupByCategory(ITEMS).map(([category, items]) => (
        <section key={category} className="kit-group">
          <h2 className="kit-group__title">{category}</h2>
          <div className="kit-grid">
            {items.map((item) => (
              <Frame key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
