---
id: t-02-word-reveal
name: 'Word Reveal'
kind: motion
category: text
engine: gsap/SplitText
description: 'Words cascade upward into place — the standard split-text entrance for titles.'
motion: 'gate on active; duration 0 for reduced motion'
tags: [text, split, entrance]
---

```ts
const split = SplitText.create('[sel]', { type: 'words' });
gsap.from(split.words, { yPercent: 80, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
```

## Adapt

Gate on active. Keep the stagger tight (0.04-0.06) so long titles do not drag; reduced motion shows the finished line immediately.
