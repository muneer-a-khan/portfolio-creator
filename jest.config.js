module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Or 'jsdom' if DOM access is needed for some tests
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json, e.g., "@/*": ["src/*"])
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock CSS/asset imports if they cause issues in tests not using them
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
