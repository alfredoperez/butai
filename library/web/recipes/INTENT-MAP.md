# Intent map — route by what the moment is doing

The decision layer ported from the upstream motion catalog: look up the moment's
job, get the recipe id(s) to reach for. Skills and generators should route through
this table instead of guessing.

Ids reference files in `recipes/<category>/<id>.md`. Intents marked *engine-level*
are served by the platform's default motion layer (plain entrances, component
behavior), not by a GSAP recipe.

| Intent | Recipe id(s) | Notes |
| --- | --- | --- |
| Land one number / stat | `ui-13-counter-odometer` | Count up on active; pair with `ui-14-progress-stat-bar` for bars |
| Show progress / proportion | `ui-14-progress-stat-bar` | scaleX fill, stagger multiple bars |
| Compare A vs B | `ui-07-flip-grid-filter`, `ui-04-card-expand-to-detail` | Flip crossfade between layout states |
| Show a change between two views | `ui-04-card-expand-to-detail` | Flip magic-move: same DOM, new layout |
| Assemble a diagram | `svg-01-stroke-draw-on`, `svg-05-multi-path-sequential-draw` | Sequential stroke-on; per-step via `svg-06-step-scrubbed-stroke` |
| Un-build / rewind a diagram | `svg-02-stroke-erase` | Pairs with draw-on across two steps |
| Move data through a diagram | `svg-11-element-along-path`, `svg-12-auto-rotate-along-path` | MotionPath; step-driven variant `svg-13-step-driven-path-follower` |
| Morph one shape into another | `svg-07-shape-morph-simple`, `svg-08-icon-to-icon-morph` | Sequence via `svg-10-multi-shape-morph-sequence` |
| Reveal an image / panel cleanly | `svg-14-clip-path-reveal` | Masked wipe, no plugin |
| Type a command / terminal line | `t-09-typewriter` | ease none for constant speed |
| Premium hero / cover title | `t-04-masked-line-reveal`, `t-01-line-reveal` | Masked variant for calm/premium feels |
| Standard title entrance | `t-02-word-reveal`, `t-03-character-reveal` | Words default; chars for energetic |
| Decode / reveal moment | `t-07-scramble-decode`, `t-08-custom-glyph-scramble` | Glyph set follows the theme language |
| Emphasize ONE key word | `svg-03-scribble-underline`, `t-14-skew-glitch-burst` | One attention effect per view, max |
| "Broken / before" word | `t-13-rgb-split-glitch` | Sparse bursts only |
| Rotate options in a slot | `t-10-rotating-headlines` | Loop only while active |
| Reveal a sequence of items | `ui-06-step-stagger-reveal` | Engine-level for plain cases; GSAP for distribute/random |
| Ripple across a grid | `adv-05-radial-grid-stagger` | distribute from center/edges |
| Section / chapter change | `ui-16-transition-wipe`, `ui-03-3d-card-flip` | Wipe overlay or 3D flip |
| Celebrate / close | `adv-13-confetti-burst` | Physics2D; reduced motion = plain fade |
| Physical / playful entrance | `adv-14-gravity-drop`, `adv-04-organic-random-entrance` | Physics or random offsets |
| Ambient living background | `svg-09-blob-morph-loop`, `adv-15-organic-floating` | Subtle, active-only, paused on reduced motion |
| Ticker of logos / keywords | `scr-13-infinite-marquee` | Seamless wrap loop |
| Expand / collapse detail | `ui-11-smooth-accordion` | height auto measure-then-tween |
| Fan out a hand of options | `ui-05-stacked-card-fan` | Step-triggered |
| Pointer polish (laptop demos) | `ui-01-card-hover-lift`, `ui-02-3d-card-tilt`, `ui-08-magnetic-button` | Never on projection; quickTo only |
| Micro-interaction on a control | `ui-09-button-shimmer`, `ui-10-button-morph` | Paused timelines, play/reverse |
| Hands-on drag surface | `adv-10-draggable-element`, `adv-08-snap-to-grid`, `adv-11-draggable-carousel` | Interactive surfaces only |
| Gesture-driven navigation | `adv-12-swipe-gesture` | Platform nav layer owns nav — use with care |
| Brand motion signature | `adv-09-custom-easing` | Register once, reuse by name |
| Step progress → any value | `adv-01-step-to-value-mapping`, `adv-07-utility-pipeline` | The scroll-to-value translation |
| Pointer position → any value | `adv-02-pointer-to-value-mapping` | quickTo-smoothed |
| Step progress → color | `adv-03-color-interpolation` | interpolate + set per step |
| Walk through code | *engine-level* | Code-walkthrough components (P2+), not a GSAP recipe |
| Draw the eye live (cursor) | *engine-level* | Cursor layers are omitted from this library (see README) |

## Rules that travel with every routing decision

- **Reduced motion**: every effect must settle to the finished, readable surface.
- **One motion idea per view.** Let one thing move; restraint reads as polish.
- **Projected vs interactive.** Projection gets no pointer effects and standard
  intensity; interactive/web-shared surfaces may use hover, magnetic, and drag.
