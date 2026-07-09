---
id: ui-06-step-stagger-reveal
name: 'Step Stagger Reveal'
kind: motion
category: transitions
engine: gsap
description: 'Cards or list items stagger in — reach for GSAP only when you need its grid/random stagger distribution.'
motion: 'run on active; prefer the platform default entrance for plain cases; duration 0 for reduced motion'
tags: [transition, stagger, entrance, scr-03]
---

```ts
gsap.from('[sel]', { y: 50, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }); // on active
```

## Adapt

Plain entrances belong to the platform's default motion layer; use this GSAP form only for distribute/random staggers (see the radial/grid stagger utility). Run on active; reduced motion shows everything at once.
