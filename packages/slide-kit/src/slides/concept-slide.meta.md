---
id: concept-slide
name: Concept Slide
kind: slide
category: content
description: Eyebrow label + big serif title + optional subtitle. Use for concept defines (What is X?).
tags: [content, concept, title]
source: { file: src/slides/concept-slide.tsx }
---

```tsx
<ConceptSlide
  chapter="Concepts"
  eyebrow="The Concept"
  title={<>What is <span className="c-accent">Spec-Driven Development</span>?</>}
/>
```
