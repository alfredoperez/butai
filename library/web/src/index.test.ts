import { describe, expect, it } from 'vitest';
import { catalogVersion } from '@butai/patterns';
import { LIBRARY_WEB } from './index';

describe('library-web scaffold', () => {
  it('exports the workspace name', () => {
    expect(LIBRARY_WEB).toBe('@butai/library-web');
  });
  it('links against @butai/patterns', () => {
    expect(catalogVersion()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
