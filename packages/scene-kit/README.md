# @butai/scene-kit

A catalog of self-contained HTML video scenes you copy into your own project. Each
scene is a single framework-free page (a title card, a callout, an outro) that an
external renderer can turn into video frames.

## What it does

It ships a set of video scene templates described in a generated catalog. You pick
a scene by id and copy its source in with the butai CLI. Because each scene is
plain HTML and CSS with no framework, any renderer that can screenshot a page can
turn it into video.

## Install

```sh
pnpm add @butai/scene-kit
butai add <scene-id>
```

## Usage

Browse `catalog/catalog.md` for the available scenes, then copy the ones you want
in with `butai add`. A Node entry point (`@butai/scene-kit/node`) exposes the
catalog for tooling that needs to read scenes programmatically.

## Under the hood

- `catalog/catalog.json` and `catalog/catalog.md`: the generated scene catalog
  (regenerated with `pnpm gen`).
- `registry/index.json`: the copy-in registry the CLI resolves against.
- `src/`: the scene sources; `./node` exports the catalog readers.
- Depends on `@butai/patterns` and `@butai/themes`; the tarball ships `dist`,
  `src`, `catalog`, and `registry`.
