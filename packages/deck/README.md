# @butai/deck

The engine that turns a list of slides into a running presentation. It is a small
set of React components that handle navigation, transitions, backgrounds, theme
switching, and the chapter tracking a real talk needs.

## What it does

Give it your slides and a theme and it renders a keyboard-navigable deck: it
tracks the current slide and chapter, animates transitions, paints slide
backgrounds, and offers a theme picker and navigation sidebar. It is the runtime
the slide kit's archetypes plug into.

## Install

```sh
pnpm add @butai/deck @butai/themes react react-dom
```

React 19 is a peer dependency.

## Usage

```tsx
import { SlideEngine, Slide } from '@butai/deck';
import '@butai/deck/styles/engine.css';
import '@butai/themes/themes/aurora.css';

export function Deck() {
  return (
    <SlideEngine>
      <Slide>First slide</Slide>
      <Slide>Second slide</Slide>
    </SlideEngine>
  );
}
```

## Grid overview (contact sheet)

Press G while presenting to see every slide of the deck at once, laid out as a
grid of small live previews, like a photographer's contact sheet. The slide you
are on is highlighted; click any thumbnail to jump straight to it, or press G
or Escape to go back to where you were. People who prefer reduced motion get a
plain fade instead of the zoom animation.

To enable it, import the overview stylesheet after the engine one:

```tsx
import '@butai/deck/styles/engine.css';
import '@butai/deck/styles/overview.css';
```

Under the hood this is a true mode, not a re-render: the engine's real slide
elements are scaled into the grid cells with inline transforms, so interactive
slide content is never mounted twice. The `DeckOverview` component is also
exported for decks that drive `useSlides` directly.

## Under the hood

- Component exports: `SlideEngine`, `Slide`, `SlideBackground`, `ThemePicker`,
  `EngineOverlays`, `DeckOverview`, `SectionTracker`, `NavSidebar`,
  `LinktreePage`, and the `useSlides` hook.
- Motion helpers: `PROFILES`, `THEME_PROFILE`, `profileForTheme`, `specForTheme`.
- Styles: `@butai/deck/styles/engine.css`, `@butai/deck/styles/overview.css`,
  and `@butai/deck/styles/linktree.css`.
- Depends on `@butai/themes`; the published tarball ships `dist` and `styles`.
