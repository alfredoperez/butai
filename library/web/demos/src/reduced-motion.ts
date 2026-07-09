/** Every demo honors prefers-reduced-motion: durations collapse to 0, loops never start. */
export const reducedMotion = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** Duration helper: the requested duration, or 0 under reduced motion. */
export const dur = (seconds: number): number => (reducedMotion() ? 0 : seconds);
