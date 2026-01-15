import * as tokenService from "../token.service";
import * as userService from "../user.service";
import * as authUtils from "../../utils/auth";

// Mock dependencies
jest.mock("../user.service");
jest.mock("../../utils/auth");
jest.mock("../../config/config", () => ({
	jwt: {
		accessExpirationMinutes: 30,
		refreshExpirationDays: 30,
		resetPasswordExpirationMinutes: 10,
	},
}));

const mockGetUserByEmail = userService.getUserByEmail as jest.MockedFunction<
	typeof userService.getUserByEmail
>;
const mockGenerateToken = authUtils.generateToken as jest.MockedFunction<
	typeof authUtils.generateToken
>;
const mockGenerateExpires = authUtils.generateExpires as jest.MockedFunction<
	typeof authUtils.generateExpires
>;

describe("Token Service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGenerateToken.mockReturnValue("mock-token");
		mockGenerateExpires.mockReturnValue(new Date().getTime());
	});

	describe("generateAuthTokens", () => {
		it("should generate tokens with tier information for tier 1 user", async () => {
			const payload = { userId: 1, tier: 1 };

			const tokens = await tokenService.generateAuthTokens(payload);

			expect(tokens).toHaveProperty("access");
			expect(tokens).toHaveProperty("refresh");
			expect(tokens.access).toHaveProperty("token");
			expect(tokens.access).toHaveProperty("expires");
			expect(tokens.refresh).toHaveProperty("token");
			expect(tokens.refresh).toHaveProperty("expires");

			// Verify access token includes tier
			expect(mockGenerateToken).toHaveBeenCalledWith(
				{ userId: 1, tier: 1 },
				expect.any(Number),
			);
		});

		it("should generate tokens with tier information for tier 0 (free) user", async () => {
			const payload = { userId: 2, tier: 0 };

			const tokens = await tokenService.generateAuthTokens(payload);

			expect(tokens).toBeDefined();
			expect(mockGenerateToken).toHaveBeenCalledWith(
				{ userId: 2, tier: 0 },
				expect.any(Date),
			);
		});

		it("should generate tokens with tier information for tier 3+ (premium) user", async () => {
			const payload = { userId: 3, tier: 5 };

			const tokens = await tokenService.generateAuthTokens(payload);

			expect(tokens).toBeDefined();
			expect(mockGenerateToken).toHaveBeenCalledWith(
				{ userId: 3, tier: 5 },
				expect.any(Date),
			);
		});

		it("should generate refresh token without tier information", async () => {
			const payload = { userId: 1, tier: 2 };

			await tokenService.generateAuthTokens(payload);

			// Refresh token should only have userId
			expect(mockGenerateToken).toHaveBeenCalledWith(
				{ userId: 1 },
				expect.any(Date),
			);
		});

		it("should call generateToken twice (access and refresh)", async () => {
			const payload = { userId: 1, tier: 2 };

			await tokenService.generateAuthTokens(payload);

			expect(mockGenerateToken).toHaveBeenCalledTimes(2);
		});

		it("should call generateExpires twice (access and refresh)", async () => {
			const payload = { userId: 1, tier: 2 };

			await tokenService.generateAuthTokens(payload);

			expect(mockGenerateExpires).toHaveBeenCalledTimes(2);
		});
	});

	describe("generateResetPasswordToken", () => {
		it("should generate reset password token for user", async () => {
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

			const token =
				await tokenService.generateResetPasswordToken(
					"test@example.com",
				);

			expect(token).toBe("mock-token");
			expect(mockGetUserByEmail).toHaveBeenCalledWith("test@example.com");
		});

		it("should throw error if user not found", async () => {
			mockGetUserByEmail.mockResolvedValue(null);

			await expect(
				tokenService.generateResetPasswordToken(
					"nonexistent@example.com",
				),
			).rejects.toThrow();
		});

		it("should work for users with different tiers", async () => {
			const mockUser = {
				id: 5,
				name: "Premium User",
				email: "premium@example.com",
				tier: 5,
				password: "hashedPassword",
				created_date_time: new Date(),
				modified_date_time: new Date(),
			};

			mockGetUserByEmail.mockResolvedValue(mockUser);

			const token = await tokenService.generateResetPasswordToken(
				"premium@example.com",
			);

			expect(token).toBe("mock-token");
		});
	});
});
