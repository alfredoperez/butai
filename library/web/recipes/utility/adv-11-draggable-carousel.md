---
id: adv-11-draggable-carousel
name: 'Draggable Carousel'
kind: motion
category: utility
engine: gsap/Draggable
description: 'A momentum carousel that snaps to each panel width after a throw.'
motion: 'interactive surfaces only; disable inertia on reduced motion'
tags: [utility, draggable, carousel, interactive]
---

```ts
Draggable.create('[track]', {
  type: 'x',
  inertia: true,
  bounds: { minX: -(panels - 1) * panelW, maxX: 0 },
  snap: { x: gsap.utils.snap(panelW) },
});
```

## Adapt

Snap to multiples of the panel width so every throw lands cleanly on a panel. On stepped surfaces prefer step navigation; this is for hands-on browsing moments.
