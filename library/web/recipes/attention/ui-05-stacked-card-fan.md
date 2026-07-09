---
id: ui-05-stacked-card-fan
name: 'Stacked Card Fan'
kind: motion
category: attention
engine: gsap
description: 'A stack of cards fans out into an arc — a reveal for a hand of options.'
motion: 'fan on a step; duration 0 for reduced motion'
tags: [attention, cards, reveal]
---

```ts
cards.forEach((c, i) =>
  gsap.to(c, {
    rotation: (i - (cards.length - 1) / 2) * 8,
    x: (i - (cards.length - 1) / 2) * 40,
    y: -Math.abs(i - (cards.length - 1) / 2) * 6,
    duration: 0.5,
    ease: 'back.out(1.4)',
  }),
);
```

## Adapt

Fan on a step (hover has no projector equivalent). Compute offsets from the center index so any card count fans symmetrically; reduced motion lays the fan out instantly.
