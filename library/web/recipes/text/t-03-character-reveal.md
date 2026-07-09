---
id: t-03-character-reveal
name: 'Character Reveal'
kind: motion
category: text
engine: gsap/SplitText
description: 'Per-character cascade with a back.out pop — energetic titles and single punch words.'
motion: 'gate on active; duration 0 for reduced motion'
tags: [text, split, entrance]
---

```ts
const split = SplitText.create('[sel]', { type: 'chars' });
gsap.from(split.chars, { y: 20, autoAlpha: 0, scale: 0.8, stagger: 0.03, ease: 'back.out(1.7)' });
```

## Adapt

Gate on active; best on short strings (a word, a stat label) — per-character motion on a paragraph reads as noise. Reduced motion renders the text plainly.
