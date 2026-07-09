---
id: terminal-slide
name: Terminal Slide
kind: slide
category: demo
description: Terminal window chrome (traffic lights, title bar) with mono lines that reveal per step or staggered. Prompt/output/comment line styling plus a highlighted payoff line.
tags: [demo, terminal, cli, steps, walkthrough]
motion: "stagger (default) fades lines in sequentially on slide activation via pure CSS; steps reveals one line per engine advance through hidden data-step markers; reduced motion shows all lines at once"
source: { file: src/slides/terminal-slide.tsx }
---

```tsx
<TerminalSlide
  chapter="Demo"
  title="One command, whole pipeline"
  windowTitle="~/acme-app"
  reveal="steps"
  lines={[
    { kind: "prompt", text: "specify plan payments-v2" },
    { kind: "output", text: "reading spec … ok (14 requirements)" },
    { kind: "output", text: "writing plan.md … ok" },
    { kind: "comment", text: "# review the plan before any code exists" },
    { kind: "highlight", text: "plan ready for review -> plan.md" },
  ]}
/>
```

### Line kinds

`prompt` renders an accent `$` glyph (override via `prompt`), `output` is
dimmed, `comment` is dimmed italic, and `highlight` is the accented payoff
line. In `steps` mode the window keeps its full height while lines reveal, so
the chrome never jumps mid-demo; outside an engine only the first line shows.
