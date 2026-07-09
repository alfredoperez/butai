import { gsap } from 'gsap';
import { dur } from '../reduced-motion';

/** SVG-14 · SVG Clip-Path Reveal — a masked wipe brings the graphic in. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `
    <svg viewBox="0 0 400 200" width="380" height="190" aria-label="clip reveal demo">
      <defs>
        <linearGradient id="reveal-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#5aa9ff"/><stop offset="1" stop-color="#f5c542"/>
        </linearGradient>
        <clipPath id="reveal-clip" clipPathUnits="objectBoundingBox">
          <rect id="clip-rect" x="0" y="0" width="1" height="0"/>
        </clipPath>
      </defs>
      <g clip-path="url(#reveal-clip)">
        <rect x="40" y="30" width="320" height="140" rx="14" fill="url(#reveal-grad)"/>
        <text x="200" y="110" text-anchor="middle" font-size="34" font-weight="700" fill="#0f0f13">butai</text>
      </g>
    </svg>`;
  gsap.to('#clip-rect', { attr: { height: 1 }, duration: dur(1.2), ease: 'power3.out' });
}
