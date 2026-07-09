# Butai demo site

A read-only "play with butai" site. It is the fastest way to see what butai gives
you before adopting it: browse the themes, the slide archetypes, the video scenes,
and the doc patterns, all in one place. It is a demo, not an authoring tool. There
is no editing that persists and no storyboard here. Authoring content lives in your
own tooling and the skills.

## Run

```sh
pnpm --filter studio dev
```

## The four explore surfaces

A persistent left nav switches between four routes (visiting `/` redirects to
`/theme`):

- `/theme`: a theme explorer to tweak tokens and preview them across the themes.
- `/slides`: a slide-kit browser with the `butai add` command to copy each
  archetype in.
- `/video`: a scene-kit contact sheet of the video scenes.
- `/docs`: a docs-kit pattern gallery.

## Under the hood

- React plus `react-router-dom`; routes are defined in `src/App.tsx`.
- Consumes the real packages (`@butai/deck`, `@butai/themes`, `@butai/slide-kit`,
  `@butai/scene-kit`, `@butai/docs-kit`, `@butai/patterns`), so what you see is
  what a consumer gets.
- Private workspace app; it is not published to npm.
