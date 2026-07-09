/**
 * BigStatementSlide — one huge line. The manifesto / "one big word" / punchline
 * beat. Centered, minimal — let the sentence land, optionally accent one phrase.
 *
 * NOTE: the upstream `reveal` word-cascade (SplitReveal) was dropped in the kit
 * migration to keep the closure free of motion primitives; the statement is
 * rendered statically.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Label } from "../primitives/label.js";

interface BigStatementSlideProps {
  chapter: string;
  eyebrow?: string;
  /** the statement */
  children: ReactNode;
  sub?: ReactNode;
  background?: BackgroundPattern;
}

export function BigStatementSlide({
  chapter,
  eyebrow,
  children,
  sub,
  background = "none",
}: BigStatementSlideProps) {
  return (
    <Slide chapter={chapter} align="center" background={background}>
      <div className="bigstmt">
        {eyebrow && <Label>{eyebrow}</Label>}
        <h1 className="bigstmt__line" data-animate="fade-up">
          {children}
        </h1>
        {sub && <p className="bigstmt__sub">{sub}</p>}
      </div>
    </Slide>
  );
}
