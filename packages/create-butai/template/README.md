# __PROJECT_NAME__

A small slide deck built on butai. It runs in the browser with Vite, uses the
butai deck engine for slides and transitions, and can pull ready-made slide
designs straight into your code.

## What it does

You write slides as plain React components and the deck engine handles the
presentation: navigation, step-by-step reveals, themes, and print. Nothing is
hidden behind a hosted app — the deck is your own code, and you own every file.

## Run it

```bash
pnpm install     # or npm install
pnpm dev         # start Vite, open the printed URL
```

Then edit `src/App.tsx` to change the slides, and `src/main.tsx` to change the
theme.

## Add a ready-made slide

The starter ships a `butai.json` so the copy-in tool works out of the box. To
drop a designed slide (a cover, a stat row, a quote…) into your project:

```bash
npx butai add cover-slide
```

The tool copies the slide's source into your project — no black-box dependency.

## Under the hood

- `src/main.tsx` imports `@butai/deck/styles/engine.css` and one theme CSS from
  `@butai/themes` (each theme is scoped to `[data-theme="<id>"]`, so it stays
  inert until `<html data-theme>` matches). Switch themes by changing the import
  and the `data-theme` value.
- `src/App.tsx` renders `<SlideEngine>` with `<Slide>` children from
  `@butai/deck`.
- `butai.json` configures the copy-in registry and the import aliases the tool
  writes into copied files.
- **Local development against a butai checkout:** the two `@butai/*` deps are
  pinned to a published version range. To develop against a local workspace
  instead, swap them for `file:` or `link:` specs pointing at your checkout, or
  install the packed tarballs — then `pnpm install` again.
