/**
 * QuoteSlide — pull quote in serif type + attribution + optional source/role.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";

interface QuoteSlideProps {
  chapter?: string;
  quote: ReactNode;
  attribution: string;
  role?: string;
  source?: string;
  background?: BackgroundPattern;
}

export function QuoteSlide({
  chapter = "Quote",
  quote,
  attribution,
  role,
  source,
  background = "blueprint",
}: QuoteSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      <figure className="quote" data-animate="fade-up">
        <span className="quote__mark" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="quote__body title-serif">{quote}</blockquote>
        <figcaption className="quote__attr">
          <span className="quote__attr-name">&mdash; {attribution}</span>
          {(role || source) && (
            <span className="quote__attr-meta">
              {role}
              {role && source ? " · " : ""}
              {source && <em>{source}</em>}
            </span>
          )}
        </figcaption>
      </figure>
    </Slide>
  );
}
