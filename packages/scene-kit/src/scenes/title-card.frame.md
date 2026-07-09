---
name: Title Card — Studio Dark
colors:
  bg: "#0F0F13"          # near-black ground
  panel: "#16161D"       # card surface
  grid: "#2A2A3A"        # blueprint hairline
  ink: "#E9E9F2"         # primary text
  muted: "#8A8A9C"       # secondary text
  accent: "#60A5FA"      # the single payoff / structure color
typography:
  display: "Archivo"          # 800 weight, tight tracking, headlines
  body: "Inter"               # 400/600, running text
  mono: "JetBrains Mono"      # 500, eyebrows and labels
spacing:
  pad: "120px 70px"
  gap: "44px"
components:
  eyebrow: "mono, 28px, uppercase, letter-spacing .22em, color accent"
  headline: "display 800, 112px, tight negative tracking, one accent word"
  sub: "body, 38px, muted, balanced, max-width 820px"
---

# Title Card — Studio Dark

A kinetic-type opener for a framework-free scene. Near-black ground, a faint
blueprint grid, a mono eyebrow, a big display headline, and exactly one accent
payoff word. Calm mission-control, one idea per frame, no UI.

## The Frame

- **Ground:** near-black with a faint grid hairline (~46px) and a soft radial
  vignette so the content floats.
- **Structure is the accent.** The single payoff word takes the accent color;
  nothing else competes with it.
- **Chrome is mono and quiet; the headline is display and loud. Never both.**

## Typography

- **Display** for the punch line, tight negative tracking.
- **Body** for the running subtitle.
- **Mono** uppercase with wide tracking for the eyebrow label only.

## Motion feel

- Precise, not bouncy. The eyebrow and headline rise and settle on firm eases
  (power2/power3 out), then the subtitle lands a beat later. No overshoot.
- Respect reduced-motion: the resting state is fully legible with motion off.

## Do

- Keep one idea per frame; give the accent word room to land.
- Let the type carry the beat; no decoration.

## Don't

- No two accent colors in a frame. No CDN-only fonts (system fallbacks first).
- No bouncy/elastic motion. No em dashes in on-screen copy.
