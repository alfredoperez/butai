/**
 * Motion profiles — the "feeling → motion" layer of the suggestion system.
 * A deck's theme implies a motion language: default entrance timing, intensity,
 * cursor, and which TEXT and CARD effects are on-brand. Build tooling reads
 * this to suggest motion instead of guessing, and it can drive runtime
 * defaults (e.g. auto-pick a cursor for a theme).
 *
 * Design note: effects aren't only for slides — text and cards get suggested
 * treatments here too, keyed by the deck's feeling.
 */
export type MotionProfile = "energetic" | "calm" | "technical" | "bold";

export interface ProfileSpec {
  /** default `data-animate` entrance for content */
  entrance: "fade-up" | "pop" | "fade" | "blur-in";
  /** deck-wide intensity dial (SlideEngine `intensity`) */
  intensity: "subtle" | "standard" | "expressive";
  /** slide-change transition (SlideEngine `transition`) */
  transition: "slide" | "fade" | "zoom";
  /** CursorLayer variant, or "none" for projected/formal decks */
  cursor: "none" | "laser" | "spotlight" | "trail" | "ring";
  /** on-brand text effects (from the text-effects library) */
  text: string[];
  /** on-brand card treatment */
  card: string;
  note: string;
}

export const PROFILES: Record<MotionProfile, ProfileSpec> = {
  energetic: {
    entrance: "pop",
    intensity: "expressive",
    transition: "zoom",
    cursor: "trail",
    text: ["FlipWords", "ShimmerText", "SplitReveal(chars)"],
    card: "FeatureCard shine + hover-lift (magnetic on interactive slides)",
    note: "Playful/creative decks: bouncy springs, confetti closers, bold moves.",
  },
  calm: {
    entrance: "blur-in",
    intensity: "subtle",
    transition: "fade",
    cursor: "none",
    text: ["GradientText", "SplitReveal(words, masked)", "BreathingText"],
    card: "quiet cards, no shine; slow fade-in, generous spacing",
    note: "Editorial/premium decks: slow fades, masked line reveals, restraint.",
  },
  technical: {
    entrance: "fade-up",
    intensity: "standard",
    transition: "slide",
    cursor: "none",
    text: ["TypingText", "ScrambleText", "Annotate"],
    card: "bordered cards, data-stagger; DrawSVG on diagrams, magic-move for code",
    note: "Devtools/precise decks: draw-on diagrams, terminal, code magic-move.",
  },
  bold: {
    entrance: "pop",
    intensity: "expressive",
    transition: "zoom",
    cursor: "spotlight",
    text: ["SplitReveal(chars)", "GlitchText", "GradientText"],
    card: "full-bleed, big-statement beats; strong scale-in, dominant color",
    note: "Dramatic/keynote decks: one-big-word, full-bleed, scale-zoom.",
  },
};

/**
 * Theme → profile, one entry per theme in the @butai/themes manifest.
 * Unlisted themes fall back to `technical` (the house default).
 */
export const THEME_PROFILE: Record<string, MotionProfile> = {
  // ported originals
  brand: "technical",
  dark: "technical",
  light: "calm",
  aurora: "calm",
  glassmorphism: "calm",
  neon: "energetic",
  "warm-noir": "bold",
  brutalist: "bold",
  "midnight-coral": "bold",
  // butai originals
  blueprint: "technical",
  atelier: "calm",
  stage: "bold",
  marker: "energetic",
};

export function profileForTheme(theme: string): MotionProfile {
  return THEME_PROFILE[theme] ?? "technical";
}

export function specForTheme(theme: string): ProfileSpec {
  return PROFILES[profileForTheme(theme)];
}
