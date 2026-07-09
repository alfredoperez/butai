---
id: svg-01-stroke-draw-on
name: Stroke Draw On
kind: motion
category: svg-diagram
engine: gsap/DrawSVG
description: Draw a line/path on as if hand-drawn — diagram connectors, arrows, underlines.
motion: drive on active; duration 0 for reduced motion
tags: [svg, draw, diagram]
---

```ts
gsap.registerPlugin(DrawSVGPlugin);
gsap.set('[sel]', { drawSVG: '0% 0%' });
gsap.to('[sel]', { drawSVG: '0% 100%', duration: 1.5, ease: 'power2.inOut' });
```

## Adapt

Drive from the active step; set duration to 0 when reduced motion is preferred.
