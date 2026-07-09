/**
 * ConceptSlide — Label eyebrow + serif h1 + optional Subtitle.
 * The "What is X?" pattern.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Label } from "../primitives/label.js";
import { Subtitle } from "../primitives/subtitle.js";

interface ConceptSlideProps {
  chapter: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  background?: BackgroundPattern;
}

export function ConceptSlide({
  chapter,
  eyebrow,
  title,
  subtitle,
  background = "none",
}: ConceptSlideProps) {
  return (
    <Slide chapter={chapter} align="center" background={background}>
      {eyebrow && <Label>{eyebrow}</Label>}
      <h1 className="title-serif" data-animate="fade-up">
        {title}
      </h1>
      {subtitle && <Subtitle style={{ marginTop: 18 }}>{subtitle}</Subtitle>}
    </Slide>
  );
}
