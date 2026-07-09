---
name: Feature Callout — Studio Dark
colors:
  bg: "#0F0F13"          # near-black ground
  panel: "#16161D"       # the framed shot surface
  grid: "#2A2A3A"        # blueprint hairline / borders
  ink: "#E9E9F2"         # primary text
  muted: "#8A8A9C"       # placeholder / secondary text
  accent: "#60A5FA"      # the single payoff / ring color
  good: "#34D399"        # reserved pass-state accent
typography:
  display: "Archivo"          # 800 weight, the caption
  body: "Inter"               # running text
  mono: "JetBrains Mono"      # the eyebrow label
spacing:
  pad: "0"
  shot: "900px"
  radius: "20px"
components:
  eyebrow: "mono, 28px, uppercase, letter-spacing .2em, accent, pinned top"
  shot: "panel bg, 1px grid border, 20px radius, faint accent ring, no heavy shadow"
  caption: "display 800, 80px, one accent payoff word, pinned bottom over a scrim"
---

# Feature Callout — Studio Dark

A shot-with-caption beat. A centered framed region stands in for a product UI (a
generic placeholder, never a real screenshot), a mono eyebrow names what the
viewer is looking at, and a big display caption delivers one accent payoff.

## The Frame

- **The shot is the hero.** A flat card: panel fill, 1px border, a faint accent
  ring, no heavy drop shadow. Depth comes from the grid and the bottom scrim.
- **One accent payoff** in the caption; the eyebrow is quiet mono chrome.
- **A bottom scrim** fades the ground up so the caption always reads.

## Typography

- **Display** for the caption punch line.
- **Mono** uppercase for the eyebrow label.

## Motion feel

- A slow crop punch-in on the shot (a subtle scale settle), then the caption
  rises and lands a beat after the frame settles. Firm eases, no bounce.
- Respect reduced-motion: the resting frame is fully legible with motion off.

## Do

- Let the shot carry the story; animate attention, not decoration.
- Use the mono eyebrow to label what the viewer sees.

## Don't

- No real screenshots or personal assets in the seed. No two accent colors.
- No bouncy motion. No em dashes in on-screen copy.
