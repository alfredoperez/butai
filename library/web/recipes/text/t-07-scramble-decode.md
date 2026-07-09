---
id: t-07-scramble-decode
name: 'Scramble Decode'
kind: motion
category: text
engine: gsap/ScrambleText
description: 'Text resolves out of random characters — a matrix-style decode for a reveal moment.'
motion: 'run on active; reduced motion sets the final text instantly'
tags: [text, scramble, reveal]
---

```ts
gsap.registerPlugin(ScrambleTextPlugin);
gsap.to('[sel]', {
  duration: 2,
  ease: 'none',
  scrambleText: { text: '[final]', chars: 'upperAndLowerCase', revealDelay: 0.3, speed: 0.4 },
}); // on active
```

## Adapt

Run once on active — a decode that replays on every revisit gets old fast. Reduced motion sets the final string with no scramble frames.
