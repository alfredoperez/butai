---
id: cold-open-slide
name: Cold Open Slide
kind: slide
category: structure
description: Cold open — background + eyebrow only; the title is held back to land on the first click.
tags: [structure, opener, reveal]
source: { file: src/slides/cold-open-slide.tsx }
---

```tsx
<ColdOpenSlide
  coldOpen
  miniHeader="DevTools Summit · 2026"
  title={<>The Big <span className="c-accent">Idea</span></>}
  subtitle="Hold the title back, then land it."
/>
```
