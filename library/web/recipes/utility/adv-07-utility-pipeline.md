---
id: adv-07-utility-pipeline
name: 'Chained Utility Pipeline'
kind: motion
category: utility
engine: gsap
description: 'Compose a value transform once with gsap.utils.pipe (normalize, map, snap) and reuse it.'
motion: 'composition helper; inherits the drive mode of whatever consumes it'
tags: [utility, mapping, composition]
---

```ts
const transform = gsap.utils.pipe(
  gsap.utils.normalize(0, totalSteps),
  gsap.utils.mapRange(0, 1, 0, 100),
  gsap.utils.snap(5),
);
// transform(step) -> 0..100 snapped to 5s
```

## Adapt

`pipe` composes once and runs allocation-free per call — build it next to the mappers from the step-to-value recipe and share it across consumers.
