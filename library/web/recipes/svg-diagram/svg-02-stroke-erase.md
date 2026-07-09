---
id: svg-02-stroke-erase
name: 'Stroke Erase'
kind: motion
category: svg-diagram
engine: gsap/DrawSVG
description: 'Retract a drawn stroke — the reverse of draw-on — or sweep a moving dash window along a path.'
motion: 'drive on a later step; duration 0 for reduced motion'
tags: [svg, draw, diagram]
---

```ts
gsap.set('[sel]', { drawSVG: '0% 100%' }); // fully visible
gsap.to('[sel]', { drawSVG: '100% 100%', duration: 1.2, ease: 'power2.in' }); // erase L to R
// moving window: fromTo { drawSVG: '0% 10%' } -> { drawSVG: '90% 100%', repeat: -1, ease: 'none' }
```

## Adapt

Trigger on a later step to "un-draw" a connector; pairs with the draw-on recipe across two steps. Reduced motion jumps straight to the erased state.
