/**
 * @butai/slide-kit — copy-in slide registry (phase-3).
 *
 * The barrel re-exports every migrated component so studios/playground can
 * `import { CoverSlide } from '@butai/slide-kit'`, and exposes the frozen
 * registry-format types for downstream tooling.
 */

// ── Registry contract types ──
export type {
  RegistryIndex,
  RegistryItem,
  RegistryFile,
  RegistryItemType,
  RegistryFileTarget,
  ImportMapEntry,
  FileImportMap,
} from "./registry-types.js";

// ── Primitives ──
export { Label } from "./primitives/label.js";
export { Subheading } from "./primitives/subheading.js";
export { Subtitle } from "./primitives/subtitle.js";
export { IntroSlide } from "./primitives/intro-slide.js";
export { Icon } from "./primitives/icon.js";
export type { IconName } from "./primitives/icon.js";
export { Badge } from "./primitives/badge.js";

// ── Archetypes ──
export { CoverSlide } from "./slides/cover-slide.js";
export { ColdOpenSlide } from "./slides/cold-open-slide.js";
export { ConceptSlide } from "./slides/concept-slide.js";
export { SectionDividerSlide } from "./slides/section-divider-slide.js";
export { QuoteSlide } from "./slides/quote-slide.js";
export { QuotePortraitSlide } from "./slides/quote-portrait-slide.js";
export { ImageCaptionSlide } from "./slides/image-caption-slide.js";
export { ImageTextSplitSlide } from "./slides/image-text-split-slide.js";
export { RecapSlide } from "./slides/recap-slide.js";
export type { RecapItem } from "./slides/recap-slide.js";
export { AgendaSlide } from "./slides/agenda-slide.js";
export type { AgendaItem } from "./slides/agenda-slide.js";
export { BigStatementSlide } from "./slides/big-statement-slide.js";
export { FullBleedSlide } from "./slides/full-bleed-slide.js";
export { BentoGridSlide } from "./slides/bento-grid-slide.js";
export type { BentoTile } from "./slides/bento-grid-slide.js";
export { ComparisonTableSlide } from "./slides/comparison-table-slide.js";
export { TimelineSlide } from "./slides/timeline-slide.js";
export type { TimelineItem } from "./slides/timeline-slide.js";
export { StatRowSlide } from "./slides/stat-row-slide.js";
export type { StatItem } from "./slides/stat-row-slide.js";
export { SpeakerIntroSlide } from "./slides/speaker-intro-slide.js";
export type { SpeakerLink } from "./slides/speaker-intro-slide.js";
export { DemoCueSlide } from "./slides/demo-cue-slide.js";

// ── Gallery examples (asset-free, personal-data-free) ──
export { EXAMPLES } from "./examples.js";
