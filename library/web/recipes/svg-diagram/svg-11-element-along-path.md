---
id: svg-11-element-along-path
name: 'Element Along Path'
kind: motion
category: svg-diagram
engine: gsap/MotionPath
description: 'Move a token, avatar, or dot along an (often hidden) SVG path — data flowing through a diagram.'
motion: 'run on active; duration 0 for reduced motion'
tags: [svg, motion-path, diagram]
---

```ts
gsap.registerPlugin(MotionPathPlugin);
gsap.to('[el]', {
  motionPath: { path: '[path]', align: '[path]', alignOrigin: [0.5, 0.5], autoRotate: false },
  duration: 2,
  ease: 'power1.inOut',
}); // on active
```

## Adapt

Fire when the surface goes active. Reduced motion places the element at the path end immediately — the resting diagram must read complete.
