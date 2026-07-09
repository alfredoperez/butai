---
id: image-text-split-slide
name: Image Text Split Slide
kind: slide
category: content
description: Half image, half copy. Use for product detail beats or storytelling pairs.
tags: [content, image, split, layout]
source: { file: src/slides/image-text-split-slide.tsx }
---

```tsx
<ImageTextSplitSlide
  chapter="Product"
  image="/img/viewer.png"
  alt="Viewer"
  side="left"
  eyebrow="Spec Viewer"
  title="Read and navigate specs like code"
  body={<p>Rendered markdown with anchors to sub-documents.</p>}
/>
```
