/**
 * ImageTextSplitSlide — 50/50 image + prose layout (image on left or right).
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Label } from "../primitives/label.js";

interface ImageTextSplitSlideProps {
  chapter: string;
  image: string;
  alt: string;
  side?: "left" | "right";
  eyebrow?: string;
  title: ReactNode;
  body: ReactNode;
  background?: BackgroundPattern;
}

export function ImageTextSplitSlide({
  chapter,
  image,
  alt,
  side = "left",
  eyebrow,
  title,
  body,
  background = "blueprint",
}: ImageTextSplitSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      <div className={`split split--${side}`}>
        <div className="split__media">
          <img src={image} alt={alt} />
        </div>
        <div className="split__copy" data-animate="fade-up" data-delay="1">
          {eyebrow && <Label>{eyebrow}</Label>}
          <h2 className="title-serif split__title">{title}</h2>
          <div className="split__body">{body}</div>
        </div>
      </div>
    </Slide>
  );
}
