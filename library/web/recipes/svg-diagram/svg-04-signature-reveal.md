---
id: svg-04-signature-reveal
name: 'Signature / Handwriting Reveal'
kind: motion
category: svg-diagram
engine: gsap/DrawSVG
description: 'Sequentially draw multiple pen-stroke paths so the mark looks written — signatures, built-up logos, glyphs.'
motion: 'build the timeline on active; reduced motion sets all paths fully drawn instantly'
tags: [svg, draw, timeline]
---

```ts
gsap.set('[sel] path', { drawSVG: '0% 0%', autoAlpha: 1 });
const tl = gsap.timeline();
paths.forEach((p, i) =>
  tl.to(p, { drawSVG: '0% 100%', duration: 0.6, ease: 'power1.inOut' }, i ? '-=0.1' : 0),
);
```

## Adapt

Build the timeline when the surface becomes active. For reduced motion, set every path to `"0% 100%"` instantly — the end state must be the finished mark.
