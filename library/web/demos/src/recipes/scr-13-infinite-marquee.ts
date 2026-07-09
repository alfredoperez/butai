import { gsap } from 'gsap';
import { reducedMotion } from '../reduced-motion';

/** SCR-13 · Infinite Marquee — a seamless keyword ticker. */
export function run(stage: HTMLElement): void {
  const words = ['decks', 'videos', 'docs', 'themes', 'motion', 'catalogs'];
  const half = words.map((w) => `<span style="padding:0 1.4rem;color:#9a9aa8;">${w} ·</span>`).join('');
  stage.innerHTML = `
    <div style="width:100%;overflow:hidden;font-size:1.6rem;font-weight:700;letter-spacing:0.04em;">
      <div id="track" style="display:inline-block;white-space:nowrap;">${half}${half}</div>
    </div>`;
  const track = stage.querySelector<HTMLElement>('#track');
  if (!track || reducedMotion()) return; // reduced motion: static row

  const loopWidth = track.scrollWidth / 2;
  gsap.to(track, {
    x: -loopWidth,
    duration: 14,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x: number) => x % loopWidth),
    },
  });
}
