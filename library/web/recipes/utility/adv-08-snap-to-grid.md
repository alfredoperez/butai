---
id: adv-08-snap-to-grid
name: 'Snap-to-Grid Drag'
kind: motion
category: utility
engine: gsap/Draggable
description: 'Drag an element with inertia that settles onto a grid via a snap function.'
motion: 'interactive surfaces only; disable on reduced motion (no throw physics)'
tags: [utility, draggable, interactive]
---

```ts
gsap.registerPlugin(Draggable, InertiaPlugin);
Draggable.create('[sel]', {
  type: 'x,y',
  inertia: true,
  snap: { x: gsap.utils.snap(80), y: gsap.utils.snap(80) },
});
```

## Adapt

`gsap.utils.snap(grid)` inside the snap config is the whole recipe. Interactive demos only; under reduced motion disable inertia so drags settle immediately.
