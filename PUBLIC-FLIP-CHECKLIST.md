# Public-flip checklist

This is the one-time, top-to-bottom pre-flight for shipping butai. Since you
opted into a **beta publish (2026-07-08)**, the build prepped the 7 packages for
`0.1.0-beta.0` (see section 2, marked DONE). What is still **held** and is your
call: nothing has been **published** to npm, the repo is still **private**, and
no domain was bought. The only outward step left for the packages is the
authenticated `pnpm -r publish` in section 3, which the build does not run for you.

**Read this first — what butai is now.** butai is a public substrate (the deck
engine, the theme and slide/scene/docs kits, and a CLI) plus a small read-only
demo site. The visual authoring app — the old Storyboard and Video studio — was
**removed from this repo**. Authoring now lives in a separate private app
(Command Center), so **there is nothing studio-related to publish here.** Don't
go looking for an authoring surface to ship; the demo site is just a showcase.

Steps 1–6 are safe prep and publishing. Steps 7–8 are the irreversible calls
(repo public, domain) and are explicitly **your decision** — they stay on HOLD
until you choose to lift them.

---

## 1. License review (do this before any public flip)

These are the flags raised during the license/provenance pass. Each is a human
judgment call, not a code change. Resolve each before flipping anything public.

- [ ] **house-design-system** — the docs-kit doc-patterns were generalized from a
      proprietary house design system. It is disclosed in `sources.yml` as a
      non-naming excluded row (no proprietary content ships, and the guard
      enforces that). Decide: name it precisely, keep the generic wording, or
      drop the reference entirely.
- [ ] **frontend-slides** — license is UNVERIFIED. It was a concept-only borrow;
      no code ships. Confirm you are comfortable with that before the flip.
- [ ] **gsap-recipe-reference** — decide whether to name the maintainer's
      personal domain (the personal-domain naming recorded in `CREDITS.md`)
      precisely in the public credits, or keep the generic "first-party prior
      art" wording.
- [ ] **hyperframes** — listed as proprietary/external in the adopted-family
      section (no code ships). Confirm the framing reads right.
- [ ] **LICENSE holder consistency** — confirm the `LICENSE` copyright holder is
      consistent with the naming in `CREDITS.md`, `plugin.json`, and
      `marketplace.json` (all MIT).

## 2. Package manifest prep — DONE (beta 0.1.0-beta.0)

The build already applied the publish prep for the 7 packages. Verify it, do not
redo it:

```bash
pnpm --filter @butai/release-check test   # publish-readiness + npm pack --dry-run, publishes nothing
```

Applied to `@butai/patterns`, `@butai/themes`, `@butai/deck`, `@butai/slide-kit`,
`@butai/scene-kit`, `@butai/docs-kit`, `@butai/cli`:

- [x] Removed `"private": true`.
- [x] Added `"publishConfig": { "access": "public", "tag": "beta" }`.
- [x] Added `"license": "MIT"`.
- [x] Version bump `0.0.1` → `0.1.0-beta.0`, all in lockstep.
- [x] Added a **files array** where missing: `@butai/patterns` → `"files": ["dist"]`
      (stops shipping `src/`); `@butai/themes` → `"files": ["dist", "themes"]`.
- [ ] **`@butai/create-butai`** (the starter) is still `private` on purpose — it
      depends on the 7, so it is a follow-on beta you flip + publish **last**.
- [x] Intended-private packages left untouched: `studio`, `playground`,
      `@butai/library-web`, `@butai/credits`, `@butai/skills-plugin-tests` (tests
      for the marketplace plugin; the plugin dir itself has no package.json),
      `@butai/release-check`.

## 3. npm org + publish (real, human-run — your authenticated step)

The packages are beta-ready; publishing needs your npm identity, so the build
does not do it. Two steps:

- [ ] Create the `@butai` **npm org** / scope on npmjs (logged in as yourself).
- [ ] From the repo root, publish the beta. `pnpm -r publish` walks the packages
      in **dependency order** (leaves first) and skips the private ones:

      ```bash
      pnpm -r publish --tag beta --no-git-checks
      ```

      Use **`pnpm -r publish`** (not `npm publish`): pnpm rewrites the
      `workspace:*` inter-package deps to the real `0.1.0-beta.0` versions at
      publish time — npm does not, and would ship a broken `workspace:*` spec.
      The `--tag beta` dist-tag means a plain `npm install @butai/deck` will not
      pick up beta; only `@butai/deck@beta` does.
- [ ] Publish **`create-butai` last**, once the packages it points at exist.
- [ ] Verify each package renders on npmjs (README, files, version).

## 4. Consumer swap (platform-consumer site)

- [ ] Review, merge, and deploy the **platform-consumer** site
      branch (commit `28d9f97`), which consumes `@butai/deck`.
- [ ] Swap its vendored `@butai/deck` tarball dependency for the published npm
      dependency (steps are in that branch's `vendor/butai/README.md`).

## 5. CI fix (Playwright)

- [ ] Add `npx playwright install chromium --with-deps` before the e2e steps in
      `.github/workflows/**` (the **playwright-install** gap — the e2e jobs for
      library-web, playground, scene-kit, and docs-kit need a browser installed
      in CI).
- [ ] Decide whether to wire the `e2e` script into `pnpm check` or keep it as a
      separate CI job.

## 6. Optional cleanups

- [ ] **fixture-scenes** — consider deleting
      `apps/studio/src/video-studio/fixture-scenes/*.html` for a leaner public
      surface. They are the never-empty fallback and the e2e exercises the real
      scenes, so they are dead in practice — but verify the empty-state path
      after deleting.

## 7. Repo public flip — HOLD (your call)

- [ ] Only after steps 1–2 pass, flip the GitHub repo from private to public.
      **This is on HOLD by your directive** — nothing overnight touched it. Lift
      the hold deliberately.

## 8. Domain — HOLD (your call)

- [ ] Buying / wiring a domain is **deferred by your directive**. Left on HOLD.

## 9. Announce / build-in-public

- [ ] Last: announce, write the launch post, start the build-in-public thread.

## 10. Post-launch (logged, not blocking)

- [ ] A full npm SBOM / license scanner in CI.
- [ ] A hosted docs site that dogfoods `@butai/docs-kit` to render the catalogs.
- [ ] A separate published starter repo (vs the in-repo `create-butai`).
- [ ] Decide whether `@butai/library-web` should publish.
- [ ] A real automated upstream sync (a scheduled poller).
