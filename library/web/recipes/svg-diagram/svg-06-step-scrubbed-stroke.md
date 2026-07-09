---
id: svg-06-step-scrubbed-stroke
name: 'Step-Scrubbed Stroke'
kind: motion
category: svg-diagram
engine: gsap/DrawSVG
description: 'A paused draw-on timeline whose progress is driven by the step index instead of scroll.'
motion: 'paused timeline; step change tweens progress; reduced motion jumps to the target progress'
tags: [svg, draw, step-driven]
---

```ts
const tl = gsap
  .timeline({ paused: true })
  .fromTo('[sel]', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', ease: 'none' });
// on step change: tl.tweenTo(step / totalSteps);
```

## Adapt

This is the platform translation of scroll scrub: replace `scrub` with `tl.tweenTo(progress)` fed by the step index. Reduced motion sets `tl.progress(target)` directly.
