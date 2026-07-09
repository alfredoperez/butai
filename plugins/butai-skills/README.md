# butai-skills

A Claude Code plugin that bundles the butai content skills — the tools that help
you plan a talk, author a theme, compose a slide deck, write an HTML doc, build
scenes for video, and keep the project's upstream credits current. Install it
once and all seven skills become available in Claude Code, ready to invoke by
name.

Each skill is a set of instructions Claude follows. None of them run code on
their own — they read a butai kit's **generated catalog** and guide Claude to
produce output that maps to real, current building blocks. That is the flywheel:
the catalog is the single source of truth, so a skill never drifts as a kit
regenerates. See [CATALOG-RESOLUTION.md](./CATALOG-RESOLUTION.md) for how a
skill finds its catalog once it is installed in your project.

## The seven skills

- **/outline** — plans and outlines a talk. Asks a few questions about
  purpose, length, and content, then drafts a structured outline whose visuals
  map to real slide archetypes, and hands off to `/create`.
- **/create-theme** — authors a complete theme. Fills every token the
  contract requires (never a partial theme), validates the result, and emits a
  standalone CSS file you can drop into your own project.
- **/create** — composes a React/TSX slide deck from an outline. Picks
  archetypes from the slide catalog, wires them to the butai deck engine, and
  copies each one in through the butai CLI.
- **/create-doc** — writes a self-contained, framework-free HTML document (a
  brief, report, or explainer) by composing the doc patterns and styling the
  page through a butai theme.
- **/create-scene** — authors a single framework-free HTML scene (a title
  card, callout, code, quote, or outro) that an external renderer later turns
  into video.
- **/storyboard** — turns a storyboard into a set of scene files
  plus a browser preview, ready for a real video render through your own
  external render tool.
- **/sync-upstreams** — reviews the project's upstream credits ledger,
  reading each source from it at run time, and reports what changed upstream since
  each was last checked, proposing what might be worth adopting. It proposes only;
  a human decides.

## Install

The plugin ships with butai as a local marketplace. From a checkout of this
repo:

```
claude plugin marketplace add .
claude plugin install butai-skills@butai
```

`claude plugin marketplace add .` registers the marketplace defined at
`.claude-plugin/marketplace.json` (repo root); the install line pulls the single
`butai-skills` plugin from it. Installing copies the plugin's `skills/` folder
into Claude Code's plugin cache, so all seven skills resolve there.

Once this repo is public, an external consumer installs the same plugin straight
from git, without a local checkout, by pointing the marketplace at a
`git-subdir` source:

```json
{
  "source": "git-subdir",
  "url": "https://github.com/<owner>/<repo>",
  "path": "plugins/butai-skills",
  "ref": "main"
}
```

## Using a skill

After install, invoke a skill by its name, for example `/outline` or
`/create-doc`, or just describe what you want — each skill's description
carries the natural-language triggers Claude uses to pick it automatically.

The catalog-reading skills expect the matching butai kit to be installed in your
project so they can read its catalog (for example `@butai/slide-kit` for
`/outline` and `/create`, `@butai/patterns` and `@butai/themes`
for `/create-theme`). The resolution order — installed package first,
repo-local fallback — is documented in
[CATALOG-RESOLUTION.md](./CATALOG-RESOLUTION.md).

## Versioning

The plugin version lives in both `.claude-plugin/plugin.json` and the
marketplace entry, and the two must match. Bump both on every release. This
phase ships `0.1.0` from a private repo; no package is published yet.

## Under the hood

- `.claude-plugin/plugin.json` — the plugin manifest (name, version, description,
  keywords). Skills are auto-discovered from `skills/`; there is no explicit list
  to maintain.
- `skills/<name>/SKILL.md` — one folder per skill. The folder name is the
  invocation suffix, so it always equals the skill's frontmatter `name`.
- `.claude-plugin/marketplace.json` (repo root) — lists this single plugin and
  points at `./plugins/butai-skills`.
- `src/plugin.manifest.test.ts` — validates the manifest, the marketplace entry,
  and that all seven skills resolve with a frontmatter `name` matching their
  folder.
- `src/plugin.guard.test.ts` — scans the whole packaged surface for personal or
  proprietary strings, so nothing private ships in the public plugin.

Both tests are plain Node plus a YAML parser — no network, no external CLI — so
they run wherever the workspace test suite runs.
