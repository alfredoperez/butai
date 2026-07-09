---
id: agenda-slide
name: Agenda Slide
kind: slide
category: structure
description: Numbered list of chapters with an optional 'you are here' highlight. Sets the audience's expectations.
tags: [structure, agenda, overview]
source: { file: src/slides/agenda-slide.tsx }
---

```tsx
<AgendaSlide
  chapter="Agenda"
  current={1}
  items={[
    { num: "01", title: "The problem", sub: "vibe coding fails at scale" },
    { num: "02", title: "Spec-driven development", sub: "the cycle" },
    { num: "03", title: "An open standard" },
    { num: "04", title: "Live demo" },
  ]}
/>
```
