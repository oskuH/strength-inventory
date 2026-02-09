import eslintReact from '@eslint-react/eslint-plugin';
import eslintJs from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  files: ['**/*.{ts,tsx}'],
  extends: [
    eslintJs.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.strictTypeChecked,
    eslintReact.configs['recommended-typescript'],
    pluginQuery.configs['flat/recommended'],
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  plugins: { '@stylistic': stylistic },
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    }
  },
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/arrow-spacing': ['error', { 'before': true, 'after': true }],
    '@stylistic/comma-dangle': ['error', 'never']
  },
  ignores: ['dist', 'src/routeTree.gen.ts']
});
