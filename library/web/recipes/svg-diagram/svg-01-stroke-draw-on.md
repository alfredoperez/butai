---
id: svg-01-stroke-draw-on
name: 'Stroke Draw On'
kind: motion
category: svg-diagram
engine: gsap/DrawSVG
description: 'Draw a line or path on as if hand-drawn — diagram connectors, arrows, underlines that build in.'
motion: 'drive on active; duration 0 for reduced motion'
tags: [svg, draw, diagram]
---

```ts
gsap.registerPlugin(DrawSVGPlugin);
gsap.set('[sel]', { drawSVG: '0% 0%' });
gsap.to('[sel]', { drawSVG: '0% 100%', duration: 1.5, ease: 'power2.inOut' });
```

## Adapt

Run the tween when the slide/scene becomes active; for reduced motion set the final state instantly (duration 0). A plugin-free equivalent uses `strokeDasharray`/`strokeDashoffset`; `drawSVG` adds partial `"x% y%"` windows.
