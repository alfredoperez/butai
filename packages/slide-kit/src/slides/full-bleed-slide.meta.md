---
id: full-bleed-slide
name: Full Bleed Slide
kind: slide
category: layout
description: Edge-to-edge image with a text lockup over a scrim — the cinematic opener / chapter cover. Degrades to a gradient if the image is missing.
tags: [layout, image, cinematic, cover]
source: { file: src/slides/full-bleed-slide.tsx }
---

```tsx
<FullBleedSlide
  chapter="Chapter"
  eyebrow="Part II"
  title="Ship faster, break less"
  subtitle="How spec-driven delivery changed the numbers."
  anchor="bottom-left"
/>
```
