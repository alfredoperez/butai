/**
 * DeckOverview: grid "contact sheet" mode (toggled with G in SlideEngine).
 *
 * Implementation choice: this is a TRUE overview mode over the engine's real
 * slide DOM, not a second render of the slide children. The engine's whole
 * architecture is imperative on real DOM slides: useSlides scans
 * [data-slide], toggles `.active`, and writes inline transforms (goTo,
 * magic-move FLIP). Re-rendering the children into scaled frames would
 * double-mount interactive content (videos, timers, demos) and desync
 * [data-step] reveal state. Instead this component:
 *
 *   1. renders a backdrop plus a responsive grid of empty 16:9 cell buttons
 *      (number badge, title, current highlight, click-to-jump),
 *   2. flags the closest `.slide-area` with `is-overview`; overview.css
 *      forces every [data-slide] visible via specificity (no !important),
 *   3. measures each cell and writes an inline translate+scale on the
 *      matching slide element so the real slide shrinks into its cell
 *      (uniform scale-to-fit, centered, since cells are 16:9 while the
 *      live slide area can be any aspect).
 *
 * On unmount everything is restored: inline transforms cleared, mode class
 * removed. The zoom in/out falls out of the engine's existing `.slide`
 * transition; prefers-reduced-motion swaps it for a plain fade (overview.css).
 */
import { useLayoutEffect, useEffect, useRef } from "react";

export interface DeckOverviewProps {
  /** 0-based index of the highlighted (current) slide */
  current: number;
  /** slide count; must match the [data-slide] elements in the slide area */
  total: number;
  /** per-slide labels (from useSlides); falls back to "Slide N" */
  titles: string[];
  /** jump to a slide (0-based); wired to a cell click before onClose */
  goTo: (index: number) => void;
  /** exit overview (unmounts this component and restores the deck) */
  onClose: () => void;
}

export function DeckOverview({
  current,
  total,
  titles,
  goTo,
  onClose,
}: DeckOverviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Layout pass: fit every real slide into its grid cell. Re-runs on area
  // resize (fullscreen, window) and on grid scroll (tall decks).
  useLayoutEffect(() => {
    const root = rootRef.current;
    const area = root?.closest<HTMLElement>(".slide-area");
    if (!root || !area) return;

    const grid = root.querySelector<HTMLElement>(".deck-ov__grid");
    const slides = Array.from(
      area.querySelectorAll<HTMLElement>("[data-slide]"),
    );
    const cells = Array.from(
      root.querySelectorAll<HTMLElement>("[data-ov-cell]"),
    );

    area.classList.add("is-overview");

    const layout = () => {
      const areaRect = area.getBoundingClientRect();
      if (!areaRect.width || !areaRect.height) return;
      cells.forEach((cell, i) => {
        const slide = slides[i];
        if (!slide) return;
        const r = cell.getBoundingClientRect();
        // Uniform scale-to-fit plus centering: nothing crops even when the
        // live slide area's aspect differs from the 16:9 cell.
        const scale = Math.min(
          r.width / areaRect.width,
          r.height / areaRect.height,
        );
        const dx =
          r.left - areaRect.left + (r.width - areaRect.width * scale) / 2;
        const dy =
          r.top - areaRect.top + (r.height - areaRect.height * scale) / 2;
        slide.style.transformOrigin = "top left";
        slide.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      });
    };

    layout();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(layout) : null;
    ro?.observe(area);
    grid?.addEventListener("scroll", layout, { passive: true });
    window.addEventListener("resize", layout);

    return () => {
      ro?.disconnect();
      grid?.removeEventListener("scroll", layout);
      window.removeEventListener("resize", layout);
      // Restore the deck: the active slide's resting transform is the class
      // default, so clearing the inline style animates it back to full size.
      slides.forEach((s) => {
        s.style.transform = "";
        s.style.transformOrigin = "";
      });
      area.classList.remove("is-overview");
    };
  }, [total]);

  // Move focus to the current cell so Enter/Tab work immediately; this also
  // scrolls tall grids to the current slide (the scroll listener re-fits).
  useEffect(() => {
    rootRef.current
      ?.querySelector<HTMLElement>(".deck-ov__cell.is-current")
      ?.focus();
  }, []);

  return (
    <div
      className="deck-ov"
      ref={rootRef}
      role="dialog"
      aria-label="Slide overview"
      onClick={onClose}
    >
      <div className="deck-ov__hint">
        Overview · {total} slides · click to jump · G / Esc to close
      </div>
      <div className="deck-ov__grid">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            data-ov-cell
            className={`deck-ov__cell${i === current ? " is-current" : ""}`}
            aria-current={i === current}
            aria-label={`Slide ${i + 1}${titles[i] ? `: ${titles[i]}` : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
              onClose();
            }}
          >
            <span className="deck-ov__num">{i + 1}</span>
            {titles[i] && <span className="deck-ov__title">{titles[i]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
