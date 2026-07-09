---
name: Butai Docs — Page Design System
colors:
  bg: "#0F0F13"          # page canvas (near-black)
  panel: "#16161D"       # default card / panel surface
  nested: "#1C1D24"      # nested cards, chips, mock chrome, table zebra
  console: "#0A0B0D"     # darkest terminal / console surface
  ink: "#E9E9F2"         # primary text, headlines
  muted: "#8A8A9C"       # metadata, captions, eyebrows, de-emphasized labels
  grid: "#2A2A3A"        # hairline borders and dividers
  accent: "#60A5FA"      # primary accent: eyebrows, links, structure
  ok: "#3ECF8E"          # shipped · done · success
  warn: "#E0A52E"        # planned · todo · caution
  info: "#4C6EE6"        # neutral highlight · next · informational
  crit: "#EF4444"        # must · critical · removed · rejected
typography:
  display: "Space Grotesk"    # 500 weight, tight tracking, headlines
  body: "Inter"               # 400/600, running text
  mono: "SF Mono"             # 600/700, eyebrows, labels, code
spacing:
  wrap: "48px 28px 96px"
  gap: "14px"
  section: "44px"
components:
  header: "eyebrow (mono, uppercase, accent) + one tight display h1 with one accent word + a muted one-line sub + a meta row of date and status badges"
  eyebrow: "mono, 12px, uppercase, wide tracking; lead section takes accent, others muted"
  callout: "faint accent wash + 1px accent border; holds the one line that matters"
  card: "panel surface, hairline border, radius 16; a card-head title row with status badges + body + muted card-meta footer"
  grid: "cols-2 / cols-3 responsive card grids, collapse to one column on mobile"
  badge: "status pill; text = status color, background = same color at 14% alpha"
  metric: "counted stat card: a mono kicker + a big number in a status color + a caption"
  table: "full-width, hairline rows, uppercase-mono headers; two tinted compared columns"
  compare: "a pair grid of two sides; side.a warm tint (before/other), side.b green tint (after/ours)"
  decisions: "numbered list; a chip digit in the accent + a title + a muted rationale"
  steps: "counter chips down the left for a sequence; a flow variant is a horizontal pipeline of step cards"
  code: "a terminal window + a code viewer, hand-highlighted via span classes, no highlight.js"
  band: "full-bleed brand band, light ink on a tinted accent/green surface; the thesis or the close"
  footer: "a what's-next CTA band + a muted foot meta line; ends with forward momentum"
---

# Butai Docs — Page Design System

The shared design spec for the butai docs lane: framework-free, self-contained
HTML documents (briefs, reports, explainers) styled entirely by the token
contract. This is the single reference the doc patterns generalize; a theme
repaints every pattern by overriding the same contract variables.

## The canvas

- **Dark, flat, restrained color.** A near-black ground, light ink, hairline
  borders. Accent and status tints arrive in small doses, never as broad fills.
- **Monumental but compact type.** One tight display headline per document; the
  rest settles into 15px body and small uppercase mono labels.
- **Flat depth.** No drop shadows. Depth comes from surface alternation (canvas
  to panel to nested), hairlines, and the occasional full-width band.

## Color roles

Every color is a contract token, never a raw hex in component CSS.

- **Surfaces** step from the canvas up: ground, panel, nested. The console
  surface is the darkest, reserved for terminal and code mocks.
- **Ink** has two tiers: primary for headlines and body, muted for metadata and
  captions.
- **Accent** carries structure: eyebrows, links, the single payoff word.
- **Status** is standardized: ok (shipped, done), warn (planned, caution),
  info (next, neutral), crit (critical, removed). One scheme, used everywhere.

## Typography

- **Display** for the one hero headline, tight negative tracking.
- **Body** for running copy; drop to 15px immediately after the title.
- **Mono** uppercase with wide tracking for eyebrows, statuses, and labels only,
  never for prose.

## Rhythm

Open with a header (title, one-line summary, meta) then the thesis in a callout.
Pick components by intent: a comparison uses compare and a table; locked choices
use decisions; a process uses steps or a flow; a feel uses the code mock; the
thesis or the close uses a band. End with forward momentum, a what's-next band,
never a flat summary.

## Constraints

- **Self-contained.** Inline CSS, system-font fallback stacks, no external
  runtime dependencies, no CDN. Every pattern renders legibly offline.
- **Token-driven.** Themeable surfaces, ink, accent, and status use contract
  variables so a theme restyles the whole document without touching content.
- **Honest.** Placeholder frames over invented data; generic copy and
  example.com only.
