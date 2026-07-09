import type { ReactNode } from "react";

/** Small uppercase eyebrow label above a heading. */
export function Label({ children }: { children: ReactNode }) {
  return <div className="label">{children}</div>;
}
