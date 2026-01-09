import ApiError from '../ApiError';

describe('ApiError', () => {
  it('should create an ApiError with correct properties', () => {
    const statusCode = 404;
    const message = 'Not found';
    const error = new ApiError(statusCode, message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
    expect(error.isOperational).toBe(true);
  });

  it('should have isOperational as true by default', () => {
    const error = new ApiError(500, 'Internal server error');
    expect(error.isOperational).toBe(true);
  });

  it('should allow custom isOperational value', () => {
    const error = new ApiError(500, 'Internal server error', false);
    expect(error.isOperational).toBe(false);
  });

  it('should capture stack trace', () => {
    const error = new ApiError(400, 'Bad request');
    expect(error.stack).toBeDefined();
  });

  it('should use provided stack if given', () => {
    const customStack = 'Custom stack trace';
    const error = new ApiError(400, 'Bad request', true, customStack);
    expect(error.stack).toBe(customStack);
  });
});
