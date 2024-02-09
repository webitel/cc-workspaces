module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-useless-catch': 'off',
    'no-shadow': 'off',
    'no-empty': 'off',
    'no-underscore-dangle': 'off',
    'max-len': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    indent: 'off',
    'no-useless-escape': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
    },
  ],
};
