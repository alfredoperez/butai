/**
 * CodeSpotlightSlide — one code block; each engine step spotlights a different
 * line range (the rest dim + soften) and shows a one-line note. Stepping rides
 * the deck engine's `data-step` reveal system, so arrow keys walk the focuses.
 * Outside an engine (the /kit gallery) it statically shows the first focus.
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

export interface SpotlightStep {
  /** [from, to] line range to spotlight, 1-based inclusive */
  focus: [number, number];
  note?: string;
}

interface CodeSpotlightSlideProps {
  chapter: string;
  title?: ReactNode;
  code: string;
  lang: string;
  steps: SpotlightStep[];
  /** Optional token colorizer (e.g. the copy-in code-hike-highlighter). */
  highlighter?: CodeHighlighter;
  background?: BackgroundPattern;
}

export function CodeSpotlightSlide({
  chapter,
  title,
  code,
  lang,
  steps,
  highlighter,
  background = "none",
}: CodeSpotlightSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = Math.min(useStepIndex(ref), steps.length - 1);
  const lines = useHighlightedLines(code.trim(), lang, highlighter);
  const step = steps[idx];

  return (
    <Slide chapter={chapter} background={background}>
      <div ref={ref} className="code-spot">
        {title && <Subheading gap="18px">{title}</Subheading>}
        <CodePanel code={lines} focus={step?.focus ?? null} />
        {step?.note && <p className="code-spot__note">{step.note}</p>}
        <StepMarkers count={steps.length - 1} />
      </div>
    </Slide>
  );
}
