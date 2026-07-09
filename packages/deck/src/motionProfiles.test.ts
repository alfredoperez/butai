import { describe, expect, it } from 'vitest';
import { THEMES } from '@butai/themes';
import {
  PROFILES,
  THEME_PROFILE,
  profileForTheme,
  specForTheme,
} from './motionProfiles.js';

describe('motionProfiles', () => {
  it('falls back to "technical" for unknown themes', () => {
    expect(profileForTheme('does-not-exist')).toBe('technical');
    expect(specForTheme('does-not-exist')).toBe(PROFILES.technical);
  });

  it('maps every @butai/themes manifest id to a profile (no strays, no gaps)', () => {
    const manifestIds = THEMES.map((t) => t.id).sort();
    expect(Object.keys(THEME_PROFILE).sort()).toEqual(manifestIds);
  });

  it('resolves every butai theme to a full profile spec', () => {
    for (const { id } of THEMES) {
      const profile = profileForTheme(id);
      expect(THEME_PROFILE[id]).toBe(profile);
      const spec = specForTheme(id);
      expect(spec).toBe(PROFILES[profile]);
      expect(spec.entrance).toBeTruthy();
      expect(spec.intensity).toBeTruthy();
      expect(spec.transition).toBeTruthy();
    }
  });
});
