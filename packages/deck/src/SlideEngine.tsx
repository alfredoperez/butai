import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { NavSidebar } from "./NavSidebar.js";
import { ThemePicker } from "./ThemePicker.js";
import { EngineOverlays } from "./EngineOverlays.js";
import { SectionTracker } from "./SectionTracker.js";
import { useSlides } from "./useSlides.js";

export type SlideTransition = "slide" | "fade" | "zoom" | "flip";

export interface SlideEngineProps {
  title?: string;
  transition?: SlideTransition;
  /** deck-wide motion intensity — scales entrance timing (default "standard") */
  intensity?: "subtle" | "standard" | "expressive";
  /** show the top section-tracker tab bar (from the deck's chapters) */
  chapterBar?: boolean;
  /** tween shared [data-flip="id"] elements between consecutive slides (FLIP) */
  magicMove?: boolean;
  /**
   * Slide to activate on mount (0-based). Read once, at init, so deep links
   * land directly on the target slide with no cover→target ghost transition.
   */
  initialSlide?: number;
  /**
   * Optional controlled slide index (0-based). When it changes and differs
   * from the engine's current slide, the engine jumps there — the consumer→
   * engine half of URL sync (back/forward, paste-and-go).
   */
  slide?: number;
  /**
   * Engine→consumer: fires when the current slide changes (e.g. to sync the
   * URL — the consumer decides push vs replace).
   */
  onSlideChange?: (index: number) => void;
  /** corner watermark link on every slide; omitted → no watermark rendered */
  watermark?: { label: string; href: string };
  children: ReactNode;
  /** optional extra class on the slide-area root, for per-deck CSS scoping */
  className?: string;
}

export function SlideEngine({
  title = "Presentation",
  transition = "slide",
  intensity = "standard",
  chapterBar = false,
  magicMove = false,
  initialSlide,
  slide,
  onSlideChange,
  watermark,
  children,
  className,
}: SlideEngineProps) {
  const {
    current,
    total,
    chapters,
    titles,
    notes,
    currentChapter,
    init,
    goTo,
    next,
    prev,
  } = useSlides();
  const [navOpen, setNavOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const [overlay, setOverlay] = useState<
    "overview" | "help" | "presenter" | null
  >(null);
  const slideAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slideAreaRef.current) {
      // Read the deep-link target once, at mount, so init activates the right
      // slide directly (no cover→target transition that races and ghosts).
      init(slideAreaRef.current, initialSlide ?? 0);
    }
    // Mount-only: deliberately not re-running when initialSlide changes (the
    // controlled `slide` effect below handles later changes via goTo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init]);

  // Consumer → engine: when the controlled `slide` prop changes (history nav,
  // paste-and-go), advance the engine to that slide.
  useEffect(() => {
    if (total === 0 || slide === undefined) return;
    const idx = Math.max(0, Math.min(total - 1, slide));
    if (idx !== current) goTo(idx);
    // intentionally only re-run on slide / total change, not `current`, so the
    // consumer→engine sync stays one-way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, total]);

  // Engine → consumer: report slide changes (skipped while the controlled
  // prop already matches, so the two one-way syncs never ping-pong).
  useEffect(() => {
    if (total === 0) return;
    if (slide === undefined || slide !== current) {
      onSlideChange?.(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total]);

  const handleCopyLink = useCallback(() => {
    void navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "n" || e.key === "N") {
        setNavOpen((o) => !o);
      }
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
      if (e.key === "t" || e.key === "T") {
        setThemePickerOpen((o) => !o);
      }
      if (e.key === "o" || e.key === "O") {
        setOverlay((o) => (o === "overview" ? null : "overview"));
      }
      if (e.key === "p" || e.key === "P") {
        setOverlay((o) => (o === "presenter" ? null : "presenter"));
      }
      if (e.key === "?") {
        setOverlay((o) => (o === "help" ? null : "help"));
      }
      if (e.key === "Escape") {
        setOverlay(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="presentation">
      <NavSidebar
        title={title}
        chapters={chapters}
        currentChapter={currentChapter}
        open={navOpen}
        onChapterClick={goTo}
      />
      <div
        className={`slide-area${className ? ` ${className}` : ""}`}
        ref={slideAreaRef}
        data-transition={transition}
        data-motion={intensity}
        data-chapterbar={chapterBar ? "" : undefined}
        data-magicmove={magicMove ? "" : undefined}
      >
        {chapterBar && (
          <SectionTracker
            chapters={chapters}
            activeIndex={chapters.reduce(
              (acc, c, i) => (c.firstSlide <= current ? i : acc),
              0,
            )}
            onJump={goTo}
          />
        )}
        <button
          className="nav-toggle"
          onClick={() => setNavOpen((o) => !o)}
          title="Toggle navigation (N)"
        >
          &#9776;
        </button>
        <div className="slide-toolbar">
          <button
            type="button"
            className="slide-toolbar__btn"
            onClick={handleCopyLink}
            title="Copy link to this slide"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
          {currentChapter && (
            <div className="slide-now" title="Current section">
              {currentChapter}
            </div>
          )}
          <div className="slide-counter">
            {total > 0 ? `${current + 1} / ${total}` : ""}
          </div>
        </div>
        {children}
        {watermark && (
          <a
            className="slide-watermark"
            href={watermark.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {watermark.label}
          </a>
        )}
        {themePickerOpen && (
          <ThemePicker onClose={() => setThemePickerOpen(false)} />
        )}
        <EngineOverlays
          open={overlay}
          onClose={() => setOverlay(null)}
          titles={titles}
          notes={notes}
          current={current}
          total={total}
          goTo={goTo}
        />
        {total > 1 && (
          <nav className="slide-dots" aria-label="Slides">
            <span
              className={`slide-dots__peek${peek !== null ? " is-shown" : ""}`}
              aria-hidden
            >
              {peek !== null ? `${peek + 1} · ${titles[peek] || "Slide"}` : ""}
            </span>
            <span className="slide-dots__row">
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`slide-dots__dot${i === current ? " is-active" : ""}`}
                  aria-label={`Slide ${i + 1}${titles[i] ? `: ${titles[i]}` : ""}`}
                  aria-current={i === current}
                  title={titles[i] || `Slide ${i + 1}`}
                  onMouseEnter={() => setPeek(i)}
                  onMouseLeave={() => setPeek(null)}
                  onFocus={() => setPeek(i)}
                  onBlur={() => setPeek(null)}
                  onClick={() => goTo(i)}
                />
              ))}
            </span>
          </nav>
        )}
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
