---
name: butai-deck-compose
description: >
  Compose a React/TSX slide deck from a talk outline — read the @butai/slide-kit
  catalog to pick real archetypes by intent, copy them into the project with
  `butai add`, wire them into the @butai/deck engine (SlideEngine / Slide), apply
  a butai theme, and write the deck to a generic, user-named target. Use when the
  user says '/butai-deck-compose', "build the deck", "generate slides from this
  outline", "compose a presentation", or hands off a talk outline (typically from
  butai-talk-plan) ready to become slides. Wires to the butai packages and a
  consumer-named slides directory — never a personal app path or barrel.
argument-hint: "[path to the talk outline (optional — defaults to the outline just planned)]"
---

# butai Deck Compose

## What this does

Turns a talk outline into a working React/TSX slide deck. It reads the outline's
acts and beats, picks matching slide archetypes from the generated slide-kit
catalog, copies those archetypes into the user's own project via the `butai add`
copy-in, wires them into the `@butai/deck` engine, applies a butai theme, and
writes the composed deck to a location the user names.

This is the build step after `butai-talk-plan`. It stays React/TSX — butai's deck
is React/TSX — but it wires to the **butai packages** and a **generic consumer
target**, never a personal app, barrel, or config. Nothing personal, no product
message, and no external service is baked in.

## When to use

- The user has a talk outline (usually from `butai-talk-plan`) and wants slides.
- The user wants a deck composed from real butai archetypes and a butai theme.

Do **not** use this to plan the outline (that is `butai-talk-plan`) or to author a
theme (that is `butai-theme-author`).

## The flywheel: read the slide-kit catalog, never a hand table

The archetypes are **not** hand-maintained here — they are discovered from the
generated slide-kit catalog, so this skill grows with the kit. Resolve the catalog
per `../../CATALOG-RESOLUTION.md`:

- **Prefer the installed package** — read
  `node_modules/@butai/slide-kit/catalog/catalog.json` (or import the `SLIDES`
  barrel from `@butai/slide-kit`) for every archetype's `id`, `name`, `category`,
  `description`, `tags`, `props`, and a copy-ready `snippet`.
- **Fallback to repo-local** `packages/slide-kit/catalog/catalog.json` inside the
  monorepo.

Read the catalog before choosing any component — it is the source of truth for
what archetypes exist and how they are used. Never hardcode a component list.

## Steps

### 1. Load the outline

Read the outline from the skill argument, or the outline the user just planned.
Extract the title, the `**Density:**`, and each `## Act N` with its `### Key
Points`, `### Visuals` (which already name the archetype ids `butai-talk-plan`
chose), and `### Speaker Notes`.

### 2. Derive a slug + a generic target

Derive a kebab slug from the title (e.g. "Ship Faster, Break Less" →
`ship-faster-break-less`). Ask the user where their deck lives, or default to a
generic slides directory in the user's own project — for example
`<project>/src/slides/<slug>/`. Do **not** assume any personal app path, and do
**not** write to or mutate a shared deck-config file; the deck is self-contained
in its own directory.

### 3. Pick archetypes by intent (from the catalog)

For each beat, choose the archetype the outline's `### Visuals` line names,
confirming it exists in the catalog and reading its `snippet` + `props` for the
exact shape. If the outline left a beat open, pick by intent (the same map
`butai-talk-plan` uses): opener → `cover-slide` / `cold-open-slide`; roadmap →
`agenda-slide`; gear change → `section-divider-slide`; one big idea →
`big-statement-slide`; explained concept → `concept-slide`; comparison →
`comparison-table-slide`; results → `stat-row-slide`; sequence → `timeline-slide`;
feature grid → `bento-grid-slide`; demo → `demo-cue-slide`; quote → `quote-slide`
/ `quote-portrait-slide`; screenshot beat → `image-caption-slide` /
`image-text-split-slide` / `full-bleed-slide`; wrap → `recap-slide` /
`speaker-intro-slide`.

**Density drives the build.** Speaker-led → more slides, fewer words each,
statement/demo beats favored. Reading-first → fewer, denser, self-contained
slides.

### 4. Copy the archetypes in with `butai add`

The chosen archetypes are copy-in registry items. Bring them into the user's
project (which must have `@butai/slide-kit` installed) with the butai CLI, rather
than importing from any personal component barrel:

```bash
# one-time: set up the copy-in config (writes/merges butai.json)
npx butai init --yes

# copy each chosen archetype (+ its closure) into the project
npx butai add cover-slide stat-row-slide comparison-table-slide demo-cue-slide

# preview the plan without writing
npx butai add <archetype> --dry-run
```

`butai add` copies each archetype's source and its registry dependencies into the
project's configured slides / primitives / styles locations. It does not modify
the CLI or the kit — it is a consumer-side copy-in.

### 5. Compose the deck (`index.tsx`)

Write `<target>/<slug>/index.tsx` importing the **engine from `@butai/deck`** and
the copied-in archetypes from the project's own slides alias — never a personal
`../../components` barrel:

```tsx
import { SlideEngine, Slide } from "@butai/deck";
import { CoverSlide } from "@/slides/cover-slide";
import { StatRowSlide } from "@/slides/stat-row-slide";
// …import each archetype `butai add` copied in (path per the project's butai.json alias)

export default function ShipFasterBreakLess() {
  return (
    <SlideEngine title="Ship Faster, Break Less">
      {/* ===== ACT 1: THE HOOK ===== */}
      <CoverSlide
        miniHeader="Example Conf · 2026"
        title={<>Ship Faster, <span className="c-accent">Break Less</span></>}
        subtitle="A practical guide to shipping with confidence."
      />

      {/* content slides — one per Key Point or logical group */}
    </SlideEngine>
  );
}
```

Rules:

- **Import `SlideEngine` / `Slide` from `@butai/deck`.** Import each archetype
  from the project's own copied-in slides location (the alias in its `butai.json`),
  not a hardcoded personal barrel.
- **One chapter/act** gets a divider beat plus one content slide per Key Point or
  logical group. Add a `{/* ===== ACT N: {TITLE} ===== */}` comment before each
  act's slides.
- **Fill props from each archetype's catalog `snippet`** — the snippet is the
  copy-ready shape; adapt its props to the beat's real (generic, `example.com`)
  content.
- **Status / color semantics** ride the contract tokens the theme supplies
  (`c-accent`, `--green`, `--yellow`, `--blue`, `--red`, `--orange`).

### 6. Screenshot placeholders

For a `### Visuals` beat that needs a screenshot, do not invent an image. Emit a
labeled placeholder so the gap is visible, and let the user drop the real asset in
later:

```tsx
{/* TODO: screenshot not yet captured — {description} */}
<div style={{ opacity: 0.4, textAlign: "center", padding: "60px 0",
  border: "1px dashed var(--border)", borderRadius: "8px" }}>
  [TODO: {description}]
</div>
```

If the outline marks a shot as already captured, swap the dashed placeholder for a
green-bordered "ready" note that names the file to add.

### 7. Apply a butai theme + report

Apply one of the 13 butai themes by setting `data-theme="<theme>"` on the deck
root (or the app shell), pulling the theme's CSS from `@butai/themes` (`THEMES`
lists the available ids). The deck is authored in contract tokens, so the theme
repaints it without touching the slides. Report the composed file, the archetypes
copied in, the theme applied, and the screenshot count:

```
--- Deck composed ---
Talk:    {Title}
File:    {target}/{slug}/index.tsx
Acts:    {N} acts → {N} slides
Added:   {archetype ids copied via `butai add`}
Theme:   {theme id}
Screenshots pending: {N}
```

## Hard rules (the deck contract)

1. **Read the catalog to pick archetypes** — never a hand-maintained component
   table, never an archetype the catalog lacks.
2. **Wire to the butai packages.** `SlideEngine` / `Slide` from `@butai/deck`;
   archetypes copied in via `butai add`. No personal component barrel.
3. **Write to a generic, user-named target.** No hardcoded personal app path, and
   no mutation of a shared deck-config file.
4. **Apply a butai theme via the token contract** — the deck restyles by theme, so
   never hardcode hex in slide layout.
5. **Personal-data-clean and trademark-clean.** Generic copy and `example.com`
   only. No real names, handles, product names, or campaign lines. A
   forbidden-strings guard scans the whole plugin; violations fail.

## Quality checklist

- [ ] Read the slide-kit catalog for archetypes + snippets + props (no hand table)
- [ ] Derived a slug and a generic, user-named target (no personal app path)
- [ ] Picked archetypes by the outline's intent; density drove the slide count
- [ ] Copied archetypes in with `butai add` (project has `@butai/slide-kit`)
- [ ] `index.tsx` imports `SlideEngine` / `Slide` from `@butai/deck` + copied-in
      archetypes (no `../../components` barrel)
- [ ] No shared deck-config file mutated; deck self-contained in its own dir
- [ ] Screenshot beats emit labeled placeholders, not invented images
- [ ] A butai theme applied via `data-theme`; layout styled through the contract
- [ ] Personal-data-clean + trademark-clean (generic copy + `example.com` only)

## Non-goals

- No outline planning — that is `butai-talk-plan`.
- No theme authoring — that is `butai-theme-author`.
- No hardcoded personal app path, component barrel, or shared deck-config mutation.
- No CLI changes — `butai add` is documented against the existing `@butai/cli`.
- No hand-maintained component table — read the generated slide-kit catalog.
- No personal, product, proprietary, or campaign content; generic + `example.com`.
