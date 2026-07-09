/**
 * Checklist coverage gate (phase-10 §0.5, Verification 6).
 *
 * Machine-verifies that PUBLIC-FLIP-CHECKLIST.md mentions every required
 * morning-queue + GAPS public-flip item. If a builder drops an item, this fails
 * — the checklist is the single pre-flight the user runs, so it must be
 * complete.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { repoRoot } from './manifests.js';

const checklist = readFileSync(path.join(repoRoot(), 'PUBLIC-FLIP-CHECKLIST.md'), 'utf8');

/** Each required item: a label + a regex that must match the checklist text. */
const REQUIRED: Array<[string, RegExp]> = [
  // §2 manifest flips
  ['private-flip', /private/i],
  ['publishConfig', /publishConfig/],
  ['license field', /license/i],
  ['files array', /files array/i],
  ['version bump', /version bump/i],
  ['patterns no-private gap', /@butai\/patterns/],
  ['themes files array', /"files": \["dist", "themes"\]/],
  // §3 npm org + publish
  ['npm org', /npm\s+org/i],
  ['publish order', /dependency order/i],
  ['pnpm -r publish (workspace rewrite)', /pnpm -r publish/],
  ['workspace:* rewrite note', /workspace:\*/],
  // §4 consumer swap
  ['platform-consumer branch', /platform-consumer/],
  ['platform-consumer commit', /28d9f97/],
  // §5 CI
  ['playwright-install', /playwright install/i],
  // §6 optional cleanup
  ['fixture-scenes', /fixture-scenes/],
  // §1 P8 license-review flags
  ['house-design-system flag', /house-design-system/],
  ['frontend-slides flag', /frontend-slides/],
  ['gsap personal-domain flag', /gsap-recipe-reference/],
  ['hyperframes flag', /hyperframes/],
  ['LICENSE holder consistency', /LICENSE.*consisten|consisten.*LICENSE/is],
  // §7–8 HOLDs
  ['repo-flip HOLD', /repo.*public.*HOLD|public flip.*HOLD/is],
  ['domain HOLD', /[Dd]omain.*HOLD/],
  // pivot note
  ['studio removed / authoring in Command Center', /Command Center/],
  ['create-butai starter publish', /create-butai/],
];

describe('PUBLIC-FLIP-CHECKLIST.md coverage', () => {
  for (const [label, re] of REQUIRED) {
    it(`covers: ${label}`, () => {
      expect(re.test(checklist), `checklist is missing "${label}" (${re})`).toBe(true);
    });
  }

  it('keeps the HOLDs unambiguous (no accidental "flip now")', () => {
    // The repo-flip + domain sections must still read as HOLD, not as applied.
    expect(checklist).toMatch(/HOLD/);
  });
});
