---
id: comparison
name: Comparison
kind: page
category: data
description: A side-by-side pair — a before/other side (warm tint) versus an after/ours side (green tint), each with a mono label. The core X vs Y device.
tags: [page, data, compare, before-after]
engine: none
source: { file: src/patterns/comparison.html }
---

```html
<!-- comparison — side.a and side.b tint the status palette; a theme repaints both -->
<div class="pair">
  <div class="side a"><span class="lbl">Before</span><p>Every doc was hand-styled.</p></div>
  <div class="side b"><span class="lbl">After</span><p>One token set repaints them all.</p></div>
</div>
```
