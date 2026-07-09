import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";

interface IntroSlideProps {
  chapter?: string;
  /** small eyebrow above the title */
  miniHeader: string;
  title: ReactNode;
  subtitle?: ReactNode;
  background?: BackgroundPattern;
  /** optional faded background image (e.g. a hero render) */
  backgroundImage?: string;
  /** cold open: mark the cover so styling can hold the reveal for the first click */
  coldOpen?: boolean;
}

/**
 * IntroSlide — the deck opener. Big left-aligned display-font title, eyebrow,
 * subtitle, and an optional faded background image. Backs both CoverSlide and
 * ColdOpenSlide.
 */
export function IntroSlide({
  chapter = "Intro",
  miniHeader,
  title,
  subtitle,
  background = "beams",
  backgroundImage,
  coldOpen,
}: IntroSlideProps) {
  return (
    <Slide
      chapter={chapter}
      align="left"
      className={`cover${backgroundImage ? " cover--bg" : ""}${coldOpen ? " cover--coldopen" : ""}`}
      background={backgroundImage ? "none" : background}
    >
      {backgroundImage && (
        <div className="cover-bg" aria-hidden="true">
          <img className="cover-bg__img" src={backgroundImage} alt="" />
          <div className="cover-bg__fade" />
        </div>
      )}
      <div className="cover-body">
        <div className="cover-eyebrow">{miniHeader}</div>
        <h1 className="cover-title">{title}</h1>
        {subtitle && <p className="cover-subtitle">{subtitle}</p>}
      </div>
    </Slide>
  );
}
