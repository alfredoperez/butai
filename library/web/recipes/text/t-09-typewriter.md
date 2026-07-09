---
id: t-09-typewriter
name: 'Typewriter'
kind: motion
category: text
engine: gsap/TextPlugin
description: 'Type text out character by character — terminal lines, commands, captions.'
motion: 'run on active; reduced motion sets the full text instantly'
tags: [text, typewriter, terminal]
---

```ts
gsap.registerPlugin(TextPlugin);
gsap.set('[sel]', { text: '' });
gsap.to('[sel]', { duration: 2, ease: 'none', text: '[your text]', delay: 0.5 }); // on active
```

## Adapt

Run on active with `ease: "none"` so typing speed is constant. Reduced motion sets the complete string — never leave the element empty at rest.
