---
id: t-01-line-reveal
name: 'Line Reveal'
kind: motion
category: text
engine: gsap/SplitText
description: 'A multi-line headline rises in line by line.'
motion: 'gate on active; duration 0 for reduced motion'
tags: [text, split, entrance]
---

```ts
const split = SplitText.create('[sel]', { type: 'lines' });
gsap.from(split.lines, { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
```

## Adapt

Lazy-load GSAP and SplitText together and gate the tween on active. Reduced motion reverts the split (or runs at duration 0) so the headline is simply present.
