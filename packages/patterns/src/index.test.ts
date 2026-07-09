import { describe, expect, it } from 'vitest';
import { BUTAI, catalogVersion } from './index';

describe('pipeline smoke', () => {
  it('exports the brand', () => {
    expect(BUTAI).toBe('butai');
  });
  it('reports a version', () => {
    expect(catalogVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
