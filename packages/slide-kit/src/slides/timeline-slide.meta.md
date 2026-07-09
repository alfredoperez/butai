---
id: timeline-slide
name: Timeline Slide
kind: slide
category: layout
description: Horizontal timeline / roadmap — dated beats (when + title + body) on a connecting line. Use for history or now·next·later.
tags: [layout, timeline, roadmap, chronology]
source: { file: src/slides/timeline-slide.tsx }
---

```tsx
<TimelineSlide
  chapter="Roadmap"
  title="How the workflow evolved"
  items={[
    { when: "v0", title: "Vibe coding", body: "No structure, lost context", color: "red" },
    { when: "v1", title: "Spec + plan", body: "Two files you own", color: "yellow" },
    { when: "v2", title: "Reviewed", body: "Review built into the loop", color: "green" },
    { when: "next", title: "Your workflow", body: "Steal the best, own it", color: "accent" },
  ]}
/>
```
