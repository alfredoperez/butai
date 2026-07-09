/**
 * KpiSlide - a row of 2-4 KPI cards. Each card has a big display number that
 * counts up when the slide activates, a label, an optional delta indicator
 * (up/down/flat with a good/bad/neutral tone), and an optional context line.
 *
 * The count-up is a tiny self-contained rAF hook (original, no motion
 * library): it starts when the host `.slide` gains the engine's `active`
 * class, or immediately when the slide is already visible (the /kit gallery
 * renders a bare <Slide> that never activates). Reduced motion skips the
 * animation and renders the final value at once.
 */
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";
import { Subtitle } from "../primitives/subtitle.js";

export interface KpiDelta {
  direction: "up" | "down" | "flat";
  /** short delta text, e.g. "+38% vs Q4" */
  text: string;
  /** color tone; defaults by direction: up=good, down=bad, flat=neutral */
  tone?: "good" | "bad" | "neutral";
}

export interface KpiItem {
  /** numeric target the card counts up to */
  value: number;
  /** fixed fraction digits to render, default 0 */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delta?: KpiDelta;
  /** optional muted context line under the delta */
  context?: string;
}

interface KpiSlideProps {
  chapter: string;
  title?: ReactNode;
  items: KpiItem[];
  caption?: ReactNode;
  background?: BackgroundPattern;
}

const COUNT_MS = 1100;

/** "12345.6" -> "12,345.6" (fixed decimals, grouped thousands). */
function formatKpi(n: number, decimals: number): string {
  const [int, frac] = Math.abs(n).toFixed(decimals).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = n < 0 ? "-" : "";
  return frac ? `${sign}${grouped}.${frac}` : `${sign}${grouped}`;
}

/**
 * Animate 0 -> target with an ease-out rAF loop. Starts when the closest
 * `.slide` becomes active; if the slide is already visible (gallery, first
 * active slide), it starts right away. Reduced motion returns the target.
 */
function useCountUp(ref: RefObject<HTMLElement | null>, target: number): number {
  const [value, setValue] = useState(target);
  useEffect(() => {
    const host = ref.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    let obs: MutationObserver | undefined;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / COUNT_MS, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setValue(0);
      raf = requestAnimationFrame(tick);
    };
    const slide = host.closest(".slide");
    if (
      !slide ||
      slide.classList.contains("active") ||
      getComputedStyle(slide).visibility === "visible"
    ) {
      run();
    } else {
      obs = new MutationObserver(() => {
        if (slide.classList.contains("active")) {
          obs?.disconnect();
          obs = undefined;
          run();
        }
      });
      obs.observe(slide, { attributes: true, attributeFilter: ["class"] });
    }
    return () => {
      cancelAnimationFrame(raf);
      obs?.disconnect();
    };
  }, [ref, target]);
  return value;
}

const ARROW: Record<KpiDelta["direction"], string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

const DEFAULT_TONE: Record<KpiDelta["direction"], NonNullable<KpiDelta["tone"]>> = {
  up: "good",
  down: "bad",
  flat: "neutral",
};

function KpiCard({ item }: { item: KpiItem }) {
  const numRef = useRef<HTMLDivElement>(null);
  const shown = useCountUp(numRef, item.value);
  const delta = item.delta;
  const tone = delta ? (delta.tone ?? DEFAULT_TONE[delta.direction]) : undefined;
  return (
    <div className="kpi__card">
      <div ref={numRef} className="kpi__num">
        {item.prefix}
        {formatKpi(shown, item.decimals ?? 0)}
        {item.suffix}
      </div>
      <div className="kpi__label">{item.label}</div>
      {delta && (
        <div className={`kpi__delta kpi__delta--${tone}`}>
          <span aria-hidden className="kpi__arrow">
            {ARROW[delta.direction]}
          </span>
          {delta.text}
        </div>
      )}
      {item.context && <div className="kpi__context">{item.context}</div>}
    </div>
  );
}

export function KpiSlide({ chapter, title, items, caption, background = "none" }: KpiSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      {title && <Subheading gap="28px">{title}</Subheading>}
      <div className="kpi" data-stagger="" style={{ ["--cols" as string]: items.length }}>
        {items.map((it) => (
          <KpiCard key={it.label} item={it} />
        ))}
      </div>
      {caption && <Subtitle style={{ marginTop: 26, fontSize: 17 }}>{caption}</Subtitle>}
    </Slide>
  );
}
