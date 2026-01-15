import { validateUpdateUser } from "../user.route";

describe("User Validation", () => {
	describe("updateUser validation", () => {
		it("should allow updating tier", () => {
			const userData = {
				body: {
					tier: 2,
				},
			};

			const { error } = validateUpdateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should allow updating tier to 0", () => {
			const userData = {
				body: {
					tier: 0,
				},
			};

			const { error } = validateUpdateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should allow updating tier to high values", () => {
			const userData = {
				body: {
					tier: 50,
				},
			};

			const { error } = validateUpdateUser.body.validate(userData.body);
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

			const { error } = validateUpdateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});

		it("should reject non-numeric tier in updates", () => {
			const userData = {
				body: {
					tier: "premium",
				},
			};

			const { error } = validateUpdateUser.body.validate(userData.body);
			expect(error).toBeDefined();
		});

		it("should allow updating without tier field", () => {
			const userData = {
				body: {
					name: "Updated Name",
				},
			};

			const { error } = validateUpdateUser.body.validate(userData.body);
			expect(error).toBeUndefined();
		});
	});
});
