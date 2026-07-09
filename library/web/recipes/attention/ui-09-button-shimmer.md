---
id: ui-09-button-shimmer
name: 'Button Shimmer'
kind: motion
category: attention
engine: gsap
description: 'A light sweep crosses a button — a paused timeline replayed on demand.'
motion: 'paused timeline; play on step or hover; skip on reduced motion'
tags: [attention, micro-interaction]
---

```ts
gsap.set('.shine', { xPercent: -120, skewX: -20 });
const tl = gsap
  .timeline({ paused: true })
  .to('.shine', { xPercent: 220, duration: 0.7, ease: 'power2.inOut' });
// on step / hover: tl.restart();
```

## Adapt

The shine layer is an absolutely-positioned gradient strip. Build the timeline paused and `restart()` it per trigger; reduced motion never plays it.
