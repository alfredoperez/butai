---
id: ui-02-3d-card-tilt
name: '3D Card Tilt'
kind: motion
category: attention
engine: gsap
description: 'A card tilts in 3D toward the pointer — use gsap.quickTo in the move handler, never gsap.to per frame.'
motion: 'pointer-driven, interactive surfaces only; disable on touch and reduced motion'
tags: [attention, hover, 3d, interactive]
---

```ts
const rxTo = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
const ryTo = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
el.addEventListener('mousemove', (e) => {
  const r = card.getBoundingClientRect();
  ryTo(gsap.utils.mapRange(0, r.width, -10, 10)(e.clientX - r.left));
  rxTo(gsap.utils.mapRange(0, r.height, 10, -10)(e.clientY - r.top));
});
```

## Adapt

`quickTo` is the whole trick — per-frame `gsap.to` calls thrash. Reset both rotations on leave; skip wiring entirely on touch or reduced motion.
