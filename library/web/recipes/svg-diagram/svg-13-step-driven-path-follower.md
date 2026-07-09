---
id: svg-13-step-driven-path-follower
name: 'Step-Driven Path Follower'
kind: motion
category: svg-diagram
engine: gsap/MotionPath
description: 'An element whose position along a path tracks progress — driven by the step index instead of scroll.'
motion: 'paused timeline; step change sets progress; reduced motion jumps to the target position'
tags: [svg, motion-path, step-driven]
---

```ts
const tl = gsap.timeline({ paused: true }).to('[el]', {
  motionPath: {
    path: '[path]', align: '[path]', alignOrigin: [0.5, 0.5],
    autoRotate: true, start: 0, end: 1,
  },
  ease: 'none',
});
// step change -> tl.progress(step / total);
```

## Adapt

Swap scroll progress for step progress: `tl.progress(step / total)` on every step change. Reduced motion is inherently satisfied — position updates are instant sets.
