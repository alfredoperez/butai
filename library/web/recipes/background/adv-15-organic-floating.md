---
id: adv-15-organic-floating
name: 'Organic Floating Elements'
kind: motion
category: background
engine: gsap
description: 'Elements drift to new random spots forever via a recursive onComplete — a lava-lamp background.'
motion: 'start only while active; do not start under reduced motion'
tags: [background, float, loop]
---

```ts
function float(el) {
  gsap.to(el, {
    x: gsap.utils.random(-30, 30),
    y: gsap.utils.random(-20, 20),
    rotation: gsap.utils.random(-8, 8),
    duration: gsap.utils.random(3, 6),
    ease: 'sine.inOut',
    onComplete: () => float(el),
  });
}
```

## Adapt

Stagger the starts with `gsap.delayedCall` so elements desynchronize. Under reduced motion, never start the recursion — the static arrangement is the design.
