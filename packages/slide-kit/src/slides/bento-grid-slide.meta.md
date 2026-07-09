---
id: bento-grid-slide
name: Bento Grid Slide
kind: slide
category: layout
description: Bento grid of mixed tiles (stat / text / quote), each spanning 1–2 cols/rows. The 'everything at a glance' dashboard beat.
tags: [layout, bento, grid, dashboard]
source: { file: src/slides/bento-grid-slide.tsx }
---

```tsx
<BentoGridSlide
  chapter="Recap"
  title="The quarter, at a glance"
  tiles={[
    { value: "412", title: "PRs shipped", tone: "accent", colSpan: 2 },
    { value: "24m", title: "Median review", tone: "green" },
    { value: "1.4", title: "Reverts / 100", tone: "red" },
    { title: "What changed", body: "Specs made review a step, not a scramble.", colSpan: 2 },
  ]}
/>
```
