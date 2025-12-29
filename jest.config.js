/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  // Use SWC instead of ts-jest for 10-20x faster compilation
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  // Setup file to load .env.test before integration tests
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
  // Cache to speed up subsequent runs
  cacheDirectory: '<rootDir>/.jest-cache',
};