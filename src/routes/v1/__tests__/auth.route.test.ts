import { validateRegisterUser } from "../auth.route";


describe("Auth Validation", () => {
	describe("register validation", () => {
		it("should validate user creation with tier 1", () => {
			const userData = {
				body: {
					email: "test@example.com",
					password: "Password123!",
					name: "Test User",
					tier: 1,
				},
			};

			const { error } = validateRegisterUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should validate user creation with tier 0 (free)", () => {
			const userData = {
				body: {
					email: "free@example.com",
					password: "Password123!",
					name: "Free User",
					tier: 0,
				},
			};

			const { error } = validateRegisterUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should validate user creation with high tier values", () => {
			const userData = {
				body: {
					email: "enterprise@example.com",
					password: "Password123!",
					name: "Enterprise User",
					tier: 99,
				},
			};

			const { error } = validateRegisterUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should require tier field", () => {
			const userData = {
				body: {
					email: "test@example.com",
					password: "Password123!",
					name: "Test User",
					// tier is missing
				},
			};

			const { error } = validateRegisterUser.body.validate(userData.body);
			expect(error).toBeDefined();
			expect(error?.message).toContain("tier");
		});

		it("should reject non-numeric tier values", () => {
			const userData = {
				body: {
					email: "test@example.com",
					password: "Password123!",
					name: "Test User",
					tier: "premium", // should be a number
				},
			};

			const { error } = validateRegisterUser.body.validate(userData.body);
			expect(error).toBeDefined();
		});

		it("should require all fields for user creation", () => {
			const userData = {
				body: {
					email: "test@example.com",
					// missing password, name, tier
				},
			};

			const { error } = validateRegisterUser.body.validate(userData.body);
			expect(error).toBeDefined();
		});
	});
});
