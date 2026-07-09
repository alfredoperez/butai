---
name: butai-sync-upstreams
description: >
  Check every upstream in the repo-root sources.yml ledger for new
  releases/commits since it was last reviewed, summarize what changed, and
  propose what butai might adopt — then update each entry's last-checked date and
  reference and note that CREDITS.md should be regenerated. Data-driven: it reads
  the upstream names, urls, and repos from sources.yml at runtime and hardcodes
  none of them. Use when the user says '/butai-sync-upstreams', "check my
  upstreams for updates", "sync the credits ledger", "what changed upstream", or
  "are any of our sources out of date". It proposes; a human always decides what
  to adopt.
argument-hint: "[optional source id or 'all' — e.g. all, or one entry's id]"
---

# butai Sync Upstreams

## What this does

Every project that borrows from other work owes an honest, current account of
what it borrowed. butai keeps that account in one file at the repo root — a
ledger listing each upstream it copied from, was inspired by, depends on, uses as
an external tool, or deliberately chose not to ship. Over time those upstreams
release new versions and move on, and the ledger quietly goes stale.

This skill walks that ledger and tells you, in plain language, what has changed
since each source was last looked at: new releases, notable commits, and anything
worth adopting. It then records that you checked — the date and the reference it
looked at — so next time you only review what is genuinely new. It **proposes**
adoptions; it never adopts anything on its own. A human reads the summary and
decides.

It is **data-driven**. It reads the concrete source names, urls, and repositories
from the ledger at run time — it hardcodes no specific upstream. Point it at a
different project's ledger and it does the same job there.

## When to use

- The user wants to know what changed in the project's upstreams.
- The credits ledger has not been reviewed in a while and may be stale.
- Before a release or an audit, to confirm nothing borrowed has drifted.
- The user is weighing whether to pull in a newer version of something.

Do **not** use this to actually change dependencies or vendor new code — it
reviews and proposes only. Adopting is a separate, human-driven step.

## The ledger is the source of truth (read it, never hardcode a source)

The list of upstreams is **not** maintained in this skill. It lives in the
repo-root ledger file (`sources.yml`), and this skill reads it fresh every run so
it always reflects the current set:

- Read the repo-root `sources.yml`. It has a top-level `version` and a `sources`
  array; each entry carries `id`, `name`, `url`, an optional `repo`, `license`,
  `what`, `how`, `adopted`, `last_checked`, `last_ref`, and optional `notes`. An
  entry whose `how` is `excluded` also carries an `excluded_reason`.
- Take every name, url, and repository **from the entry** — never write a specific
  upstream's name or address into this skill or into the summary from memory. If
  you need the address to check, read it from that entry's `repo` (or `url`).
- `how` tells you how to treat the entry: `copied-in`, `inspired-by`,
  `runtime-dep`, `external-tool`, and `own-work` are live sources worth checking;
  `excluded` entries were considered and deliberately not shipped, so they are
  reviewed differently (below), not checked for updates to adopt.

If the ledger gains or loses an entry, this skill follows automatically because it
re-reads the file — capture the source once in the ledger, review it forever.

## Hard rules

1. **Read the ledger at run time; hardcode no upstream.** Every source name, url,
   and repo comes from `sources.yml`. This skill names no specific upstream in its
   own text — that keeps the distributed skill clean and lets it work against any
   project's ledger.
2. **Propose, never adopt.** This skill summarizes and recommends. It does not
   change a dependency version, vendor code, or edit any package. A human decides
   what to adopt, in a separate step.
3. **Only `last_checked` and `last_ref` get written back.** The one change this
   skill makes to the ledger is advancing each reviewed entry's `last_checked`
   (today's date) and `last_ref` (the newest reference it saw). It does not
   rewrite `what`, `license`, `how`, or any other field.
4. **Credits are generated, never hand-edited.** After the ledger changes,
   `CREDITS.md` is regenerated from it (`pnpm --filter @butai/credits gen`) — never
   edit the credits file by hand.
5. **Personal-data-clean and trademark-clean.** The skill text stays generic.
   Concrete upstream identities live only in the ledger it reads, not in this
   file.

## Steps

### 1. Load the ledger

Read the repo-root `sources.yml`. Confirm it parses and has a `sources` array. If
the user passed a single source `id` (or a name), narrow to that one entry;
otherwise review the whole set. Skip nothing silently — if an entry looks
malformed, say so rather than dropping it.

### 2. Separate live sources from excluded ones

Split the entries by `how`. Everything except `excluded` is a **live** source to
check for updates. The `excluded` entries are things the project looked at and
chose not to ship; for those, the review is a re-confirmation (below), not an
update check.

### 3. Check each live source for what changed

For each live entry, use its `repo` (or `url` when there is no separate repo) to
look at releases and commits **since** the point recorded in `last_ref` /
`last_checked`:

- If `last_ref` holds a release tag or commit, treat that as the baseline and look
  at what landed after it.
- If `last_ref` is empty, use `last_checked` (the date it was last reviewed) as
  the baseline, and note that this is the first reference being recorded.
- Summarize in plain language: the newest release/tag, roughly how many commits or
  releases have landed since the baseline, and anything notable (a major version, a
  breaking change, a new capability that maps to how butai uses this source per its
  `what`).

Keep each source's summary to a few honest sentences. If nothing changed since the
baseline, say exactly that — "no new releases since last checked" is a useful
result.

### 4. Re-confirm the excluded entries

For each `excluded` entry, do not look for updates to adopt. Instead confirm its
`excluded_reason` still holds — the thing is still non-free / still not something
the project intends to ship. If an upstream's terms visibly changed in a way that
would affect that reasoning, flag it for a human; otherwise note it as unchanged.
This keeps the deliberately-excluded rows honest over time.

### 5. Propose adoptions (recommendation first)

Where a live source shipped something worth pulling in, write a short proposal —
**lead with your recommendation**, then the reasoning: what changed, why it might
matter for how butai uses that source, and the rough cost/risk of adopting it. Be
conservative: prefer "worth a look" over "adopt now", and always frame it as a
suggestion a human signs off on. If nothing is worth adopting, say so plainly.

### 6. Update the ledger, then regenerate credits

For every entry you actually reviewed, update **only** its `last_checked` (to
today's date) and its `last_ref` (to the newest reference you saw — a release tag
or commit; leave it empty only if there genuinely is no reference). Write those
edits back into `sources.yml`. Then note that the credits file must be
regenerated so it reflects the refreshed dates:

```
pnpm --filter @butai/credits gen
```

That command re-renders the repo-root `CREDITS.md` from the ledger. Confirm the
only change is the refreshed `last_checked` / `last_ref` data — the credits file
is a pure render of the ledger and should never be edited by hand.

### 7. Report

Give the user a short, scannable summary: which sources changed and which did not,
the proposals (recommendation first), the excluded-entry re-confirmations, and the
fact that the ledger dates were advanced and credits regenerated. Make it easy to
decide what to do next.

## Quality checklist

- [ ] Read the repo-root `sources.yml` at run time — no upstream name hardcoded here
- [ ] Split live sources from `excluded` entries by `how`
- [ ] Checked each live source's releases/commits since its `last_ref` / `last_checked`
- [ ] Summarized what changed in plain language (or confirmed nothing did)
- [ ] Re-confirmed each `excluded` entry's reason still holds
- [ ] Proposed adoptions recommendation-first; never auto-adopted
- [ ] Advanced only `last_checked` + `last_ref` on reviewed entries
- [ ] Noted that `CREDITS.md` is regenerated from the ledger (never hand-edited)
- [ ] Reported a scannable summary so a human can decide

## Non-goals

- No adopting, vendoring, or version-bumping — this skill proposes; a human acts.
- No editing package sources, lockfiles, or any code — only the ledger's
  `last_checked` / `last_ref` fields change.
- No hand-editing `CREDITS.md` — it is generated from the ledger.
- No hardcoded upstream names, urls, or repos — every concrete source is read from
  `sources.yml` at run time.
- No new ledger rows — adding a newly discovered source is a separate, deliberate
  edit to the ledger, not something this review invents.
- No personal, proprietary, or trademarked content in the skill text; concrete
  identities live only in the ledger it reads.
