---
id: stat-row-slide
name: Stat Row Slide
kind: slide
category: type
description: Row of 3–4 metric cards with accent edge bars, big display numbers, and an optional secondary line. Use to frame results or scale at a glance.
tags: [type, stats, metrics, results]
source: { file: src/slides/stat-row-slide.tsx }
---

```tsx
<StatRowSlide
  chapter="Results"
  title="The quarter in three figures"
  stats={[
    { value: "412", label: "PRs shipped", sub: "+38% throughput", color: "accent" },
    { value: "24m", label: "Median review", sub: "down from 71m", color: "green" },
    { value: "1.4", label: "Reverts / 100", sub: "from 6.2", color: "red" },
  ]}
/>
```
