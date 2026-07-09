import js from '@eslint/js';
import tseslint from 'typescript-eslint';
// Framework-free package: no react-hooks plugin (mirrors @butai/scene-kit).
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**'],
  },
);
