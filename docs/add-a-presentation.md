# Add a presentation

A step by step walkthrough for building a new slide deck in your own project with butai.

## What you get

A real React/TSX presentation that you own. Butai gives you three pieces that fit together:

- **The engine** (`@butai/deck`): a small set of React components that turn a list of slides into a keyboard navigable deck, with transitions, backgrounds, chapter tracking, and a theme picker.
- **The slides** (`@butai/slide-kit`): a catalog of ready made slide layouts (a cover, a concept explainer, a stat row, a comparison table, and more). You do not import these. You copy their source into your project with a CLI and edit them freely.
- **A theme** (`@butai/themes`): the colors, type, and spacing. Butai ships thirteen themes. You pick one, and it repaints the whole deck without touching a single slide.

The result is a folder in your project with an `index.tsx` deck, some copied in slide components, and one theme applied. Nothing is locked behind a dependency you cannot change.

## Prerequisites and install

You need a React 19 project with a bundler that understands TypeScript and path aliases (Vite is the common choice). There are two install paths. Pick the one that matches where the packages are today.

### Path A: Published (once `@butai/*@beta` is on npm)

Add the packages from your package manager:

```sh
yarn add @butai/deck@beta @butai/themes@beta @butai/slide-kit@beta @butai/cli@beta
# or: pnpm add @butai/deck@beta @butai/themes@beta @butai/slide-kit@beta @butai/cli@beta
# or: npm install @butai/deck@beta @butai/themes@beta @butai/slide-kit@beta @butai/cli@beta
```

`@butai/deck` needs `react` and `react-dom` 19 as peers, so install those too if your project does not already have them.

Then install the Claude Code skills plugin from the public marketplace:

```sh
claude plugin marketplace add <the public butai repo or marketplace URL>
claude plugin install butai-skills@butai
```

The first line registers the butai marketplace; the second pulls in the single `butai-skills` plugin, which carries the guided authoring skills.

### Path B: Local / unpublished (works today)

Nothing is on npm yet, so you vendor the packages as tarballs. This is exactly how the real consumers work today (see `consumer-proof/` in this repo for a worked example).

From a checkout of this repo, pack each package you need:

```sh
pnpm --filter @butai/deck pack
pnpm --filter @butai/themes pack
pnpm --filter @butai/patterns pack
pnpm --filter @butai/slide-kit pack
pnpm --filter @butai/cli pack
```

Each `pack` writes a `.tgz` tarball. Copy the five tarballs into a `vendor/butai/` folder in your own project. Include `@butai/patterns`: it is a transitive dependency of the others, so you need it pinned even though you never import it directly.

Add them as `file:` dependencies in your `package.json`:

```json
{
  "dependencies": {
    "@butai/deck": "file:vendor/butai/butai-deck-0.0.1.tgz",
    "@butai/themes": "file:vendor/butai/butai-themes-0.0.1.tgz",
    "@butai/slide-kit": "file:vendor/butai/butai-slide-kit-0.0.1.tgz",
    "@butai/cli": "file:vendor/butai/butai-cli-0.0.1.tgz"
  }
}
```

Then pin every `@butai/*` to the tarball in your package manager's overrides block, so the packages' own internal `@butai/*` dependencies also resolve to the tarballs instead of a registry. For pnpm use `pnpm.overrides`; for yarn use `resolutions`; for npm use `overrides`:

```json
{
  "pnpm": {
    "overrides": {
      "@butai/deck": "file:vendor/butai/butai-deck-0.0.1.tgz",
      "@butai/themes": "file:vendor/butai/butai-themes-0.0.1.tgz",
      "@butai/patterns": "file:vendor/butai/butai-patterns-0.0.1.tgz",
      "@butai/slide-kit": "file:vendor/butai/butai-slide-kit-0.0.1.tgz",
      "@butai/cli": "file:vendor/butai/butai-cli-0.0.1.tgz"
    }
  }
}
```

Then install (`pnpm install` / `yarn` / `npm install`).

For the skills plugin, point the marketplace at your local checkout of this repo instead of a public URL:

```sh
claude plugin marketplace add ~/dev/GitHub/butai
claude plugin install butai-skills@butai
```

## Set up the project

Scaffold the butai config in your project root:

```sh
butai init          # or: npx butai init --yes
```

This writes a `butai.json`. It is idempotent: re running it fills in missing defaults without clobbering anything you hand edited (pass `--force` to reset). The file looks like this:

```json
{
  "$schema": "https://butai.dev/schema/butai.json",
  "registry": "file:node_modules/@butai/slide-kit/registry",
  "tsx": true,
  "aliases": {
    "slides": "@/components/butai/slides",
    "primitives": "@/components/butai/primitives",
    "styles": "@/styles/butai"
  },
  "importExtensions": false
}
```

What each field means:

- **`registry`**: where the CLI reads slide archetype source from. The default points at the `@butai/slide-kit` package you installed. Override it with `--registry <spec>`.
- **`aliases`**: where copied in code lands, expressed as import aliases. `slides` and `primitives` are the component destinations; `styles` is the CSS destination. The CLI resolves these against your `tsconfig.json` `paths` (for example `@/*` mapped to `./src/*`), so make sure your tsconfig has that mapping. Set all three from one base with `--alias-base @/components/butai`.
- **`tsx`**: whether your project uses `.tsx` (the default) or `.jsx`. Pass `--no-tsx` for JSX.
- **`importExtensions`**: whether rewritten imports keep a `.js` extension. Leave it `false` for a normal Vite project; set it `true` (`--import-extensions`) only for NodeNext style consumers.

## Author the deck: the guided flow (recommended)

The fastest path is to let the Claude Code skills drive it. The skills are optional (you can do everything by hand, see the next section), but they read the live slide catalog for you and wire the deck up correctly.

**Step 1: outline the talk.**

```
/outline
```

It runs a short discovery (purpose, length, how ready your content is, and whether the deck is speaker led or reading first), then drafts a structured outline whose visual beats map to real archetypes read from the slide-kit catalog. It shows you the outline, waits for your sign off, and saves it to a location you name (for example `talks/my-talk.md`). It plans only. It does not build slides yet.

**Step 2: compose the deck.**

```
/create talks/my-talk.md
```

It reads the outline, picks the matching archetypes from the catalog, runs `butai add` to copy each one into your project, wires them into a `SlideEngine`, applies a theme, and writes the finished deck to a folder you name (for example `src/slides/my-talk/`). Screenshot beats become labeled placeholders so you can drop the real images in later.

When both skills finish you have a working deck folder, no hand wiring required.

## Author the deck: the manual CLI flow

If you would rather build it by hand, do the two steps yourself.

**Step 1: copy the archetypes in.** Pick archetype ids from the slide-kit catalog (`concept-slide`, `stat-row-slide`, `comparison-table-slide`, and so on) and copy their source into your project:

```sh
butai add cover-slide concept-slide stat-row-slide demo-cue-slide
```

`butai add` copies each archetype's source, plus anything it depends on, into the `slides` / `primitives` / `styles` locations your `butai.json` aliases point at, rewriting imports to those aliases. Useful flags: `--dry-run` to preview the plan without writing, `--overwrite` to replace files that already exist, `--backup` to keep a `.bak` when overwriting. Later, `butai diff <item>` tells you whether your local copy has drifted from the registry version.

**Step 2: wire the deck.** Create `src/slides/my-talk/index.tsx`. Import `SlideEngine` and `Slide` from the engine, import the archetypes you copied in from your own slides alias, and fill their props with your content:

```tsx
import { SlideEngine } from "@butai/deck";
import { CoverSlide } from "@/components/butai/slides/cover-slide";
import { ConceptSlide } from "@/components/butai/slides/concept-slide";
import { StatRowSlide } from "@/components/butai/slides/stat-row-slide";

export function MyTalk() {
  return (
    <SlideEngine title="My Talk" transition="slide" chapterBar>
      {/* ===== ACT 1: THE HOOK ===== */}
      <CoverSlide
        miniHeader="Example Conf · 2026"
        title={<>Ship Faster, <span className="c-accent">Break Less</span></>}
        subtitle="A practical guide to shipping with confidence."
      />

      {/* ===== ACT 2: THE IDEA ===== */}
      <ConceptSlide
        title="One idea that has to land"
        body="Explain it in a sentence, then show it."
      />
      <StatRowSlide
        stats={[
          { value: "3x", label: "faster" },
          { value: "40%", label: "fewer defects" },
        ]}
      />
    </SlideEngine>
  );
}
```

The exact prop shape for each archetype is in the catalog (`packages/slide-kit/catalog/catalog.md`, or `node_modules/@butai/slide-kit/catalog/catalog.md` once installed): every entry ships a copy ready snippet.

**Step 3: load the CSS and pick a theme.** The engine and slides carry structure; a theme carries the paint. In your app entry (for example `src/main.tsx`), import the engine CSS, the slide-kit CSS, and exactly one theme, then set `data-theme` so the theme (which is inert until the attribute matches) turns on:

```tsx
import { createRoot } from "react-dom/client";

import "@butai/deck/styles/engine.css";
import "@butai/slide-kit/styles/index.css";
import "@butai/themes/themes/aurora.css";

import { MyTalk } from "./slides/my-talk";

document.documentElement.setAttribute("data-theme", "aurora");

createRoot(document.getElementById("root")!).render(<MyTalk />);
```

`@butai/deck` never imports a theme itself, so importing one theme and setting `data-theme` to its id is what styles the deck.

## Run it

Butai does not ship an app to run your deck in. You run it in your own project's dev server. With Vite that is:

```sh
yarn dev          # or: pnpm dev / npm run dev
```

Open the URL it prints and click (or arrow key) through the slides.

## Switch themes

There are thirteen themes: `atelier`, `aurora`, `blueprint`, `brand`, `brutalist`, `dark`, `glassmorphism`, `light`, `marker`, `midnight-coral`, `neon`, `stage`, and `warm-noir`. To switch, change the imported theme CSS and the `data-theme` value to match:

```tsx
import "@butai/themes/themes/neon.css";
// ...
document.documentElement.setAttribute("data-theme", "neon");
```

Because the slides are authored in the theme's token contract (accent, status colors, spacing) rather than hardcoded hex, the whole deck repaints. You do not edit any slide to change the look.

## Moving to another computer

The **published path** (Path A) is what makes a second machine clean. The packages come from npm and the skills plugin comes from a public or shared marketplace, so a fresh `install` plus `claude plugin install butai-skills@butai` is all it takes. Your deck source is just files in your repo.

The **local path** (Path B) does not travel on its own. The other machine needs the vendored tarballs (commit `vendor/butai/` into your repo, or re pack them there) and a local checkout of this repo for the skills plugin marketplace. Until the packages are published, prefer committing the tarballs so a teammate can install without rebuilding them.
