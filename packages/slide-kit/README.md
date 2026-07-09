# @butai/slide-kit

A catalog of ready-made slide layouts you copy into your own project. Instead of
importing a component you cannot edit, you pull the actual source of a slide
archetype into your codebase and own it from there.

## What it does

It ships a set of slide archetypes (a concept slide, an image-caption slide, a
speaker intro, and more) described in a generated catalog you can browse. You
pick one by id and copy its source in with the butai CLI, which also brings along
anything it depends on. The copied slide renders on the `@butai/deck` engine.

## Install

Install the kit so the CLI can read its registry, then copy slides in:

```sh
pnpm add @butai/slide-kit
butai add concept-slide
```

You do not import from this package at runtime. It is the source of the copy-in
registry the `butai add` command reads.

## Usage

Browse the catalog to find an archetype id, then add it:

```sh
butai add speaker-intro-slide image-caption-slide
```

Each id in `catalog/catalog.md` maps to a registry entry the CLI copies into the
aliases your `butai.json` defines.

## Under the hood

- `catalog/catalog.json` and `catalog/catalog.md`: the generated, human- and
  machine-readable list of archetypes (regenerated with `pnpm gen`).
- `registry/index.json`: the copy-in registry the CLI resolves against.
- `src/`: the archetype sources (`slides/`, `primitives/`, `styles/`).
- Style entry: `@butai/slide-kit/styles/index.css`.
- Peers on React 19; depends on `@butai/deck` and `@butai/patterns`.
