---
id: decisions
name: Decisions
kind: page
category: structure
description: A numbered locked-decisions list, ADR-style — a chip digit, a title, and a muted rationale, one row per decision.
tags: [page, structure, decisions, adr]
engine: none
source: { file: src/patterns/decisions.html }
---

```html
<!-- decisions — the chip digit takes the accent; a theme repaints it -->
<div class="decisions">
  <div class="dec">
    <span class="num">1</span>
    <div class="body"><h3>The locked choice</h3><p>Why it was made, in one line.</p></div>
  </div>
</div>
```
