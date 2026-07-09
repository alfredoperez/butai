---
id: adv-04-organic-random-entrance
name: 'Organic Random Entrance'
kind: motion
category: background
engine: gsap
description: 'Each element enters from its own random offset and rotation with a random-order stagger.'
motion: 'run on active; duration 0 for reduced motion'
tags: [background, entrance, random]
---

```ts
gsap.set(els, {
  x: () => gsap.utils.random(-40, 40),
  y: () => gsap.utils.random(20, 60),
  rotation: () => gsap.utils.random(-12, 12),
  autoAlpha: 0,
});
gsap.to(els, {
  x: 0,
  y: 0,
  rotation: 0,
  autoAlpha: 1,
  ease: 'power3.out',
  duration: () => gsap.utils.random(0.6, 1.0),
  stagger: { each: 0.08, from: 'random' },
}); // on active
```

## Adapt

Function-based values give every target a unique offset — that is what makes it organic. Run on active; reduced motion places everything at rest immediately.
