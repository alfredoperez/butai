---
name: butai-html-page
description: >
  Author a self-contained, framework-free HTML document — a brief, report, or
  explainer — by reading the generated @butai/docs-kit catalog, composing its
  doc patterns (hero, section, callout, card grid, metric grid, table,
  comparison, decisions, timeline, code block, quote band, footer), and styling
  the whole page through the token contract with a chosen butai theme. Use when
  the user says '/butai-html-page', "make a page/doc/brief/report", "an
  explainer", "capture this as a browsable HTML artifact", "render this design /
  decision / comparison / plan as a page", or wants a themeable HTML document
  richer than markdown. One `.html` file, inline CSS, no external runtime deps —
  it opens and paints offline anywhere.
argument-hint: "<topic or what to explain, e.g. 'compare our two caching options'>"
---

# butai HTML Page

## What this does

Turns a design, decision, comparison, or plan into a single self-contained HTML
document — a brief, a report, or an explainer — built from the butai doc-pattern
kit. The output is one `.html` file with inline CSS and no external runtime
dependencies: it opens and paints anywhere, offline, and travels well beside the
work it documents.

The page is **framework-free** (plain HTML + CSS, no React, no build step) and
**restyleable by any butai theme**: you author it once in neutral token-contract
variables, and a theme repaints the whole document by supplying a different token
block — same HTML, different look. Nothing personal, no product message, and no
external service is baked in.

## When to use

- The user wants a brief / report / explainer captured as a browsable HTML page.
- A design discussion, set of decisions, comparison, or plan is worth a richer
  artifact than markdown.
- The user wants something laid out visually and themeable, not prose.

Do **not** use this for documents the user wants as markdown, or for diagrams.

## The flywheel: read the generated catalog, never a hand table

The available patterns are **not** hand-maintained in this skill. They are
discovered from the docs-kit's generated catalog, so as the kit grows this skill
grows with it automatically:

- Read `packages/docs-kit/catalog/catalog.json` (the committed, byte-stable
  catalog `gen` produces) — or import the `PATTERNS` array from `@butai/docs-kit`
  (the isomorphic root barrel) — to list every doc pattern, its `id`, `category`,
  `description`, and `tags`.
- The full renderable fragment for a pattern is `packages/docs-kit/src/patterns/<id>.html`;
  the catalog's `snippet` is a short copy-ready excerpt, not the whole fragment.
- Never invent a pattern that is not in the catalog, and never hardcode a pattern
  list here. If the page needs a component the kit lacks, add it to the kit (a new
  pattern via the pattern-authoring flow), then re-read the catalog — capture
  once, reuse forever.

The seed kit (categories in parentheses) covers the common doc shapes:

| Pattern id | Use it for |
|---|---|
| `doc-hero` (header) | the opener — eyebrow, one tight headline, a one-line summary, a date + status meta row |
| `section-header` (structure) | a section break — uppercase eyebrow + `h2` with a hairline |
| `callout` (emphasis) | the thesis — one line that matters, accent-washed |
| `card-grid` (content) | a responsive grid of status-badged cards |
| `metric-grid` (data) | a trio of counted stat cards (kicker + big number + caption) |
| `data-table` (data) | a full-width comparison table, two tinted columns |
| `comparison` (data) | a side-by-side before/after (or A/B) pair |
| `decisions` (structure) | a numbered, ADR-style locked-decisions list |
| `timeline` (structure) | a stepped vertical sequence (or a horizontal flow) |
| `code-block` (code) | a terminal / console window + hand-highlighted code (no highlight.js, no CDN) |
| `quote-band` (emphasis) | a full-bleed pull-quote / emphasis band |
| `doc-footer` (closing) | a closing "what's next" CTA band that ends with momentum |

Always confirm the live list against the catalog; the table above is a map, not
the source of truth.

## Pick patterns by intent

Choose components by what the page argues, then compose them top to bottom:

- **A comparison** → `comparison` + `data-table`.
- **Locked decisions** → `decisions`.
- **A pipeline / sequence / steps** → `timeline`.
- **A thesis or a strong closing line** → `callout` and/or `quote-band`.
- **A group of options / items** → `card-grid`.
- **Numbers / results** → `metric-grid`.
- **"What it feels like" / a command session** → `code-block`.

Open with `doc-hero`, state the thesis in a `callout`, compose the body from the
patterns that fit, and end with `doc-footer` — forward momentum, not a summary.

## Hard rules (the doc contract)

1. **Framework-free.** Plain HTML + CSS only. No React, no Remotion, no bundler,
   no build step. The file must open and paint on its own in a browser.
2. **Style only through the token contract.** Use the contract variables, never
   raw hex in the layout:
   `var(--bg)`, `var(--bg-card)`, `var(--text)`, `var(--text-dim)`,
   `var(--accent)`, `var(--accent-glow)`, `var(--border)`,
   `var(--green)`, `var(--yellow)`, `var(--blue)`, `var(--red)`, `var(--orange)`,
   `var(--font-display)`, `var(--font-body)`, `var(--font-mono)`.
   Status semantics map onto contract tokens: shipped/done → `--green`,
   planned/caution → `--yellow`, info/next → `--blue`, critical/removed →
   `--red`/`--orange`. A page that hardcodes hex in its layout will not restyle by
   theme.
3. **Self-contained, inline CSS, no external runtime deps.** One `.html` file with
   an inline `<style>`. Ship a fallback `:root` giving every token the page uses a
   default value, plus the page-local design constants the contract does not name
   (a deeper surface, a console surface, radii) derived from contract vars — so
   the raw file renders standalone and offline. A theme later overrides these by
   injecting its own token block.
4. **Offline-safe, no CDN.** System-font fallback stacks in every `font-family`;
   pure-CSS motion only; no `highlight.js` (the code pattern hand-highlights via
   span classes); no external `<script src>` or `<link href="http…">`. An offline
   render must stay legible and log no external-fetch errors.
5. **Personal-data-clean and trademark-clean.** Generic copy and `example.com`
   only. No real names, handles, product names, campaign lines, screenshots,
   logos, brand characters, or proprietary provenance. The kit runs a
   forbidden-strings guard; violations fail the build.

## Steps

### 1. Settle the content and pick patterns

Identify what the page argues. Read the docs-kit catalog to see the available
patterns and choose the ones that fit the intent (above). Pull the substance from
the conversation; if key content is missing, ask briefly rather than inventing it.
Keep it honest — placeholder frames over invented data, `badge`s for real status.

### 2. Choose a theme

Pick one of the 13 butai themes (from `@butai/themes` `THEMES`). The page is
authored in neutral token-contract variables; the theme supplies the concrete
token block. Inject the chosen theme's tokens as a `:root` (or `[data-theme]`)
block so the theme's values win over the page's fallback `:root`. Docs reuse the
same 13 themes as scenes and slides — no page-specific theme layer.

### 3. Compose the HTML

Assemble one self-contained `.html`: the inline `<style>` (fallback `:root` +
the theme token block + the patterns' scoped styles), then the fragments in
order — `doc-hero`, the thesis `callout`, the body patterns, `doc-footer`. Copy
each pattern's fragment from `packages/docs-kit/src/patterns/<id>.html` and fill
in real (generic, `example.com`) copy. Put today's date in the hero's `.meta`
row, not in the filename.

### 4. Preview (free, no cost)

- **In the Studio:** open the `/docs` route in `apps/studio` to see every pattern
  in the themed preview gallery and try the theme switcher — a local render, no
  network, no cost.
- **From Node:** call `renderPreviews` from `@butai/docs-kit/node` to write a
  per-pattern PNG for a chosen theme to a temporary, git-ignored directory. It is
  a headless screenshot proxy — no network, no external service, no credit spend,
  no mp4. Screenshots are not byte-stable across machines, so they are never
  committed; treat them as throwaway previews.

```ts
import { renderPreviews } from "@butai/docs-kit/node";

await renderPreviews({ theme: "dark", outDir: "/tmp/butai-doc-preview" });
```

### 5. Save and report

Pick a kebab slug from the topic. Save as `<slug>.html` next to the work it
documents (no date prefix — the date lives inside the page). Report the saved
path.

## Quality checklist

- [ ] Read the docs-kit catalog for the available patterns (no hand-maintained list)
- [ ] Picked patterns by intent; opened with `doc-hero`, thesis in a `callout`, closed with `doc-footer`
- [ ] One self-contained `.html` — inline CSS, fallback `:root`, no external runtime deps
- [ ] Styled through the token contract (`var(--…)`), never raw hex in the layout
- [ ] A butai theme applied as a `:root` / `[data-theme]` token block (restyleable)
- [ ] Offline-safe: system-font fallbacks, pure-CSS motion, no CDN / no external fetch
- [ ] Content honest; drafts/planned tagged; status uses contract color tokens
- [ ] Personal-data-clean + trademark-clean (generic copy + `example.com` only)
- [ ] Saved as `<slug>.html` next to the work; path reported

## Non-goals

- No React / TSX doc components (framework-free is the architecture).
- No shared external stylesheet or CDN — each page is self-contained.
- No JS syntax-highlight dependency (`code-block` hand-highlights via spans).
- No paid render, no mp4, no external render service; previews are local headless
  screenshots only.
- No hand-maintained pattern table — read the generated catalog.
- No personal, product, proprietary, or campaign content; generic + `example.com`.
- No plugin manifest (that packaging is a later phase).
