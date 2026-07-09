---
id: speaker-intro-slide
name: Speaker Intro Slide
kind: slide
category: closing
description: Speaker introduction — avatar + name + role + bio + links. Drop it early to set credibility.
tags: [closing, speaker, bio, intro]
source: { file: src/slides/speaker-intro-slide.tsx }
---

```tsx
<SpeakerIntroSlide
  chapter="Speaker"
  avatar="/img/avatar.png"
  name="Jordan Rivera"
  role="Developer Advocate"
  bio="Builds tools so that writing software with AI feels like engineering, not improvisation."
  links={[{ label: "example.dev", href: "https://example.dev" }]}
/>
```
