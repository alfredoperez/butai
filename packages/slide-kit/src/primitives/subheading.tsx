import type { CSSProperties, ReactNode } from "react";

interface SubheadingProps {
  children: ReactNode;
  /** Override the default bottom margin (CSS default is 12px) */
  gap?: string;
  className?: string;
  style?: CSSProperties;
}

/** Section <h3> heading with an optional gap override. */
export function Subheading({ children, gap, className, style }: SubheadingProps) {
  const merged: CSSProperties = gap ? { marginBottom: gap, ...style } : (style ?? {});
  return (
    <h3 className={className} style={Object.keys(merged).length ? merged : undefined}>
      {children}
    </h3>
  );
}
