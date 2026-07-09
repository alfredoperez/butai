---
id: ui-01-card-hover-lift
name: 'Card Hover Lift'
kind: motion
category: attention
engine: gsap
description: 'A card lifts and scales slightly under the pointer — polish for interactive (laptop) surfaces.'
motion: 'pointer-driven, interactive surfaces only; disable on touch, projection, and reduced motion'
tags: [attention, hover, interactive]
---

```ts
el.addEventListener('mouseenter', () =>
  gsap.to(card, { y: -8, scale: 1.02, boxShadow: '0 12px 24px rgba(0,0,0,0.25)', duration: 0.3 }),
);
el.addEventListener('mouseleave', () => gsap.to(card, { y: 0, scale: 1, clearProps: 'boxShadow', duration: 0.3 }));
```

## Adapt

Interactive surfaces only — a projected deck has no pointer. Guard for touch and reduced motion; the resting card is the finished state.
