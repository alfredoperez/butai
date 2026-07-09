import { gsap } from 'gsap';
import { dur, reducedMotion } from '../reduced-motion';

/** UI-16 · Transition Wipe — an accent panel wipes across between two views. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `
    <div style="position:absolute;inset:0;display:grid;place-items:center;">
      <div id="view" style="font-size:2rem;font-weight:700;">View A</div>
    </div>
    <div id="wipe" style="position:absolute;inset:0;background:#5aa9ff;transform:scaleX(0);"></div>`;
  const view = stage.querySelector<HTMLElement>('#view');
  if (!view) return;
  if (reducedMotion()) {
    view.textContent = 'View B'; // reduced motion: cut directly
    return;
  }
  gsap
    .timeline()
    .set('#wipe', { transformOrigin: 'left center' })
    .to('#wipe', { scaleX: 1, duration: dur(0.5), ease: 'power3.inOut' })
    .add(() => {
      view.textContent = 'View B';
    })
    .set('#wipe', { transformOrigin: 'right center' })
    .to('#wipe', { scaleX: 0, duration: dur(0.5), ease: 'power3.inOut' });
}
