/**
 * ImageCaptionSlide — title + large screenshot + optional caption.
 * The workhorse of every recap/product section.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";
import { Subtitle } from "../primitives/subtitle.js";

interface ImageCaptionSlideProps {
  chapter: string;
  title: ReactNode;
  image: string;
  alt: string;
  caption?: ReactNode;
  /** "full" applies .screenshot-full (default); "card" leaves it contained */
  fit?: "full" | "card";
  background?: BackgroundPattern;
}

export function ImageCaptionSlide({
  chapter,
  title,
  image,
  alt,
  caption,
  fit = "full",
  background = "blueprint",
}: ImageCaptionSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      <Subheading gap="20px">{title}</Subheading>
      <img src={image} alt={alt} className={fit === "full" ? "screenshot-full" : "screenshot-card"} />
      {caption && <Subtitle style={{ marginTop: 20, fontSize: 18 }}>{caption}</Subtitle>}
    </Slide>
  );
}
