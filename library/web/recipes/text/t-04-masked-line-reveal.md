---
id: t-04-masked-line-reveal
name: 'Masked Line Reveal'
kind: motion
category: text
engine: gsap/SplitText
description: 'Lines slide up from behind a clip mask — the premium reveal. Needs GSAP 3.13+.'
motion: 'trigger inside onSplit when active; duration 0 for reduced motion'
tags: [text, split, mask, entrance]
---

```ts
SplitText.create('[sel]', {
  type: 'lines',
  mask: 'lines',
  autoSplit: true,
  onSplit: (self) =>
    gsap.from(self.lines, { yPercent: 110, duration: 0.9, stagger: 0.1, ease: 'power4.out' }),
});
```

## Adapt

Trigger inside `onSplit` when active and return the tween so re-splits (resize) stay synced. Reduced motion skips the tween — masked lines must rest fully visible.
