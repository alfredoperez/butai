---
id: ui-08-magnetic-button
name: 'Magnetic Button'
kind: motion
category: attention
engine: gsap
description: 'A button drifts toward the pointer and snaps back on leave — desktop-only micro-delight.'
motion: 'pointer-driven, interactive surfaces only; disable on touch and reduced motion'
tags: [attention, hover, interactive]
---

```ts
const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });
// mousemove: xTo((e.clientX - cx) * 0.3); yTo((e.clientY - cy) * 0.3);
// mouseleave: xTo(0); yTo(0);
```

## Adapt

Multiply the pointer offset by ~0.3 so the pull feels magnetic, not glued. Same guards as all pointer flourishes: desktop-only, off under reduced motion.
