---
id: svg-03-scribble-underline
name: 'Scribble Underline'
kind: motion
category: svg-diagram
engine: gsap/DrawSVG
description: 'A hand-drawn wavy underline revealed as an emphasis beat under a headline.'
motion: 'trigger on a step (not hover); duration 0 for reduced motion'
tags: [svg, draw, emphasis]
---

```ts
gsap.set(path, { drawSVG: '0% 0%' });
gsap.to(path, { drawSVG: '0% 100%', duration: 0.4, ease: 'power2.out' }); // on step
```

## Adapt

Inject the scribble SVG under the headline and reveal it as an emphasis step — steps replace hover in a stepped surface. Kill any in-flight tween before re-running.
