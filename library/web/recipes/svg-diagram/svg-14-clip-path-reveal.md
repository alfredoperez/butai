---
id: svg-14-clip-path-reveal
name: 'SVG Clip-Path Reveal'
kind: motion
category: svg-diagram
engine: gsap
description: 'Wipe an image or graphic into view by animating an SVG clip rect — a clean masked reveal.'
motion: 'run on active; duration 0 for reduced motion'
tags: [svg, reveal, mask]
---

```ts
// clipPath#reveal-clip > rect#clip-rect (objectBoundingBox, height 0); CSS clip-path: url(#reveal-clip)
gsap.to('#clip-rect', { attr: { height: 1 }, duration: 1.2, ease: 'power3.out' }); // on active
```

## Adapt

Attribute tween, no plugin. Run on active; reduced motion sets `height: 1` instantly so the content is never hidden in the resting state.
