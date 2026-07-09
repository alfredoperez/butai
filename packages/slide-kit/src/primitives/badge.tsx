import type { ReactNode } from "react";

type BadgeVariant = "red" | "green" | "yellow" | "blue" | "orange" | "accent";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

/** Small pill badge in a theme color. */
export function Badge({ variant, children }: BadgeProps) {
  if (variant === "accent") {
    return (
      <span className="badge" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
        {children}
      </span>
    );
  }
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
