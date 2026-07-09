---
id: adv-14-gravity-drop
name: 'Gravity Drop'
kind: motion
category: attention
engine: gsap/Physics2D
description: 'Elements fall in under gravity with a little friction — a physical entrance for a cluster of items.'
motion: 'run on active; reduced motion uses a simple fade-up instead of physics'
tags: [attention, particles, entrance]
---

```ts
gsap.to(el, {
  autoAlpha: 1,
  duration: gsap.utils.random(0.8, 1.4),
  delay: i * 0.1,
  physics2D: {
    velocity: gsap.utils.random(100, 200),
    angle: 90,
    gravity: 800,
    friction: 0.1,
  },
}); // on active
```

## Adapt

Run on active with a small per-item delay so the cluster tumbles in. Reduced motion substitutes a plain fade-up — physics for flavor, never for information.
