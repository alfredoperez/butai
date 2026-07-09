---
id: ui-13-counter-odometer
name: 'Counter / Number Odometer'
kind: motion
category: attention
engine: gsap
description: 'Animate a number from zero to its target with locale formatting — the top pick for KPI and stat moments.'
motion: 'run on active; reduced motion sets the final value instantly'
tags: [attention, counter, kpi]
---

```ts
const obj = { value: 0 };
gsap.to(obj, {
  value: target,
  duration: 2,
  ease: 'power2.out',
  onUpdate: () => {
    el.textContent = Math.round(obj.value).toLocaleString() + suffix;
  },
}); // on active
```

## Adapt

Tween a plain object and format in `onUpdate` — never tween `textContent` directly. Run on active; reduced motion writes the final formatted value immediately.
