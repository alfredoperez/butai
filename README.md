# Butai 舞台

The stage for AI-crafted content. Butai gives you the reusable building blocks
for presentation decks, short-form videos, and self-contained HTML docs, plus a
set of Claude skills that assemble them into finished work.

It is distributed the shadcn way: a small set of engine packages you install
from npm, kits whose source you copy into your own project with a CLI, a Claude
Code skills plugin that drives them, and a demo site you can run locally to see
everything before you adopt it.

Authoring the actual content (writing an outline, arranging a storyboard) happens
in your own tooling and the skills, for example a personal Command Center app.
This repo ships the substrate: the packages, the kits, the skills, the CLI, and
the demo site. It does not bundle an authoring app.

## Quickstart

Install once from the repo root:

```sh
pnpm install
```

**Explore the demo site.** Run the read-only "play with butai" site and click
through its four surfaces (theme explorer, slide browser, video contact sheet,
doc gallery):

```sh
pnpm --filter studio dev
```

**Browse a demo deck.** The playground renders a real deck and a kit gallery at
`/kit`:

```sh
pnpm --filter playground dev
```

**Consume it in your own project.** Install the engine, scaffold a config, and
copy a slide in:

```sh
pnpm add @butai/deck @butai/themes
butai init          # writes a butai.json into your project
butai add concept-slide
```

For the full end-to-end walkthrough (install paths, the guided authoring skills,
the manual CLI flow, and switching themes), see
[docs/add-a-presentation.md](./docs/add-a-presentation.md).

**Drive it with the skills.** Install the `butai-skills` plugin (see
`plugins/butai-skills/README.md`) and invoke a skill by name, for example
`/butai-talk-plan` or `/butai-deck-compose`, to plan and assemble content against
the kits' catalogs.

## Monorepo map

- `packages/`: the engine, kits, and CLI:
  - `@butai/patterns`: the design-spec, token contract, and shared catalog types.
  - `@butai/themes`: the theme token sets and standalone theme CSS.
  - `@butai/deck`: the React slide engine (SlideEngine, Slide, useSlides, ThemePicker).
  - `@butai/slide-kit`: copy-in slide archetypes with a generated catalog and registry.
  - `@butai/scene-kit`: copy-in HTML video scenes with a catalog and registry.
  - `@butai/docs-kit`: copy-in HTML doc patterns with a catalog and registry.
  - `@butai/cli`: the `butai` command (`init` / `add` / `diff`).
  - `@butai/credits`: the internal generator that builds the upstream-credit ledger.
- `apps/`: local run targets:
  - `studio`: the read-only butai demo site (four explore surfaces, no authoring).
  - `playground`: a demo deck plus a `/kit` gallery.
- `plugins/butai-skills/`: the Claude Code plugin with the seven butai skills.
- `library/web/`: a GSAP motion recipe library and demo harness (internal).
- `_ops/`: the autonomous build's plan, state, journal, and verifier reports.

## License and credits

Butai is MIT licensed. See [LICENSE](./LICENSE). Every upstream source and its
license is recorded in [CREDITS.md](./CREDITS.md), generated from `sources.yml`.
