---
id: scr-13-infinite-marquee
name: 'Infinite Marquee'
kind: motion
category: background
engine: gsap
description: 'An endless horizontal ticker of logos or keywords — pure repeat, no scroll dependence.'
motion: 'loop only while active; pause on reduced motion'
tags: [background, marquee, loop]
---

```ts
gsap.to('[track]', {
  x: -(track.scrollWidth / 2),
  duration: 20,
  ease: 'none',
  repeat: -1,
  modifiers: {
    x: gsap.utils.unitize((x) => parseFloat(x) % (track.scrollWidth / 2)),
  },
});
```

## Adapt

Duplicate the track content once; `gsap.utils.unitize` + modulo gives the seamless wrap. Pause on reduced motion and while inactive — the static row is a fine resting state.
