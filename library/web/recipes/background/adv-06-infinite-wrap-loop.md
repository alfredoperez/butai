---
id: adv-06-infinite-wrap-loop
name: 'Infinite Wrap Loop'
kind: motion
category: background
engine: gsap
description: 'Cycle values endlessly with gsap.utils.wrap — positions or a 360-degree rotation orbit.'
motion: 'loop only while active; pause on reduced motion'
tags: [background, loop, utility]
---

```ts
const wrapX = gsap.utils.wrap(-100, 100);
gsap.to(els, {
  x: '+=200',
  duration: 10,
  ease: 'none',
  repeat: -1,
  modifiers: { x: gsap.utils.unitize(wrapX) },
});
```

## Adapt

`wrap(min, max)` cycles back to min (unlike `clamp`) — the primitive behind every seamless loop. Same background rules: active-only, paused on reduced motion.
