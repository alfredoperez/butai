# @butai/docs-kit

A catalog of HTML document patterns you copy into your own project. Each pattern
is a piece of a self-contained doc (a brief, a report, an explainer) you can
compose and style with a butai theme.

## What it does

It ships a set of doc patterns described in a generated catalog. You pick the
patterns you want by id and copy their source in with the butai CLI, then style
the page with a theme. The result is a framework-free HTML document you can open
anywhere.

## Install

```sh
pnpm add @butai/docs-kit
butai add <pattern-id>
```

## Usage

Browse `catalog/catalog.md` for the available doc patterns, then copy them in with
`butai add`. A Node entry point (`@butai/docs-kit/node`) exposes the catalog for
tooling that reads patterns programmatically.

## Under the hood

- `catalog/catalog.json` and `catalog/catalog.md`: the generated pattern catalog
  (regenerated with `pnpm gen`).
- `registry/index.json`: the copy-in registry the CLI resolves against.
- `src/`: the pattern sources; `./node` exports the catalog readers.
- Depends on `@butai/patterns` and `@butai/themes`; the tarball ships `dist`,
  `src`, `catalog`, and `registry`.
