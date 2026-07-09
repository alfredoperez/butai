---
id: demo-cue-slide
name: Demo Cue Slide
kind: slide
category: demo
description: Cue card for a live demo — accent badge + h1 + optional subtitle. Drops the speaker out of the deck and into the demo.
tags: [demo, cue, live]
source: { file: src/slides/demo-cue-slide.tsx }
---

```tsx
<DemoCueSlide
  chapter="Live Demo"
  cue="Live Demo"
  iconName="terminal"
  title="Back to the spec we created"
  subtitle="We'll create it, plan it, and review it — live."
/>
```
