import { useState, useRef, useCallback } from "react";

export interface ChapterInfo {
  name: string;
  firstSlide: number;
}

export function useSlides() {
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);

  const slidesRef = useRef<HTMLElement[]>([]);
  const currentRef = useRef(0);

  const init = useCallback((container: HTMLElement, initialIndex = 0) => {
    const slideEls = Array.from(
      container.querySelectorAll<HTMLElement>("[data-slide]"),
    );
    slidesRef.current = slideEls;
    setTotal(slideEls.length);

    const chapterMap: ChapterInfo[] = [];
    slideEls.forEach((el, i) => {
      const ch = el.dataset.chapter ?? "Main";
      if (
        chapterMap.length === 0 ||
        chapterMap[chapterMap.length - 1].name !== ch
      ) {
        chapterMap.push({ name: ch, firstSlide: i });
      }
    });
    setChapters(chapterMap);

    // Per-slide titles for the bottom nav; fall back to the chapter name.
    setTitles(
      slideEls.map((el) => el.dataset.title || el.dataset.chapter || ""),
    );
    setNotes(slideEls.map((el) => el.dataset.notes || ""));

    // Activate the slide the consumer points at — not always slide 0.
    // Deep-linking (e.g. /<slug>/3) or refreshing mid-deck must show the right
    // slide immediately, with no transition away from the cover (which used to
    // leave the cover ghosting and the counter stuck at 1).
    const startIdx = Math.max(0, Math.min(slideEls.length - 1, initialIndex));
    if (slideEls[startIdx]) {
      slideEls[startIdx].classList.add("active");
    }
    currentRef.current = startIdx;
    setCurrent(startIdx);
  }, []);

  const goTo = useCallback((idx: number) => {
    const slides = slidesRef.current;
    if (idx < 0 || idx >= slides.length) return;

    const prev = currentRef.current;
    if (idx === prev) return;

    // ── Shared-element magic-move ────────────────────────────────────────
    // If the deck opts in (SlideEngine `magicMove`), snapshot the outgoing
    // slide's [data-flip] elements; after the incoming slide activates, animate
    // each matching [data-flip] FROM the old position/size to its new spot
    // (FLIP via the Web Animations API — no deps). Skipped for reduced motion.
    const area = slides[idx].closest<HTMLElement>(".slide-area");
    const magic =
      area?.dataset.magicmove != null &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const fromRects = new Map<string, DOMRect>();
    if (magic) {
      slides[prev]
        ?.querySelectorAll<HTMLElement>("[data-flip]")
        .forEach((el) =>
          fromRects.set(el.dataset.flip!, el.getBoundingClientRect()),
        );
    }

    slides[prev]?.classList.remove("active");
    if (idx > prev) {
      slides[prev]?.classList.add("exit-left");
      setTimeout(() => slides[prev]?.classList.remove("exit-left"), 400);
    }

    const transitionMode =
      slides[idx].closest<HTMLElement>(".slide-area")?.dataset.transition ??
      "slide";
    if (transitionMode === "slide") {
      slides[idx].style.transform =
        idx > prev ? "translateX(40px)" : "translateX(-40px)";
    }

    requestAnimationFrame(() => {
      slides[idx].classList.add("active");
      slides[idx].style.transform = "";

      if (magic && fromRects.size) {
        slides[idx]
          .querySelectorAll<HTMLElement>("[data-flip]")
          .forEach((el) => {
            const from = fromRects.get(el.dataset.flip!);
            if (!from) return;
            const to = el.getBoundingClientRect();
            if (!to.width || !to.height) return;
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const sx = from.width / to.width;
            const sy = from.height / to.height;
            el.animate(
              [
                {
                  transformOrigin: "top left",
                  transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
                },
                { transformOrigin: "top left", transform: "none" },
              ],
              {
                duration: 520,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                fill: "both",
              },
            );
          });
      }
    });

    currentRef.current = idx;
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    const currentSlide = slidesRef.current[currentRef.current];
    const hidden = currentSlide?.querySelectorAll<HTMLElement>(
      "[data-step]:not(.step-visible)",
    );
    if (hidden && hidden.length > 0) {
      hidden[0].classList.add("step-visible");
    } else {
      goTo(currentRef.current + 1);
    }
  }, [goTo]);

  const prev = useCallback(() => {
    const currentSlide = slidesRef.current[currentRef.current];
    const visible = currentSlide?.querySelectorAll<HTMLElement>(
      "[data-step].step-visible",
    );
    if (visible && visible.length > 0) {
      visible[visible.length - 1].classList.remove("step-visible");
    } else {
      goTo(currentRef.current - 1);
    }
  }, [goTo]);

  const currentChapter = chapters.reduce((last, ch) => {
    return ch.firstSlide <= currentRef.current ? ch.name : last;
  }, chapters[0]?.name ?? "");

  return {
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
  };
}
