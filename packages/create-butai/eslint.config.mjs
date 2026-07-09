import js from '@eslint/js';
import tseslint from 'typescript-eslint';
// Framework-free scaffolding CLI: node builtins only, no React.
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'template/**'],
  },
);
