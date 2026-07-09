---
id: svg-07-shape-morph-simple
name: 'Shape Morph (Simple)'
kind: motion
category: svg-diagram
engine: gsap/MorphSVG
description: 'Morph one SVG path into another (circle to star, etc.) — convert primitives to paths first.'
motion: 'trigger on a step; duration 0 for reduced motion'
tags: [svg, morph]
---

```ts
gsap.registerPlugin(MorphSVGPlugin);
MorphSVGPlugin.convertToPath('[start], [end]');
gsap.to('[start]', {
  morphSVG: { shape: '[end]', type: 'rotational', shapeIndex: 'auto' },
  duration: 1.2,
  ease: 'power2.inOut',
});
```

## Adapt

Trigger on a step. The hidden target path supplies shape data only. If the morph twists, set `shapeIndex: "log"` to find the right index.
