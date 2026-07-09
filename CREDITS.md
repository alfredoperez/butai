<!-- generated from sources.yml by @butai/credits — do not edit by hand -->

# Credits

Butai stands on other people's work, and this file is the honest account of it: the code we vendored, the ideas we were inspired by, the runtime libraries we depend on, the external tools we call, and our own prior work. It is generated from `sources.yml` (edit there, not here). The **Excluded** section at the end is the point of the license review — it records the non-free things we looked at and deliberately did NOT ship, and why.

## Vendored (copied in)

### [shadcn/ui](https://ui.shadcn.com) — MIT

UI primitives (button, card, input, badge) for the Studio surface, hand-copied as MIT source in the "new-york" style. Adopted P4. Last checked 2026-07-07.

Source: https://github.com/shadcn-ui/ui

_Hand-vendored per phase-4 §0.2 with NO `npx shadcn` network call; each primitive at apps/studio/src/components/ui/*.tsx carries a provenance header naming the MIT source. Its small utility deps (class-variance-authority, clsx, tailwind-merge) ride along under this entry rather than earning separate rows._

## Inspired by

### [frontend-slides](https://github.com/zarazhangrui/frontend-slides) — UNVERIFIED

The stepped-deck engine concept plus two CSS motion ideas (the print reveal and the cinematic "unfocus into view"), reimplemented from scratch — no theme code taken. Adopted P1. Last checked 2026-07-07.

_Evidence: packages/deck/styles/engine.css headers ("Extracted from the upstream presentation app's base.css", "Ported concept from frontend-slides", "cinematic 'unfocus into view' — ported from frontend-slides"). NO theme code ported from here — its two theme packs are EXCLUDED (see frontend-slides-theme-presets and bold-template-pack). License is UNVERIFIED; because no upstream code ships (only the concept and two reimplemented CSS motions), it is not a distribution risk, but the concept-level borrow is FLAGGED for the public-flip review._

### [GSAP recipe reference (first-party prior art)](./library/web/README.md) — Own prior work

The recipe-catalog structure and the preserved recipe ids (svg-01-…, t-09-…, ui-13-…, adv-05-…), reworked here one-file-per-recipe for the motion library. Adopted P1. Last checked 2026-07-07.

_Evidence: library/web/README.md — the maintainer's own prior deck-native GSAP recipe reference (itself harvested from an 84-entry GSAP prompt library), restructured here. Recipe ids are preserved; the snippets are short GSAP API idioms, low copyright risk. FLAG for the public-flip review: whether to name the maintainer's personal domain as the precise first-party source (recorded internally in _ops/GAPS.md) or keep this generic "first-party prior art" wording in the public CREDITS.md._

## Runtime dependencies

### [GSAP (GreenSock core)](https://gsap.com) — GreenSock Standard "No Charge" License

The free GSAP core — the runtime behind the motion recipe library. Adopted P1. Last checked 2026-07-07.

Source: https://github.com/greensock/GSAP

_gsap ^3.12.5 in library/web/package.json. Secondary relationship — inspired-by: the ~57 recipe idioms in library/web/recipes/** are short GSAP API patterns. Only the free CORE ships; the Club GreenSock plugins (DrawSVG, MorphSVG, Physics2D, SplitText) are EXCLUDED (see greensock-club-plugins)._

### [Lucide (lucide-react)](https://lucide.dev) — ISC

The icon set used across the Studio navigation and controls. Adopted P4. Last checked 2026-07-07.

Source: https://github.com/lucide-icons/lucide

_lucide-react ^0.468.0 in apps/studio; part of the adopted shadcn Studio surface._

### [Radix UI](https://www.radix-ui.com) — MIT

The @radix-ui/react-slot primitive that underpins the vendored shadcn Button (Slot). Adopted P4. Last checked 2026-07-07.

Source: https://github.com/radix-ui/primitives

_shadcn/ui's peer primitive; @radix-ui/react-slot ^1.1.0 in apps/studio/package.json. Earns a row because it is tied to the adopted shadcn story, not merely a transitive lib._

### [Tailwind CSS](https://tailwindcss.com) — MIT

The utility-CSS engine (v4) behind the Studio's shadcn surface. Adopted P4. Last checked 2026-07-07.

Source: https://github.com/tailwindlabs/tailwindcss

_tailwindcss ^4.0.0 + @tailwindcss/vite in apps/studio; the styling layer of the adopted shadcn Studio surface._

## External tools

### [HyperFrames](https://www.npmjs.com/package/hyperframes) — External tool (proprietary; not adopted code)

The external video-render tool the storyboard-to-video skill invokes for the real render — run through the user's own install via `npx hyperframes`. Adopted P5. Last checked 2026-07-07.

_Evidence: plugins/butai-skills/skills/butai-storyboard-to-video/SKILL.md — "HyperFrames is an external tool, consumed via npx, never vendored." It is a tool dependency the user runs themselves, not code adopted into the repo and not an npm dependency._

## Our own work

### [Butai themes](./packages/themes/THEMES-PROVENANCE.md) — MIT

The 13 shipped presentation themes — 9 originals ported from our own prior presentations app plus 4 authored fresh for butai (blueprint, atelier, stage, marker). Adopted P1. Last checked 2026-07-07.

_Originality gate documented per-theme in packages/themes/THEMES-PROVENANCE.md (file headers, author-voice comments, first-party git history). NONE come from the excluded third-party packs; src/themes.test.ts enforces that no excluded string or selector ships._

## Excluded (considered, not shipped)

### [bold-template-pack (34 themes) + its primitives.css devices](https://github.com/zarazhangrui/frontend-slides) — UNVERIFIED

The 34-template frontend-slides-bold.css pack AND the primitives.css signature devices (hard-offset shadows, sticker borders, Win95 bevels). **Why excluded:** Third-party pack with an unverified license — never ported. The original license flag was dissolved by authoring our own themes instead; primitives.css and base.css were deliberately NOT ported (base.css @imports the excluded aggregators). The one exception, midnight-coral, was generated by our own create-theme skill and is credited under butai-themes, not here.

_Evidence: packages/themes/THEMES-PROVENANCE.md + _ops/GAPS.md [P1/GroupC], [P3/GroupA]._

### [frontend-slides theme presets (12)](https://github.com/zarazhangrui/frontend-slides) — UNVERIFIED

The 12-preset frontend-slides.css theme pack (bold-signal, electric-studio, creative-voltage, dark-botanical, and 8 more). **Why excluded:** Bulk third-party theme pack with an unverified license — treated as not ours and never ported. The 12 excluded [data-theme] blocks are named in packages/themes/THEMES-PROVENANCE.md; src/themes.test.ts forbids any "frontend-slides" string or excluded selector from shipping.

_Evidence: packages/themes/THEMES-PROVENANCE.md "EXCLUDE — 46 third-party bulk imports" section._

### [Club GreenSock plugins (DrawSVG, MorphSVG, Physics2D, SplitText)](https://gsap.com/pricing/) — Club GreenSock (commercial, not freely redistributable)

SVG draw/morph and physics motion plugins referenced by the GSAP recipe idioms. **Why excluded:** Non-free — requires paid Club GreenSock membership; shipping it via copy-in would distribute a non-redistributable dependency. The recipe docs reference the idioms as metadata (library/web/catalog/catalog.md lists engine: gsap/DrawSVG|MorphSVG|Physics2D) but NO Club code is vendored; the slide archetypes that imported them (gsap-showcase, diagram-slide, fill-chart-slide) were excluded at P3.

_Evidence: _ops/GAPS.md [P3/GroupA] "EXCLUDED gsap business-plugin slides"._

### [Proprietary house design system (layout conventions only)](./packages/docs-kit/src/docs-kit.guard.test.ts) — Proprietary (professional access; not adopted, nothing shipped)

Generic page/section LAYOUT conventions (hero, section-header, metric-grid, timeline, comparison) that informed the docs-kit doc-pattern scaffolds — structure only, no visual expression. **Why excluded:** A proprietary house design system the maintainer has professional access to informed the docs-kit doc-pattern LAYOUT scaffolds. NOTHING proprietary ships: the docs-kit provenance guard (packages/docs-kit/src/docs-kit.guard.test.ts) enforces that no proprietary palette, font, product name, or copy crosses into the kit — only generic, unprotectable layout structure was generalized. Disclosed here for ledger completeness, by parity with the frontend-slides concept-borrow row. PUBLIC-FLIP REVIEW: decide whether to name it precisely, keep this generic wording, or drop the reference entirely before going public.

_Evidence: packages/docs-kit/src/docs-kit.guard.test.ts header ("generalized from a proprietary-derived house design system"). Surfaced by the phase-8 verifier's independent provenance sweep (_ops/feedback/phase-8-iter-1.md, MAJOR finding) as a ledger-consistency gap vs the frontend-slides inspired-by row; resolved in iter-2 as a non-naming disclosure._
