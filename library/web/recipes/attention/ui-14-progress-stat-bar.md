---
id: ui-14-progress-stat-bar
name: 'Progress / Stat Bar'
kind: motion
category: attention
engine: gsap
description: 'Fill a bar to a target percentage using scaleX (compositor-friendly), not width.'
motion: 'run on active, stagger multiple bars; reduced motion sets the fill instantly'
tags: [attention, bar, kpi]
---

```ts
gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });
gsap.to(fill, { scaleX: target / 100, duration: 1.2, ease: 'power3.out' }); // on active; stagger multiple bars
```

## Adapt

Always `scaleX` with a left origin — animating `width` forces layout every frame. Stagger multiple bars ~0.1s apart; reduced motion snaps fills to their targets.
