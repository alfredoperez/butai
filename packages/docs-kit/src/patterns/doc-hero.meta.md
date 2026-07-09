---
id: doc-hero
name: Doc Hero
kind: page
category: header
description: Brief/report opener — a mono eyebrow, one tight display headline with one accent word, a one-line summary, and a meta row of date + status badges.
tags: [page, header, opener]
engine: none
source: { file: src/patterns/doc-hero.html }
---

```html
<!-- doc-hero — the header block; a theme repaints the eyebrow/accent via the token contract -->
<header class="doc-hero">
  <div class="meta"><span>2026-01-01</span> · <span class="badge is-shipped">shipped</span></div>
  <div class="eyebrow">Example.com · Report</div>
  <h1>One tight headline, <span class="accent">one clear idea</span></h1>
  <p class="sub">A one-line summary of what this document argues, in plain language.</p>
</header>
```
