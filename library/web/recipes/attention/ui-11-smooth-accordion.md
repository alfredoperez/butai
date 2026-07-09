---
id: ui-11-smooth-accordion
name: 'Smooth Accordion'
kind: motion
category: attention
engine: gsap
description: 'Animate an expand/collapse between height 0 and auto — measure the auto height, then tween.'
motion: 'toggle on step or click; duration 0 for reduced motion'
tags: [attention, accordion, interactive]
---

```ts
const open = () => {
  gsap.set(panel, { height: 'auto' });
  gsap.from(panel, { height: 0, autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' });
};
const close = () => gsap.to(panel, { height: 0, autoAlpha: 0, duration: 0.35, ease: 'power2.inOut' });
```

## Adapt

Let GSAP own the motion — no CSS transitions on the content or the two fight. The set-auto-then-from trick measures the natural height for you. Reduced motion toggles instantly.
