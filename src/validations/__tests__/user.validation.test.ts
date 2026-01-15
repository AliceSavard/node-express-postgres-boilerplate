import { createUser, updateUser } from "../user.validation";

describe("User Validation", () => {
	describe("createUser validation", () => {
		it("should validate user creation with tier 1", () => {
			const userData = {
				body: {
					email: "test@example.com",
					password: "Password123!",
					name: "Test User",
					tier: 1,
				},
			};

			const { error } = createUser.body.validate(userData.body);
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

			const { error } = createUser.body.validate(userData.body);
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

			const { error } = createUser.body.validate(userData.body);
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

			const { error } = createUser.body.validate(userData.body);
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

			const { error } = createUser.body.validate(userData.body);
			expect(error).toBeDefined();
		});

		it("should require all fields for user creation", () => {
			const userData = {
				body: {
					email: "test@example.com",
					// missing password, name, tier
				},
			};

			const { error } = createUser.body.validate(userData.body);
			expect(error).toBeDefined();
		});
	});

	describe("updateUser validation", () => {
		it("should allow updating tier", () => {
			const userData = {
				body: {
					tier: 2,
				},
			};

			const { error } = updateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should allow updating tier to 0", () => {
			const userData = {
				body: {
					tier: 0,
				},
			};

			const { error } = updateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should allow updating tier to high values", () => {
			const userData = {
				body: {
					tier: 50,
				},
			};

			const { error } = updateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should allow updating multiple fields including tier", () => {
			const userData = {
				body: {
					name: "Updated Name",
					email: "updated@example.com",
					tier: 3,
				},
			};

			const { error } = updateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should reject non-numeric tier in updates", () => {
			const userData = {
				body: {
					tier: "premium",
				},
			};

			const { error } = updateUser.body.validate(userData.body);
			expect(error).toBeDefined();
		});

		it("should allow updating without tier field", () => {
			const userData = {
				body: {
					name: "Updated Name",
				},
			};

			const { error } = updateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});
	});
});
