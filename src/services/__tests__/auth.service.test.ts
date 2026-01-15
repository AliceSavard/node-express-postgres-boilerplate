import * as authService from "../auth.service";
import * as userService from "../user.service";
import * as authUtils from "../../utils/auth";
import httpStatus from "http-status";

// Mock dependencies
jest.mock("../user.service");
jest.mock("../../utils/auth");
jest.mock("../../config/config", () => ({
	default: {
		env: "test",
	},
}));

// Mock ApiError properly
class ApiError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(statusCode: number, message: string, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.name = "ApiError";
	}
}

const mockGetUserByEmail = userService.getUserByEmail as jest.MockedFunction<
	typeof userService.getUserByEmail
>;
const mockDecryptData = authUtils.decryptData as jest.MockedFunction<
	typeof authUtils.decryptData
>;

describe("Auth Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("loginUserWithEmailAndPassword", () => {
		const mockReq = {
			body: {
				email: "test@example.com",
				password: "password12345",
			},
		};

		it("should login user and return user with tier", async () => {
			const mockUser = {
				id: 1,
				name: "Test User",
				email: "test@example.com",
				tier: 2,
				password: "hashedPassword",
				created_date_time: new Date(),
				modified_date_time: new Date(),
			};

			mockGetUserByEmail.mockResolvedValue(mockUser);
			mockDecryptData.mockResolvedValue(true);

			const user =
				await authService.loginUserWithEmailAndPassword(mockReq);

			expect(user).toBeDefined();
			expect(user.tier).toBe(2);
			expect(user.email).toBe("test@example.com");
			expect(user).not.toHaveProperty("password");
		});

		it("should login free tier user (tier 0)", async () => {
			const mockUser = {
				id: 2,
				name: "Free User",
				email: "free@example.com",
				tier: 0,
				password: "hashedPassword",
				created_date_time: new Date(),
				modified_date_time: new Date(),
			};

			const freeReq = {
				body: {
					email: "free@example.com",
					password: "password12345",
				},
			};

			mockGetUserByEmail.mockResolvedValue(mockUser);
			mockDecryptData.mockResolvedValue(true);

			const user =
				await authService.loginUserWithEmailAndPassword(freeReq);

			expect(user.tier).toBe(0);
		});

		it("should login premium tier user (tier 3+)", async () => {
			const mockUser = {
				id: 3,
				name: "Premium User",
				email: "premium@example.com",
				tier: 5,
				password: "hashedPassword",
				created_date_time: new Date(),
				modified_date_time: new Date(),
			};

			const premiumReq = {
				body: {
					email: "premium@example.com",
					password: "password12345",
				},
			};

			mockGetUserByEmail.mockResolvedValue(mockUser);
			mockDecryptData.mockResolvedValue(true);

			const user =
				await authService.loginUserWithEmailAndPassword(premiumReq);

			expect(user.tier).toBe(5);
		});

		it("should throw error if user not found", async () => {
			mockGetUserByEmail.mockResolvedValue(null);

			await expect(
				authService.loginUserWithEmailAndPassword(mockReq),
			).rejects.toMatchObject({
				statusCode: httpStatus.UNAUTHORIZED,
				message: "Invalid email or password",
			});
		});

		it("should throw error if password does not match", async () => {
			const mockUser = {
				id: 1,
				name: "Test User",
				email: "test@example.com",
				tier: 1,
				password: "hashedPassword",
				created_date_time: new Date(),
				modified_date_time: new Date(),
			};

			mockGetUserByEmail.mockResolvedValue(mockUser);
			mockDecryptData.mockResolvedValue(false);

			await expect(
				authService.loginUserWithEmailAndPassword(mockReq),
			).rejects.toMatchObject({
				statusCode: httpStatus.UNAUTHORIZED,
				message: "Invalid email or password",
			});
		});

		it("should not include password in returned user object", async () => {
			const mockUser = {
				id: 1,
				name: "Test User",
				email: "test@example.com",
				tier: 2,
				password: "hashedPassword",
				created_date_time: new Date(),
				modified_date_time: new Date(),
			};

			mockGetUserByEmail.mockResolvedValue(mockUser);
			mockDecryptData.mockResolvedValue(true);

			const user =
				await authService.loginUserWithEmailAndPassword(mockReq);

			expect(user).not.toHaveProperty("password");
			expect(user).toHaveProperty("tier");
			expect(user).toHaveProperty("email");
			expect(user).toHaveProperty("name");
		});
	});
});
