---
id: t-13-rgb-split-glitch
name: 'RGB Split Glitch'
kind: motion
category: text
engine: gsap
description: 'Chromatic-aberration glitch bursts on a headline — two colored layers jitter and reset.'
motion: 'burst on a step or sparse random timer; skip on reduced motion'
tags: [text, glitch, emphasis]
---

```ts
const tl = gsap.timeline();
tl.to('.red', { x: gsap.utils.random(-4, 4), skewX: gsap.utils.random(-2, 2), duration: 0.08 })
  .to('.cyan', { x: gsap.utils.random(-4, 4), skewX: gsap.utils.random(-2, 2), duration: 0.08 }, '<')
  .to(['.red', '.cyan'], { x: 0, skewX: 0, duration: 0.06 });
gsap.delayedCall(gsap.utils.random(2, 6), glitchBurst);
```

## Adapt

Needs two color-shifted clone layers behind the headline. Keep bursts sparse (random 2-6s) and only while active; skip entirely on reduced motion — the clean headline is the end state.
