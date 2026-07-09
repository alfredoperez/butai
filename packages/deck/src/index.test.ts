/**
 * Public-API conformance — every value export of the FROZEN contract
 * (_ops/plans/phase-2.md) must exist. Type-only exports are enforced by tsc.
 */
import { describe, expect, it } from 'vitest';
import * as deck from './index.js';

const VALUE_EXPORTS = [
  'SlideEngine',
  'Slide',
  'SlideBackground',
  'useSlides',
  'ThemePicker',
  'EngineOverlays',
  // additive extension to the P2 frozen surface: grid contact-sheet mode
  'DeckOverview',
  'SectionTracker',
  'NavSidebar',
  'LinktreePage',
  'PROFILES',
  'THEME_PROFILE',
  'profileForTheme',
  'specForTheme',
] as const;

describe('@butai/deck public API', () => {
  it.each(VALUE_EXPORTS)('exports %s', (name) => {
    expect(deck[name]).toBeDefined();
  });

  it('exports exactly the frozen value surface (no strays)', () => {
    expect(Object.keys(deck).sort()).toEqual([...VALUE_EXPORTS].sort());
  });
});
