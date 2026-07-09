---
id: ui-10-button-morph
name: 'Button Morph'
kind: motion
category: attention
engine: gsap
description: 'A button morphs between two states via a paused timeline played and reversed.'
motion: 'paused timeline; play/reverse on state change; duration 0 for reduced motion'
tags: [attention, micro-interaction]
---

```ts
const tl = gsap
  .timeline({ paused: true })
  .to(btn, { width: 56, borderRadius: 28, duration: 0.35, ease: 'power2.inOut' })
  .to('.label', { autoAlpha: 0, duration: 0.2 }, '<')
  .to('.icon', { autoAlpha: 1, duration: 0.2 }, '<0.15');
// state change: on ? tl.play() : tl.reverse();
```

## Adapt

One paused timeline owns both directions — `play()`/`reverse()` on state change keeps them perfectly symmetric. Reduced motion sets the target state directly.
