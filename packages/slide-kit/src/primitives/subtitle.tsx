import type { CSSProperties, ReactNode } from "react";

interface SubtitleProps {
  children: ReactNode;
  style?: CSSProperties;
}

/** Muted supporting line under a heading. */
export function Subtitle({ children, style }: SubtitleProps) {
  return (
    <p className="subtitle" style={style}>
      {children}
    </p>
  );
}
