---
id: ui-04-card-expand-to-detail
name: 'Card Expand to Detail'
kind: motion
category: transitions
engine: gsap/Flip
description: 'A card morphs from grid tile into a full detail panel and back — same DOM, animated layout change.'
motion: 'trigger on a step click; duration 0 for reduced motion'
tags: [transition, flip, layout]
---

```ts
gsap.registerPlugin(Flip);
const state = Flip.getState(card);
card.classList.add('expanded'); // or move into a bigger container
Flip.from(state, { duration: 0.5, ease: 'power2.inOut', absolute: true });
```

## Adapt

Trigger on a step — great for "zoom into this part of the diagram". Capture state, mutate layout, then `Flip.from`. Reduced motion applies the layout change with no tween.
