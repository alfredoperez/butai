---
id: ui-16-transition-wipe
name: 'Transition Wipe'
kind: motion
category: transitions
engine: gsap
description: 'A full-screen accent panel wipes across on enter/exit — a between-view wipe overlay.'
motion: 'hook to the surface change (slide/scene advance); duration 0 for reduced motion'
tags: [transition, wipe, overlay]
---

```ts
gsap.set('#overlay', { scaleX: 0, transformOrigin: 'left center' });
// enter: from scaleX: 1 (origin right) -> scaleX: 0, duration: 0.6, ease: 'power3.inOut'
// exit:  to scaleX: 1 (origin left), then advance in onComplete
```

## Adapt

Hook the wipe to the platform's view change instead of link clicks: exit fills the overlay, `onComplete` advances, enter empties it. Reduced motion cuts directly.
