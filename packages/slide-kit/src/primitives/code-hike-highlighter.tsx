/**
 * code-hike-highlighter — the OPTIONAL Code Hike adapter behind the code
 * archetypes' `highlighter` prop.
 *
 * COPY-IN ONLY. This file is deliberately excluded from the package build
 * (tsconfig `exclude`) and from the barrel/examples, so @butai/slide-kit and
 * its EXAMPLES never depend on codehike. It ships through the registry: every
 * code archetype lists it as a registryDependency, so `butai add` copies it
 * alongside the slide and reports `codehike` as the npm dep to install.
 *
 * Usage in a deck (after `npm install codehike`): import `codeHikeHighlighter`
 * from this copied file and wire it through the slide's `highlighter` prop:
 *
 *   <CodeSpotlightSlide highlighter={codeHikeHighlighter} ... />
 *
 * It flattens Code Hike v1's `highlight()` output (`HighlightedCode.tokens`:
 * plain strings for whitespace, `[content, color, style?]` tuples for colored
 * runs) into the panel's line/token shape.
 */
import { highlight } from "codehike/code";
import type { CodeHighlighter, CodeToken, HighlightedLines } from "./code-panel.js";

export const DEFAULT_CODE_THEME = "github-dark";

/** Build a `CodeHighlighter` bound to a Code Hike theme name. */
export function createCodeHikeHighlighter(theme: string = DEFAULT_CODE_THEME): CodeHighlighter {
  return async (code: string, lang: string): Promise<HighlightedLines> => {
    const hl = await highlight(
      { value: code, lang, meta: "" },
      theme as Parameters<typeof highlight>[1],
    );

    const lines: CodeToken[][] = [[]];
    for (const token of hl.tokens) {
      const [content, color] = typeof token === "string" ? [token, undefined] : [token[0], token[1]];
      const parts = String(content).split("\n");
      parts.forEach((part, i) => {
        if (i > 0) lines.push([]);
        if (part.length > 0) {
          lines[lines.length - 1].push(color ? { content: part, color } : { content: part });
        }
      });
    }

    const style = (hl.style ?? {}) as { background?: string; color?: string };
    const out: HighlightedLines = { lines };
    if (typeof style.background === "string") out.background = style.background;
    if (typeof style.color === "string") out.color = style.color;
    return out;
  };
}

/** Ready-made adapter with the default theme. */
export const codeHikeHighlighter: CodeHighlighter = createCodeHikeHighlighter();
