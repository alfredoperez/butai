import { gsap } from 'gsap';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { reducedMotion } from '../reduced-motion';

gsap.registerPlugin(Physics2DPlugin);

/** ADV-13 · Confetti / Particle Burst — the "ta-da" moment. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `<div id="tada" style="font-size:2rem;font-weight:800;">Shipped! 🎉</div>`;
  if (reducedMotion()) return; // reduced motion: the message alone is the celebration

  const colors = ['#5aa9ff', '#f5c542', '#7ee787', '#ff7a90', '#e8e8ee'];
  const { width, height } = stage.getBoundingClientRect();
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    const size = gsap.utils.random(5, 10);
    p.style.cssText = `position:absolute;left:${width / 2}px;top:${height * 0.6}px;width:${size}px;height:${size}px;border-radius:2px;background:${colors[i % colors.length]};pointer-events:none;`;
    stage.appendChild(p);
    gsap.to(p, {
      physics2D: {
        velocity: gsap.utils.random(150, 400),
        angle: gsap.utils.random(200, 340),
        gravity: 600,
      },
      rotation: gsap.utils.random(-180, 180),
      autoAlpha: 0,
      duration: gsap.utils.random(1.5, 2.5),
      onComplete: () => p.remove(),
    });
  }
}
