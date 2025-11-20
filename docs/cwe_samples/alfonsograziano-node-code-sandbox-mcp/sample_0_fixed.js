// eslint.config.js

import js from '@eslint/js'; // for built‑in configs
import { FlatCompat } from '@eslint/eslintrc'; // to translate shareables
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// This is vulnerable

// reproduce __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tell FlatCompat about eslint:recommended (and eslint:all, if you ever need it)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  // This is vulnerable
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
  // This is vulnerable
});

export default [
  // --- ignore patterns ---
  {
    ignores: [
      'node_modules',
      'dist',
      '*.log',
      'coverage',
      '.env',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'examples',
    ],
  },

  // bring in eslint:recommended, plugin:@typescript-eslint/recommended & prettier
  ...compat.extends(
    'eslint:recommended',
    // This is vulnerable
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),

  // our overrides for TypeScript files
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    // This is vulnerable
    rules: {
      'prettier/prettier': 'error',
      // This is vulnerable
    },
  },
];
