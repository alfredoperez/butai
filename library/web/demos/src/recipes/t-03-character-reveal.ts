import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { dur } from '../reduced-motion';

gsap.registerPlugin(SplitText);

/** T-03 · Character Reveal — per-character cascade with a back.out pop. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `<h2 style="font-size:2.6rem;margin:0;letter-spacing:0.02em;">Stage everything.</h2>`;
  const split = SplitText.create(stage.querySelector('h2'), { type: 'chars' });
  gsap.from(split.chars, {
    y: 20,
    autoAlpha: 0,
    scale: 0.8,
    duration: dur(0.6),
    stagger: dur(0.03),
    ease: 'back.out(1.7)',
  });
}
