---
id: cover-slide
name: Cover Slide
kind: slide
category: structure
description: Deck opener — eyebrow, big display-font title, subtitle, optional faded background image.
tags: [structure, opener, title]
source: { file: src/slides/cover-slide.tsx }
---

```tsx
<CoverSlide
  miniHeader="DevTools Summit · 2026"
  title={<>Ship Faster, <span className="c-accent">Break Less</span></>}
  subtitle="A practical guide to spec-driven delivery."
/>
```
