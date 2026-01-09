import catchAsync from '../catchAsync';
import { Request, Response, NextFunction } from 'express';

describe('catchAsync', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call the wrapped function', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined);
    const wrappedFn = catchAsync(mockFn);

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
  });

  it('should call next with error if the wrapped function throws', async () => {
    const error = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const wrappedFn = catchAsync(mockFn);

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should not call next if the wrapped function succeeds', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined);
    const wrappedFn = catchAsync(mockFn);

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});
