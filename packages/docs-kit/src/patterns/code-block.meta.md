---
id: code-block
name: Code Block
kind: page
category: code
description: A terminal window plus a code viewer, both hand-highlighted with span classes (no highlight.js, no CDN) — a command session and a focused source excerpt.
tags: [page, code, terminal, viewer]
engine: none
source: { file: src/patterns/code-block.html }
---

```html
<!-- code-block — hand-highlighted spans, no highlight.js; each maps to a contract token -->
<div class="term">
  <div class="body"><span class="p">$</span> <span class="cmd">docs gen</span>
<span class="ok">&#10003;</span> <span class="o">cataloged 12 patterns</span></div>
</div>
```
