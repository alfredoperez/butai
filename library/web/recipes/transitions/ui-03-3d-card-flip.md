---
id: ui-03-3d-card-flip
name: '3D Card Flip'
kind: motion
category: transitions
engine: gsap
description: 'Flip a card front-to-back in 3D — needs preserve-3d and backface-visibility hidden.'
motion: 'flip on a step or click; duration 0 for reduced motion'
tags: [transition, card, 3d]
---

```ts
gsap.to(card, {
  rotationY: flipped ? 0 : 180,
  duration: 0.6,
  ease: 'power2.inOut',
  transformPerspective: 1000,
});
```

## Adapt

CSS prerequisites: `transform-style: preserve-3d` on the card, `backface-visibility: hidden` on both faces. Drive from a step on projection; reduced motion swaps faces instantly.
