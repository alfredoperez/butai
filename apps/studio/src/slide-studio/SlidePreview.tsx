/**
 * Themed deck-frame preview (Group B). Renders one archetype example inside a
 * dedicated `data-theme` stage so the theme cascade + slide-base + engine CSS all
 * apply to the slide, while staying isolated from the shadcn chrome (see the CSS).
 */
import type { ReactElement } from 'react';

export function SlidePreview({
  element,
  themeId,
}: {
  element: ReactElement | null;
  themeId: string;
}) {
  return (
    <div
      className="slide-studio__stage"
      data-theme={themeId}
      data-slide-preview
    >
      <div className="slide-studio__canvas">
        {element ?? (
          <p className="p-8 text-sm text-muted-foreground">No example registered.</p>
        )}
      </div>
    </div>
  );
}
