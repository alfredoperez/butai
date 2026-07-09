---
id: svg-09-blob-morph-loop
name: 'Blob Morph Loop'
kind: motion
category: background
engine: gsap/MorphSVG
description: 'An organic shape morphs forever between a few reference blobs — a living background element.'
motion: 'loop only while active; pause on reduced motion; keep durations slow (3-5s)'
tags: [background, svg, morph, loop]
---

```ts
const tl = gsap.timeline({ repeat: -1 });
shapes.forEach((s) =>
  tl.to('#blob', { morphSVG: { shape: s, type: 'rotational' }, duration: 4, ease: 'power1.inOut' }),
);
```

## Adapt

Pause the timeline on reduced motion and whenever the surface is inactive. Keep durations 3-5s and contrast low — background motion must never fight the content.
