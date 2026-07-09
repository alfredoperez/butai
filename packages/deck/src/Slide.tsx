import type { ReactNode } from "react";
import { SlideBackground, type BackgroundPattern } from "./SlideBackground.js";

export type { BackgroundPattern };

export interface SlideProps {
  chapter: string;
  children: ReactNode;
  /** "left" (default) for content; "center" for covers/hero/quote; "top" pins content to the top. */
  align?: "center" | "left" | "top";
  variant?: "demo";
  background?: BackgroundPattern;
  /** extra class on the slide root (e.g. "cover") */
  className?: string;
  /** short label for the bottom slide-nav peek; defaults to the chapter */
  title?: string;
  /** speaker notes — shown in presenter view (press P), never on the slide */
  notes?: string;
}

export function Slide({
  chapter,
  children,
  align = "left",
  variant,
  background = "none",
  className,
  title,
  notes,
}: SlideProps) {
  const classes = [
    "slide",
    align === "center" ? "centered" : "",
    align === "top" ? "top-aligned" : "",
    variant === "demo" ? "slide--demo" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      data-slide
      data-chapter={chapter}
      data-title={title || undefined}
      data-notes={notes || undefined}
      className={classes}
    >
      <SlideBackground pattern={background} />
      {children}
    </div>
  );
}
