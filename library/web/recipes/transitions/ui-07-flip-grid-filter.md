---
id: ui-07-flip-grid-filter
name: 'Flip Grid Filter'
kind: motion
category: transitions
engine: gsap/Flip
description: 'Re-filter a grid and have surviving items smoothly relayout into their new slots.'
motion: 'drive per step (each step = a filter); duration 0 for reduced motion'
tags: [transition, flip, grid]
---

```ts
const state = Flip.getState('.card');
// toggle display: none on non-matching cards
Flip.from(state, {
  duration: 0.5,
  ease: 'power2.inOut',
  absolute: true,
  onEnter: (els) => gsap.from(els, { autoAlpha: 0, duration: 0.3 }),
  onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.2 }),
});
```

## Adapt

Each step applies one filter state: capture, toggle visibility, `Flip.from` with enter/leave fades. Reduced motion swaps the filtered layout in one frame.
