---
name: butai-storyboard-to-video
description: >
  Turn a STORYBOARD.md plus the butai scene kit into a video — parse the
  storyboard, preview the scenes as a themed contact sheet for free, then drive
  the real render through the user's own HyperFrames install via `npx
  hyperframes`. Use when the user says '/butai-storyboard-to-video', "render this
  storyboard", "turn my STORYBOARD.md into a video", "preview my video scenes", or
  has a STORYBOARD.md and scenes ready. A real render costs credits and is a
  deliberate manual step; the default output here is the free contact-sheet
  preview. HyperFrames is an external tool, consumed via npx, never vendored.
argument-hint: "[path to STORYBOARD.md, e.g. ./STORYBOARD.md]"
---

# butai Storyboard to Video

## What this does

Takes a **STORYBOARD.md** (a plain-markdown list of video frames: title,
duration, transition, the visual, the voiceover) together with the butai scene
kit, and helps you get from plan to video in two clearly separated steps:

1. A **free preview** that renders every scene as a themed thumbnail grid (a
   contact sheet), so you can see the whole sequence and check the look before
   spending anything.
2. The **real video render**, which you run yourself through HyperFrames. That
   step costs credits and time, so it is always a deliberate manual action, never
   something this skill triggers on its own.

The storyboard stays a portable, hand-editable markdown file. It is the
HyperFrames-native artifact and it is deliberately kept separate from butai's
JSON deck-outline storyboard.

## When to use

- The user has a STORYBOARD.md and wants to see or build the video.
- The user wants a quick, free visual check of a scene sequence.
- The user is ready to do a real render and wants the exact command and guardrails.

## The STORYBOARD.md shape

Frontmatter carries `format`, `message`, `arc`, `audience`. The body is a series
of frame sections. HTML comments carry research notes and are ignored by the
parser.

```md
---
format: 1080x1920
message: "One clear promise for the whole clip."
arc: Hook -> Reveal -> Proof -> CTA
audience: the people this is for
---

## Frame 1 - The hook

- status: outline
- duration: 3s
- transition_in: cut
- scene: Big kinetic type on a calm background; one accent word lands late.
- voiceover: "The one line that names the viewer's problem."

A short director's note in prose. Why this frame exists and how it should feel.

## Frame 2 - The reveal

- status: draft
- duration: 4s
- transition_in: crossfade
- scene: A framed placeholder panel punches in; a caption pays off underneath.
- voiceover: "The turn: what the viewer did not expect."
```

## Parsing a storyboard

Use `parseStoryboard` from `@butai/scene-kit` (the isomorphic root barrel; safe in
a browser bundle). It never throws: malformed input surfaces as `diagnostics`
rather than an exception, and a best-effort result still comes back.

```ts
import { parseStoryboard } from "@butai/scene-kit";

const board = parseStoryboard(markdownString);
// board.format / board.message / board.arc / board.audience
// board.scenes[] -> { index, title, durationSeconds, transitionIn, scene, voiceover, note, ... }
// board.diagnostics[] -> surface any warnings/errors to the user
```

Report the frame count, total duration (sum of `durationSeconds`), and any
diagnostics back to the user before doing anything expensive.

## Step 1 — Free preview (the contact sheet, no cost)

This is the cheap proxy for a render. It proves every scene paints and shows the
sequence in a chosen theme, using local headless screenshots. No network, no
credits, no mp4.

- **In the Studio:** open the `/video` route in `apps/studio`. It parses the
  storyboard, lays out one themed thumbnail per scene next to its frame metadata,
  and offers a theme switcher so you can see the sequence repaint.
- **From Node:** call `renderContactSheet` from `@butai/scene-kit/node` to write
  per-scene PNGs (and an optional grid) to a temporary, git-ignored directory.

```ts
import { renderContactSheet } from "@butai/scene-kit/node";

await renderContactSheet({ theme: "dark", outDir: "/tmp/butai-contact-sheet" });
```

Screenshots are not byte-stable across machines, so they are never committed.
Treat them as throwaway previews.

## Step 2 — Real render (manual, costs credits)

A real video render is done by the user's own HyperFrames install, invoked
through npx. HyperFrames is never vendored into this repo and never added as a
dependency; you only document the command the user runs.

The scene folder holds a HyperFrames config (the tool's own settings file) and the
frame documents. From that folder, the user runs, in order:

```bash
# lint the scene/config
HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes@<version> lint

# optional: cheap still snapshots at chosen timestamps
HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes@<version> snapshot -o slides --at 2.8,6.3,9.8

# the paid step: the actual video
HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes@<version> render -o out.mp4
```

Pin `<version>` to the version the user already uses. The `render` step is the
paid one (it can call an external rendering service and consume credits), so:

- **Never run `render` automatically.** Present the command; let the user run it.
- Treat a real render as a Morning-Queue / manual task, not an overnight
  automated step.
- If the user only wants to see the result, stop at the free contact-sheet
  preview.

## Guardrails

- HyperFrames is external, consumed via `npx hyperframes` only. Do not vendor its
  CLI, registry, config, or renderer source, and do not add it as a dependency.
- No paid render, no mp4, no credit spend triggered from here. The contact-sheet
  screenshot is the only rendering this skill performs.
- Keep storyboards and scenes personal-data-clean and trademark-clean: generic
  copy and `example.com`, no real names, handles, product names, or campaign
  lines.
- STORYBOARD.md (this video artifact) is distinct from butai's JSON deck-outline
  storyboard. Do not merge them or push STORYBOARD.md through the deck persistence
  layer.

## Non-goals

- No mp4 render, no credit spend, no external render service call from this skill.
- No vendoring HyperFrames or adding it as a dependency.
- No STORYBOARD.md editor or persistence loop (the Studio surface is read-only).
- No plugin manifest (that packaging is a later phase).
