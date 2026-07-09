---
name: Blueprint Dark
colors:
  bg: "#0F0F13"          # near-black ground
  panel: "#16161D"       # card surface
  panel2: "#1B1B24"      # raised surface
  grid: "#2A2A3A"        # blueprint hairline
  ink: "#E9E9F2"         # primary text
  muted: "#8A8A9C"       # secondary text
  dim: "#61616F"         # tertiary / chrome
  blue: "#60A5FA"        # primary accent (structure, glow, links)
  blue2: "#3B82F6"       # deeper blue
  yellow: "#FACC15"      # THE scarce accent — one payoff per frame, nothing else
  emerald: "#34D399"     # pass-state ONLY
typography:
  display: "Archivo"          # 800 weight, tight tracking, headlines
  body: "Inter"               # 400/600, running text
  mono: "JetBrains Mono"      # 500, eyebrows, labels, data, code
spacing:
  radius: "12px"
  radius_pill: "999px"
  gap: "16px"
  pad: "22px"
components:
  eyebrow: "mono, 11px, uppercase, letter-spacing .18em, color blue"
  chip: "mono, pill, 1px grid border, panel bg"
  badge_pass: "emerald text, 1px emerald-25 border, panel bg"
  card: "panel bg, 1px grid border, 12px radius, no heavy shadow"
  counter: "display 800, tabular-nums, ticks up on entry"
---

# Blueprint Dark

A dark, technical mission-control frame for a developer tool. It should feel
like an engineering blueprint that is quietly alive: a near-black ground, a
faint grid, glowing-blue structure, and exactly one gold payoff per frame.
Never decorative. The product UI is the hero.

## The Frame

- **Ground:** near-black `#0F0F13` with a faint blueprint grid (`#2A2A3A` hairlines, ~44px). A soft radial vignette darkens the edges so content floats.
- **Structure is blue.** Rails, nodes, connectors, active states, links: `#60A5FA` with a soft glow. Deeper `#3B82F6` for depth.
- **One yellow, and only one, per frame.** `#FACC15` marks the single thing the viewer must take away from that beat. If two things are yellow, one is wrong.
- **Emerald is the pass-state only.** Checks tick emerald. Nowhere else.
- **Absolutely no purple or violet.** Brand rule.

## Typography

- **Display — Archivo 800**, tight negative tracking, for the punch lines.
- **Body — Inter**, 400/600, for any running sentence.
- **Mono — JetBrains Mono 500**, uppercase with `.14–.18em` tracking for eyebrows, labels, filenames, and data. The mono is the blueprint voice; use it for chrome, not headlines.
- `tabular-nums` wherever digits move (counters, timings).

## Composition rules

- Center a single card or UI region per frame; crop into the real product view rather than showing the whole wide panel shrunk.
- Cards are flat: panel fill, 1px grid border, 12px radius, no drop shadow (a faint inner glow at most). Depth comes from the grid + vignette, not blur.
- Chrome is mono and quiet; headlines are display and loud. Never both loud.
- Whitespace is generous; this is calm mission-control, not a busy dashboard.

## Motion feel

- **Precise, not bouncy.** Crisp cuts and short crossfades. Eases are firm (power2/power3 out), no elastic, no overshoot on UI.
- **Counters tick up** on entry. Checks tick green one at a time, left to right.
- The one yellow payoff of each frame arrives a beat after the frame settles: a pull, an underline, a glow, then hold.
- Reveals are directional and confident (wipe/slide from the read direction). Respect reduced-motion.

## Do

- Let the real UI carry the story; animate attention, not decoration.
- Keep one idea per frame; give the yellow payoff room to land.
- Use the mono chrome to label what the viewer is looking at.

## Don't

- No purple/violet, ever. No rainbow of accents. No two yellows in a frame.
- No heavy drop shadows, no glassmorphism, no gradient-hero clichés.
- No bouncy/elastic UI motion. No emoji as section markers.
