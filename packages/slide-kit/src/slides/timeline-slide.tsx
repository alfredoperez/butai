/**
 * TimelineSlide — a horizontal chronology / roadmap. Each item is a dated beat
 * (when + title + optional body) strung along a connecting line with a node.
 * Use for history or now·next·later.
 *
 * NOTE: the upstream `stepped` per-click reveal (StepReveal) was dropped in the
 * kit migration to keep the closure free of motion primitives; all beats render
 * at once.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";

export interface TimelineItem {
  when: string;
  title: string;
  body?: string;
  color?: "accent" | "green" | "red" | "yellow" | "blue";
}

interface TimelineSlideProps {
  chapter: string;
  title?: ReactNode;
  items: TimelineItem[];
  background?: BackgroundPattern;
}

const CVAR: Record<string, string> = {
  accent: "var(--accent)",
  green: "var(--green)",
  red: "var(--red)",
  yellow: "var(--yellow)",
  blue: "var(--blue)",
};

export function TimelineSlide({ chapter, title, items, background = "none" }: TimelineSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      {title && <Subheading gap="30px">{title}</Subheading>}
      <ol className="tl" data-stagger="" style={{ ["--cols" as string]: items.length }}>
        {items.map((it, i) => (
          <li
            key={i}
            className="tl__item"
            style={{ ["--tl-color" as string]: CVAR[it.color ?? "accent"] }}
          >
            <span className="tl__node" />
            <span className="tl__when">{it.when}</span>
            <span className="tl__title">{it.title}</span>
            {it.body && <span className="tl__body">{it.body}</span>}
          </li>
        ))}
      </ol>
    </Slide>
  );
}
