/**
 * SectionTracker — a full-width top bar of the deck's sections (chapters) as
 * numbered tabs, with the current one highlighted. Click a tab to jump to that
 * section's first slide. Opt-in via `<SlideEngine chapterBar>`. Driven by the
 * chapters `useSlides` already derives from `data-chapter`.
 */
import type { ChapterInfo } from "./useSlides.js";

export function SectionTracker({
  chapters,
  activeIndex,
  onJump,
}: {
  chapters: ChapterInfo[];
  activeIndex: number;
  onJump: (slide: number) => void;
}) {
  if (chapters.length < 2) return null;
  return (
    <nav className="section-tracker" aria-label="Sections">
      {chapters.map((c, i) => (
        <button
          key={`${c.name}-${i}`}
          type="button"
          className={`st-tab${i === activeIndex ? " is-active" : ""}`}
          aria-current={i === activeIndex}
          onClick={() => onJump(c.firstSlide)}
        >
          <span className="st-num">{i}</span>
          <span className="st-name">{c.name}</span>
        </button>
      ))}
    </nav>
  );
}
