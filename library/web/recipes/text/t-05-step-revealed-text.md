---
id: t-05-step-revealed-text
name: 'Step-Revealed Text'
kind: motion
category: text
engine: gsap/SplitText
description: 'Words sit ghosted at low opacity, then brighten to full — revealed as one tween or per step.'
motion: 'brighten on active or per step; reduced motion shows full opacity immediately'
tags: [text, split, step-driven]
---

```ts
gsap.set(split.words, { opacity: 0.15 });
gsap.to(split.words, { opacity: 1, stagger: 0.15, ease: 'none' }); // on active (or tween by step)
```

## Adapt

Originally scroll-scrubbed; here brighten per step or as one tween on active. Uses real `opacity` (partial values), not `autoAlpha` — words must stay in flow.
