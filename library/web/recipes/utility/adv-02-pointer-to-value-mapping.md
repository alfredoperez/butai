---
id: adv-02-pointer-to-value-mapping
name: 'Pointer-to-Value Range Mapping'
kind: motion
category: utility
engine: gsap
description: 'Map pointer position to a value range, applied through gsap.quickTo — desktop-interactive surfaces only.'
motion: 'pointer-driven, interactive surfaces only; disable on touch and reduced motion'
tags: [utility, mapping, interactive]
---

```ts
const toX = gsap.utils.mapRange(0, window.innerWidth, -30, 30);
const xTo = gsap.quickTo('[sel]', 'x', { duration: 0.4, ease: 'power2.out' });
window.addEventListener('pointermove', (e) => xTo(toX(e.clientX)));
```

## Adapt

Pair `mapRange` with `quickTo` so pointer motion is smoothed, not sampled raw. Interactive surfaces only; unwire on touch and under reduced motion.
