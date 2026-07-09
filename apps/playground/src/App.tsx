/**
 * Playground routes (plan Q3 + phase-3 Group C):
 *   /            → demo deck
 *   /:slideIndex → demo deck deep-linked (1-based, e.g. /2 lands on slide 2)
 *   /links       → LinktreePage fed exclusively by fixtures
 *   /kit         → slide-kit gallery (every cataloged archetype, framed)
 *   /kit/:id     → a single archetype, deep-linked
 *
 * The router↔engine seam (plan Q4 cut 1): the app reads the URL once for
 * `initialSlide`, mirrors later URL changes through the controlled `slide`
 * prop (back/forward), and writes engine changes back via `onSlideChange`
 * with history replace so Back exits the deck instead of walking slides.
 */
import { useCallback, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { LinktreePage } from '@butai/deck';
import { DemoDeck } from './demo-deck';
import { KitGallery } from './kit-gallery';
import {
  FIXTURE_FOOTER,
  FIXTURE_LINKS,
  FIXTURE_LINKS_HEADING,
  FIXTURE_SOCIALS,
  FIXTURE_SPEAKER,
  FIXTURE_TALK,
} from './fixtures';

/** 1-based URL param → clamped 0-based slide index. */
function paramToIndex(param: string | undefined): number {
  const parsed = param ? Number.parseInt(param, 10) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed - 1 : 0;
}

function DeckRoute() {
  const { slideIndex } = useParams<{ slideIndex?: string }>();
  const navigate = useNavigate();
  const urlIndex = paramToIndex(slideIndex);

  // Read the deep-link target exactly once (mount), per the contract's
  // "initialSlide read once at init" semantics — no re-init on later changes.
  const [initialSlide] = useState(urlIndex);

  const handleSlideChange = useCallback(
    (index: number) => {
      navigate(`/${index + 1}`, { replace: true });
    },
    [navigate],
  );

  return (
    <DemoDeck
      initialSlide={initialSlide}
      slide={urlIndex}
      onSlideChange={handleSlideChange}
    />
  );
}

function LinksRoute() {
  return (
    <LinktreePage
      talk={FIXTURE_TALK}
      speaker={FIXTURE_SPEAKER}
      links={FIXTURE_LINKS}
      linksHeading={FIXTURE_LINKS_HEADING}
      socials={FIXTURE_SOCIALS}
      deckHref="/"
      deckLabel="View the demo deck"
      homeHref="/"
      footer={FIXTURE_FOOTER}
    />
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/kit" element={<KitGallery />} />
      <Route path="/kit/:id" element={<KitGallery />} />
      <Route path="/links" element={<LinksRoute />} />
      <Route path="/:slideIndex?" element={<DeckRoute />} />
    </Routes>
  );
}
