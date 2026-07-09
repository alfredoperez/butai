# Butai playground

A small demo app that renders a real butai deck and a gallery of the slide kit.
It is where you confirm the engine and the kit work end to end in a running app.

## Run

```sh
pnpm --filter playground dev
```

Then open `/kit` for the slide-kit gallery.

## Under the hood

- React plus `react-router-dom`; the `/kit` route renders the gallery.
- Consumes `@butai/deck`, `@butai/slide-kit`, and `@butai/themes`.
- Private workspace app; it is not published to npm.
