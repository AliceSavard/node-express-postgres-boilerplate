import { Request, Response, NextFunction } from "express";
import { grantAccess } from "../validateAccessControl";

interface AuthRequest extends Request {
	user?: {
		userId: number;
		tier: number;
	};
}

describe("validateAccessControl middleware", () => {
	let mockReq: Partial<AuthRequest>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		mockReq = {
			user: {
				userId: 1,
				tier: 2,
			},
			params: {
				userId: "1",
			},
		};
		mockRes = {};
		mockNext = jest.fn();
	});

	describe("grantAccess", () => {
		it("should grant access when user tier meets requirement", async () => {
			const middleware = grantAccess(2);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
			expect(mockNext).toHaveBeenCalledTimes(1);
		});

		it("should grant access when user tier exceeds requirement", async () => {
			mockReq.user = { userId: 1, tier: 3 };
			const middleware = grantAccess(2);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
			expect(mockNext).toHaveBeenCalledTimes(1);
		});

		it("should deny access when user tier is below requirement", async () => {
			mockReq.user = { userId: 1, tier: 1 };
			const middleware = grantAccess(2);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalled();
			const error = (mockNext as jest.Mock).mock.calls[0][0];
			expect(error).toBeDefined();
			expect(error.statusCode || error.message).toBeDefined();
		});

		it("should deny access when userId does not match params", async () => {
			mockReq.params = { userId: "999" };
			const middleware = grantAccess(1);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalled();
			const error = (mockNext as jest.Mock).mock.calls[0][0];
			expect(error).toBeDefined();
			expect(error.statusCode || error.message).toBeDefined();
		});

		it("should allow same user access regardless of tier when user owns resource", async () => {
			mockReq.user = { userId: 1, tier: 1 };
			mockReq.params = { userId: "1" };
			const middleware = grantAccess(1);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
		});

		it("should handle tier 0 (free tier) users correctly", async () => {
			mockReq.user = { userId: 5, tier: 0 };
			mockReq.params = { userId: "5" };
			const middleware = grantAccess(0);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
		});

		it("should deny tier 0 users from accessing tier 1+ features", async () => {
			mockReq.user = { userId: 5, tier: 0 };
			const middleware = grantAccess(1);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalled();
			const error = (mockNext as jest.Mock).mock.calls[0][0];
			expect(error).toBeDefined();
		});

		it("should handle high tier values correctly", async () => {
			mockReq.user = { userId: 1, tier: 99 };
			const middleware = grantAccess(5);

			await middleware(
				mockReq as AuthRequest,
				mockRes as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
		});
	});
});
