/**
 * DiagramSlide - a titled frame hosting an inline SVG diagram with a pure-CSS
 * stroke draw-on entrance, plus an optional caption. Original implementation:
 * plain stroke-dasharray/dashoffset keyframes, no motion library.
 *
 * Contract for the SVG you pass as children:
 *   - every drawable stroke (path/rect/line/circle/...) carries the
 *     `dgm-draw` class AND `pathLength={1}`, so one normalized keyframe
 *     draws any shape regardless of its real length
 *   - labels and fills that should fade in after their stroke carry `dgm-fade`
 *   - stagger beats via `style={{ ["--dgm-i" as string]: n }}` on either class
 *
 * The entrance runs when the slide activates; outside an engine (the /kit
 * gallery) the diagram renders fully drawn. Reduced motion disables it.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";

interface DiagramSlideProps {
  chapter: string;
  title?: ReactNode;
  /** the inline SVG (see the draw-on contract in the header) */
  children: ReactNode;
  caption?: ReactNode;
  background?: BackgroundPattern;
}

export function DiagramSlide({
  chapter,
  title,
  children,
  caption,
  background = "none",
}: DiagramSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      <div className="dgm">
        {title && <Subheading gap="24px">{title}</Subheading>}
        <div className="dgm__frame">{children}</div>
        {caption && <p className="dgm__caption">{caption}</p>}
      </div>
    </Slide>
  );
}
