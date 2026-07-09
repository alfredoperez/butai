/**
 * RecapSlide — "what we saw" bulleted list with check markers.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Label } from "../primitives/label.js";
import { Icon } from "../primitives/icon.js";

export interface RecapItem {
  title: ReactNode;
  sub?: ReactNode;
}

interface RecapSlideProps {
  chapter?: string;
  eyebrow?: string;
  title: ReactNode;
  items: RecapItem[];
  background?: BackgroundPattern;
}

export function RecapSlide({
  chapter = "Recap",
  eyebrow = "Recap",
  title,
  items,
  background = "blueprint",
}: RecapSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      <Label>{eyebrow}</Label>
      <h1 className="title-serif" data-animate="fade-up">
        {title}
      </h1>
      <ul className="recap" data-stagger="">
        {items.map((it, i) => (
          <li key={i} className="recap__item">
            <span className="recap__check">
              <Icon name="check" size={20} />
            </span>
            <span className="recap__text">
              <span className="recap__title">{it.title}</span>
              {it.sub && <span className="recap__sub">{it.sub}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Slide>
  );
}
