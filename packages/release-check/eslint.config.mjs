import js from '@eslint/js';
import tseslint from 'typescript-eslint';
// Internal release-tooling package: node scripts + vitest, no React.
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**'],
  },
);
