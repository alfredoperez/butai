---
id: svg-15-filter-distortion-liquid
name: 'SVG Filter Distortion (Liquid)'
kind: motion
category: svg-diagram
engine: gsap
description: 'A liquid/glass ripple over one hero element via feTurbulence and feDisplacementMap.'
motion: 'trigger on a step, then settle back; skip entirely on reduced motion'
tags: [svg, filter, emphasis]
---

```ts
// inject filter: feTurbulence#liquid-turbulence + feDisplacementMap#liquid-displacement (scale 0)
gsap.to('#liquid-turbulence', { attr: { baseFrequency: '0.65 0.75' }, duration: 0.4 });
gsap.to('#liquid-displacement', { attr: { scale: 30 }, duration: 0.4 });
```

## Adapt

Trigger on a step instead of hover; reverse to `baseFrequency: "0 0"`, `scale: 0` to settle. Skip on reduced motion — the undistorted element is the correct end state. One hero element max.
