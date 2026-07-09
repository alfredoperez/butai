---
id: code-slideshow-slide
name: Code Slideshow Slide
kind: slide
category: code
description: Step through code snapshots that swap with a fade, one caption per snapshot and a dot progress row. The before/during/after refactor slide.
tags: [code, slideshow, refactor, steps]
motion: step-driven via hidden data-step markers; snapshot fade on advance (generic seam; a Code Hike token morph needs its DOM renderer); reduced motion disables the fade
dependencies: [codehike]
registryDependencies: [code-hike-highlighter]
source: { file: src/slides/code-slideshow-slide.tsx }
---

```tsx
<CodeSlideshowSlide
  chapter="Code"
  title="Refactor, live"
  lang="ts"
  snapshots={[
    { code: "function add(a, b) {\n  return a + b;\n}", caption: "Start: a plain function." },
    { code: "const add = (a, b) => a + b;", caption: "Arrow + implicit return." },
    { code: "const add = (a: number, b: number): number => a + b;", caption: "Typed." },
  ]}
/>
```

### Code Hike seam

By default the slide renders plain, dependency-free code (theme colors), so the
packaged examples never need codehike installed. `butai add code-slideshow-slide`
also copies the `code-hike-highlighter` primitive and reports `codehike` as the
npm dependency to install. To turn on real syntax colors, install codehike and
pass the adapter through the `highlighter` prop:

```tsx
import { codeHikeHighlighter } from "@/primitives/code-hike-highlighter";

<CodeSlideshowSlide highlighter={codeHikeHighlighter} ... />
```
