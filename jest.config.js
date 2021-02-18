module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFiles: ['<rootDir>/__mocks__/setEnvVars.js'],
  setupFilesAfterEnv: [
    'jest-plugin-context/setup',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  displayName: 'unittest',
  transform: {
    '^.+\\.(js)?$': 'babel-jest',
  },
};
