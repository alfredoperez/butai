/**
 * CodePanel — dependency-free code rendering plus the step plumbing shared by
 * the code archetypes (code-scrolly / code-spotlight / code-slideshow).
 *
 * The panel renders plain <pre><code> lines by default (zero runtime deps,
 * theme text color) and accepts an optional async `CodeHighlighter` that swaps
 * in per-token colors once it resolves. The copy-in `code-hike-highlighter`
 * primitive implements that contract with Code Hike; any tokenizer that can
 * produce colored line tokens works. If the highlighter is absent or fails,
 * the plain rendering simply stays — the seam degrades, never breaks.
 */
import { useEffect, useLayoutEffect, useMemo, useState, type RefObject } from "react";

/** One colored run of text within a line. `color` optional — plain inherits the theme. */
export interface CodeToken {
  content: string;
  color?: string;
}

/** Tokenized code: one token array per line, plus optional panel colors. */
export interface HighlightedLines {
  lines: CodeToken[][];
  background?: string;
  color?: string;
}

/**
 * The enhancement seam: resolve colored tokens for `code`. Resolve `null` (or
 * reject) to keep the plain rendering.
 */
export type CodeHighlighter = (code: string, lang: string) => Promise<HighlightedLines | null>;

/** Plain fallback: one uncolored token per line (the theme's text color applies). */
export function plainLines(code: string): HighlightedLines {
  return {
    lines: code.split("\n").map((line) => (line.length > 0 ? [{ content: line }] : [])),
  };
}

/**
 * Resolve `highlighter` when provided; render plain lines immediately either
 * way, so first paint never waits on (or requires) a tokenizer.
 */
export function useHighlightedLines(
  code: string,
  lang: string,
  highlighter?: CodeHighlighter,
): HighlightedLines {
  const plain = useMemo(() => plainLines(code), [code]);
  const [rich, setRich] = useState<HighlightedLines | null>(null);
  useEffect(() => {
    if (!highlighter) return;
    let alive = true;
    setRich(null);
    highlighter(code, lang).then(
      (h) => {
        if (alive && h) setRich(h);
      },
      () => {
        /* highlighter unavailable/failed → stay on the plain rendering */
      },
    );
    return () => {
      alive = false;
    };
  }, [code, lang, highlighter]);
  return rich ?? plain;
}

/**
 * Framed console-style code card. `focus` spotlights a 1-based inclusive line
 * range — lines outside it dim + soften (CSS-only, works plain or highlighted).
 */
export function CodePanel({
  code,
  focus = null,
  className,
}: {
  code: HighlightedLines;
  focus?: [number, number] | null;
  className?: string;
}) {
  const panelStyle =
    code.background || code.color
      ? { background: code.background, color: code.color }
      : undefined;
  return (
    <pre className={`code-panel${className ? ` ${className}` : ""}`} style={panelStyle}>
      <code>
        {code.lines.map((tokens, i) => {
          const lit = !focus || (i + 1 >= focus[0] && i + 1 <= focus[1]);
          return (
            <div
              key={i}
              className={`code-panel__line${lit ? "" : " code-panel__line--dim"}`}
            >
              {tokens.length > 0
                ? tokens.map((t, j) =>
                    t.color ? (
                      <span key={j} style={{ color: t.color }}>
                        {t.content}
                      </span>
                    ) : (
                      <span key={j}>{t.content}</span>
                    ),
                  )
                : " "}
            </div>
          );
        })}
      </code>
    </pre>
  );
}

/**
 * useStepIndex — how many `[data-step]` markers inside `ref` have been revealed
 * (carry `step-visible`). Lets a code slide drive focus/snapshots off the deck
 * engine's existing step system: render N hidden step markers, read this count,
 * advance. Outside an engine (e.g. the /kit gallery) nothing is ever revealed,
 * so the slide statically shows its first beat.
 */
export function useStepIndex(ref: RefObject<HTMLElement | null>): number {
  const [n, setN] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setN(el.querySelectorAll("[data-step].step-visible").length);
    read();
    const obs = new MutationObserver(read);
    obs.observe(el, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, [ref]);
  return n;
}

/** Hidden step markers the engine reveals one-by-one to drive `useStepIndex`. */
export function StepMarkers({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span aria-hidden style={{ display: "none" }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} data-step="" className="motion-step" />
      ))}
    </span>
  );
}
