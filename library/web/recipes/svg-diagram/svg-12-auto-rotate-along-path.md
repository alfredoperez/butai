---
id: svg-12-auto-rotate-along-path
name: 'Auto-Rotate Along Path'
kind: motion
category: svg-diagram
engine: gsap/MotionPath
description: 'Same as element-along-path but the element turns to face its direction of travel — an arrowhead, a ship.'
motion: 'run on active; continuous orbits use repeat -1 and pause on reduced motion'
tags: [svg, motion-path, loop]
---

```ts
gsap.to('[el]', {
  motionPath: { path: '[path]', align: '[path]', alignOrigin: [0.5, 0.5], autoRotate: true },
  duration: 2,
  ease: 'power1.inOut',
});
// orbit loop: drop the trigger, add repeat: -1, ease: 'none'
```

## Adapt

Run on active; for a continuous orbit use `repeat: -1` with `ease: "none"` and pause the loop entirely on reduced motion.
