---
id: feature-callout
name: Feature Callout
kind: scene
category: callout
description: A centered framed shot placeholder with a mono eyebrow label on top and a big display caption with one accent payoff below.
tags: [scene, callout, shot-with-caption]
engine: css
motion: a slow crop punch-in on the shot, then the caption rises and lands a beat after the frame settles; firm eases, no bounce
source: { file: src/scenes/feature-callout.html }
---

```html
<!-- feature-callout — a generic placeholder panel, not a real screenshot -->
<section class="scene">
  <div class="shot"><div class="placeholder">Your UI here</div></div>
  <div class="scrim"></div>
  <div class="eyebrow">Feature · what it does</div>
  <div class="caption">One panel, <span class="accent">one payoff</span></div>
</section>
```
