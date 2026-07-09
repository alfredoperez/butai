/*
 * Docs Studio (phase-6 · Group B) — a READ-ONLY docs lane surface.
 *
 * It visualizes the framework-free doc-pattern kit (`@butai/docs-kit`) as a themed
 * preview gallery: every doc pattern rendered as its own isolated `<iframe srcdoc>`
 * so its CSS never leaks into the shadcn chrome (and Tailwind preflight never
 * restyles it). Beside each preview sits the pattern's catalog metadata (name,
 * category, description).
 *
 * A theme switcher (driven by @butai/themes `THEMES`) injects the selected theme's
 * token block into every pattern's `:root` — the same HTML repaints, proving the
 * docs-restyle-via-token-contract contract. There is NO authoring / persistence
 * loop here (authoring is the html-page skill's job — §Group C). This surface only
 * visualizes the pattern kit.
 *
 * Robust to Group A's timing: patterns come from the kit's `src/patterns/*.html`
 * when present, else this studio's bundled fixture patterns — so the surface is
 * never empty and the e2e always has something to exercise (the P5 fixture pattern).
 */
import { useMemo, useState, type JSX } from 'react';
import { FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { loadPatterns, loadThemeTokens, patternSrcdoc, type DocPattern } from './patterns-data';
import './docs-studio.css';

export function DocsStudio(): JSX.Element {
  const patterns = useMemo(() => loadPatterns(), []);
  const themeList = useMemo(() => loadThemeTokens(), []);

  const [themeId, setThemeId] = useState(
    () => themeList.find((t) => t.id === 'dark')?.id ?? themeList[0]?.id ?? 'dark',
  );
  const tokens = useMemo(
    () => themeList.find((t) => t.id === themeId)?.tokens ?? {},
    [themeList, themeId],
  );

  return (
    <div className="flex h-full min-h-0 flex-col" data-docs-studio>
      <header className="flex flex-wrap items-center gap-3 border-b px-6 py-4">
        <FileText className="size-5 text-muted-foreground" />
        <div className="mr-auto">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Butai Studio
          </p>
          <h1 className="text-2xl font-semibold">Docs Studio</h1>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Read-only. A themed preview gallery of the framework-free doc-pattern kit. Switch the
            theme to repaint every pattern via the token contract.
          </p>
        </div>

        {/* Theme switcher */}
        <div className="flex flex-wrap gap-1.5" data-testid="theme-switcher">
          {themeList.map((theme) => (
            <button
              key={theme.id}
              type="button"
              data-theme-chip={theme.id}
              aria-pressed={theme.id === themeId}
              onClick={() => setThemeId(theme.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                theme.id === themeId
                  ? 'border-primary bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50',
              )}
            >
              <span className="flex gap-0.5">
                {['--bg', '--accent', '--text'].map((t) => (
                  <span
                    key={t}
                    className="size-3 rounded-full border"
                    style={{ background: theme.tokens[t] ?? 'transparent' }}
                  />
                ))}
              </span>
              {theme.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Preview gallery (themed doc-pattern previews) ────────────────────── */}
      <section className="min-h-0 flex-1 overflow-auto p-5" data-testid="pattern-gallery">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-semibold">Doc patterns</h2>
          <Badge variant="secondary">{themeId}</Badge>
          <Badge variant="outline">
            {patterns.length} pattern{patterns.length === 1 ? '' : 's'}
          </Badge>
          {patterns[0]?.fixture && <Badge variant="outline">fixtures</Badge>}
        </div>

        {patterns.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="patterns-empty">
            No doc patterns yet. The docs kit has not published any patterns.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {patterns.map((pattern) => (
              <PatternPreview key={pattern.id} pattern={pattern} tokens={tokens} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PatternPreview({
  pattern,
  tokens,
}: {
  pattern: DocPattern;
  tokens: Record<string, string>;
}): JSX.Element {
  const srcdoc = useMemo(() => patternSrcdoc(pattern.html, tokens), [pattern.html, tokens]);
  return (
    <figure className="m-0 space-y-2" data-pattern={pattern.id}>
      <div className="ds-preview" data-pattern-frame={pattern.id}>
        {/* `allow-same-origin` (no `allow-scripts`): the preview paints the pattern's
            static markup — no inline scripts run, so no CDN fetch, no console noise —
            while Playwright can still read the token probe's computed style. */}
        <iframe
          title={`Doc pattern: ${pattern.title}`}
          srcDoc={srcdoc}
          loading="lazy"
          sandbox="allow-same-origin"
        />
      </div>
      <figcaption className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-foreground" title={pattern.id}>
            {pattern.title}
          </span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            {pattern.category}
          </span>
        </div>
        {pattern.description && (
          <p className="text-xs text-muted-foreground">{pattern.description}</p>
        )}
      </figcaption>
    </figure>
  );
}
