---
id: adv-03-color-interpolation
name: 'Color Interpolation'
kind: motion
category: utility
engine: gsap
description: 'Interpolate between two colors by progress — handles hex, rgb, hsl, and named colors.'
motion: 'drive by step progress; apply with gsap.set'
tags: [utility, color, step-driven]
---

```ts
const mix = gsap.utils.interpolate('#0EA5E9', '#F59E0B');
// on step change:
gsap.set('[sel]', { color: mix(step / totalSteps) });
```

## Adapt

Build the interpolator once outside the update path, then `gsap.set` per step. A step-driven color shift (state A warming into state B) is the classic use.
