---
id: before-after-slide
name: Before After Slide
kind: slide
category: layout
description: Two panels (before/after) with header chips and a center divider arrow. Opens on the "before" state; the first engine step brings "after" in and lights the arrow.
tags: [layout, before-after, comparison, steps, transformation]
motion: step-driven via a hidden data-step marker; the after panel waits dimmed and shifted, then transitions in on the first advance; reduced motion drops the transition and shift
source: { file: src/slides/before-after-slide.tsx }
---

```tsx
<BeforeAfterSlide
  chapter="Payoff"
  title="Review, before and after specs"
  before={{
    label: "Before",
    title: "Vibe-coded PRs",
    points: ["Reviewer reverse-engineers intent", "Median review 71 minutes"],
  }}
  after={{
    label: "After",
    title: "Spec-first PRs",
    points: ["Intent is written down first", "Median review 24 minutes"],
  }}
/>
```

### Reveal

The slide rides the engine's `data-step` system through the shared step
plumbing (`useStepIndex` / `StepMarkers`): beat one shows "before" with
"after" held back at low opacity, the next advance reveals "after". Outside
an engine it statically shows the first beat. Panel `tone` overrides the
red/green defaults.
