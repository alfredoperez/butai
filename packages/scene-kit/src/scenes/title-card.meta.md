---
id: title-card
name: Title Card
kind: scene
category: opener
description: Kinetic-type opener — a mono eyebrow, a big display headline with one accent word, and a calm subtitle. No UI.
tags: [scene, opener, kinetic-type]
engine: css
motion: eyebrow and headline rise and settle on firm eases, then the subtitle lands a beat later; power2/power3 out, no bounce
source: { file: src/scenes/title-card.html }
---

```html
<!-- title-card — the accent word is the single payoff; a theme repaints it -->
<section class="scene">
  <div class="eyebrow">Example.com · 2026</div>
  <h1 class="headline">Ship faster, <span class="accent">break less</span></h1>
  <p class="sub">A calm, one-idea-per-frame opener.</p>
</section>
```
