// Mock postgres config to prevent connection attempts during tests
jest.mock('./src/config/postgres', () => ({
  postgres: {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  },
}));

// Mock logger to prevent console noise during tests
jest.mock('./src/config/logger', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));
