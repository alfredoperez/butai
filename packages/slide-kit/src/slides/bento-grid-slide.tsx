/**
 * BentoGridSlide — a bento grid of mixed tiles (stat / text / quote), each able
 * to span 1–2 columns/rows. The "everything at a glance" / dashboard beat.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";

export interface BentoTile {
  /** big value (stat tile) */
  value?: string;
  /** heading / label */
  title?: string;
  /** supporting line or quote body */
  body?: ReactNode;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  tone?: "accent" | "green" | "red" | "yellow" | "blue" | "plain";
}

interface BentoGridSlideProps {
  chapter: string;
  title?: ReactNode;
  tiles: BentoTile[];
  background?: BackgroundPattern;
}

const CVAR: Record<string, string> = {
  accent: "var(--accent)",
  green: "var(--green)",
  red: "var(--red)",
  yellow: "var(--yellow)",
  blue: "var(--blue)",
  plain: "var(--border)",
};

export function BentoGridSlide({ chapter, title, tiles, background = "none" }: BentoGridSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      {title && <Subheading gap="22px">{title}</Subheading>}
      <div className="bento" data-stagger="">
        {tiles.map((t, i) => (
          <div
            key={i}
            className="bento__tile"
            style={{
              ["--bento-color" as string]: CVAR[t.tone ?? "plain"],
              gridColumn: `span ${t.colSpan ?? 1}`,
              gridRow: `span ${t.rowSpan ?? 1}`,
            }}
          >
            {t.value && <div className="bento__value">{t.value}</div>}
            {t.title && <div className="bento__title">{t.title}</div>}
            {t.body && <div className="bento__body">{t.body}</div>}
          </div>
        ))}
      </div>
    </Slide>
  );
}
