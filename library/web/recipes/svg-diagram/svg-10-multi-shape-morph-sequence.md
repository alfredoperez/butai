---
id: svg-10-multi-shape-morph-sequence
name: 'Multi-Shape Morph Sequence'
kind: motion
category: svg-diagram
engine: gsap/MorphSVG
description: 'Morph through several reference shapes in sequence, driven by the step index.'
motion: 'paused timeline; step change tweens progress; reduced motion jumps to the target shape'
tags: [svg, morph, step-driven]
---

```ts
const tl = gsap.timeline({ paused: true });
shapes.forEach((s) =>
  tl.to('#morph', { morphSVG: { shape: s, type: 'rotational' }, duration: 1 }),
);
// step change -> tl.tweenTo(step / shapes.length);
```

## Adapt

Originally pinned and scroll-scrubbed; here the paused timeline advances per step via `tl.tweenTo(step / shapes.length)`. Reduced motion sets progress directly.
