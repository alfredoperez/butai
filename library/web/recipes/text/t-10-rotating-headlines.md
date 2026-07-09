---
id: t-10-rotating-headlines
name: 'Text Swap / Rotating Headlines'
kind: motion
category: text
engine: gsap/TextPlugin
description: 'Cycle one slot word through a list ("build / ship / scale"): fade out, swap, fade in, hold, repeat.'
motion: 'loop only while active; pause on reduced motion'
tags: [text, loop, headline]
---

```ts
const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.out' } });
words.forEach((w) =>
  tl
    .to('.rotating-word', { autoAlpha: 0, duration: 0.3 })
    .set('.rotating-word', { text: w })
    .to('.rotating-word', { autoAlpha: 1, duration: 0.4 })
    .to({}, { duration: 2 }),
);
```

## Adapt

Run the loop only while the surface is active and pause it on reduced motion, resting on the first word. The empty tween is the hold between swaps.
