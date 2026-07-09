# Butai pattern catalog

- count: 25
- version: 0.0.1
- contentHash: c4b7eceb05f24a3c64f9cf04388259aed529a72af6f542108ec2dcc969dbd209

## slide

### closing

- **Speaker Intro Slide** (`speaker-intro-slide`) — Speaker introduction — avatar + name + role + bio + links. Drop it early to set credibility.
### code

- **Code Scrolly Slide** (`code-scrolly-slide`) — Explanation cards on one side, code on the other; each step advances the active card and refocuses the code to the lines it describes. Scrollycoding, adapted to a stepped deck.
  - motion: step-driven via hidden data-step markers; active card highlights and code focus moves per advance; reduced motion drops the dim blur and card transition
- **Code Slideshow Slide** (`code-slideshow-slide`) — Step through code snapshots that swap with a fade, one caption per snapshot and a dot progress row. The before/during/after refactor slide.
  - motion: step-driven via hidden data-step markers; snapshot fade on advance (generic seam; a Code Hike token morph needs its DOM renderer); reduced motion disables the fade
- **Code Spotlight Slide** (`code-spotlight-slide`) — One code block; each step spotlights a different line range (the rest dim and soften) with a short note. Arrow keys walk the focuses via the engine step system.
  - motion: step-driven via hidden data-step markers; per-line dim/blur transition on focus change; reduced motion drops the blur
### content

- **Concept Slide** (`concept-slide`) — Eyebrow label + big serif title + optional subtitle. Use for concept defines (What is X?).
- **Diagram Slide** (`diagram-slide`) — Titled frame hosting an inline SVG diagram with a pure-CSS stroke draw-on entrance and an optional caption. Bring your own SVG; strokes draw in with a per-shape stagger.
  - motion: CSS stroke-dasharray/dashoffset keyframes draw each `dgm-draw` shape on slide activation, staggered by `--dgm-i`; `dgm-fade` labels fade in after; reduced motion renders the diagram fully drawn
- **Image Caption Slide** (`image-caption-slide`) — Title + large screenshot + optional caption. The workhorse of every recap section.
- **Image Text Split Slide** (`image-text-split-slide`) — Half image, half copy. Use for product detail beats or storytelling pairs.
- **Quote Portrait Slide** (`quote-portrait-slide`) — Testimonial with a face — big quote + portrait (photo or initials) + name/role + optional logo. Social proof, vs. the text-only quote.
- **Quote Slide** (`quote-slide`) — Pull quote with attribution. Use for evidence, a stakeholder voice, or a memorable framing.
- **Recap Slide** (`recap-slide`) — Closing recap of a section or the whole talk. A check-marker list anchors what the audience just heard.
### data

- **KPI Slide** (`kpi-slide`) — Row of 2-4 KPI cards with a count-up display number, label, up/down/flat delta pill, and optional context line. Use to land headline metrics with a beat of motion.
  - motion: numbers count up via a tiny self-contained rAF hook when the slide activates; cards stagger in via the engine's data-stagger; reduced motion renders final values immediately
### demo

- **Demo Cue Slide** (`demo-cue-slide`) — Cue card for a live demo — accent badge + h1 + optional subtitle. Drops the speaker out of the deck and into the demo.
- **Terminal Slide** (`terminal-slide`) — Terminal window chrome (traffic lights, title bar) with mono lines that reveal per step or staggered. Prompt/output/comment line styling plus a highlighted payoff line.
  - motion: stagger (default) fades lines in sequentially on slide activation via pure CSS; steps reveals one line per engine advance through hidden data-step markers; reduced motion shows all lines at once
### layout

- **Before After Slide** (`before-after-slide`) — Two panels (before/after) with header chips and a center divider arrow. Opens on the "before" state; the first engine step brings "after" in and lights the arrow.
  - motion: step-driven via a hidden data-step marker; the after panel waits dimmed and shifted, then transitions in on the first advance; reduced motion drops the transition and shift
- **Bento Grid Slide** (`bento-grid-slide`) — Bento grid of mixed tiles (stat / text / quote), each spanning 1–2 cols/rows. The 'everything at a glance' dashboard beat.
- **Big Statement Slide** (`big-statement-slide`) — One huge line — the manifesto / 'one big word' / punchline beat. Centered, minimal, with one accent phrase.
- **Comparison Table Slide** (`comparison-table-slide`) — Feature matrix (rows × columns) with check/x/partial or short-text cells and an optional highlighted winning column. The 'X vs Y' slide.
- **Full Bleed Slide** (`full-bleed-slide`) — Edge-to-edge image with a text lockup over a scrim — the cinematic opener / chapter cover. Degrades to a gradient if the image is missing.
- **Timeline Slide** (`timeline-slide`) — Horizontal timeline / roadmap — dated beats (when + title + body) on a connecting line. Use for history or now·next·later.
### structure

- **Agenda Slide** (`agenda-slide`) — Numbered list of chapters with an optional 'you are here' highlight. Sets the audience's expectations.
- **Cold Open Slide** (`cold-open-slide`) — Cold open — background + eyebrow only; the title is held back to land on the first click.
- **Cover Slide** (`cover-slide`) — Deck opener — eyebrow, big display-font title, subtitle, optional faded background image.
- **Section Divider Slide** (`section-divider-slide`) — Visual chapter break — large number + section name. Lets the audience reset between acts.
### type

- **Stat Row Slide** (`stat-row-slide`) — Row of 3–4 metric cards with accent edge bars, big display numbers, and an optional secondary line. Use to frame results or scale at a glance.
