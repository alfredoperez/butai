# @butai/patterns

The shared vocabulary the rest of butai is built on. It defines what a design
spec looks like, the contract every theme's tokens must satisfy, and the catalog
types the kits generate. If the other packages are the actors, this is the
script they all read from.

## What it does

Every butai kit describes its building blocks as a catalog, and every theme is a
set of tokens. This package is where those shapes are defined once, so a slide
kit, a theme, and a skill all agree on the same structure. It also validates that
a theme fills every token the contract requires, so a theme is never half-done.

## Install

```sh
pnpm add @butai/patterns
```

## Usage

```ts
import { parseDesignSpec, validateThemeTokens, TOKEN_CONTRACT } from '@butai/patterns';

const spec = parseDesignSpec(rawYaml);
const diagnostics = validateThemeTokens(themeTokens);
```

A Node-only entry point is available at `@butai/patterns/node` for tooling that
reads specs from disk.

## Under the hood

- Main exports: `parseDesignSpec`, `TOKEN_CONTRACT`, `extractThemes`,
  `tokensFromSpec`, `validateThemeTokens`, `catalogVersion`, and the shared types
  `Catalog`, `DesignSpec`, `Diagnostic`, `PatternMeta`.
- Two entry points: `.` (isomorphic) and `./node` (filesystem readers).
- Source lives under `src/` (`spec/`, `tokens/`, `catalog/`); the published
  tarball ships the compiled `dist/`.
