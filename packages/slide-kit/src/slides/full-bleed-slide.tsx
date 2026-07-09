/**
 * FullBleedSlide — an edge-to-edge image with a text lockup over a scrim. The
 * cinematic opener / chapter cover. Overlay corner + scrim strength are
 * configurable; degrades to a gradient if the image is missing.
 */
import type { ReactNode } from "react";
import { Slide } from "@butai/deck";
import { Label } from "../primitives/label.js";

interface FullBleedSlideProps {
  chapter: string;
  image?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** where the text sits */
  anchor?: "bottom-left" | "center" | "bottom-center";
  /** darken the image so text stays legible (0–1) */
  scrim?: number;
}

export function FullBleedSlide({
  chapter,
  image,
  eyebrow,
  title,
  subtitle,
  anchor = "bottom-left",
  scrim = 0.55,
}: FullBleedSlideProps) {
  return (
    <Slide chapter={chapter} className="fullbleed" background="none">
      <div className="fb__img" style={image ? { backgroundImage: `url(${image})` } : undefined} />
      <div className="fb__scrim" style={{ ["--fb-scrim" as string]: String(scrim) }} />
      <div className={`fb__lock fb__lock--${anchor}`} data-animate="fade-up">
        {eyebrow && <Label>{eyebrow}</Label>}
        <h1 className="fb__title">{title}</h1>
        {subtitle && <p className="fb__sub">{subtitle}</p>}
      </div>
    </Slide>
  );
}
