---
id: comparison-table-slide
name: Comparison Table Slide
kind: slide
category: layout
description: Feature matrix (rows × columns) with check/x/partial or short-text cells and an optional highlighted winning column. The 'X vs Y' slide.
tags: [layout, comparison, table, matrix]
source: { file: src/slides/comparison-table-slide.tsx }
---

```tsx
<ComparisonTableSlide
  chapter="Compare"
  title="Why spec-driven wins"
  columns={["Vibe coding", "Spec + plan", "Reviewed"]}
  highlight={2}
  rows={[
    { label: "Structure", cells: [false, true, true] },
    { label: "Handoff survives", cells: [false, "partial", true] },
    { label: "Review built in", cells: [false, false, true] },
  ]}
/>
```
