import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { dur, reducedMotion } from '../reduced-motion';

gsap.registerPlugin(DrawSVGPlugin);

/** SVG-01 · Stroke Draw On — connectors draw in as if hand-drawn. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `
    <svg viewBox="0 0 400 200" width="380" height="190" fill="none" aria-label="draw-on demo">
      <rect x="20" y="30" width="90" height="50" rx="8" stroke="#5aa9ff" stroke-width="2" class="draw"/>
      <rect x="290" y="30" width="90" height="50" rx="8" stroke="#5aa9ff" stroke-width="2" class="draw"/>
      <path d="M110 55 C 180 55, 220 55, 290 55" stroke="#f5c542" stroke-width="2.5" class="draw"/>
      <path d="M65 80 C 65 140, 200 150, 335 80" stroke="#e8e8ee" stroke-width="2" stroke-dasharray="none" class="draw"/>
    </svg>`;
  const paths = stage.querySelectorAll<SVGElement>('.draw');
  if (reducedMotion()) {
    gsap.set(paths, { drawSVG: '0% 100%' });
    return;
  }
  gsap.set(paths, { drawSVG: '0% 0%' });
  gsap.to(paths, { drawSVG: '0% 100%', duration: dur(1.5), ease: 'power2.inOut', stagger: 0.25 });
}
