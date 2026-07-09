/**
 * ComparisonTableSlide — a feature matrix (rows × columns) with check / x /
 * partial cells or short text, and an optional highlighted "winning" column.
 * The classic "X vs Y" / capability-grid slide.
 */
import type { ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";

type Cell = boolean | "partial" | string;

interface ComparisonTableSlideProps {
  chapter: string;
  title?: ReactNode;
  columns: string[];
  rows: { label: string; cells: Cell[] }[];
  /** index of the column to highlight as the winner */
  highlight?: number;
  background?: BackgroundPattern;
}

function CellView({ v }: { v: Cell }) {
  if (v === true) return <span className="cmp-yes">✓</span>;
  if (v === false) return <span className="cmp-no">✕</span>;
  if (v === "partial") return <span className="cmp-partial">◐</span>;
  return <span className="cmp-text">{v}</span>;
}

export function ComparisonTableSlide({
  chapter,
  title,
  columns,
  rows,
  highlight,
  background = "none",
}: ComparisonTableSlideProps) {
  return (
    <Slide chapter={chapter} background={background}>
      {title && <Subheading gap="24px">{title}</Subheading>}
      <div className="cmp" data-stagger="" style={{ ["--cols" as string]: columns.length }}>
        <div className="cmp__row cmp__row--head">
          <span className="cmp__rowlabel" />
          {columns.map((c, i) => (
            <span key={c} className={`cmp__col${i === highlight ? " is-win" : ""}`}>
              {c}
            </span>
          ))}
        </div>
        {rows.map((r) => (
          <div className="cmp__row" key={r.label}>
            <span className="cmp__rowlabel">{r.label}</span>
            {r.cells.map((cell, i) => (
              <span key={i} className={`cmp__cell${i === highlight ? " is-win" : ""}`}>
                <CellView v={cell} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}
