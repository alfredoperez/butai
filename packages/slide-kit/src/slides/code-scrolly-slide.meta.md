---
id: code-scrolly-slide
name: Code Scrolly Slide
kind: slide
category: code
description: Explanation cards on one side, code on the other; each step advances the active card and refocuses the code to the lines it describes. Scrollycoding, adapted to a stepped deck.
tags: [code, scrolly, walkthrough, steps]
motion: step-driven via hidden data-step markers; active card highlights and code focus moves per advance; reduced motion drops the dim blur and card transition
dependencies: [codehike]
registryDependencies: [code-hike-highlighter]
source: { file: src/slides/code-scrolly-slide.tsx }
---

```tsx
<CodeScrollySlide
  chapter="Code"
  title="How review reads a change"
  lang="ts"
  code={source}
  steps={[
    { focus: [2, 3], title: "Load the spec", body: "No spec means flag and stop early." },
    { focus: [4, 4], title: "Load the plan", body: "The plan is the contract to judge against." },
    { focus: [5, 6], title: "Judge the diff", body: "Spec, plan, and diff decide the verdict." },
  ]}
/>
```

### Code Hike seam

By default the slide renders plain, dependency-free code (theme colors), so the
packaged examples never need codehike installed. `butai add code-scrolly-slide`
also copies the `code-hike-highlighter` primitive and reports `codehike` as the
npm dependency to install. To turn on real syntax colors, install codehike and
pass the adapter through the `highlighter` prop:

```tsx
import { codeHikeHighlighter } from "@/primitives/code-hike-highlighter";

<CodeScrollySlide highlighter={codeHikeHighlighter} ... />
```
