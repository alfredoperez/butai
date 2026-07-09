---
id: adv-10-draggable-element
name: 'Draggable Element'
kind: motion
category: utility
engine: gsap/Draggable
description: 'A momentum-draggable element with bounds — the base for hands-on demo surfaces.'
motion: 'interactive surfaces only; disable inertia on reduced motion'
tags: [utility, draggable, interactive]
---

```ts
gsap.registerPlugin(Draggable, InertiaPlugin);
Draggable.create('[sel]', { type: 'x,y', bounds: '[container]', inertia: true });
```

## Adapt

Set `bounds` to the stage so nothing escapes. Interactive (laptop) surfaces only — a projected view should show the element parked in its resting spot.
