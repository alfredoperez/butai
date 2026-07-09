import { gsap } from 'gsap';
import { dur } from '../reduced-motion';

/** UI-14 · Progress / Stat Bar — bars fill to targets via scaleX. */
export function run(stage: HTMLElement): void {
  const stats: [string, number, string][] = [
    ['Decks shipped', 92, '#5aa9ff'],
    ['Reuse rate', 74, '#f5c542'],
    ['Reduced-motion safe', 100, '#7ee787'],
  ];
  stage.innerHTML = `<div style="width:320px;display:grid;gap:0.9rem;">${stats
    .map(
      ([label, pct, color]) => `
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:#9a9aa8;">
          <span>${label}</span><span>${pct}%</span>
        </div>
        <div style="height:10px;border-radius:5px;background:#2a2a33;overflow:hidden;">
          <div class="fill" data-pct="${pct}" style="height:100%;border-radius:5px;background:${color};"></div>
        </div>
      </div>`,
    )
    .join('')}</div>`;
  const fills = stage.querySelectorAll<HTMLElement>('.fill');
  gsap.set(fills, { scaleX: 0, transformOrigin: 'left center' });
  fills.forEach((fill, i) =>
    gsap.to(fill, {
      scaleX: Number(fill.dataset.pct) / 100,
      duration: dur(1.2),
      delay: dur(i * 0.12),
      ease: 'power3.out',
    }),
  );
}
