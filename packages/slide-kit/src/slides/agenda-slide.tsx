/**
 * AgendaSlide — numbered chapter list with optional "you are here" highlight.
 */
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Label } from "../primitives/label.js";

export interface AgendaItem {
  num: string;
  title: string;
  sub?: string;
}

interface AgendaSlideProps {
  chapter?: string;
  eyebrow?: string;
  title?: string;
  items: AgendaItem[];
  /** zero-based index of the current chapter (highlights that row) */
  current?: number;
  background?: BackgroundPattern;
}

export function AgendaSlide({
  chapter = "Agenda",
  eyebrow = "Agenda",
  title = "What we'll cover today",
  items,
  current,
  background = "blueprint",
}: AgendaSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      <Label>{eyebrow}</Label>
      <h1 className="title-serif" data-animate="fade-up">
        {title}
      </h1>
      <ol className="agenda" data-stagger="">
        {items.map((it, i) => (
          <li key={i} className={`agenda__item${current === i ? " agenda__item--current" : ""}`}>
            <span className="agenda__num">{it.num}</span>
            <span className="agenda__text">
              <span className="agenda__title">{it.title}</span>
              {it.sub && <span className="agenda__sub">{it.sub}</span>}
            </span>
          </li>
        ))}
      </ol>
    </Slide>
  );
}
