/**
 * Theme Studio (phase-4 · Group A) — live token editor.
 *
 * Flow: pick one of the 13 shipped themes as a base, live-edit its token values
 * against the frozen `TOKEN_CONTRACT`, watch the edits cascade instantly onto a
 * swatch grid AND real kit slides (rendered in themed `<Slide>` frames), validate
 * the working set with `validateThemeTokens`, and export a `[data-theme]{…}` block.
 *
 * Live-update mechanism (perf note, phase-4 Risks): edits are written to a single
 * injected `<style id="butai-theme-override">` (debounced), so previews update via
 * pure CSS cascade — no per-keystroke React re-render of the preview subtree.
 *
 * Style-collision guardrail: the deck/slide preview lives inside the dedicated
 * `.ts-preview` container (data-theme scoped); Tailwind utilities are never applied
 * to `.slide*` internals, and the slide framing CSS is scoped in `preview.css`.
 */
import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { validateThemeTokens } from '@butai/patterns';
import { EXAMPLES } from '@butai/slide-kit';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { loadThemes, sectionsFor, toHexColor, nonEmptyTokens, exportCss } from './tokens';
import './preview.css';

const OVERRIDE_STYLE_ID = 'butai-theme-override';
const PREVIEW_SLIDE_IDS = ['cover-slide', 'concept-slide', 'stat-row-slide'];
const DEBOUNCE_MS = 60;

export function ThemeStudio(): JSX.Element {
  const themes = useMemo(() => loadThemes(), []);
  const [selectedId, setSelectedId] = useState(
    () =>
      themes.find((t) => t.manifest.id === 'dark')?.manifest.id ??
      themes[0]?.manifest.id ??
      'dark',
  );

  const base = useMemo(
    () => themes.find((t) => t.manifest.id === selectedId)?.tokens ?? {},
    [themes, selectedId],
  );

  const [draft, setDraft] = useState<Record<string, string>>(() => ({ ...base }));
  const [exportName, setExportName] = useState(() => `${selectedId}-custom`);

  // Reset the working draft + export name when the base theme changes.
  useEffect(() => {
    setDraft({ ...base });
    setExportName(`${selectedId}-custom`);
  }, [base, selectedId]);

  // Apply the selected theme to <html> so the deck's `html[data-theme]`-scoped
  // font rules also cascade into the preview; restore the prior value on unmount.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.dataset.theme;
    html.dataset.theme = selectedId;
    return () => {
      if (prev === undefined) delete html.dataset.theme;
      else html.dataset.theme = prev;
    };
  }, [selectedId]);

  // Debounced write-through to a single injected <style> override — later in the
  // cascade than the theme CSS (equal specificity), so its declarations win.
  const styleRef = useRef<HTMLStyleElement | null>(null);
  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement('style');
      el.id = OVERRIDE_STYLE_ID;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    const el = styleRef.current;
    const timer = window.setTimeout(() => {
      const decls = Object.entries(draft)
        .filter(([, v]) => v.trim() !== '')
        .map(([k, v]) => `  ${k}: ${v.trim()};`)
        .join('\n');
      el.textContent = `[data-theme="${selectedId}"] {\n${decls}\n}\n`;
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [draft, selectedId]);

  useEffect(
    () => () => {
      styleRef.current?.remove();
      styleRef.current = null;
    },
    [],
  );

  const setToken = (token: string, value: string) => setDraft((d) => ({ ...d, [token]: value }));

  const sections = useMemo(() => sectionsFor(Object.keys(draft)), [draft]);
  const colorTokens = useMemo(
    () => sections.filter((s) => s.kind === 'color').flatMap((s) => s.tokens),
    [sections],
  );

  const diagnostics = useMemo(() => validateThemeTokens(nonEmptyTokens(draft)), [draft]);
  const errors = diagnostics.filter((d) => d.level === 'error');
  const warnings = diagnostics.filter((d) => d.level === 'warning');

  const exportedCss = useMemo(
    () => exportCss(exportName, draft, base),
    [exportName, draft, base],
  );

  const previewIds = useMemo(() => {
    const preferred = PREVIEW_SLIDE_IDS.filter((id) => id in EXAMPLES);
    return (preferred.length >= 2 ? preferred : Object.keys(EXAMPLES)).slice(0, 3);
  }, []);

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(exportedCss);
    } catch {
      /* clipboard unavailable (e.g. headless) — the <pre> stays copyable by hand */
    }
  };
  const downloadCss = () => {
    const blob = new Blob([exportedCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportName.trim() || 'theme'}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="border-b px-6 py-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Butai Studio
        </p>
        <h1 className="text-2xl font-semibold">Theme Studio</h1>
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">
          Live-edit token values against the contract, preview on real kit slides, and export a{' '}
          <code className="font-mono text-xs">[data-theme]</code> block.
        </p>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(360px,440px)_1fr]">
        {/* ── Editor column ─────────────────────────────────────────────── */}
        <div className="min-h-0 space-y-5 overflow-auto border-r p-5">
          <section>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Base theme
            </p>
            <div className="flex flex-wrap gap-2">
              {themes.map(({ manifest, tokens }) => (
                <button
                  key={manifest.id}
                  type="button"
                  data-theme-chip={manifest.id}
                  aria-pressed={manifest.id === selectedId}
                  onClick={() => setSelectedId(manifest.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                    manifest.id === selectedId
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50',
                  )}
                >
                  <span className="flex gap-0.5">
                    {['--bg', '--accent', '--text'].map((t) => (
                      <span
                        key={t}
                        className="size-3 rounded-full border"
                        style={{ background: tokens[t] ?? 'transparent' }}
                      />
                    ))}
                  </span>
                  {manifest.label}
                </button>
              ))}
            </div>
          </section>

          {sections.map((section) => (
            <section key={section.label}>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {section.label}
              </p>
              <div className="space-y-2">
                {section.tokens.map((token) => {
                  const value = draft[token] ?? '';
                  const hex = toHexColor(value);
                  return (
                    <div key={token} className="flex items-center gap-2" data-token-row={token}>
                      <label
                        htmlFor={`token-${token}`}
                        title={token}
                        className="w-24 shrink-0 truncate font-mono text-xs text-muted-foreground"
                      >
                        {token}
                      </label>
                      {section.kind === 'color' && (
                        <input
                          type="color"
                          aria-label={`${token} color picker`}
                          value={hex ?? '#000000'}
                          onChange={(e) => setToken(token, e.target.value)}
                          className="size-8 shrink-0 cursor-pointer rounded border bg-transparent p-0.5"
                        />
                      )}
                      <Input
                        id={`token-${token}`}
                        data-testid={`token-${token}`}
                        value={value}
                        spellCheck={false}
                        onChange={(e) => setToken(token, e.target.value)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                Validation
                {errors.length > 0 ? (
                  <Badge variant="destructive">
                    {errors.length} error{errors.length > 1 ? 's' : ''}
                  </Badge>
                ) : (
                  <Badge variant="secondary">valid</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-xs" data-testid="validation">
              {errors.length === 0 && warnings.length === 0 && (
                <p className="text-muted-foreground">
                  All 17 required tokens present. No contract violations.
                </p>
              )}
              {errors.map((d, i) => (
                <p key={`e${i}`} className="text-destructive">
                  {d.message}
                </p>
              ))}
              {warnings.map((d, i) => (
                <p key={`w${i}`} className="text-muted-foreground">
                  {d.message}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="export-name" className="text-xs text-muted-foreground">
                  Name
                </label>
                <Input
                  id="export-name"
                  data-testid="export-name"
                  value={exportName}
                  spellCheck={false}
                  onChange={(e) => setExportName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <pre
                data-testid="export-css"
                className="max-h-56 overflow-auto rounded-md border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed"
              >
                {exportedCss}
              </pre>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={copyCss}>
                  Copy CSS
                </Button>
                <Button size="sm" variant="outline" onClick={downloadCss}>
                  Download .css
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Preview column (data-theme scoped; deck/slide CSS lives here) ── */}
        <div className="ts-preview min-h-0 space-y-6 overflow-auto p-5" data-theme={selectedId}>
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">Tokens</h2>
              <Badge variant="secondary">{selectedId}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {colorTokens.map((token) => (
                <div key={token} data-swatch={token} className="overflow-hidden rounded-md border">
                  <div
                    className="h-10 w-full"
                    data-testid={token === '--accent' ? 'preview-accent' : undefined}
                    style={{ background: `var(${token})` }}
                  />
                  <div className="bg-card px-2 py-1">
                    <p className="truncate font-mono text-[10px] text-foreground" title={token}>
                      {token}
                    </p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      {draft[token]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Kit slides</h2>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {previewIds.map((id) => {
                const Example = EXAMPLES[id];
                return (
                  <figure key={id} data-preview-slide={id} className="m-0">
                    <div className="ts-frame">
                      <div className="ts-canvas">{Example ? <Example /> : null}</div>
                    </div>
                    <figcaption className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                      {id}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
