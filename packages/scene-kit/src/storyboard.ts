/**
 * `parseStoryboard` — STORYBOARD.md → a structured `SceneStoryboard` (§0.4).
 *
 * ISOMORPHIC: pure string parsing, NO `node:fs` — so the root barrel stays
 * browser-safe (the P2 rule). The Studio (browser) imports this from the root
 * barrel. `yaml` is a pure-JS dep (no node builtins), exactly as
 * `@butai/patterns`'s own `parseDesignSpec` uses it.
 *
 * The parser NEVER throws on content: every problem surfaces as a `Diagnostic`
 * and a best-effort scene is still emitted. Modeled on the real campaign
 * STORYBOARD.md shape: YAML frontmatter (`format`/`message`/`arc`/`audience`),
 * `## Frame N - Title` sections carrying `- key: value` bullets plus a trailing
 * director's-note prose paragraph, and HTML-comment research anchors that are
 * stripped before parsing.
 */
import { parse as parseYaml } from 'yaml';

import type { Diagnostic } from '@butai/patterns';
import {
  STORYBOARD_MD_VERSION,
  type SceneStatus,
  type SceneStoryboard,
  type StoryboardScene,
} from './storyboard-types.js';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;

/** `## Frame 3 - Title`, `## Scene 3 — Title`, `## Frame 3: Title`, `## Frame 3`. */
const FRAME_HEADING_RE = /^##\s+(?:Frame|Scene)\s+(\d+)\s*(?:[-–—:.)]\s*(.*))?$/i;

/** `- key: value` / `* key: value` bullet. */
const BULLET_RE = /^[-*]\s+([A-Za-z_][\w-]*)\s*:\s*(.*)$/;

const VALID_STATUS = new Set<SceneStatus>(['outline', 'draft', 'final']);

/** Strip one pair of matching wrapping quotes (VO lines are commonly quoted). */
function stripQuotes(value: string): string {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' || first === "'") && first === last) return value.slice(1, -1);
  }
  return value;
}

/** Parse `"3s"` / `"4.5s"` / `"4 s"` / `"4"` → seconds; non-numeric → undefined. */
function parseDurationSeconds(raw: string): number | undefined {
  const m = /(-?[\d.]+)/.exec(raw);
  if (!m) return undefined;
  const n = Number.parseFloat(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

type RawSection = { index: number; title: string; lines: string[]; headingLine: number };

/** Split the comment-stripped body into `## Frame N` sections. */
function splitSections(body: string): { sections: RawSection[]; badHeadings: string[] } {
  const lines = body.split('\n');
  const sections: RawSection[] = [];
  const badHeadings: string[] = [];
  let current: RawSection | null = null;

  lines.forEach((line, i) => {
    const m = FRAME_HEADING_RE.exec(line.trim());
    if (m) {
      if (current) sections.push(current);
      const index = Number.parseInt(m[1], 10);
      current = { index, title: (m[2] ?? '').trim(), lines: [], headingLine: i };
    } else if (/^##\s+/.test(line.trim()) && /frame|scene/i.test(line)) {
      // Looks like a frame/scene heading but the number didn't parse.
      badHeadings.push(line.trim());
      if (current) current.lines.push(line);
    } else if (current) {
      current.lines.push(line);
    }
  });
  if (current) sections.push(current);
  return { sections, badHeadings };
}

/** Turn one raw section's body lines into a typed scene, collecting diagnostics. */
function parseScene(section: RawSection, diagnostics: Diagnostic[]): StoryboardScene {
  const scene: StoryboardScene = { index: section.index, title: section.title };
  const extra: Record<string, string> = {};
  const proseParagraphs: string[] = [];
  let proseBuffer: string[] = [];

  const flushProse = () => {
    if (proseBuffer.length) {
      proseParagraphs.push(proseBuffer.join(' ').trim());
      proseBuffer = [];
    }
  };

  for (const line of section.lines) {
    const trimmed = line.trim();
    const bullet = BULLET_RE.exec(trimmed);
    if (bullet) {
      // A bullet ends any in-progress prose paragraph.
      flushProse();
      const key = bullet[1].toLowerCase();
      const value = stripQuotes(bullet[2].trim());
      switch (key) {
        case 'status': {
          if (VALID_STATUS.has(value as SceneStatus)) scene.status = value as SceneStatus;
          else {
            extra.status = value;
            diagnostics.push({
              level: 'warning',
              code: 'unknown-status',
              message: `Frame ${section.index}: unrecognized status "${value}" (kept in extra)`,
            });
          }
          break;
        }
        case 'duration': {
          const seconds = parseDurationSeconds(value);
          if (seconds === undefined) {
            extra.duration = value;
            diagnostics.push({
              level: 'warning',
              code: 'bad-duration',
              message: `Frame ${section.index}: unparseable duration "${value}"`,
            });
          } else scene.durationSeconds = seconds;
          break;
        }
        case 'transition_in':
          scene.transitionIn = value;
          break;
        case 'scene':
          scene.scene = value;
          break;
        case 'voiceover':
          scene.voiceover = value;
          break;
        case 'src':
          scene.src = value;
          break;
        case 'poster': {
          const n = Number.parseInt(value, 10);
          if (Number.isNaN(n)) {
            extra.poster = value;
            diagnostics.push({
              level: 'warning',
              code: 'bad-poster',
              message: `Frame ${section.index}: non-numeric poster "${value}"`,
            });
          } else scene.poster = n;
          break;
        }
        case 'asset':
          scene.asset = value;
          break;
        default:
          extra[key] = value;
          break;
      }
    } else if (trimmed === '') {
      flushProse();
    } else {
      // Non-bullet prose line — accumulate into the current paragraph.
      proseBuffer.push(trimmed);
    }
  }
  flushProse();

  // The first prose paragraph is the director's note.
  if (proseParagraphs.length) scene.note = proseParagraphs[0];
  if (Object.keys(extra).length) scene.extra = extra;
  return scene;
}

export function parseStoryboard(md: string): SceneStoryboard {
  const diagnostics: Diagnostic[] = [];
  const result: SceneStoryboard = { version: STORYBOARD_MD_VERSION, scenes: [], diagnostics };

  const source = typeof md === 'string' ? md : '';

  // 1. Frontmatter (parsed from the RAW source, before comment stripping — the
  //    frontmatter fence is at the very top and carries no HTML comments).
  let body = source;
  const fm = FRONTMATTER_RE.exec(source);
  if (fm) {
    body = source.slice(fm[0].length);
    try {
      const parsed: unknown = parseYaml(fm[1]);
      if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const map = parsed as Record<string, unknown>;
        const str = (v: unknown) =>
          v === null || v === undefined ? undefined : typeof v === 'string' ? v : String(v);
        result.format = str(map.format);
        result.message = str(map.message);
        result.arc = str(map.arc);
        result.audience = str(map.audience);
      } else if (parsed !== null && parsed !== undefined) {
        diagnostics.push({
          level: 'error',
          code: 'invalid-frontmatter',
          message: 'Frontmatter is not a YAML mapping — storyboard parsed body-only',
        });
      }
    } catch (err) {
      diagnostics.push({
        level: 'error',
        code: 'invalid-frontmatter',
        message: `Unparseable YAML frontmatter — storyboard parsed body-only (${
          err instanceof Error ? err.message.split('\n')[0] : 'unknown error'
        })`,
      });
    }
  }

  // 2. Strip HTML-comment research anchors before scanning frames.
  body = body.replace(HTML_COMMENT_RE, '');

  // 3. Split into `## Frame N` sections + parse each.
  const { sections, badHeadings } = splitSections(body);
  for (const bad of badHeadings) {
    diagnostics.push({
      level: 'warning',
      code: 'unnumbered-frame',
      message: `Frame heading without a parseable number, skipped: "${bad}"`,
    });
  }

  if (sections.length === 0) {
    diagnostics.push({
      level: 'warning',
      code: 'no-frames',
      message: 'No "## Frame N - Title" sections found',
    });
    return result;
  }

  const seenIndex = new Set<number>();
  for (const section of sections) {
    if (seenIndex.has(section.index)) {
      diagnostics.push({
        level: 'warning',
        code: 'duplicate-frame',
        message: `Duplicate frame index ${section.index}`,
      });
    }
    seenIndex.add(section.index);
    if (!section.title) {
      diagnostics.push({
        level: 'warning',
        code: 'missing-title',
        message: `Frame ${section.index} has no title`,
      });
    }
    result.scenes.push(parseScene(section, diagnostics));
  }

  // 4. Emit ordered by frame index (stable for equal indices).
  result.scenes.sort((a, b) => a.index - b.index);
  return result;
}
