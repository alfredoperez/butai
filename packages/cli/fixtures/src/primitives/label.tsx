import type { ReactNode } from 'react';

/** A small eyebrow / kicker label. Pure React — the shared closure floor. */
export function Label({ children }: { children: ReactNode }): ReactNode {
  return <span className="butai-label">{children}</span>;
}
