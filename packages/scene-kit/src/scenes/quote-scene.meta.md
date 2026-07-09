---
id: quote-scene
name: Quote Scene
kind: scene
category: quote
description: A large pull-quote with attribution; the oversized quotation mark is the single accent payoff. Generic quote.
tags: [scene, quote, pull-quote]
engine: css
motion: the mark pops in first, then the quote rises and settles, then the attribution lands a beat later; firm eases, no overshoot
source: { file: src/scenes/quote-scene.html }
---

```html
<!-- quote-scene — the accent quotation mark is the single payoff -->
<section class="scene">
  <div class="mark" aria-hidden="true">&ldquo;</div>
  <blockquote class="quote">Make the important thing the obvious thing.</blockquote>
  <div class="attr">Casey Vale<span class="role"> · Design lead</span></div>
</section>
```
