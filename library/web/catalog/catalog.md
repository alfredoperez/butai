# Butai pattern catalog

- count: 57
- version: 0.0.1
- contentHash: 70804eb39185d6aa4059778a4071dc1c328c56267347c2c4373b5e4feb829aab

## motion

### attention

- **Confetti / Particle Burst** (`adv-13-confetti-burst`) · engine: gsap/Physics2D — A particle burst from a point — the "ta-da" for a reveal or closing moment.
  - motion: fire once on a step; reduced motion replaces the burst with a simple fade-in
- **Gravity Drop** (`adv-14-gravity-drop`) · engine: gsap/Physics2D — Elements fall in under gravity with a little friction — a physical entrance for a cluster of items.
  - motion: run on active; reduced motion uses a simple fade-up instead of physics
- **Card Hover Lift** (`ui-01-card-hover-lift`) · engine: gsap — A card lifts and scales slightly under the pointer — polish for interactive (laptop) surfaces.
  - motion: pointer-driven, interactive surfaces only; disable on touch, projection, and reduced motion
- **3D Card Tilt** (`ui-02-3d-card-tilt`) · engine: gsap — A card tilts in 3D toward the pointer — use gsap.quickTo in the move handler, never gsap.to per frame.
  - motion: pointer-driven, interactive surfaces only; disable on touch and reduced motion
- **Stacked Card Fan** (`ui-05-stacked-card-fan`) · engine: gsap — A stack of cards fans out into an arc — a reveal for a hand of options.
  - motion: fan on a step; duration 0 for reduced motion
- **Magnetic Button** (`ui-08-magnetic-button`) · engine: gsap — A button drifts toward the pointer and snaps back on leave — desktop-only micro-delight.
  - motion: pointer-driven, interactive surfaces only; disable on touch and reduced motion
- **Button Shimmer** (`ui-09-button-shimmer`) · engine: gsap — A light sweep crosses a button — a paused timeline replayed on demand.
  - motion: paused timeline; play on step or hover; skip on reduced motion
- **Button Morph** (`ui-10-button-morph`) · engine: gsap — A button morphs between two states via a paused timeline played and reversed.
  - motion: paused timeline; play/reverse on state change; duration 0 for reduced motion
- **Smooth Accordion** (`ui-11-smooth-accordion`) · engine: gsap — Animate an expand/collapse between height 0 and auto — measure the auto height, then tween.
  - motion: toggle on step or click; duration 0 for reduced motion
- **Counter / Number Odometer** (`ui-13-counter-odometer`) · engine: gsap — Animate a number from zero to its target with locale formatting — the top pick for KPI and stat moments.
  - motion: run on active; reduced motion sets the final value instantly
- **Progress / Stat Bar** (`ui-14-progress-stat-bar`) · engine: gsap — Fill a bar to a target percentage using scaleX (compositor-friendly), not width.
  - motion: run on active, stagger multiple bars; reduced motion sets the fill instantly
### background

- **Organic Random Entrance** (`adv-04-organic-random-entrance`) · engine: gsap — Each element enters from its own random offset and rotation with a random-order stagger.
  - motion: run on active; duration 0 for reduced motion
- **Infinite Wrap Loop** (`adv-06-infinite-wrap-loop`) · engine: gsap — Cycle values endlessly with gsap.utils.wrap — positions or a 360-degree rotation orbit.
  - motion: loop only while active; pause on reduced motion
- **Organic Floating Elements** (`adv-15-organic-floating`) · engine: gsap — Elements drift to new random spots forever via a recursive onComplete — a lava-lamp background.
  - motion: start only while active; do not start under reduced motion
- **Infinite Marquee** (`scr-13-infinite-marquee`) · engine: gsap — An endless horizontal ticker of logos or keywords — pure repeat, no scroll dependence.
  - motion: loop only while active; pause on reduced motion
- **Blob Morph Loop** (`svg-09-blob-morph-loop`) · engine: gsap/MorphSVG — An organic shape morphs forever between a few reference blobs — a living background element.
  - motion: loop only while active; pause on reduced motion; keep durations slow (3-5s)
### svg-diagram

- **Stroke Draw On** (`svg-01-stroke-draw-on`) · engine: gsap/DrawSVG — Draw a line or path on as if hand-drawn — diagram connectors, arrows, underlines that build in.
  - motion: drive on active; duration 0 for reduced motion
- **Stroke Erase** (`svg-02-stroke-erase`) · engine: gsap/DrawSVG — Retract a drawn stroke — the reverse of draw-on — or sweep a moving dash window along a path.
  - motion: drive on a later step; duration 0 for reduced motion
- **Scribble Underline** (`svg-03-scribble-underline`) · engine: gsap/DrawSVG — A hand-drawn wavy underline revealed as an emphasis beat under a headline.
  - motion: trigger on a step (not hover); duration 0 for reduced motion
- **Signature / Handwriting Reveal** (`svg-04-signature-reveal`) · engine: gsap/DrawSVG — Sequentially draw multiple pen-stroke paths so the mark looks written — signatures, built-up logos, glyphs.
  - motion: build the timeline on active; reduced motion sets all paths fully drawn instantly
- **Multi-Path Sequential Draw** (`svg-05-multi-path-sequential-draw`) · engine: gsap/DrawSVG — Draw many diagram segments in order, each timed to its length so pen speed feels constant.
  - motion: one timeline on active, or one segment per step for click-paced assembly
- **Step-Scrubbed Stroke** (`svg-06-step-scrubbed-stroke`) · engine: gsap/DrawSVG — A paused draw-on timeline whose progress is driven by the step index instead of scroll.
  - motion: paused timeline; step change tweens progress; reduced motion jumps to the target progress
- **Shape Morph (Simple)** (`svg-07-shape-morph-simple`) · engine: gsap/MorphSVG — Morph one SVG path into another (circle to star, etc.) — convert primitives to paths first.
  - motion: trigger on a step; duration 0 for reduced motion
- **Icon-to-Icon Morph** (`svg-08-icon-to-icon-morph`) · engine: gsap/MorphSVG — Toggle between two icon states (play/pause, menu/close) — a live-toggle cue for interactive demos.
  - motion: toggle on step or click; duration 0 for reduced motion
- **Multi-Shape Morph Sequence** (`svg-10-multi-shape-morph-sequence`) · engine: gsap/MorphSVG — Morph through several reference shapes in sequence, driven by the step index.
  - motion: paused timeline; step change tweens progress; reduced motion jumps to the target shape
- **Element Along Path** (`svg-11-element-along-path`) · engine: gsap/MotionPath — Move a token, avatar, or dot along an (often hidden) SVG path — data flowing through a diagram.
  - motion: run on active; duration 0 for reduced motion
- **Auto-Rotate Along Path** (`svg-12-auto-rotate-along-path`) · engine: gsap/MotionPath — Same as element-along-path but the element turns to face its direction of travel — an arrowhead, a ship.
  - motion: run on active; continuous orbits use repeat -1 and pause on reduced motion
- **Step-Driven Path Follower** (`svg-13-step-driven-path-follower`) · engine: gsap/MotionPath — An element whose position along a path tracks progress — driven by the step index instead of scroll.
  - motion: paused timeline; step change sets progress; reduced motion jumps to the target position
- **SVG Clip-Path Reveal** (`svg-14-clip-path-reveal`) · engine: gsap — Wipe an image or graphic into view by animating an SVG clip rect — a clean masked reveal.
  - motion: run on active; duration 0 for reduced motion
- **SVG Filter Distortion (Liquid)** (`svg-15-filter-distortion-liquid`) · engine: gsap — A liquid/glass ripple over one hero element via feTurbulence and feDisplacementMap.
  - motion: trigger on a step, then settle back; skip entirely on reduced motion
### text

- **Line Reveal** (`t-01-line-reveal`) · engine: gsap/SplitText — A multi-line headline rises in line by line.
  - motion: gate on active; duration 0 for reduced motion
- **Word Reveal** (`t-02-word-reveal`) · engine: gsap/SplitText — Words cascade upward into place — the standard split-text entrance for titles.
  - motion: gate on active; duration 0 for reduced motion
- **Character Reveal** (`t-03-character-reveal`) · engine: gsap/SplitText — Per-character cascade with a back.out pop — energetic titles and single punch words.
  - motion: gate on active; duration 0 for reduced motion
- **Masked Line Reveal** (`t-04-masked-line-reveal`) · engine: gsap/SplitText — Lines slide up from behind a clip mask — the premium reveal. Needs GSAP 3.13+.
  - motion: trigger inside onSplit when active; duration 0 for reduced motion
- **Step-Revealed Text** (`t-05-step-revealed-text`) · engine: gsap/SplitText — Words sit ghosted at low opacity, then brighten to full — revealed as one tween or per step.
  - motion: brighten on active or per step; reduced motion shows full opacity immediately
- **Rotated Character Entrance** (`t-06-rotated-character-entrance`) · engine: gsap/SplitText — Characters flip in on the X axis in 3D — set perspective on the parent.
  - motion: gate on active; duration 0 for reduced motion
- **Scramble Decode** (`t-07-scramble-decode`) · engine: gsap/ScrambleText — Text resolves out of random characters — a matrix-style decode for a reveal moment.
  - motion: run on active; reduced motion sets the final text instantly
- **Custom Glyph Scramble** (`t-08-custom-glyph-scramble`) · engine: gsap/ScrambleText — Scramble decode with a themed glyph set: binary "01", Katakana for cyberpunk, dots and dashes for minimal.
  - motion: run on active; reduced motion sets the final text instantly
- **Typewriter** (`t-09-typewriter`) · engine: gsap/TextPlugin — Type text out character by character — terminal lines, commands, captions.
  - motion: run on active; reduced motion sets the full text instantly
- **Text Swap / Rotating Headlines** (`t-10-rotating-headlines`) · engine: gsap/TextPlugin — Cycle one slot word through a list ("build / ship / scale"): fade out, swap, fade in, hold, repeat.
  - motion: loop only while active; pause on reduced motion
- **RGB Split Glitch** (`t-13-rgb-split-glitch`) · engine: gsap — Chromatic-aberration glitch bursts on a headline — two colored layers jitter and reset.
  - motion: burst on a step or sparse random timer; skip on reduced motion
- **Skew Glitch Burst** (`t-14-skew-glitch-burst`) · engine: gsap — Lightweight single-element skew jitter — a quick attention tic with no extra layers.
  - motion: burst on a step or sparse random timer; skip on reduced motion
### transitions

- **3D Card Flip** (`ui-03-3d-card-flip`) · engine: gsap — Flip a card front-to-back in 3D — needs preserve-3d and backface-visibility hidden.
  - motion: flip on a step or click; duration 0 for reduced motion
- **Card Expand to Detail** (`ui-04-card-expand-to-detail`) · engine: gsap/Flip — A card morphs from grid tile into a full detail panel and back — same DOM, animated layout change.
  - motion: trigger on a step click; duration 0 for reduced motion
- **Step Stagger Reveal** (`ui-06-step-stagger-reveal`) · engine: gsap — Cards or list items stagger in — reach for GSAP only when you need its grid/random stagger distribution.
  - motion: run on active; prefer the platform default entrance for plain cases; duration 0 for reduced motion
- **Flip Grid Filter** (`ui-07-flip-grid-filter`) · engine: gsap/Flip — Re-filter a grid and have surviving items smoothly relayout into their new slots.
  - motion: drive per step (each step = a filter); duration 0 for reduced motion
- **Transition Wipe** (`ui-16-transition-wipe`) · engine: gsap — A full-screen accent panel wipes across on enter/exit — a between-view wipe overlay.
  - motion: hook to the surface change (slide/scene advance); duration 0 for reduced motion
### utility

- **Step-to-Value Range Mapping** (`adv-01-step-to-value-mapping`) · engine: gsap — Map step progress to any value range with mapRange and clamp built outside the update callback.
  - motion: drive by step progress; values apply instantly (reduced-motion safe)
- **Pointer-to-Value Range Mapping** (`adv-02-pointer-to-value-mapping`) · engine: gsap — Map pointer position to a value range, applied through gsap.quickTo — desktop-interactive surfaces only.
  - motion: pointer-driven, interactive surfaces only; disable on touch and reduced motion
- **Color Interpolation** (`adv-03-color-interpolation`) · engine: gsap — Interpolate between two colors by progress — handles hex, rgb, hsl, and named colors.
  - motion: drive by step progress; apply with gsap.set
- **Radial / Grid Stagger** (`adv-05-radial-grid-stagger`) · engine: gsap — Ripple a stagger outward from the center or edges of a grid using gsap.utils.distribute.
  - motion: run on active; duration 0 for reduced motion
- **Chained Utility Pipeline** (`adv-07-utility-pipeline`) · engine: gsap — Compose a value transform once with gsap.utils.pipe (normalize, map, snap) and reuse it.
  - motion: composition helper; inherits the drive mode of whatever consumes it
- **Snap-to-Grid Drag** (`adv-08-snap-to-grid`) · engine: gsap/Draggable — Drag an element with inertia that settles onto a grid via a snap function.
  - motion: interactive surfaces only; disable on reduced motion (no throw physics)
- **Custom Easing** (`adv-09-custom-easing`) · engine: gsap/CustomEase — Register a brand ease once and reuse it everywhere by name — plus CustomBounce and CustomWiggle.
  - motion: define once at setup; eases apply wherever recipes run
- **Draggable Element** (`adv-10-draggable-element`) · engine: gsap/Draggable — A momentum-draggable element with bounds — the base for hands-on demo surfaces.
  - motion: interactive surfaces only; disable inertia on reduced motion
- **Draggable Carousel** (`adv-11-draggable-carousel`) · engine: gsap/Draggable — A momentum carousel that snaps to each panel width after a throw.
  - motion: interactive surfaces only; disable inertia on reduced motion
- **Swipe / Gesture Observer** (`adv-12-swipe-gesture`) · engine: gsap/Observer — Unified touch/pointer/wheel gesture detection with an isAnimating guard — could drive step navigation.
  - motion: guard with isAnimating; the platform nav layer owns navigation — use with care
