/**
 * BeforeAfterSlide - two panels (before/after) with header chips, a center
 * divider arrow, and a per-step reveal: the slide opens on the "before" panel
 * with "after" held back (dimmed and shifted); the first engine step brings
 * "after" in and lights the arrow. Stepping rides the deck engine's
 * `data-step` reveal system via the shared step plumbing (useStepIndex /
 * StepMarkers). Outside an engine (the /kit gallery) it statically shows the
 * un-revealed first beat.
 */
import { useRef, type ReactNode } from "react";
import { Slide, type BackgroundPattern } from "@butai/deck";
import { Subheading } from "../primitives/subheading.js";
import { StepMarkers, useStepIndex } from "../primitives/code-panel.js";

export interface BeforeAfterPanel {
  /** header chip text, e.g. "Before" / "After" */
  label: string;
  title?: string;
  /** bullet points; use `body` instead for arbitrary content */
  points?: string[];
  body?: ReactNode;
  /** chip + border tone; defaults: before=red, after=green */
  tone?: "red" | "green" | "accent" | "neutral";
}

interface BeforeAfterSlideProps {
  chapter: string;
  title?: ReactNode;
  before: BeforeAfterPanel;
  after: BeforeAfterPanel;
  background?: BackgroundPattern;
}

const TONE_VAR: Record<NonNullable<BeforeAfterPanel["tone"]>, [string, string]> = {
  red: ["var(--red)", "var(--red-dim)"],
  green: ["var(--green)", "var(--green-dim)"],
  accent: ["var(--accent)", "var(--accent-glow)"],
  neutral: ["var(--text-dim)", "var(--accent-glow)"],
};

function Panel({
  spec,
  side,
  defaultTone,
}: {
  spec: BeforeAfterPanel;
  side: "before" | "after";
  defaultTone: NonNullable<BeforeAfterPanel["tone"]>;
}) {
  const [tone, toneDim] = TONE_VAR[spec.tone ?? defaultTone];
  return (
    <div
      className={`ba__panel ba__panel--${side}`}
      style={{ ["--ba-tone" as string]: tone, ["--ba-tone-dim" as string]: toneDim }}
    >
      <span className="ba__chip">{spec.label}</span>
      {spec.title && <h4 className="ba__title">{spec.title}</h4>}
      {spec.points && (
        <ul className="ba__points">
          {spec.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {spec.body}
    </div>
  );
}

export function BeforeAfterSlide({
  chapter,
  title,
  before,
  after,
  background = "none",
}: BeforeAfterSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useStepIndex(ref) > 0;

  return (
    <Slide chapter={chapter} background={background}>
      <div ref={ref} className={`ba${revealed ? " ba--revealed" : ""}`}>
        {title && <Subheading gap="28px">{title}</Subheading>}
        <div className="ba__grid">
          <Panel spec={before} side="before" defaultTone="red" />
          <div className="ba__divider" aria-hidden>
            <svg viewBox="0 0 48 48" width="48" height="48">
              <circle cx="24" cy="24" r="23" fill="var(--accent-glow)" />
              <path
                d="M14 24 h18 M25 17 l8 7 -8 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Panel spec={after} side="after" defaultTone="green" />
        </div>
        <StepMarkers count={1} />
      </div>
    </Slide>
  );
}
