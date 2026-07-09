---
id: svg-08-icon-to-icon-morph
name: 'Icon-to-Icon Morph'
kind: motion
category: svg-diagram
engine: gsap/MorphSVG
description: 'Toggle between two icon states (play/pause, menu/close) — a live-toggle cue for interactive demos.'
motion: 'toggle on step or click; duration 0 for reduced motion'
tags: [svg, morph, interactive]
---

```ts
let on = false;
el.addEventListener('click', () => {
  on = !on;
  gsap.to('#icon-a', { morphSVG: on ? dataB : dataA, duration: 0.4, ease: 'power2.inOut' });
});
```

## Adapt

On a stepped surface, drive the toggle from a step change rather than a click when nobody can interact (projection). Reduced motion swaps the path data instantly.
