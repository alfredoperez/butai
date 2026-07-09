/**
 * @butai/deck — the presentation engine, extracted in P2.
 * Public API is FROZEN per _ops/plans/phase-2.md.
 */
export { SlideEngine } from './SlideEngine.js';
export type { SlideEngineProps, SlideTransition } from './SlideEngine.js';
export { Slide } from './Slide.js';
export type { SlideProps, BackgroundPattern } from './Slide.js';
export { SlideBackground } from './SlideBackground.js';
export { useSlides } from './useSlides.js';
export type { ChapterInfo } from './useSlides.js';
export { ThemePicker } from './ThemePicker.js';
export { EngineOverlays } from './EngineOverlays.js';
export { DeckOverview } from './DeckOverview.js';
export type { DeckOverviewProps } from './DeckOverview.js';
export { SectionTracker } from './SectionTracker.js';
export { NavSidebar } from './NavSidebar.js';
export { LinktreePage } from './LinktreePage.js';
export type { LinktreePageProps, LinktreeLink } from './LinktreePage.js';
export { PROFILES, THEME_PROFILE, profileForTheme, specForTheme } from './motionProfiles.js';
export type { MotionProfile, ProfileSpec } from './motionProfiles.js';
