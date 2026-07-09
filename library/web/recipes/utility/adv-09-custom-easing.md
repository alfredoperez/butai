---
id: adv-09-custom-easing
name: 'Custom Easing'
kind: motion
category: utility
engine: gsap/CustomEase
description: 'Register a brand ease once and reuse it everywhere by name — plus CustomBounce and CustomWiggle.'
motion: 'define once at setup; eases apply wherever recipes run'
tags: [utility, easing]
---

```ts
gsap.registerPlugin(CustomEase);
CustomEase.create('brandEase', '.17,.67,.35,1.2');
gsap.to('[sel]', { y: 0, duration: 0.8, ease: 'brandEase' });
```

## Adapt

Register the ease once at startup and reference it by name in every recipe — the ease IS the brand's motion signature. CustomBounce/CustomWiggle extend the same idea.
