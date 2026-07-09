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

## Under the hood

- Component exports: `SlideEngine`, `Slide`, `SlideBackground`, `ThemePicker`,
  `EngineOverlays`, `SectionTracker`, `NavSidebar`, `LinktreePage`, and the
  `useSlides` hook.
- Motion helpers: `PROFILES`, `THEME_PROFILE`, `profileForTheme`, `specForTheme`.
- Styles: `@butai/deck/styles/engine.css` and `@butai/deck/styles/linktree.css`.
- Depends on `@butai/themes`; the published tarball ships `dist` and `styles`.
