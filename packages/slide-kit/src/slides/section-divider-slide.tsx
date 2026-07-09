/**
 * SectionDividerSlide — big chapter number + name as a stage between sections.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subtitle } from "../primitives/subtitle.js";

interface SectionDividerSlideProps {
  chapter: string;
  num: string;
  title: ReactNode;
  subtitle?: ReactNode;
  background?: BackgroundPattern;
}

export function SectionDividerSlide({
  chapter,
  num,
  title,
  subtitle,
  background = "beams",
}: SectionDividerSlideProps) {
  return (
    <Slide chapter={chapter} align="center" background={background}>
      <div className="section-divider" data-animate="fade-up">
        <div className="section-divider__num">{num}</div>
        <h1 className="title-serif section-divider__title">{title}</h1>
        {subtitle && <Subtitle style={{ marginTop: 18 }}>{subtitle}</Subtitle>}
      </div>
    </Slide>
  );
}
