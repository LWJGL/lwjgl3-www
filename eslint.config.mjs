import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/** @typedef {{ ignores?: string[], globals?: import('eslint').Linter.Globals}} Props */

/**
 * Returns the ESLint configuration for the project.
 * @param {'js'|'jsx'} preset
 * @param {Props} props
 * @returns {import('@eslint/config-helpers').Config[]}
 */
function getConfig(preset = 'jsx', props = {}) {
  return defineConfig([
    globalIgnores(['.next/', 'node_modules/', 'dist/', ...(props.ignores ?? [])]),
    {
      files: [`src/**/*.{js,mjs,ts,mts${preset === 'jsx' ? ',jsx,tsx' : ''}}`],
      plugins: { js },
      extends: [
        'js/recommended',
        tseslint.configs.recommended,
        preset === 'jsx' ? pluginReact.configs.flat['jsx-runtime'] : '',
        preset === 'jsx' ? reactHooks.configs.flat['recommended-latest'] : '',
        preset === 'jsx' ? jsxA11y.flatConfigs.recommended : '',
      ].filter(Boolean),
      languageOptions: {
        globals: props.globals ?? {
          ...globals.browser,
          ...globals.node,
        },
      },
      settings: {
        ...(preset === 'jsx'
          ? {
              react: { version: 'detect' },
              formComponents: ['Form'],
            }
          : {}),
      },
      rules: {
        // General rules (ours)
        'prefer-const': ['warn', { destructuring: 'all' }],
        'no-unused-vars': 'off',
        'no-var': 'off',
        'no-fallthrough': 'off',
        'no-constant-condition': 'warn',
        'no-empty': ['warn', { allowEmptyCatch: true }],

        // Typescript rules (ours)
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { caughtErrors: 'none', args: 'after-used', ignoreRestSiblings: true },
        ],
        '@typescript-eslint/no-unused-expressions': ['warn'],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',

        ...(preset === 'jsx'
          ? {
              // React rules (Next.js defaults)
              'react/no-unknown-property': 'off',
              // 'react/react-in-jsx-scope': 'off',
              'react/prop-types': 'off',
              'react/jsx-no-target-blank': 'off',

              // React rules (ours)
              'react/no-children-prop': 'off', // We pass children (as in child) as prop often
              // 'react/no-unescaped-entities': 'off',
              // 'react/jsx-no-target-blank': 'off',

              // React Hook rules
              // 'react-hooks/rules-of-hooks': 'off',

              // React Compiler rules
              // 'react-compiler/react-compiler': 'error',
            }
          : {}),
      },
    },
  ]);
}

export default getConfig('jsx');
