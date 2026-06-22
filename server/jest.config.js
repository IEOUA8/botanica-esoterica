/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/__tests__/env.setup.js'],
  // Only scan the src/ tree — prevents jest-haste-map from touching node_modules
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/src/__tests__/**/*.test.js'],
  testTimeout: 15000,
  modulePathIgnorePatterns: ['\\.node_modules\\.icloud-stale', '\\.icloud$'],
  watchPathIgnorePatterns: ['\\.node_modules\\.icloud-stale', '\\.icloud$'],
  testPathIgnorePatterns: ['/node_modules/'],
  maxWorkers: process.env.CI ? '50%' : 1,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/services/seedDatabase.js',
    '!src/services/demoStore.js',
  ],
};
