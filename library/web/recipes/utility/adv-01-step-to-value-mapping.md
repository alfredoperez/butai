---
id: adv-01-step-to-value-mapping
name: 'Step-to-Value Range Mapping'
kind: motion
category: utility
engine: gsap
description: 'Map step progress to any value range with mapRange and clamp built outside the update callback.'
motion: 'drive by step progress; values apply instantly (reduced-motion safe)'
tags: [utility, mapping, step-driven]
---

```ts
const toAngle = gsap.utils.mapRange(0, 1, -90, 90);
const clamp01 = gsap.utils.clamp(0, 1);
// on step change:
gsap.set('[dial]', { rotation: toAngle(clamp01(step / totalSteps)) });
```

## Adapt

The platform translation of scroll-to-value: feed step progress instead of scroll progress. Build the mappers once — never allocate them inside the callback.
