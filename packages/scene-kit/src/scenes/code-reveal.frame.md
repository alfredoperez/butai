---
name: Code Reveal — Studio Dark
colors:
  bg: "#0F0F13"          # near-black ground
  panel: "#16161D"       # the code card surface
  grid: "#2A2A3A"        # blueprint hairline / border
  ink: "#E9E9F2"         # active code text
  muted: "#8A8A9C"       # dimmed code lines
  accent: "#60A5FA"      # keywords / structure
  good: "#34D399"        # string literals
  warn: "#FACC15"        # the single highlighted payoff line
typography:
  display: "Archivo"          # the eyebrow-adjacent display, unused inline
  body: "Inter"               # fallback running text
  mono: "JetBrains Mono"      # the code, the vernacular of this frame
spacing:
  pad: "120px 70px"
  radius: "18px"
  line: "1.7"
components:
  eyebrow: "mono, 28px, uppercase, letter-spacing .2em, accent"
  code: "panel bg, 1px grid border, 18px radius, mono 40px, faint accent ring"
  hot: "one highlighted line — a warn-colored side bar and a faint warn wash"
---

# Code Reveal — Studio Dark

A mono code block that reveals line by line, with exactly one highlighted line
as the payoff. Generic sample code only (example.com), never a real snippet.

## The Frame

- **Mono is the whole voice here.** The card is flat panel with a 1px border and
  a faint accent ring; keywords take the accent, strings take the pass color.
- **One highlighted line** carries a warn-colored side bar and a faint wash. It
  is the single thing the viewer must take away. Never highlight two lines.

## Typography

- **Mono** for every line; tabular, generous line height so digits and symbols
  breathe.

## Motion feel

- Lines reveal top to bottom, staggered, sliding in from the read direction on
  firm eases. The highlighted line settles last and holds. No bounce.
- Respect reduced-motion: all lines are legible at rest with motion off.

## Do

- Keep the sample generic and short; let one line be the point.
- Use color sparingly: accent for keywords, pass for strings, warn for the one
  line that matters.

## Don't

- No personal or product code. No two highlighted lines. No CDN-only fonts.
- No bouncy motion. No em dashes in on-screen copy.
