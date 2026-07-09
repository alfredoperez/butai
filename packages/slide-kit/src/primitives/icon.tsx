import type { CSSProperties } from "react";

/**
 * Icon — line-icon set for decks. Consistent stroked SVG glyphs that inherit
 * `currentColor`, so no emoji (the #1 "AI-made" tell).
 */
export type IconName =
  | "spec"
  | "plan"
  | "comment"
  | "check"
  | "tasks"
  | "terminal"
  | "layers"
  | "wrench"
  | "spark"
  | "eye"
  | "branch"
  | "arrow";

const PATHS: Record<IconName, string> = {
  spec: "M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5M9 13h8M9 17h6",
  plan: "M4 14 14 4l6 6L10 20zM7 11l2 2M10 8l2 2M13 5l2 2",
  comment: "M4 5h16v11H9l-4 4v-4H4zM8 9h8M8 12h5",
  check: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12l2.5 2.5L16 9",
  tasks: "M4 6h2l1 1 2-2M4 12h2l1 1 2-2M4 18h2l1 1 2-2M12 6h8M12 12h8M12 18h8",
  terminal: "M3 4h18v16H3zM7 9l3 3-3 3M13 15h4",
  layers: "M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 18l9 5 9-5",
  wrench:
    "M21 4a5 5 0 0 1-6.6 6.6L6 19a2 2 0 0 1-3-3l8.4-8.4A5 5 0 0 1 16 2l-3 3 3 3 3-3a5 5 0 0 1 2 .9",
  spark:
    "M12 3l1.8 4.7L18 9l-4.2 1.3L12 15l-1.8-4.7L6 9l4.2-1.3ZM18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9Z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  branch:
    "M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 4v12m0-4a6 6 0 0 0 6-6 2 2 0 1 1 4 0 2 2 0 0 1-4 0",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 24, strokeWidth = 1.8, style, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
