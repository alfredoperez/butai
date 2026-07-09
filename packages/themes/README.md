# @butai/themes

The look and feel of a butai deck, packaged as ready-to-use themes. Each theme is
a complete set of design tokens plus a standalone CSS file you can drop straight
into a project, no build step required.

## What it does

A theme decides the colors, type, and spacing of everything butai renders. This
package ships thirteen of them (for example light, dark, aurora, blueprint,
brutalist, and glassmorphism) as plain CSS you can import, and the token data
behind them so tools can read a theme as structured values.

## Install

```sh
pnpm add @butai/themes
```

## Usage

Import a theme's CSS in your app entry, then activate it with a `data-theme`
attribute:

```ts
import '@butai/themes/themes/aurora.css';
```

```html
<div data-theme="aurora"> ... your deck ... </div>
```

## Under the hood

- CSS entry: `@butai/themes/themes/<name>.css` (one file per theme under
  `themes/`).
- Data entry: the package `.` export exposes the theme token sets, built on the
  `@butai/patterns` token contract, so every theme fills the same required tokens.
- Source lives under `src/`; the published tarball ships the compiled `dist/`
  plus the `themes/` CSS.
