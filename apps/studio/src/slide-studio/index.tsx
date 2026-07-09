/**
 * Slide Studio (Group B · phase-4 "Slide Studio (Group B) — v1").
 *
 * Three panes over the FROZEN slide-kit:
 *   • Browse  — the committed catalog, grouped by category, with search.
 *   • Preview — the picked archetype rendered live + fully styled inside a themed
 *               deck frame, with a 13-theme switcher (the CSS-closure forcing fn).
 *   • Inspect — a pragmatic scalar prop editor + the exact `butai add <id>` command
 *               and its resolved dependency closure (incl. slide-base) to copy in.
 */
import { useMemo, useState } from 'react';
import { Copy, Check, Search } from 'lucide-react';
import { THEMES } from '@butai/themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CATALOG_ITEMS,
  CATALOG_COUNT,
  addCommand,
  filterItems,
  groupByCategory,
  resolveClosure,
  type CatalogItem,
} from './catalog';
import {
  editableProps,
  exampleElement,
  withOverrides,
  type ScalarValue,
} from './props';
import { SlidePreview } from './SlidePreview';
import './slide-studio.css';

const DEFAULT_THEME = 'brand';
const DEFAULT_ID = CATALOG_ITEMS[0]?.id ?? '';

function BrowsePane({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const groups = useMemo(
    () => groupByCategory(filterItems(CATALOG_ITEMS, query)),
    [query],
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r">
      <div className="border-b p-3">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${CATALOG_COUNT} archetypes`}
            className="pl-8"
            aria-label="Search archetypes"
            data-archetype-search
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        {groups.length === 0 && (
          <p className="text-muted-foreground p-4 text-sm">No archetypes match.</p>
        )}
        {groups.map(([category, items]) => (
          <section key={category} className="mb-3">
            <h2 className="text-muted-foreground px-2 py-1.5 text-xs font-semibold tracking-wider uppercase">
              {category}
            </h2>
            <ul className="flex flex-col gap-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    data-catalog-item
                    data-archetype-id={item.id}
                    aria-current={item.id === selectedId}
                    className={cn(
                      'w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                      item.id === selectedId
                        ? 'bg-secondary text-secondary-foreground font-medium'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span className="block truncate">{item.name}</span>
                    <span className="text-muted-foreground block truncate font-mono text-xs">
                      {item.id}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}

function ThemeSwitcher({
  themeId,
  onChange,
}: {
  themeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Theme</span>
      <select
        value={themeId}
        onChange={(e) => onChange(e.target.value)}
        data-theme-switcher
        aria-label="Preview theme"
        className="border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-2 text-sm outline-none focus-visible:ring-[3px]"
      >
        {THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AddCommand({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const command = addCommand(id);
  const closure = useMemo(() => resolveClosure(id), [id]);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable (e.g. headless without permission) — command is
      // still shown for manual copy; nothing to surface.
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <code
          data-add-command
          className="bg-muted flex-1 truncate rounded-md px-3 py-2 font-mono text-sm"
        >
          {command}
        </code>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={copy}
          data-copy-command
          aria-label="Copy command"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5" data-closure>
        <span className="text-muted-foreground text-xs">
          Also copies in ({closure.length}):
        </span>
        {closure.map((dep) => (
          <Badge key={dep} variant="secondary" data-closure-item={dep}>
            {dep}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function PropEditor({
  item,
  overrides,
  onChange,
}: {
  item: CatalogItem;
  overrides: Record<string, ScalarValue>;
  onChange: (key: string, value: ScalarValue) => void;
}) {
  const base = useMemo(() => exampleElement(item.id), [item.id]);
  const fields = useMemo(() => (base ? editableProps(base) : []), [base]);

  if (fields.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        This archetype exposes no scalar props to edit; complex props render from
        its canonical example.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const value = (overrides[field.key] ?? field.value) as ScalarValue;
        if (field.kind === 'boolean') {
          return (
            <label key={field.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(field.key, e.target.checked)}
                data-prop-input={field.key}
                className="size-4"
              />
              <span className="font-mono text-xs">{field.key}</span>
            </label>
          );
        }
        return (
          <label key={field.key} className="block space-y-1 text-sm">
            <span className="text-muted-foreground font-mono text-xs">{field.key}</span>
            <Input
              type={field.kind === 'number' ? 'number' : 'text'}
              value={String(value)}
              onChange={(e) =>
                onChange(
                  field.key,
                  field.kind === 'number' ? Number(e.target.value) : e.target.value,
                )
              }
              data-prop-input={field.key}
            />
          </label>
        );
      })}
    </div>
  );
}

export function SlideStudio() {
  const [selectedId, setSelectedId] = useState(DEFAULT_ID);
  const [themeId, setThemeId] = useState(DEFAULT_THEME);
  // Overrides are keyed per archetype so switching archetypes never bleeds edits.
  const [allOverrides, setAllOverrides] = useState<
    Record<string, Record<string, ScalarValue>>
  >({});

  const item = useMemo(
    () => CATALOG_ITEMS.find((entry) => entry.id === selectedId) ?? CATALOG_ITEMS[0],
    [selectedId],
  );
  const overrides = useMemo(
    () => allOverrides[selectedId] ?? {},
    [allOverrides, selectedId],
  );

  const previewEl = useMemo(() => {
    const base = exampleElement(selectedId);
    return base ? withOverrides(base, overrides) : null;
  }, [selectedId, overrides]);

  const setOverride = (key: string, value: ScalarValue) =>
    setAllOverrides((prev) => ({
      ...prev,
      [selectedId]: { ...(prev[selectedId] ?? {}), [key]: value },
    }));

  return (
    <div className="flex h-full min-h-0">
      <BrowsePane selectedId={selectedId} onSelect={setSelectedId} />

      <section className="flex min-w-0 flex-1 flex-col overflow-auto">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold" data-selected-name>
              {item.name}
            </h1>
            <p className="text-muted-foreground truncate text-sm">{item.description}</p>
          </div>
          <ThemeSwitcher themeId={themeId} onChange={setThemeId} />
        </header>

        <div className="mx-auto w-full max-w-4xl p-4">
          <SlidePreview element={previewEl} themeId={themeId} />
        </div>

        <div className="mx-auto w-full max-w-4xl px-4 pb-6">
          <h2 className="mb-2 text-sm font-semibold">Copy it into your project</h2>
          <AddCommand id={selectedId} />
        </div>
      </section>

      <aside className="w-80 shrink-0 overflow-auto border-l p-4">
        <h2 className="mb-3 text-sm font-semibold">Props</h2>
        <PropEditor item={item} overrides={overrides} onChange={setOverride} />
      </aside>
    </div>
  );
}
