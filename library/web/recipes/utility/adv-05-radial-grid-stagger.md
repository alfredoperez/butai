---
id: adv-05-radial-grid-stagger
name: 'Radial / Grid Stagger'
kind: motion
category: utility
engine: gsap
description: 'Ripple a stagger outward from the center or edges of a grid using gsap.utils.distribute.'
motion: 'run on active; duration 0 for reduced motion'
tags: [utility, stagger, grid]
---

```ts
gsap.from('[sel] .cell', {
  scale: 0,
  autoAlpha: 0,
  duration: 0.5,
  ease: 'power2.out',
  stagger: gsap.utils.distribute({ amount: 0.8, from: 'center', grid: 'auto' }),
});
```

## Adapt

`grid: "auto"` reads the layout for you; `from` accepts "center", "edges", or an index. This is the reason to pick GSAP over the default entrance layer for grids.
