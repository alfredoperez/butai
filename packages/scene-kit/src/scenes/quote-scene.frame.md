---
name: Quote — Studio Dark
colors:
  bg: "#0F0F13"          # near-black ground
  panel: "#16161D"       # reserved card surface
  grid: "#2A2A3A"        # blueprint hairline
  ink: "#E9E9F2"         # the quote text
  muted: "#8A8A9C"       # attribution
  accent: "#60A5FA"      # the quotation mark / role — the single payoff
typography:
  display: "Archivo"          # 800 weight, the pull quote
  body: "Inter"               # fallback running text
  mono: "JetBrains Mono"      # the attribution line
spacing:
  pad: "140px 90px"
  gap: "56px"
components:
  mark: "display 800, 240px, accent, tight line-height, the opening quote glyph"
  quote: "display 800, 96px, balanced, tight negative tracking"
  attr: "mono, 30px, uppercase, letter-spacing .16em, muted with accent role"
---

# Quote — Studio Dark

A large pull-quote with attribution. The oversized opening quotation mark takes
the accent as the single payoff; the quote is display, the credit is quiet mono.
Generic quote only, no personal or product refs.

## The Frame

- **The quote is the whole frame.** Centered, balanced, generous padding — calm,
  not busy.
- **One accent payoff:** the quotation mark (and the attribution role) carry the
  accent; nothing else competes.

## Typography

- **Display** for the mark and the quote body.
- **Mono** uppercase with wide tracking for the attribution.

## Motion feel

- The mark pops in first, then the quote rises and settles, then the attribution
  lands a beat later. Firm eases, no overshoot.
- Respect reduced-motion: the resting frame is fully legible with motion off.

## Do

- Keep the quote short enough to read in one beat.
- Let whitespace do the work; no decoration around the quote.

## Don't

- No real attributed quotes from personal sources. No two accent colors.
- No bouncy motion. No em dashes in on-screen copy.
