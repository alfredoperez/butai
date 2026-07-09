---
id: svg-05-multi-path-sequential-draw
name: 'Multi-Path Sequential Draw'
kind: motion
category: svg-diagram
engine: gsap/DrawSVG
description: 'Draw many diagram segments in order, each timed to its length so pen speed feels constant.'
motion: 'one timeline on active, or one segment per step for click-paced assembly'
tags: [svg, draw, diagram, timeline]
---

```ts
const dur = (p) => gsap.utils.clamp(0.3, 1.5, DrawSVGPlugin.getLength(p) / 300);
paths.forEach((p) => tl.to(p, { drawSVG: '0% 100%', duration: dur(p) }, '-=0.05'));
```

## Adapt

Two drive modes: one timeline fired on active, or one segment per step for click-paced assembly of a multi-part diagram. Reduced motion draws everything at duration 0.
