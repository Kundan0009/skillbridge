// Test setup and global mocks
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(() => {
  // Mock console methods to reduce noise in tests
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
});

// Mock external services
jest.mock('../src/infrastructure/external/GeminiAIProvider.js', () => ({
  GeminiAIProvider: jest.fn().mockImplementation(() => ({
    analyze: jest.fn().mockResolvedValue({
      overallScore: 75,
      atsScore: 70,
      sections: {},
      strengths: ['Test strength'],
      improvements: ['Test improvement'],
      keywords: [],
      recommendations: []
    }),
    isAvailable: jest.fn().mockReturnValue(true)
  }))
}));