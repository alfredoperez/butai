---
id: code-reveal
name: Code Reveal
kind: scene
category: code
description: A mono code block that reveals line by line with one highlighted payoff line. Generic sample code, no personal refs.
tags: [scene, code, reveal]
engine: css
motion: lines reveal top to bottom staggered, sliding in from the read direction; the highlighted line settles last and holds; no bounce
source: { file: src/scenes/code-reveal.html }
---

```html
<!-- code-reveal — one highlighted line is the payoff; a theme repaints it -->
<div class="code">
  <span class="ln"><span class="kw">async function</span> load(id) {</span>
  <span class="ln hot">  <span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> Error("not found");</span>
  <span class="ln">}</span>
</div>
```
