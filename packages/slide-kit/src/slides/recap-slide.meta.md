---
id: recap-slide
name: Recap Slide
kind: slide
category: content
description: Closing recap of a section or the whole talk. A check-marker list anchors what the audience just heard.
tags: [content, recap, summary, closing]
source: { file: src/slides/recap-slide.tsx }
---

```tsx
<RecapSlide
  chapter="Recap"
  title={<>What we <span className="c-accent">saw today</span></>}
  items={[
    { title: "Vibe coding fails at scale", sub: "the bug ships anyway" },
    { title: "Spec-driven development", sub: "the spec before the code" },
    { title: "An open standard", sub: "portable across tools" },
  ]}
/>
```
