import type { ReactNode } from 'react';
import { Slide } from '@butai/deck';
import { Label } from '../primitives/label.js';

/** Deck opener: eyebrow + big title + subtitle. Depends on the Label primitive. */
export function CoverSlide({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}): ReactNode {
  return (
    <Slide>
      <Label>{eyebrow}</Label>
      <h1 className="cover-title">{title}</h1>
      {subtitle ? <p className="cover-subtitle">{subtitle}</p> : null}
    </Slide>
  );
}
