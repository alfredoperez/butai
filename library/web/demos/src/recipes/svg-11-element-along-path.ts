import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { dur } from '../reduced-motion';

gsap.registerPlugin(MotionPathPlugin);

/** SVG-11 · Element Along Path — a data token travels through the diagram. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `
    <svg viewBox="0 0 400 200" width="380" height="190" fill="none" aria-label="motion path demo">
      <path id="flow-path" d="M30 160 C 110 20, 290 20, 370 160" stroke="#2a2a33" stroke-width="2" stroke-dasharray="4 6"/>
      <circle id="flow-dot" cx="30" cy="160" r="9" fill="#f5c542"/>
    </svg>`;
  gsap.to('#flow-dot', {
    motionPath: { path: '#flow-path', align: '#flow-path', alignOrigin: [0.5, 0.5], autoRotate: false },
    duration: dur(2),
    ease: 'power1.inOut',
  });
}
