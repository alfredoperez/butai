---
id: code-spotlight-slide
name: Code Spotlight Slide
kind: slide
category: code
description: One code block; each step spotlights a different line range (the rest dim and soften) with a short note. Arrow keys walk the focuses via the engine step system.
tags: [code, spotlight, focus, steps]
motion: step-driven via hidden data-step markers; per-line dim/blur transition on focus change; reduced motion drops the blur
dependencies: [codehike]
registryDependencies: [code-hike-highlighter]
source: { file: src/slides/code-spotlight-slide.tsx }
---

```tsx
<CodeSpotlightSlide
  chapter="Code"
  title="A highlight hook, one beat at a time"
  lang="tsx"
  code={source}
  steps={[
    { focus: [1, 2], note: "State holds the result." },
    { focus: [3, 7], note: "Resolve the async highlight in an effect." },
    { focus: [6, 6], note: "Cancel on unmount so stale results never land." },
  ]}
/>
```

### Code Hike seam

By default the slide renders plain, dependency-free code (theme colors), so the
packaged examples never need codehike installed. `butai add code-spotlight-slide`
also copies the `code-hike-highlighter` primitive and reports `codehike` as the
npm dependency to install. To turn on real syntax colors, install codehike and
pass the adapter through the `highlighter` prop:

```tsx
import { codeHikeHighlighter } from "@/primitives/code-hike-highlighter";

<CodeSpotlightSlide highlighter={codeHikeHighlighter} ... />
```
