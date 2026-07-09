---
id: card-grid
name: Card Grid
kind: page
category: content
description: A responsive 2/3-column grid of cards — each a title row with status badges, a body, and a muted meta footer. The default unit for a titled item with tags and a note.
tags: [page, content, grid, cards]
engine: none
source: { file: src/patterns/card-grid.html }
---

```html
<!-- card-grid — a titled item with status badges + a muted meta footer -->
<div class="grid cols-3">
  <div class="card">
    <div class="card-head"><h3>First item</h3><span class="badge is-shipped">shipped</span></div>
    <p>A plain-English line on what this item is.</p>
    <div class="card-meta">Owner · <b>Team A</b></div>
  </div>
</div>
```
