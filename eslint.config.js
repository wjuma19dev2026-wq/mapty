// eslint.config.js
import js from '@eslint/js'
import css from '@eslint/css'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  css.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // 'no-console': 'warn',
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-var': 'error',

      'no-alert': 'error',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
    },
  },

  {
    files: ['**/*.html'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  {
    ignores: ['dist/', 'build/', 'node_modules/', '*.min.js'],
  },

  prettier,
]
