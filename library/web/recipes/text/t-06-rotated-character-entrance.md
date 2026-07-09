---
id: t-06-rotated-character-entrance
name: 'Rotated Character Entrance'
kind: motion
category: text
engine: gsap/SplitText
description: 'Characters flip in on the X axis in 3D — set perspective on the parent.'
motion: 'gate on active; duration 0 for reduced motion'
tags: [text, split, 3d, entrance]
---

```ts
// parent: perspective: 400px
gsap.from(split.chars, {
  rotationX: 90,
  transformOrigin: '0% 50% -50',
  autoAlpha: 0,
  duration: 0.7,
  stagger: 0.04,
  ease: 'back.out(2)',
});
```

## Adapt

Set `perspective: 400px` on the parent or the flip flattens. Gate on active; reduced motion renders the text upright with no transform.
