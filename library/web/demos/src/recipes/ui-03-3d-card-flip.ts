import { gsap } from 'gsap';
import { dur } from '../reduced-motion';

/** UI-03 · 3D Card Flip — flips once on mount, then on every click. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `
    <div style="perspective:1000px;">
      <div id="flip-card" style="position:relative;width:220px;height:140px;transform-style:preserve-3d;cursor:pointer;">
        <div style="position:absolute;inset:0;backface-visibility:hidden;display:grid;place-items:center;
                    background:#5aa9ff;color:#08131f;border-radius:12px;font-weight:700;">FRONT</div>
        <div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);display:grid;place-items:center;
                    background:#f5c542;color:#1f1708;border-radius:12px;font-weight:700;">BACK</div>
      </div>
    </div>`;
  const card = stage.querySelector('#flip-card');
  let flipped = false;
  const flip = (): void => {
    flipped = !flipped;
    gsap.to(card, {
      rotationY: flipped ? 180 : 0,
      duration: dur(0.6),
      ease: 'power2.inOut',
      transformPerspective: 1000,
    });
  };
  card?.addEventListener('click', flip);
  flip(); // demo the flip immediately
}
