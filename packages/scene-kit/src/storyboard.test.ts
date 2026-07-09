/**
 * `parseStoryboard` unit tests (Group B). Runs against a committed fixture
 * modeled on the real campaign STORYBOARD.md shape (personal data stripped) plus
 * inline malformed inputs — proving frontmatter + N frames parse into typed
 * scenes, HTML comments are ignored, and malformed input yields diagnostics
 * rather than throwing.
 *
 * The fixture is read with `node:fs` HERE (a test, run in node) — never from the
 * vault, and never from the isomorphic parser itself.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { STORYBOARD_MD_VERSION } from './storyboard-types.js';
import { parseStoryboard } from './storyboard.js';

const FIXTURE = readFileSync(
  fileURLToPath(new URL('./__fixtures__/storyboard.md', import.meta.url)),
  'utf8',
);

describe('parseStoryboard — real-shape fixture', () => {
  const sb = parseStoryboard(FIXTURE);

  it('parses frontmatter into format/message/arc/audience', () => {
    expect(sb.version).toBe(STORYBOARD_MD_VERSION);
    expect(sb.format).toBe('1080x1920');
    expect(sb.message).toBe('One idea per frame beats a wall of text.');
    expect(sb.arc).toBe('Hook -> Reveal -> Proof -> CTA');
    expect(sb.audience).toBe('developers who skim');
  });

  it('parses every `## Frame N - Title` section, ordered by index', () => {
    expect(sb.scenes.map((s) => s.index)).toEqual([1, 2, 3, 4]);
    expect(sb.scenes.map((s) => s.title)).toEqual([
      'The opener (Hook)',
      'The callout (Reveal)',
      'Code reveals (Proof)',
      'End card (CTA)',
    ]);
  });

  it('types the known bullet fields', () => {
    const f2 = sb.scenes[1];
    expect(f2.status).toBe('draft');
    expect(f2.durationSeconds).toBe(4.5);
    expect(f2.transitionIn).toBe('crossfade');
    expect(f2.src).toBe('frames/02-callout.html');
    expect(f2.poster).toBe(2);
    expect(f2.asset).toBe('placeholder-panel.png');
    expect(f2.scene).toContain('framed placeholder panel');
    expect(f2.voiceover).toBe('Show the thing, then say why it matters.');
  });

  it('parses "3s" durations to numeric seconds', () => {
    expect(sb.scenes[0].durationSeconds).toBe(3);
    expect(sb.scenes[2].durationSeconds).toBe(5);
  });

  it('captures the trailing prose paragraph as the director note', () => {
    expect(sb.scenes[0].note).toBe(
      "Names the payoff in the viewer's own words. Kinetic type only, no UI yet.",
    );
    expect(sb.scenes[1].note).toContain('shot-with-caption');
  });

  it('routes unknown bullets into extra (forward-compat)', () => {
    expect(sb.scenes[2].extra).toEqual({ confidence: 'high' });
  });

  it('ignores frame-like headings inside HTML comments', () => {
    expect(sb.scenes.some((s) => s.index === 99)).toBe(false);
  });

  it('is diagnostics-clean for a well-formed storyboard', () => {
    expect(sb.diagnostics).toEqual([]);
  });
});

describe('parseStoryboard — robustness (never throws)', () => {
  it('empty input → no scenes + a no-frames warning', () => {
    const sb = parseStoryboard('');
    expect(sb.scenes).toEqual([]);
    expect(sb.diagnostics.some((d) => d.code === 'no-frames')).toBe(true);
  });

  it('malformed duration → diagnostic + kept in extra, scene still emitted', () => {
    const sb = parseStoryboard('## Frame 1 - X\n- duration: soon\n');
    expect(sb.scenes).toHaveLength(1);
    expect(sb.scenes[0].durationSeconds).toBeUndefined();
    expect(sb.scenes[0].extra?.duration).toBe('soon');
    expect(sb.diagnostics.some((d) => d.code === 'bad-duration')).toBe(true);
  });

  it('unknown status → warning + extra', () => {
    const sb = parseStoryboard('## Frame 1 - X\n- status: shipped\n');
    expect(sb.scenes[0].status).toBeUndefined();
    expect(sb.scenes[0].extra?.status).toBe('shipped');
    expect(sb.diagnostics.some((d) => d.code === 'unknown-status')).toBe(true);
  });

  it('invalid YAML frontmatter → error diagnostic, body still parsed', () => {
    const sb = parseStoryboard('---\n: : :\nformat: [\n---\n## Frame 1 - X\n- duration: 2s\n');
    expect(sb.diagnostics.some((d) => d.code === 'invalid-frontmatter')).toBe(true);
    expect(sb.scenes).toHaveLength(1);
    expect(sb.scenes[0].durationSeconds).toBe(2);
  });

  it('tolerates em-dash / colon / "Scene" heading variants', () => {
    const sb = parseStoryboard('## Scene 1 — Alpha\n## Frame 2: Beta\n');
    expect(sb.scenes.map((s) => s.title)).toEqual(['Alpha', 'Beta']);
  });

  it('never throws on arbitrary garbage', () => {
    expect(() => parseStoryboard('###\n- : \n<!--')).not.toThrow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => parseStoryboard(undefined as any)).not.toThrow();
  });
});
