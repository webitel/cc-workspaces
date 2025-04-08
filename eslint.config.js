import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    files: ['**/*.{ts,js,vue,css,scss}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...[
          'ref',
          'reactive',
          'watch',
          'watchEffect',
          'computed',
          'onMounted',
          'onUnmounted',
        ].reduce((acc, key) => ({ ...acc, [key]: 'readonly' }), {}),
      },
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always', // Enforce self-closing on void elements
            normal: 'never', // Do not enforce self-closing on normal elements
            component: 'always', // Enforce self-closing on custom components
          },
          svg: 'always', // Enforce self-closing on SVG elements
          math: 'always', // Enforce self-closing on MathML elements
        },
      ],
      'vue/no-template-shadow': 'error',
      'vue/no-lone-template': 'error',
      'vue/prefer-use-template-ref': 'error',
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: true,
          ignores: [],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_', // Ignore unused variables starting with an underscore
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  eslintConfigPrettier,
);
