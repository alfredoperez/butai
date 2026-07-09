# Catalog resolution

Every butai skill that maps its output to real archetypes, tokens, or patterns
reads a **generated catalog** rather than a hand-maintained table. This is the
flywheel: the catalog is the single source of truth, so a skill never drifts as
a kit regenerates.

## The problem

An installed plugin runs in **your** project, not in the butai monorepo. A
repo-relative path like `packages/<kit>/catalog/catalog.json` only resolves
inside butai's own checkout. In a consumer project that folder does not exist.

## The convention

Each skill resolves its catalog in this order:

1. **Prefer the installed package.** Read
   `node_modules/@butai/<kit>/catalog/catalog.json`, or import the package's
   metadata barrel:
   - `import { SLIDES } from "@butai/slide-kit"`
   - `import { PATTERNS } from "@butai/docs-kit"`
   - `import { TOKEN_CONTRACT, validateThemeTokens } from "@butai/patterns"`
   - `import { THEMES } from "@butai/themes"`

   The catalog ships inside each kit's published `files` array
   (`["dist","src","catalog","registry"]`), so it travels with the npm package
   and resolves under `node_modules` in any consumer that installed the kit.
   This copy is always current — never bundled, never stale.

2. **Fallback to repo-local.** When running **inside the butai monorepo**, where
   a kit may not be built into `node_modules` yet, read
   `packages/<kit>/catalog/catalog.json`.

The plugin ships **zero** catalog copies. A consumer installs the relevant
`@butai/*` kit alongside the plugin, and the skill reads that kit's catalog.

## Per-skill map

| Skill | Catalog it reads | Barrel / path |
|---|---|---|
| `/outline` | slide-kit catalog | `@butai/slide-kit` `catalog/catalog.json` / `SLIDES` |
| `/create` | slide-kit catalog + registry (for `butai add`) | `@butai/slide-kit` `catalog/` + `registry/` |
| `/create-theme` | token contract + themes | `@butai/patterns` `TOKEN_CONTRACT` + `@butai/themes` `THEMES` / `themes/*.css` |
| `/create-doc` | docs catalog | `@butai/docs-kit` `catalog/catalog.json` / `PATTERNS` |
| `/create-scene` | scene-kit catalog | `@butai/scene-kit` `catalog/catalog.json` |
| `/storyboard` | scene-kit catalog + STORYBOARD.md | `@butai/scene-kit` (`parseStoryboard`) |
