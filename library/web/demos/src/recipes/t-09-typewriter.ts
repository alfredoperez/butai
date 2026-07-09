import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { dur } from '../reduced-motion';

gsap.registerPlugin(TextPlugin);

/** T-09 · Typewriter — type a terminal line out character by character. */
export function run(stage: HTMLElement): void {
  stage.innerHTML = `
    <pre style="font:16px/1.6 ui-monospace,monospace;color:#7ee787;margin:0;">
<span style="color:#9a9aa8;">$</span> <span id="typed"></span><span style="color:#5aa9ff;">▌</span></pre>`;
  const line = 'pnpm create butai my-deck --theme blueprint';
  const el = stage.querySelector('#typed');
  gsap.set(el, { text: '' });
  gsap.to(el, { duration: dur(2), ease: 'none', text: line, delay: dur(0.3) });
}
