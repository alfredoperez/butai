import type { ReactNode } from 'react';
import { Slide } from '@butai/deck';
import { QRCodeSVG } from 'qrcode.react';
import { CoverSlide } from '../slides/cover-slide.js';

/**
 * A quote slide that composes CoverSlide (transitive closure: cover-slide -> label)
 * and carries an npm dependency (qrcode.react) to exercise the install summary.
 */
export function QuoteSlide({
  quote,
  attribution,
  href,
}: {
  quote: string;
  attribution: string;
  href?: string;
}): ReactNode {
  return (
    <Slide>
      <CoverSlide eyebrow="Quote" title={quote} subtitle={attribution} />
      {href ? <QRCodeSVG value={href} /> : null}
    </Slide>
  );
}
