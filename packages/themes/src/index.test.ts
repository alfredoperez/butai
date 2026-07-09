import { describe, expect, it } from 'vitest';
import { THEMES } from './index';

describe('theme manifest', () => {
  it('exports a non-empty theme manifest array', () => {
    expect(Array.isArray(THEMES)).toBe(true);
    expect(THEMES.length).toBeGreaterThanOrEqual(11);
    expect(THEMES.length).toBeLessThanOrEqual(14);
  });

  it('has unique ids and well-formed entries', () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of THEMES) {
      expect(entry.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(entry.label.length).toBeGreaterThan(0);
      expect(['dark', 'light']).toContain(entry.mode);
      expect(entry.file).toBe(`themes/${entry.id}.css`);
    }
  });
});
