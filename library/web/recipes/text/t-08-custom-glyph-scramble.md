---
id: t-08-custom-glyph-scramble
name: 'Custom Glyph Scramble'
kind: motion
category: text
engine: gsap/ScrambleText
description: 'Scramble decode with a themed glyph set: binary "01", Katakana for cyberpunk, dots and dashes for minimal.'
motion: 'run on active; reduced motion sets the final text instantly'
tags: [text, scramble, themed]
---

```ts
gsap.to('[sel]', {
  duration: 2,
  ease: 'none',
  scrambleText: { text: '[final]', chars: '01', revealDelay: 0.3, speed: 0.4 },
});
```

## Adapt

Pick the `chars` set from the theme language (binary for terminal themes, Katakana for neon, "·•—" for calm). Same active gating and reduced-motion rule as the base decode.
