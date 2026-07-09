/**
 * CodeScrollySlide — explanation cards on one side, code on the other. Each
 * engine step advances the active card and refocuses the code to the lines it
 * talks about (the "scrollycoding" idea, adapted to a stepped deck instead of
 * scroll). All cards stay visible; the active one highlights, the rest recede.
 * Outside an engine (the /kit gallery) it statically shows the first step.
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

export interface ScrollyStep {
  /** [from, to] line range to focus, 1-based inclusive */
  focus: [number, number];
  title: string;
  body: ReactNode;
}

interface CodeScrollySlideProps {
  chapter: string;
  title?: ReactNode;
  code: string;
  lang: string;
  steps: ScrollyStep[];
  /** Optional token colorizer (e.g. the copy-in code-hike-highlighter). */
  highlighter?: CodeHighlighter;
  background?: BackgroundPattern;
}

export function CodeScrollySlide({
  chapter,
  title,
  code,
  lang,
  steps,
  highlighter,
  background = "none",
}: CodeScrollySlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = Math.min(useStepIndex(ref), steps.length - 1);
  const lines = useHighlightedLines(code.trim(), lang, highlighter);

  return (
    <Slide chapter={chapter} background={background}>
      <div ref={ref} className="code-scrolly">
        {title && <Subheading gap="14px">{title}</Subheading>}
        <div className="code-scrolly__grid">
          <div className="code-scrolly__steps">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`code-scrolly__card${i === idx ? " is-active" : ""}`}
              >
                <h4 className="code-scrolly__step-title">
                  <span className="code-scrolly__n">{i + 1}</span>
                  {s.title}
                </h4>
                <p className="code-scrolly__body">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="code-scrolly__code">
            <CodePanel code={lines} focus={steps[idx]?.focus ?? null} />
          </div>
        </div>
        <StepMarkers count={steps.length - 1} />
      </div>
    </Slide>
  );
}
