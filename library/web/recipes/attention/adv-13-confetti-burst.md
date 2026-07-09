---
id: adv-13-confetti-burst
name: 'Confetti / Particle Burst'
kind: motion
category: attention
engine: gsap/Physics2D
description: 'A particle burst from a point — the "ta-da" for a reveal or closing moment.'
motion: 'fire once on a step; reduced motion replaces the burst with a simple fade-in'
tags: [attention, particles, celebration]
---

```ts
gsap.registerPlugin(Physics2DPlugin);
particles.forEach((p) =>
  gsap.to(p, {
    physics2D: {
      velocity: gsap.utils.random(150, 400),
      angle: gsap.utils.random(200, 340),
      gravity: 600,
    },
    autoAlpha: 0,
    duration: gsap.utils.random(1.5, 2.5),
    onComplete: () => p.remove(),
  }),
);
```

## Adapt

Always `gsap.utils.random()`, never `Math.random()` — GSAP's version is function-value aware. Angle 200-340 throws upward. Remove particles on complete; reduced motion swaps the burst for a plain fade.
