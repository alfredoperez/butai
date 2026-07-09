---
name: butai-theme-author
description: >
  Author a new, complete butai theme as a standalone, contract-valid
  [data-theme] CSS file — read TOKEN_CONTRACT from @butai/patterns for the exact
  token names to fill, study the 13 @butai/themes as convention exemplars, fill
  EVERY required token plus a distinctive display font, then validate the block
  with validateThemeTokens so it has zero missing tokens. Use when the user says
  '/butai-theme-author', "create a theme", "new theme", "make a <vibe> theme"
  (e.g. "a warm editorial theme", "a cyberpunk theme"), or wants to add a palette
  / color scheme for butai decks, scenes, and docs. Emits a standalone file — it
  never mutates the frozen @butai/themes package.
argument-hint: "<slug> \"<palette / vibe brief>\"  (e.g. harbor-dusk \"deep navy, coral accent, geometric\")"
---

# butai Theme Author

## What this does

Authors one complete butai theme and writes it as a standalone CSS file the user
can drop into their own project. A theme is a palette plus a distinctive display
font, expressed as a `[data-theme="<slug>"]` block that fills every token the
butai token contract requires. Because every butai surface — slides, scenes, and
HTML docs — reads the same contract variables, one authored theme repaints all of
them without touching their markup.

The whole point: a theme is **never partial**. If a required token is missing,
real surfaces break — badges go invisible, hover washes vanish. This skill fills
every required token and then proves it with the contract's own validator.

It emits a **standalone** theme file. It does **not** add a 14th theme to the
frozen `@butai/themes` package or edit that package's manifest — registering the
theme into a theme set is a documented user step, never an executed side effect.

## When to use

- The user wants a new palette / color scheme for butai decks, scenes, or docs.
- The user describes a vibe ("warm editorial", "cyberpunk", "calm clinical") and
  wants it as a reusable, restyleable theme.

## The flywheel: read the contract + the themes, never a hand checklist

The list of tokens a theme must fill is **not** hand-maintained here. It is the
generated token contract, so this skill never drifts as the contract evolves.
Resolve it per `../../CATALOG-RESOLUTION.md`:

- **The required token names** come from `TOKEN_CONTRACT` in `@butai/patterns`
  (prefer the installed package; fallback to
  `packages/patterns/src/tokens/contract.ts` in the monorepo). Read
  `TOKEN_CONTRACT.required` for the exact set to fill; `TOKEN_CONTRACT.recommended`
  for the font tokens; `TOKEN_CONTRACT.optionalPrefixes` for allowed extras.
- **The conventions** — how those tokens are conventionally filled (`-dim` alpha
  variants, the `--accent-glow` derivation, display-font pairing, theme-scoped
  heading rules) — come from the **13 `@butai/themes`** CSS files, read as
  exemplars (`THEMES` from `@butai/themes`, or `packages/themes/themes/*.css`).

The contract is the source of truth for *what tokens exist*; the themes are the
source of truth for *how they are conventionally filled*. Never hardcode a
variable checklist in this skill.

### The required tokens (confirm against `TOKEN_CONTRACT.required`)

At the time of writing the contract requires these — but read the live contract,
do not trust this copy:

- **Surface** — `--bg`, `--bg-card`, `--bg-nav`
- **Text** — `--text`, `--text-dim`
- **Accent** — `--accent`, `--accent-glow`, `--border`
- **Semantic** — `--red` / `--red-dim`, `--green` / `--green-dim`,
  `--yellow` / `--yellow-dim`, `--orange`, `--blue` / `--blue-dim`

Recommended (fill them too): `--font-display`, `--font-body`, `--font-mono`.
Optional extras must match an allowed prefix (e.g. `--grad-…`) or the validator
warns.

## Hard rules (the theme contract)

1. **Never partial.** Fill EVERY token in `TOKEN_CONTRACT.required`. A missing
   required token is a hard validation failure and breaks real surfaces.
2. **Standalone emit only.** Write a self-contained `.css` file. Do **not** edit
   the `@butai/themes` package, add a 14th theme file, or touch its `THEMES`
   manifest. Registration into a theme set is a documented user step (below).
3. **Style through the contract.** The block sets contract variables; do not
   invent new token names outside the contract's recommended set or optional
   prefixes.
4. **Validate before declaring done.** The block must produce zero `missing-token`
   diagnostics from `validateThemeTokens`.
5. **Personal-data-clean and trademark-clean.** No real names, handles, product
   names, proprietary font names, or campaign lines. Generic naming only. A
   forbidden-strings guard scans the whole plugin; violations fail.

## Steps

### 1. Choose palette + display font

From the user's brief, decide:

1. **Light or dark base.** This drives `--bg`, `--text`, and the `-dim` opacities.
2. **A cohesive palette.** One signature `--accent`, a readable `--text` on
   `--bg`, plus the semantic colors (`--red --green --yellow --orange --blue`)
   tuned to the palette's temperature — don't leave cold defaults on a warm theme.
3. **A distinctive display font.** Never a generic system sans for the headline —
   pick a face with character that fits the vibe, and always give it a system
   fallback stack so an offline render stays legible. Pair sensibly: serif display
   → sans body; bold sans display → clean sans body.

State the chosen palette + fonts back to the user in one line before writing.

### 2. Write the complete `[data-theme]` block

Fill every required token, deriving the conventional companions the way the
exemplar themes do:

- **`-dim` variants** — a low-alpha version of the solid, used by badges. Dark
  themes ~`0.15` alpha, light themes ~`0.10`. Either `rgba(r,g,b,.12)` or
  `color-mix(in srgb, var(--red) 12%, transparent)` — both patterns exist in the
  themes.
- **`--accent-glow`** — a translucent accent for hover washes / active nav
  backgrounds, e.g. `color-mix(in srgb, var(--accent) 16%, transparent)` (dark
  ~18–20%, light ~12–16%).
- **`--border`** — a hairline, usually a low-alpha of the text color.
- **Fonts** — set `--font-display`, `--font-body`, `--font-mono`, each with a
  system fallback.

Template (fill in real values):

```css
/* <Name> — <one-line vibe> (light|dark) */
[data-theme="<slug>"] {
  --bg: #______; --bg-card: #______; --bg-nav: #______;
  --text: #______; --text-dim: rgba(_,_,_,.6);
  --accent: #______; --accent-glow: color-mix(in srgb, var(--accent) 16%, transparent);
  --border: rgba(_,_,_,.14);
  --red: #______;    --red-dim: rgba(_,_,_,.12);
  --green: #______;  --green-dim: rgba(_,_,_,.12);
  --yellow: #______; --yellow-dim: rgba(_,_,_,.12);
  --orange: #______;
  --blue: #______;   --blue-dim: rgba(_,_,_,.12);
  --font-display: "<Display Font>", Georgia, serif;
  --font-body: "<Body Font>", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", monospace;
}
```

If the vibe wants a theme-scoped touch (serif headings, a soft card shadow),
mirror how an exemplar theme adds `html[data-theme="<slug>"] .slide h1 { … }`
rules after the token block — the same technique the paper/editorial themes use.

### 3. Validate against the contract (the gate)

Prove the block fills the contract before declaring done. Extract the tokens from
your CSS and run the contract validator:

```ts
import { extractThemes, validateThemeTokens } from "@butai/patterns";

const [{ tokens }] = extractThemes(cssString);
const diagnostics = validateThemeTokens(tokens);
const missing = diagnostics.filter((d) => d.code === "missing-token");
// missing.length === 0  → every required token is present
// any "unknown-token" warning → a stray variable outside the contract; remove or prefix it
```

There must be **zero `missing-token` diagnostics**. Resolve any `unknown-token`
warning (drop the stray variable or give it an allowed `--grad-` prefix) before
finishing.

**Contrast gate:** `--text` and `--text-dim` must be comfortably readable on
`--bg`, and `--accent` must clearly stand out on `--bg`. If anything is muddy,
adjust the hex and re-validate.

### 4. Save + document registration (do not execute it)

1. Save the block as a standalone `<slug>.css` in a location the user names
   (e.g. a `themes/` dir in their own project). Do not write into `@butai/themes`.
2. Report the saved path, and **document** — without performing — how a user who
   wants this theme in their own set would register it: drop the `.css` file
   alongside their themes and add a matching entry to their theme manifest
   (`{ id, label, mode, file }`, the shape `THEMES` uses). This is a user step, a
   future `butai add <theme>` CLI enhancement — never an edit this skill makes to
   the frozen package.

## Quality checklist

- [ ] Read `TOKEN_CONTRACT.required` for the token names (no hand checklist)
- [ ] Studied the 13 `@butai/themes` as convention exemplars
- [ ] Palette + distinctive display font chosen and stated
- [ ] `[data-theme="<slug>"]` block fills EVERY required token + the font tokens
- [ ] `-dim`, `--accent-glow`, `--border` derived per the exemplar conventions
- [ ] `validateThemeTokens` returns zero `missing-token`; no stray `unknown-token`
- [ ] Contrast gate passes (`--text` / `--text-dim` on `--bg`, `--accent` stands out)
- [ ] Saved as a standalone `<slug>.css`; `@butai/themes` untouched
- [ ] Registration documented as a user step, not executed
- [ ] Personal-data-clean + trademark-clean

## Non-goals

- No editing `@butai/themes` — no 14th CSS file, no `THEMES` manifest entry. The
  package stays frozen at its 13 themes; this skill emits a standalone file.
- No hand-maintained variable checklist — read `TOKEN_CONTRACT`.
- No app-specific selector wiring, screenshot scripts, or dev-server assumptions.
- No generic system sans as the display font (defeats the purpose).
- No personal, product, proprietary, or campaign content; generic naming only.
