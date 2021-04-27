module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@webitel/ui-sdk/src|webitel-sdk).+\\.js$',
  ],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/unit/mocks/fileMock.js',
    '\\.(css|less)$': '<rootDir>/tests/unit/mocks/fileMock.js',
  },
  reporters: ['default', 'bamboo-jest-reporter'],
  collectCoverage: true,
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     statements: 80,
  //     lines: 80,
  //   },
  // },
  collectCoverageFrom: [
    '!src/**/api/**/*.{js,vue}',

    'src/components/**/*.{js,vue}',

    'src/store/**/*.{js,vue}',

    'src/shared/**/*.{js,vue}',

    'src/mixins/**/*.{js,vue}',

    '!src/components/utils/*.{js,vue}',
    '!src/**/index.js', // No need to cover bootstrap file
    '!src/**/main.js', // No need to cover bootstrap file
  ],
  setupFiles: [
    // 'jest-canvas-mock',
    './tests/config/config.js',
    './src/plugins/webitel-ui.js',
  ],
  setupFilesAfterEnv: ['./tests/config/jest.config.js'],
};
