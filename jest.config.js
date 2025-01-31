module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/**/*.test.js'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {},
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 5000 // Add this line to set a 5-second timeout
};
