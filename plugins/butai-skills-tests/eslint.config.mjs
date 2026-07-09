import js from '@eslint/js';
import tseslint from 'typescript-eslint';
// Private test-only workspace: no framework plugins; lints the src/ vitests.
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**'],
  },
);
