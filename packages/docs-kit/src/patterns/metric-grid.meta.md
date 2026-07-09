---
id: metric-grid
name: Metric Grid
kind: page
category: data
description: A trio of counted stat cards — a mono kicker, a big number in a status color, and a caption. The scannable summary after a grouped section.
tags: [page, data, metrics, tally]
engine: none
source: { file: src/patterns/metric-grid.html }
---

```html
<!-- metric-grid — the big number takes a status color; a theme repaints the palette -->
<div class="metric-grid">
  <div class="metric ok"><span class="k">shipped</span><span class="n">12</span><p>patterns cataloged.</p></div>
  <div class="metric warn"><span class="k">planned</span><span class="n">4</span><p>queued next.</p></div>
</div>
```
