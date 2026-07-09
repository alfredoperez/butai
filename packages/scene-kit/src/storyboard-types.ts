/**
 * FROZEN STORYBOARD.md schema (phase-5.md §0.4).
 *
 * Modeled on the HyperFrames `STORYBOARD.md` format. Named
 * `SceneStoryboard`/`StoryboardScene` to AVOID collision with P4's
 * `Storyboard`/`StoryboardBlock` (the deck-outline JSON in
 * `apps/studio/src/store/persistence-format.ts` — a DISTINCT artifact, §0.6).
 *
 * Isomorphic: no `node:fs` in the import graph, so Group B's parser and the
 * Studio (browser) surface can import these from the root barrel safely (the
 * P2 isomorphic rule). `Diagnostic` is reused from `@butai/patterns`.
 *
 * Extend only via additive OPTIONAL fields.
 */
import type { Diagnostic } from '@butai/patterns';

export const STORYBOARD_MD_VERSION = 1;

/** The storyboard's per-frame lane. */
export type SceneStatus = 'outline' | 'draft' | 'final';

/** Open string union — the seed transitions plus any author-supplied value. */
export type TransitionKind = 'cut' | 'crossfade' | 'wipe' | 'slide' | string;

export type StoryboardScene = {
  index: number; // 1-based frame number parsed from "## Frame N - Title"
  title: string; // the heading text after "Frame N - "
  status?: SceneStatus;
  durationSeconds?: number; // parsed from "3s" / "4.5s"
  transitionIn?: TransitionKind;
  scene?: string; // the visual description
  voiceover?: string; // the VO line
  src?: string; // optional scene HTML path (e.g. "frames/04-summary.html")
  poster?: number; // optional poster frame index
  asset?: string; // optional asset filename referenced
  note?: string; // the trailing director's-note prose paragraph
  extra?: Record<string, string>; // any additional `- key: value` bullets (forward-compat)
};

export type SceneStoryboard = {
  version: number; // === STORYBOARD_MD_VERSION
  format?: string; // "1080x1920" etc. (frontmatter)
  message?: string; // frontmatter one-liner
  arc?: string; // frontmatter arc
  audience?: string; // frontmatter audience
  scenes: StoryboardScene[]; // ordered by `index`
  diagnostics: Diagnostic[]; // reuse @butai/patterns `Diagnostic` shape; parse never throws
};
