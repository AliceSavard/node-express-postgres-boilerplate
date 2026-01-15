// Set up test environment variables before any modules are loaded
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_ACCESS_EXPIRATION_MINUTES = '30';
process.env.JWT_REFRESH_EXPIRATION_DAYS = '30';
process.env.COOKIE_EXPIRATION_HOURS = '24';
process.env.SQL_USERNAME = 'test_user';
process.env.SQL_HOST = 'localhost';
process.env.SQL_DATABASE_NAME = 'test_db';
process.env.SQL_PASSWORD = 'test_password';
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USERNAME = 'test@test.com';
process.env.SMTP_PASSWORD = 'test_smtp_password';
process.env.EMAIL_FROM = 'noreply@test.com';

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
