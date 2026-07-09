---
name: butai-scene-author
description: >
  Author a new framework-free video scene into @butai/scene-kit — a standalone
  HTML document styled by the token contract, plus its frame.md design-spec and
  its meta.md catalog entry, then regenerate the catalog + registry. Use when the
  user says '/butai-scene-author', "add a scene to the scene kit", "author a new
  HyperFrames scene", "create a title-card / callout / code / quote / outro
  scene", or wants a restyleable HTML scene that a theme can repaint. Scenes are
  raw HTML rendered to video by HyperFrames (consumed via `npx hyperframes`,
  never vendored). No React, no Remotion.
argument-hint: "[scene idea, e.g. 'a stat-reveal callout' or 'an opener titled Ship Faster']"
---

# butai Scene Author

## What this does

Adds one new **video scene** to the butai scene kit. A scene is a self-contained
web page that HyperFrames later turns into video. You describe the scene you want
(an opener, a callout, a code reveal, a quote, a closing card), and this walks
through authoring the three files that make it a first-class kit item, then
refreshes the generated index so the Studio preview and a future copy-in command
can see it.

A scene restyles itself from a theme. You author it once in neutral, brand-free
tokens, and any butai theme repaints it without touching the HTML. Nothing
personal, no product message, and no external service is baked in.

## When to use

- The user wants a new reusable scene in `packages/scene-kit`.
- The user is generalizing a look they like into a themeable scene.
- The user asks for a specific scene archetype (opener / callout / code / quote / closing).

## The scene triple (author all three, co-located, paired by basename)

Every scene lives flat under `packages/scene-kit/src/scenes/` as three files that
share one id:

| File | Role |
|---|---|
| `<id>.html` | the framework-free scene document HyperFrames renders |
| `<id>.frame.md` | the design-spec (colors / typography / spacing / components + prose), parsed by the frozen `parseDesignSpec` |
| `<id>.meta.md` | the catalog entry (frontmatter is `PatternMeta`, first fenced block is a short copy-ready snippet) |

The `.meta.md` snippet is a short excerpt, not the whole scene. The full
renderable document is always `<id>.html`.

## Hard rules (the scene contract)

1. **Framework-free.** Plain HTML + CSS + optional inline `<script>`. No React,
   no Remotion, no bundler. The file must open and paint on its own in a browser.
2. **Style only through the token contract.** Use the contract variables, never
   raw hex in the layout:
   `var(--bg)`, `var(--bg-card)`, `var(--text)`, `var(--text-dim)`,
   `var(--accent)`, `var(--accent-glow)`, `var(--border)`,
   `var(--yellow)`, `var(--green)`, `var(--blue)`,
   `var(--font-display)`, `var(--font-body)`, `var(--font-mono)`.
   A scene that hardcodes hex in its layout will fail the restyle-by-theme proof.
3. **Ship a self-contained fallback `:root`.** Give every token the scene uses a
   default value in a `:root { ... }` block so the raw file renders standalone and
   offline. A theme later overrides these by injecting its own token block; same
   HTML, different values, different render.
4. **No network dependency for legibility.** System-font fallback stacks in every
   `font-family` (a web font may be listed first, but a system font must follow so
   an offline render stays legible). If you use motion, guard it so a missing
   library never blanks the frame; prefer pure CSS animation.
5. **Personal-data-clean and trademark-clean.** Generic copy and `example.com`
   only. No real names, handles, product names, campaign lines, screenshots,
   logos, or brand characters. The kit runs a forbidden-strings guard over
   `src/`; violations fail the build.
6. **Never vendor HyperFrames.** HyperFrames is an external tool the user runs via
   `npx hyperframes`. Do not copy its CLI, registry, config, or any renderer
   source into the repo, and do not add it as a dependency.

## Steps

### 1. Settle the archetype and copy

Ask (or infer) which archetype this is and its category (kebab-case:
`opener`, `callout`, `code`, `quote`, `closing`). Draft the on-scene copy in
generic, brand-free words. Keep it to one idea per frame.

### 2. Write `<id>.html`

A full document with a `:root` fallback token block, a `.scene` root element, and
layout that reads every color and font through `var(--token)`. Example shape:

```html
<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        --bg: #0f0f13; --bg-card: #17171d; --text: #f5f5f7; --text-dim: #a1a1aa;
        --accent: #60a5fa; --accent-glow: #3b82f6; --border: #2a2a33;
        --yellow: #fbbf24; --green: #34d399; --blue: #60a5fa;
        --font-display: "Space Grotesk", system-ui, sans-serif;
        --font-body: system-ui, sans-serif;
        --font-mono: ui-monospace, "SF Mono", monospace;
      }
      * { margin: 0; box-sizing: border-box; }
      .scene {
        width: 100vw; height: 100vh; background: var(--bg); color: var(--text);
        display: grid; place-content: center; gap: 1.5rem; padding: 8vh 8vw;
        font-family: var(--font-body);
      }
      .eyebrow { font-family: var(--font-mono); color: var(--text-dim);
                 letter-spacing: 0.2em; text-transform: uppercase; }
      .cap { font-family: var(--font-display); font-size: 6rem; line-height: 1.02; }
      .accent { color: var(--accent); }
    </style>
  </head>
  <body>
    <section class="scene">
      <div class="eyebrow">EXAMPLE.COM · 2026</div>
      <h1 class="cap">Ship faster, <span class="accent">break less</span></h1>
      <p class="sub" style="color: var(--text-dim)">A calm, one-idea-per-frame opener.</p>
    </section>
  </body>
</html>
```

If you add motion, use a small pure-CSS keyframe or an inline `<script>` that
degrades to a static, legible frame when it does not run.

### 3. Write `<id>.frame.md` (the design-spec)

YAML frontmatter with `colors` / `typography` / `spacing` / `components` maps,
followed by `##` prose sections (a "Motion feel" section is a good home for the
timing intent). Keep frontmatter values verbatim; the frozen parser reads them
as-is. It must parse with **zero error diagnostics** (the render-smoke asserts
this).

```md
---
colors:
  bg: "#0f0f13"
  panel: "#17171d"
  ink: "#f5f5f7"
  muted: "#a1a1aa"
  accent: "#60a5fa"
typography:
  display: "Space Grotesk"
  body: "system-ui"
  mono: "ui-monospace"
spacing:
  gutter: "8vw"
components:
  headline: "one accent word lands a beat after the line settles"
---

## Intent
A calm, one-idea-per-frame opener. Eyebrow, a big display headline with one
accent word, an optional subtitle. No UI.

## Motion feel
The headline settles, then the accent word lands a beat later. power2 / power3
out, no bounce.
```

### 4. Write `<id>.meta.md` (the catalog entry)

Frontmatter is `PatternMeta` with `kind: scene`. The first fenced code block is a
short, prop-only snippet (not the full document).

```md
---
id: title-card
name: Title Card
kind: scene
category: opener
description: Kinetic-type opener — eyebrow, a big display headline with one accent word, optional subtitle. No UI.
tags: [scene, opener, kinetic-type]
engine: css
motion: headline settles, then the accent word lands a beat later; power2/power3 out, no bounce
source: { file: src/scenes/title-card.html }
---

```html
<section class="scene">
  <div class="eyebrow">EXAMPLE.COM · 2026</div>
  <h1 class="cap">Ship faster, <span class="accent">break less</span></h1>
  <p class="sub">A calm, one-idea-per-frame opener.</p>
</section>
```
```

Set `kind: scene` on every scene (the catalog enum already accepts it). Use
`engine` for `css` / `gsap` / `none` and `motion` for the feel.

### 5. Regenerate the index and verify

```bash
pnpm --filter @butai/scene-kit gen
pnpm --filter @butai/scene-kit test
git -C ~/dev/GitHub/butai diff --exit-code packages/scene-kit/catalog packages/scene-kit/registry
```

`gen` rebuilds the committed catalog + registry from the scene files. The tests
run the forbidden-strings guard, the gen-determinism check, and the optional
render-smoke (your `frame.md` parses clean and the HTML paints headless). Commit
the new scene files together with the regenerated `catalog/` and
`registry/index.json`.

## Previewing and rendering (cheap first, paid later)

- **Cheap preview (no cost):** open `/video` in `apps/studio` to see the scene in
  the themed contact-sheet grid, or run the Node contact-sheet renderer. Both are
  local headless screenshots. No credits, no network render.
- **Real video render (manual, costs credits):** a real scene-to-video render is a
  deliberate manual step run through the user's own HyperFrames install via
  `npx hyperframes` (see the `butai-storyboard-to-video` skill). Do not run a paid
  render as part of authoring.

## Non-goals

- No React / Remotion / TSX scene components (framework-free is the architecture).
- No vendoring HyperFrames, no adding it as a dependency.
- No paid render, no mp4, no credit spend during authoring.
- No personal, product, or campaign content; generic + `example.com` only.
- No plugin manifest (that packaging is a later phase).
