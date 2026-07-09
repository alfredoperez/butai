---
id: kpi-slide
name: KPI Slide
kind: slide
category: data
description: Row of 2-4 KPI cards with a count-up display number, label, up/down/flat delta pill, and optional context line. Use to land headline metrics with a beat of motion.
tags: [data, kpi, metrics, count-up, delta]
motion: numbers count up via a tiny self-contained rAF hook when the slide activates; cards stagger in via the engine's data-stagger; reduced motion renders final values immediately
source: { file: src/slides/kpi-slide.tsx }
---

```tsx
<KpiSlide
  chapter="Results"
  title="The quarter in numbers"
  items={[
    {
      value: 412,
      label: "PRs shipped",
      delta: { direction: "up", text: "+38% vs Q4" },
      context: "across 6 teams",
    },
    {
      value: 24,
      suffix: "m",
      label: "Median review",
      delta: { direction: "down", text: "from 71m", tone: "good" },
    },
    {
      value: 1.4,
      decimals: 1,
      label: "Reverts / 100",
      delta: { direction: "down", text: "from 6.2", tone: "good" },
    },
  ]}
/>
```

### Delta tones

`direction` picks the arrow; `tone` picks the color and defaults by direction
(up=good/green, down=bad/red, flat=neutral). When down is the win (latency,
reverts), pass `tone: "good"` explicitly.
