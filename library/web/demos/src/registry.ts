/** Recipe id → lazily imported demo module. Ids must match recipe frontmatter ids. */
export type DemoModule = { run: (stage: HTMLElement) => void | Promise<void> };

export const demoRegistry: Record<string, () => Promise<DemoModule>> = {
  'svg-01-stroke-draw-on': () => import('./recipes/svg-01-stroke-draw-on'),
  'svg-11-element-along-path': () => import('./recipes/svg-11-element-along-path'),
  'svg-14-clip-path-reveal': () => import('./recipes/svg-14-clip-path-reveal'),
  't-03-character-reveal': () => import('./recipes/t-03-character-reveal'),
  't-09-typewriter': () => import('./recipes/t-09-typewriter'),
  'ui-16-transition-wipe': () => import('./recipes/ui-16-transition-wipe'),
  'ui-03-3d-card-flip': () => import('./recipes/ui-03-3d-card-flip'),
  'ui-13-counter-odometer': () => import('./recipes/ui-13-counter-odometer'),
  'ui-14-progress-stat-bar': () => import('./recipes/ui-14-progress-stat-bar'),
  'adv-13-confetti-burst': () => import('./recipes/adv-13-confetti-burst'),
  'scr-13-infinite-marquee': () => import('./recipes/scr-13-infinite-marquee'),
  'adv-15-organic-floating': () => import('./recipes/adv-15-organic-floating'),
};
