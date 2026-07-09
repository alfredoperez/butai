/**
 * Gallery examples — one canonical, asset-free, personal-data-free render per
 * archetype id. This is the /kit gallery's render source; it is intentionally
 * NOT in the catalog (JSX can't serialize). Every image uses an inline
 * solid-color placeholder so no binary asset is fetched.
 */
import type { JSX } from "react";
import { CoverSlide } from "./slides/cover-slide.js";
import { ColdOpenSlide } from "./slides/cold-open-slide.js";
import { ConceptSlide } from "./slides/concept-slide.js";
import { SectionDividerSlide } from "./slides/section-divider-slide.js";
import { QuoteSlide } from "./slides/quote-slide.js";
import { QuotePortraitSlide } from "./slides/quote-portrait-slide.js";
import { ImageCaptionSlide } from "./slides/image-caption-slide.js";
import { ImageTextSplitSlide } from "./slides/image-text-split-slide.js";
import { RecapSlide } from "./slides/recap-slide.js";
import { AgendaSlide } from "./slides/agenda-slide.js";
import { BigStatementSlide } from "./slides/big-statement-slide.js";
import { FullBleedSlide } from "./slides/full-bleed-slide.js";
import { BentoGridSlide } from "./slides/bento-grid-slide.js";
import { ComparisonTableSlide } from "./slides/comparison-table-slide.js";
import { TimelineSlide } from "./slides/timeline-slide.js";
import { StatRowSlide } from "./slides/stat-row-slide.js";
import { SpeakerIntroSlide } from "./slides/speaker-intro-slide.js";
import { DemoCueSlide } from "./slides/demo-cue-slide.js";
import { CodeScrollySlide } from "./slides/code-scrolly-slide.js";
import { CodeSpotlightSlide } from "./slides/code-spotlight-slide.js";
import { CodeSlideshowSlide } from "./slides/code-slideshow-slide.js";
import { KpiSlide } from "./slides/kpi-slide.js";
import { DiagramSlide } from "./slides/diagram-slide.js";
import { BeforeAfterSlide } from "./slides/before-after-slide.js";
import { TerminalSlide } from "./slides/terminal-slide.js";

/** A 16:9 solid-color placeholder — inline SVG data URI, no asset fetch. */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'320'%20height%3D'180'%3E%3Crect%20width%3D'320'%20height%3D'180'%20fill%3D'%234f7cff'%2F%3E%3C%2Fsvg%3E";

export const EXAMPLES: Record<string, () => JSX.Element> = {
  "cover-slide": () => (
    <CoverSlide
      miniHeader="DevTools Summit · 2026"
      title={
        <>
          Ship Faster, <span className="c-accent">Break Less</span>
        </>
      }
      subtitle="A practical guide to spec-driven delivery."
    />
  ),
  "cold-open-slide": () => (
    <ColdOpenSlide
      coldOpen
      miniHeader="DevTools Summit · 2026"
      title={
        <>
          The Big <span className="c-accent">Idea</span>
        </>
      }
      subtitle="Hold the title back, then land it."
    />
  ),
  "concept-slide": () => (
    <ConceptSlide
      chapter="Concepts"
      eyebrow="The Concept"
      title={
        <>
          What is <span className="c-accent">Spec-Driven Development</span>?
        </>
      }
    />
  ),
  "section-divider-slide": () => (
    <SectionDividerSlide
      chapter="Section"
      num="02"
      title={
        <>
          <span className="c-accent">Spec-Driven</span> Development
        </>
      }
      subtitle="The cycle that frames the rest of the talk."
    />
  ),
  "quote-slide": () => (
    <QuoteSlide
      chapter="Quote"
      quote={<>Code without a spec is just a prompt that gets forgotten.</>}
      attribution="Ada Lovelace"
      role="Engineer"
      source="Notes on the Analytical Engine"
    />
  ),
  "quote-portrait-slide": () => (
    <QuotePortraitSlide
      chapter="Proof"
      quote="It makes them look good in the room — audiences react really well."
      name="Jordan Rivera"
      role="Staff Engineer"
    />
  ),
  "image-caption-slide": () => (
    <ImageCaptionSlide
      chapter="Benefits"
      title="Easy navigation between specs"
      image={PLACEHOLDER}
      alt="Placeholder"
      caption="Every feature has its spec, plan, and tasks — connected in the sidebar."
    />
  ),
  "image-text-split-slide": () => (
    <ImageTextSplitSlide
      chapter="Product"
      image={PLACEHOLDER}
      alt="Placeholder"
      side="left"
      eyebrow="Spec Viewer"
      title="Read and navigate specs like code"
      body={<p>Rendered markdown with anchors to sub-documents.</p>}
    />
  ),
  "recap-slide": () => (
    <RecapSlide
      chapter="Recap"
      title={
        <>
          What we <span className="c-accent">saw today</span>
        </>
      }
      items={[
        { title: "Vibe coding fails at scale", sub: "the bug ships anyway" },
        { title: "Spec-driven development", sub: "the spec before the code" },
        { title: "An open standard", sub: "portable across tools" },
      ]}
    />
  ),
  "agenda-slide": () => (
    <AgendaSlide
      chapter="Agenda"
      current={1}
      items={[
        { num: "01", title: "The problem", sub: "vibe coding fails at scale" },
        { num: "02", title: "Spec-driven development", sub: "the cycle" },
        { num: "03", title: "An open standard" },
        { num: "04", title: "Live demo" },
      ]}
    />
  ),
  "big-statement-slide": () => (
    <BigStatementSlide chapter="Thesis" eyebrow="The point" sub="Steal the best ideas. Make it yours.">
      The best workflow is the one you build yourself.
    </BigStatementSlide>
  ),
  "full-bleed-slide": () => (
    <FullBleedSlide
      chapter="Chapter"
      eyebrow="Part II"
      title={<>Ship faster, break less</>}
      subtitle="How spec-driven delivery changed the numbers."
      anchor="bottom-left"
    />
  ),
  "bento-grid-slide": () => (
    <BentoGridSlide
      chapter="Recap"
      title="The quarter, at a glance"
      tiles={[
        { value: "412", title: "PRs shipped", tone: "accent", colSpan: 2 },
        { value: "24m", title: "Median review", tone: "green" },
        { value: "1.4", title: "Reverts / 100", tone: "red" },
        {
          title: "What changed",
          body: "Specs made review a step, not a scramble.",
          colSpan: 2,
        },
      ]}
    />
  ),
  "comparison-table-slide": () => (
    <ComparisonTableSlide
      chapter="Compare"
      title="Why spec-driven wins"
      columns={["Vibe coding", "Spec + plan", "Reviewed"]}
      highlight={2}
      rows={[
        { label: "Structure", cells: [false, true, true] },
        { label: "Handoff survives", cells: [false, "partial", true] },
        { label: "Review built in", cells: [false, false, true] },
      ]}
    />
  ),
  "timeline-slide": () => (
    <TimelineSlide
      chapter="Roadmap"
      title="How the workflow evolved"
      items={[
        { when: "v0", title: "Vibe coding", body: "No structure, lost context", color: "red" },
        { when: "v1", title: "Spec + plan", body: "Two files you own", color: "yellow" },
        { when: "v2", title: "Reviewed", body: "Review built into the loop", color: "green" },
        { when: "next", title: "Your workflow", body: "Steal the best, own it", color: "accent" },
      ]}
    />
  ),
  "stat-row-slide": () => (
    <StatRowSlide
      chapter="Results"
      title="The quarter in three figures"
      stats={[
        { value: "412", label: "PRs shipped", sub: "+38% throughput", color: "accent" },
        { value: "24m", label: "Median review", sub: "down from 71m", color: "green" },
        { value: "1.4", label: "Reverts / 100", sub: "from 6.2", color: "red" },
      ]}
    />
  ),
  "speaker-intro-slide": () => (
    <SpeakerIntroSlide
      chapter="Speaker"
      avatar={PLACEHOLDER}
      name="Jordan Rivera"
      role="Developer Advocate"
      bio="Builds tools so that writing software with AI feels like engineering, not improvisation."
      links={[{ label: "example.dev", href: "https://example.dev" }]}
    />
  ),
  "demo-cue-slide": () => (
    <DemoCueSlide
      chapter="Live Demo"
      cue="Live Demo"
      iconName="terminal"
      title="Back to the spec we created"
      subtitle="We'll create it, plan it, and review it — live."
    />
  ),
  // The code examples render the plain (no-codehike) path on purpose — the
  // EXAMPLES map must never require the optional codehike dependency.
  "code-scrolly-slide": () => (
    <CodeScrollySlide
      chapter="Code"
      title="How review reads a change"
      lang="ts"
      code={[
        "async function review(pr) {",
        "  const spec = await loadSpec(pr);",
        '  if (!spec) return flag(pr, "no spec");',
        "  const plan = await loadPlan(pr);",
        "  const diff = await pr.diff();",
        "  return judge({ spec, plan, diff });",
        "}",
      ].join("\n")}
      steps={[
        {
          focus: [2, 3],
          title: "Load the spec",
          body: "No spec means flag and stop early.",
        },
        {
          focus: [4, 4],
          title: "Load the plan",
          body: "The plan is the contract to judge against.",
        },
        {
          focus: [5, 6],
          title: "Judge the diff",
          body: "Spec, plan, and diff decide the verdict.",
        },
      ]}
    />
  ),
  "code-spotlight-slide": () => (
    <CodeSpotlightSlide
      chapter="Code"
      title="A highlight hook, one beat at a time"
      lang="tsx"
      code={[
        "export function useHighlight(code, lang) {",
        "  const [hl, setHl] = useState(null);",
        "  useEffect(() => {",
        "    let alive = true;",
        "    highlight(code, lang).then((h) => alive && setHl(h));",
        "    return () => { alive = false; };",
        "  }, [code, lang]);",
        "  return hl;",
        "}",
      ].join("\n")}
      steps={[
        { focus: [1, 2], note: "State holds the highlighted result." },
        { focus: [3, 7], note: "Resolve the async highlight in an effect." },
        { focus: [6, 6], note: "Cancel on unmount so stale results never land." },
      ]}
    />
  ),
  "code-slideshow-slide": () => (
    <CodeSlideshowSlide
      chapter="Code"
      title="Refactor, live"
      lang="ts"
      snapshots={[
        {
          code: "function add(a, b) {\n  return a + b;\n}",
          caption: "Start: a plain function.",
        },
        {
          code: "const add = (a, b) => a + b;",
          caption: "Arrow + implicit return.",
        },
        {
          code: "const add = (a: number, b: number): number => a + b;",
          caption: "Typed.",
        },
      ]}
    />
  ),
  "kpi-slide": () => (
    <KpiSlide
      chapter="Results"
      title="The quarter in numbers"
      items={[
        {
          value: 412,
          label: "PRs shipped",
          delta: { direction: "up", text: "+38% vs Q4" },
          context: "across 6 teams",
        },
        {
          value: 24,
          suffix: "m",
          label: "Median review",
          delta: { direction: "down", text: "from 71m", tone: "good" },
        },
        {
          value: 1.4,
          decimals: 1,
          label: "Reverts / 100",
          delta: { direction: "down", text: "from 6.2", tone: "good" },
          context: "rolling 90 days",
        },
      ]}
    />
  ),
  "diagram-slide": () => (
    <DiagramSlide
      chapter="Workflow"
      title="How a change flows"
      caption="Spec to plan to shipped code, one gate at a time."
    >
      <svg viewBox="0 0 760 160" role="img" aria-label="Flow diagram: spec, then plan, then ship">
        {(["Spec", "Plan", "Ship"] as const).map((label, i) => (
          <g key={label}>
            <rect
              className="dgm-draw"
              pathLength={1}
              style={{ ["--dgm-i" as string]: i * 2 }}
              x={30 + i * 270}
              y="40"
              width="160"
              height="80"
              rx="12"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
            />
            <text
              className="dgm-fade"
              style={{ ["--dgm-i" as string]: i * 2 }}
              x={110 + i * 270}
              y="88"
              textAnchor="middle"
              fill="var(--text)"
              fontSize="22"
              fontFamily="inherit"
            >
              {label}
            </text>
            {i < 2 && (
              <path
                className="dgm-draw"
                pathLength={1}
                style={{ ["--dgm-i" as string]: i * 2 + 1 }}
                d={`M${200 + i * 270} 80 H${282 + i * 270} M${272 + i * 270} 70 l14 10 -14 10`}
                fill="none"
                stroke="var(--text-dim)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </g>
        ))}
      </svg>
    </DiagramSlide>
  ),
  "before-after-slide": () => (
    <BeforeAfterSlide
      chapter="Payoff"
      title="Review, before and after specs"
      before={{
        label: "Before",
        title: "Vibe-coded PRs",
        points: [
          "Reviewer reverse-engineers intent",
          "Median review 71 minutes",
          "The bug ships anyway",
        ],
      }}
      after={{
        label: "After",
        title: "Spec-first PRs",
        points: [
          "Intent is written down first",
          "Median review 24 minutes",
          "Review is a step, not a scramble",
        ],
      }}
    />
  ),
  "terminal-slide": () => (
    <TerminalSlide
      chapter="Demo"
      title="One command, whole pipeline"
      windowTitle="~/acme-app"
      reveal="steps"
      lines={[
        { kind: "prompt", text: "specify plan payments-v2" },
        { kind: "output", text: "reading spec … ok (14 requirements)" },
        { kind: "output", text: "writing plan.md … ok" },
        { kind: "comment", text: "# review the plan before any code exists" },
        { kind: "highlight", text: "plan ready for review -> plan.md" },
      ]}
    />
  ),
};
