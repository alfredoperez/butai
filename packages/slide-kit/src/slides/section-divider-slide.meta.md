---
id: section-divider-slide
name: Section Divider Slide
kind: slide
category: structure
description: Visual chapter break — large number + section name. Lets the audience reset between acts.
tags: [structure, divider, chapter]
source: { file: src/slides/section-divider-slide.tsx }
---

```tsx
<SectionDividerSlide
  chapter="Section"
  num="02"
  title={<><span className="c-accent">Spec-Driven</span> Development</>}
  subtitle="The cycle that frames the rest of the talk."
/>
```
