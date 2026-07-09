---
id: adv-12-swipe-gesture
name: 'Swipe / Gesture Observer'
kind: motion
category: utility
engine: gsap/Observer
description: 'Unified touch/pointer/wheel gesture detection with an isAnimating guard — could drive step navigation.'
motion: 'guard with isAnimating; the platform nav layer owns navigation — use with care'
tags: [utility, gesture, interactive]
---

```ts
gsap.registerPlugin(Observer);
let isAnimating = false;
Observer.create({
  type: 'touch,pointer,wheel',
  onUp: () => !isAnimating && next(),
  onDown: () => !isAnimating && prev(),
});
```

## Adapt

Observer normalizes wheel, touch, and pointer into one gesture stream. It CAN drive step navigation (swipe = next/prev), but the platform nav layer already owns nav — wire it only where that layer is absent.
