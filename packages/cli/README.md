# @butai/cli

The `butai` command. It is how you pull kit source into your own project and keep
track of it afterward, the copy-in step that makes butai a shadcn-style
distribution rather than a locked dependency.

## What it does

It does three things. It sets up a config in your project, it copies a kit item
(and everything that item depends on) into your source tree, and it later tells
you whether your local copy has drifted from the registry version. The source it
copies is yours to edit.

## Install

```sh
pnpm add @butai/cli
```

This provides the `butai` binary.

## Usage

```sh
butai init                 # write/merge a butai.json into your project
butai add concept-slide    # copy a registry item's source (and its closure) in
butai diff concept-slide   # show drift between your local copy and the registry
```

Useful flags:

- `init`: `--yes`, `--force`, `--registry <spec>`, `--alias-base <base>`,
  `--import-extensions`, `--no-tsx`.
- `add`: `--overwrite`, `--backup`, `--dry-run`.
- `diff`: `--quiet`.
- Global: `--cwd <dir>`, `-h`/`--help`, `-v`/`--version`.

## Under the hood

- Binary: `butai` maps to `dist/cli.js`.
- Hand-rolled arg parsing, no CLI framework; runtime deps are `yaml` plus Node
  builtins only.
- `init` writes a `butai.json` (registry location, tsx toggle, aliases, import
  extensions); `add` resolves the registry closure and rewrites imports to your
  aliases; `diff` compares your copy against the registry.
- The published tarball ships `dist` only.
