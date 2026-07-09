import { gsap } from 'gsap';
import { reducedMotion } from '../reduced-motion';

/** ADV-15 · Organic Floating Elements — the lava-lamp background. */
export function run(stage: HTMLElement): void {
  const colors = ['#5aa9ff', '#f5c542', '#7ee787', '#ff7a90', '#b48aff', '#e8e8ee'];
  stage.innerHTML = `<div style="position:absolute;inset:0;">${colors
    .map(
      (c, i) => `<div class="blob" style="position:absolute;left:${12 + i * 15}%;top:${25 + (i % 3) * 20}%;
        width:${26 + (i % 3) * 10}px;height:${26 + (i % 3) * 10}px;border-radius:50%;
        background:${c};opacity:0.75;"></div>`,
    )
    .join('')}</div>`;
  if (reducedMotion()) return; // reduced motion: the static arrangement is the design

  const float = (el: Element): void => {
    gsap.to(el, {
      x: gsap.utils.random(-30, 30),
      y: gsap.utils.random(-20, 20),
      rotation: gsap.utils.random(-8, 8),
      duration: gsap.utils.random(3, 6),
      ease: 'sine.inOut',
      onComplete: () => float(el),
    });
  };
  stage.querySelectorAll('.blob').forEach((blob, i) => {
    gsap.delayedCall(i * 0.25, () => float(blob));
  });
}
