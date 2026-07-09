---
id: text-02-char-stagger
name: Character Stagger
kind: motion
category: text
engine: gsap
description: Reveal a headline character by character with a tight stagger.
tags: [text, stagger]
---

```ts
gsap.from('[sel] .char', { yPercent: 100, opacity: 0, stagger: 0.02, ease: 'power3.out' });
```

## Adapt

Split the headline into `.char` spans first; honor reduced motion with duration 0.
