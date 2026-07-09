/**
 * CodeSlideshowSlide — step through code snapshots; each engine step swaps in
 * the next snapshot with a fade, with an optional caption per snapshot and a
 * dot progress row. Stepping rides the deck engine's `data-step` reveal
 * system. Outside an engine (the /kit gallery) it statically shows the first
 * snapshot. (A Code Hike token morph needs its DOM renderer, so the generic
 * seam uses a fade; reduced motion disables it.)
 *
 * Renders dependency-free by default (plain tokens, theme colors). Pass a
 * `highlighter` (see the copy-in `code-hike-highlighter` primitive) for real
 * syntax colors.
 */
import { useRef, type ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";
import {
  CodePanel,
  StepMarkers,
  useHighlightedLines,
  useStepIndex,
  type CodeHighlighter,
} from "../primitives/code-panel.js";

export interface CodeSnapshot {
  code: string;
  caption?: string;
}

interface CodeSlideshowSlideProps {
  chapter: string;
  title?: ReactNode;
  lang: string;
  snapshots: CodeSnapshot[];
  /** Optional token colorizer (e.g. the copy-in code-hike-highlighter). */
  highlighter?: CodeHighlighter;
  background?: BackgroundPattern;
}

export function CodeSlideshowSlide({
  chapter,
  title,
  lang,
  snapshots,
  highlighter,
  background = "none",
}: CodeSlideshowSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = Math.max(0, Math.min(useStepIndex(ref), snapshots.length - 1));
  const current = snapshots[idx];
  const lines = useHighlightedLines((current?.code ?? "").trim(), lang, highlighter);

  return (
    <Slide chapter={chapter} background={background}>
      <div ref={ref} className="code-show">
        {title && <Subheading gap="18px">{title}</Subheading>}
        <div key={idx} className="code-show__frame">
          <CodePanel code={lines} />
        </div>
        <div className="code-show__foot">
          <span className="code-show__dots">
            {snapshots.map((_, i) => (
              <span
                key={i}
                className={`code-show__dot${i === idx ? " is-active" : ""}`}
              />
            ))}
          </span>
          {current?.caption && <p className="code-show__note">{current.caption}</p>}
        </div>
        <StepMarkers count={snapshots.length - 1} />
      </div>
    </Slide>
  );
}
