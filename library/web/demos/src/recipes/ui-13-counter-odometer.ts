import { gsap } from 'gsap';
import { dur, reducedMotion } from '../reduced-motion';

/** UI-13 · Counter / Number Odometer — the KPI count-up. */
export function run(stage: HTMLElement): void {
  const target = 12847;
  const suffix = ' installs';
  stage.innerHTML = `
    <div style="text-align:center;">
      <div class="counter" style="font-size:3.2rem;font-weight:800;font-variant-numeric:tabular-nums;">0${suffix}</div>
      <div style="color:#9a9aa8;">since launch</div>
    </div>`;
  const el = stage.querySelector<HTMLElement>('.counter');
  if (!el) return;
  if (reducedMotion()) {
    el.textContent = target.toLocaleString('en-US') + suffix;
    return;
  }
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration: dur(1.6),
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.value).toLocaleString('en-US') + suffix;
    },
  });
}
