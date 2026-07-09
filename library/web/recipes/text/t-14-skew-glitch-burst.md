---
id: t-14-skew-glitch-burst
name: 'Skew Glitch Burst'
kind: motion
category: text
engine: gsap
description: 'Lightweight single-element skew jitter — a quick attention tic with no extra layers.'
motion: 'burst on a step or sparse random timer; skip on reduced motion'
tags: [text, glitch, emphasis]
---

```ts
gsap
  .timeline()
  .to('[sel]', { skewX: gsap.utils.random(-4, 4), duration: 0.06 })
  .to('[sel]', { skewX: 0, duration: 0.08 });
gsap.delayedCall(gsap.utils.random(3, 8), glitchBurst);
```

## Adapt

The cheap sibling of the RGB split: one element, one skew, snap back. Same rules — sparse, active-only, skipped on reduced motion.
