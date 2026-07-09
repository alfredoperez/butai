---
name: outline
description: >
  Plan and outline a talk or deck BEFORE any slides are built — run a short
  discovery (purpose, length, content-readiness, speaking-vs-reading density),
  draft a structured outline whose beats map to real @butai/slide-kit archetypes
  read from the generated catalog, verify it with the user, then write it to a
  generic, user-named location for /create to build. Use when the user
  says '/outline', "plan a talk", "help me shape this talk/deck", "outline
  my presentation", or has rough notes/screenshots to turn into a talk structure.
  This skill plans the outline only — it does not build slides or author themes.
argument-hint: "[talk topic, or path to rough notes / screenshots (optional)]"
---

# butai Talk Plan

## What this does

Shapes a talk into a verified outline **before** any slide is built. The point is
to decide what goes on the slides and in what order, and to get the user's
sign-off — not to design visuals and not to write code. It runs a short discovery,
drafts a structured outline, confirms it, and writes it to a location the user
names, then hands off to `/create` to generate the deck.

The core idea: don't ask abstract questions one at a time, and don't start
building from a vague brief. Ask everything up front, draft a concrete outline,
and confirm it with the user before handing off. Nothing personal, no product
message, and no external service is baked into the outline.

## When to use

- The user wants to plan or outline a talk / deck before building slides.
- The user has rough notes, a topic, or screenshots and wants a talk structure.
- The user wants the outline signed off before any generation happens.

Do **not** use this to build slides (that is `/create`) or to author a
theme (that is `/create-theme`).

## The flywheel: read the slide-kit catalog, never a hand table

The outline's beats map to **real slide archetypes**, and the list of archetypes
is **not** hand-maintained here. It is discovered from the generated slide-kit
catalog, so as the kit grows this skill grows with it automatically. Resolve the
catalog per `../../CATALOG-RESOLUTION.md`:

- **Prefer the installed package** — read
  `node_modules/@butai/slide-kit/catalog/catalog.json`, or import the `SLIDES`
  barrel from `@butai/slide-kit`, to list every archetype with its `id`, `name`,
  `category`, `description`, `tags`, and a copy-ready `snippet`.
- **Fallback to repo-local** `packages/slide-kit/catalog/catalog.json` when running
  inside the butai monorepo.

Never invent an archetype that is not in the catalog, and never hardcode an
archetype list here. If a beat needs a shape the kit lacks, author it via
`/create-scene`'s sibling flow for slides, regenerate the catalog, then
re-read it — capture once, reuse forever.

### Map beats to archetypes by intent

Once you have read the catalog, shape each act's `### Visuals` / `### Key Points`
around the archetypes that actually exist. A guide (confirm the live ids against
the catalog — this is a map, not the source of truth):

- **The opener** → `cover-slide` (title deck) or `cold-open-slide` (start on a
  provocation before the title).
- **The roadmap of the talk** → `agenda-slide`; a mid-talk gear change →
  `section-divider-slide`.
- **One idea that has to land** → `big-statement-slide`; a single explained
  concept → `concept-slide`.
- **A comparison / "X vs Y"** → `comparison-table-slide`.
- **Numbers / results / scale** → `stat-row-slide`.
- **A sequence / history / roadmap over time** → `timeline-slide`.
- **A group of features or items at a glance** → `bento-grid-slide`.
- **A live demo beat** → `demo-cue-slide`.
- **A quote / testimonial** → `quote-slide` or `quote-portrait-slide`.
- **A screenshot-led beat** → `image-caption-slide`, `image-text-split-slide`, or
  `full-bleed-slide`.
- **The wrap** → `recap-slide`, and a closing "who I am / where to find this" beat
  → `speaker-intro-slide`.

Note in each `### Visuals` line which archetype the beat is heading for, so the
handoff to `/create` is unambiguous.

## Steps

### 1. Discovery — ask all four at once

Ask these **four questions together** in a single `AskUserQuestion` call so the
user answers in one pass. Skip any the user already settled in their prompt or
notes.

1. **Purpose** — What is this talk for? (Conference · Teaching/tutorial ·
   Internal/team · Pitch.) Affects tone, demo-heaviness, formality.
2. **Length** — Roughly how long? (Lightning ~5 min · Short 10–15 min · Standard
   20–30 min · Long 40 min+.) Drives act and slide count.
3. **Content** — How ready is the material? (Full notes · Rough notes · Topic
   only.) If rough or topic-only, you co-write more of the outline.
4. **Density** — Speaker-led or reading-first? (Speaker-led: big ideas, few words,
   more slides · Reading-first: denser, self-contained slides.)

If the user pointed at rough notes or a file, read it first and let the answers
refine your understanding — don't re-ask what the notes already settle.

### 2. Gather content

- **Full notes:** read them; you are structuring, not inventing.
- **Rough notes:** extract the real points; fill gaps with proposals the user can
  correct at the verify gate. Mark anything you invented with `(proposed)`.
- **Topic only:** propose a credible arc from topic + purpose before inventing
  detail.

**Image-first outline (if the user has screenshots/images):** co-design the
outline around them — don't plan the talk and bolt images on. For each image:
evaluate it (usable or not, one-line reason) and name what concept it shows. Then
shape acts from images and text together (three product screenshots → three
feature beats via `image-caption-slide`; a diagram image → the `concept-slide` it
explains). Only after the usable images have homes do you fill gaps with
text-only beats. Usable images become `### Visuals` lines.

### 3. Draft the outline

Write it in the exact structure `/create` consumes:

```markdown
# {Talk Title}

**Thesis:** {one-sentence through-line of the talk}
**Density:** {speaker-led | reading-first}

---

## Act 1: {Title} (~{N} min)

### Key Points
- {point — one idea per bullet, phrased the way it should land}

### Visuals
- {archetype-id + what it shows — e.g. "stat-row-slide: three quarter figures"}

### Speaker Notes
- {context, transition, or demo cue}
```

Rules:

- **Act count follows Length × Density.** Lightning ≈ 2–3 acts; Standard ≈ 4–5;
  Long ≈ 6+. Speaker-led → more acts, fewer Key Points each (1–3); reading-first
  → fewer acts, denser Key Points (4–6).
- **Record the density choice** as `**Density:**` in the outline header — it
  carries through to how `/create` builds every slide.
- **One idea per Key Point.** If a bullet is two ideas, split it.
- **Mark demos explicitly** (`[Demo] …`) in Key Points or Speaker Notes — the
  `demo-cue-slide` beat keys off that.
- **Keep a clear spine:** hook → build → payoff → recap. State the **Thesis** at
  the top; every act serves it. Time-box each act (`~N min`) so totals match the
  chosen Length.

### 4. Verify with the user (do not skip)

Show the drafted outline (titles + Key Points, compact) and ask for sign-off with
a single `AskUserQuestion`:

> "Does this outline look right?"
> - **Looks good — save it**
> - **Adjust the structure** (acts / order / length)
> - **Adjust the content** (points within acts)

If they pick an adjust option, ask what to change, revise, and re-confirm. **Only
continue once the user approves** — never write the file or hand off on an
unconfirmed outline. This verification step is the part that makes the difference.

### 5. Save + hand off

1. Ask the user where their talk outlines live, or derive a generic default in
   the user's own project (e.g. `talks/{slug}.md` at the project root). Do **not**
   assume a personal notes vault or any fixed absolute path.
2. Derive a kebab slug from the title and write the approved outline there. If a
   file with that name exists, confirm overwrite vs. a new name first.
3. Summarize:

```
--- Outline ready ---
Talk:     {Title}
Saved:    {relative path the user chose}
Shape:    {N} acts · ~{N} min · {speaker-led | reading-first}
Demos:    {N}     Visuals to capture: {N}

Next:  build the deck →  /create {saved path}
```

Offer to run `/create` now, but don't auto-run it — the user may want
to tweak the saved outline first.

## Hard rules (the outline contract)

1. **Plan only.** This skill produces a verified outline. It does not build slides
   (that is `/create`) or author a theme (that is `/create-theme`).
2. **Map beats to real archetypes read from the catalog** — never a hand-kept
   archetype list, never an archetype the catalog does not contain.
3. **Verify before saving.** No file is written on an unconfirmed outline.
4. **Write to a generic, user-named location.** No hardcoded personal folder, no
   fixed absolute path — the user's own project decides where the outline lands.
5. **Personal-data-clean and trademark-clean.** Generic copy and `example.com`
   only. No real names, handles, product names, campaign lines, or proprietary
   provenance. A forbidden-strings guard scans the whole plugin; violations fail.

## Quality checklist

- [ ] Read the slide-kit catalog for the archetypes (no hand-maintained list)
- [ ] Discovery asked all four questions in one pass
- [ ] Outline in the exact `# Title` / `**Thesis:**` / `**Density:**` / `## Act` /
      `### Key Points` / `### Visuals` / `### Speaker Notes` shape
- [ ] Each `### Visuals` line names the real archetype id the beat heads for
- [ ] Act count matches Length × Density; one idea per Key Point; demos marked
- [ ] Verified with the user before saving (adjust loop honored)
- [ ] Saved to a generic, user-named location; path reported; handed off to
      `/create`
- [ ] Personal-data-clean + trademark-clean (generic copy + `example.com` only)

## Non-goals

- No slide generation — the outline hands off to `/create`.
- No theme authoring — that is `/create-theme`.
- No hardcoded personal folder / absolute path — the user names the target.
- No hand-maintained archetype table — read the generated slide-kit catalog.
- No personal, product, proprietary, or campaign content; generic + `example.com`.
