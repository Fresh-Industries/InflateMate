/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__test__/setup.ts'],
  testMatch: [
    '**/__test__/**/*.test.ts',
    '**/__test__/**/*.test.tsx'
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/api/**/*.ts',
    'lib/**/*.ts',
    'components/**/*.tsx',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__test__/**',
    '!**/prisma/**',
    '!**/*integration.test.ts',
    '!**/*smoke.test.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10, 
      lines: 10,
      statements: 10
    }
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  },
  testTimeout: 30000,
  // Ignore integration tests by default
  testPathIgnorePatterns: [
    '/node_modules/',
    'email-template.test.ts',
    'waiverIntergration.test.ts', 
    'realtime-booking-smoke.test.ts'
  ]
}; 