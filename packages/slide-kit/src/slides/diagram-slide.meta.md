---
id: diagram-slide
name: Diagram Slide
kind: slide
category: content
description: Titled frame hosting an inline SVG diagram with a pure-CSS stroke draw-on entrance and an optional caption. Bring your own SVG; strokes draw in with a per-shape stagger.
tags: [content, diagram, svg, draw-on, flow]
motion: CSS stroke-dasharray/dashoffset keyframes draw each `dgm-draw` shape on slide activation, staggered by `--dgm-i`; `dgm-fade` labels fade in after; reduced motion renders the diagram fully drawn
source: { file: src/slides/diagram-slide.tsx }
---

```tsx
<DiagramSlide
  chapter="Workflow"
  title="How a change flows"
  caption="Spec to plan to shipped code, one gate at a time."
>
  <svg viewBox="0 0 760 160" role="img" aria-label="Flow: spec, then plan, then ship">
    <rect className="dgm-draw" pathLength={1} x="30" y="40" width="160" height="80" rx="12"
      fill="none" stroke="var(--accent)" strokeWidth="2.5" />
    <path className="dgm-draw" pathLength={1} style={{ ["--dgm-i" as string]: 1 }}
      d="M200 80 H282 M272 70 l14 10 -14 10" fill="none" stroke="var(--text-dim)" strokeWidth="2.5" />
    <text className="dgm-fade" x="110" y="88" textAnchor="middle" fill="var(--text)" fontSize="22">Spec</text>
    {/* ...repeat for Plan and Ship... */}
  </svg>
</DiagramSlide>
```

### Draw-on contract

Give every drawable stroke the `dgm-draw` class and `pathLength={1}` (one
normalized keyframe draws any shape). Labels take `dgm-fade`. Stagger beats
with `--dgm-i` on either class. Use theme tokens (`var(--accent)`,
`var(--text)`, `var(--text-dim)`) for strokes and fills so the diagram follows
every theme.
