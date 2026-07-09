/**
 * TerminalSlide - a terminal window (traffic lights, title bar) with mono
 * lines that reveal per engine step or with a CSS stagger. Line kinds style
 * prompts, output, comments, and a highlighted payoff line.
 *
 * Reveal modes:
 *   - "stagger" (default): lines fade in one after another when the slide
 *     activates, pure CSS via a per-line `--term-i` delay
 *   - "steps": one line per engine advance, riding the deck engine's
 *     `data-step` system via the shared step plumbing (useStepIndex /
 *     StepMarkers); outside an engine only the first line shows
 *   - "none": everything renders at once
 *
 * Reduced motion disables the stagger and the reveal transition.
 */
import { useRef, type ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";
import { Subtitle } from "../primitives/subtitle.js";
import { StepMarkers, useStepIndex } from "../primitives/code-panel.js";

export interface TerminalLine {
  text: string;
  /** default "output"; "highlight" is the accented payoff line */
  kind?: "prompt" | "output" | "comment" | "highlight";
  /** prompt glyph override (prompt lines only), default "$" */
  prompt?: string;
}

interface TerminalSlideProps {
  chapter: string;
  title?: ReactNode;
  /** window title-bar text, e.g. "~/project" */
  windowTitle?: string;
  lines: TerminalLine[];
  reveal?: "stagger" | "steps" | "none";
  caption?: ReactNode;
  background?: BackgroundPattern;
}

export function TerminalSlide({
  chapter,
  title,
  windowTitle,
  lines,
  reveal = "stagger",
  caption,
  background = "none",
}: TerminalSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = useStepIndex(ref);

  return (
    <Slide chapter={chapter} background={background}>
      <div ref={ref} className={`term term--${reveal}`}>
        {title && <Subheading gap="24px">{title}</Subheading>}
        <div className="term__window">
          <div className="term__bar">
            <span className="term__lights" aria-hidden>
              <span className="term__light term__light--close" />
              <span className="term__light term__light--min" />
              <span className="term__light term__light--max" />
            </span>
            {windowTitle && <span className="term__bar-title">{windowTitle}</span>}
          </div>
          <div className="term__body">
            {lines.map((line, i) => {
              const kind = line.kind ?? "output";
              const pending = reveal === "steps" && i > idx;
              return (
                <div
                  key={i}
                  className={`term__line term__line--${kind}${pending ? " term__line--pending" : ""}`}
                  style={{ ["--term-i" as string]: i }}
                >
                  {kind === "prompt" && (
                    <span className="term__prompt" aria-hidden>
                      {line.prompt ?? "$"}
                    </span>
                  )}
                  <span className="term__text">{line.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        {caption && <Subtitle style={{ marginTop: 22, fontSize: 17 }}>{caption}</Subtitle>}
        {reveal === "steps" && <StepMarkers count={lines.length - 1} />}
      </div>
    </Slide>
  );
}
