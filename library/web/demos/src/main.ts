import type { Catalog, PatternMeta } from '@butai/patterns';
import catalogJson from '../../catalog/catalog.json';
import { demoRegistry } from './registry';

const catalog = catalogJson as Catalog;
const stage = document.querySelector<HTMLDivElement>('#stage');
const list = document.querySelector<HTMLElement>('#list');
if (!stage || !list) throw new Error('demo shell markup missing');

const byCategory = new Map<string, PatternMeta[]>();
for (const item of catalog.items) {
  const bucket = byCategory.get(item.category) ?? [];
  bucket.push(item);
  byCategory.set(item.category, bucket);
}

async function runDemo(id: string): Promise<void> {
  const load = demoRegistry[id];
  if (!load) return;
  const mod = await load();
  stage!.innerHTML = '';
  stage!.dataset.activeDemo = id;
  await mod.run(stage!);
  stage!.scrollIntoView({ block: 'nearest' });
}

for (const [category, items] of byCategory) {
  const heading = document.createElement('h2');
  heading.className = 'category';
  heading.textContent = `${category} · ${items.length}`;
  list.appendChild(heading);

  for (const item of items) {
    const row = document.createElement('div');
    row.className = 'recipe';
    row.dataset.recipeId = item.id;

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = item.name;

    const id = document.createElement('span');
    id.className = 'id';
    id.textContent = item.id;

    const engine = document.createElement('span');
    engine.className = 'engine';
    engine.textContent = item.engine ?? '';

    const desc = document.createElement('span');
    desc.className = 'desc';
    desc.textContent = item.description;

    row.append(name, id, engine, desc);

    if (demoRegistry[item.id]) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Run';
      btn.dataset.run = item.id;
      btn.addEventListener('click', () => void runDemo(item.id));
      row.appendChild(btn);
    }
    list.appendChild(row);
  }
}
