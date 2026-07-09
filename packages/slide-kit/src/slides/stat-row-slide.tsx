/**
 * StatRowSlide — a row of 3–4 metric cards. Each card has an accent edge bar, a
 * big display-font number, a label, and an optional secondary line. Use to frame
 * results at a glance.
 *
 * NOTE: the upstream count-up animation (CountUp) was dropped in the kit
 * migration to keep the closure free of motion primitives; numbers render
 * statically.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";
import { Subtitle } from "../primitives/subtitle.js";

export interface StatItem {
  value: string;
  label: string;
  /** secondary line, e.g. "+38% vs Q4" or "down from 71m" */
  sub?: string;
  color?: "accent" | "green" | "red" | "yellow" | "blue" | "orange";
}

interface StatRowSlideProps {
  chapter: string;
  title?: ReactNode;
  stats: StatItem[];
  caption?: ReactNode;
  background?: BackgroundPattern;
}

const COLOR_VAR: Record<NonNullable<StatItem["color"]>, string> = {
  accent: "var(--accent)",
  green: "var(--green)",
  red: "var(--red)",
  yellow: "var(--yellow)",
  blue: "var(--blue)",
  orange: "var(--orange, var(--accent))",
};

export function StatRowSlide({
  chapter,
  title,
  stats,
  caption,
  background = "blueprint",
}: StatRowSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      {title && <Subheading gap="28px">{title}</Subheading>}
      <div className="statrow" data-stagger="" style={{ ["--cols" as string]: stats.length }}>
        {stats.map((s) => {
          const c = COLOR_VAR[s.color ?? "accent"];
          return (
            <div key={s.label} className="statrow__card" style={{ ["--stat-color" as string]: c }}>
              <div className="statrow__num">{s.value}</div>
              <div className="statrow__label">{s.label}</div>
              {s.sub && <div className="statrow__sub">{s.sub}</div>}
            </div>
          );
        })}
      </div>
      {caption && <Subtitle style={{ marginTop: 26, fontSize: 17 }}>{caption}</Subtitle>}
    </Slide>
  );
}
