---
id: outro-scene
name: Outro Scene
kind: scene
category: closing
description: An end card — a generic wordmark, a two-line CTA with one accent tagline, and a follow ask. Generic brand, no logo or brand character.
tags: [scene, closing, end-card]
engine: css
motion: elements rise and settle top to bottom, staggered, on firm eases; no bounce, no overshoot
source: { file: src/scenes/outro-scene.html }
---

```html
<!-- outro-scene — the accent tagline is the single payoff; generic brand only -->
<section class="scene">
  <div class="wordmark">Studio Kit</div>
  <div class="tagline">Build in the open.</div>
  <div class="cta">npm create example-app</div>
  <div class="follow">New drops weekly. Follow along.</div>
</section>
```
