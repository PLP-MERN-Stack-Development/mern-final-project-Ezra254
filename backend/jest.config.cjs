/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/__tests__/**'],
};

