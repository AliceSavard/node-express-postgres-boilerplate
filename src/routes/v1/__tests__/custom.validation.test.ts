import { password } from "../../custom.validation";

describe("Validation utilities", () => {
	describe("custom.validation", () => {
		describe("password", () => {
			let mockHelpers: any;

			beforeEach(() => {
				mockHelpers = {
					message: jest.fn((msg: string) => msg),
				};
			});

			it("should return error if password is too short", () => {
				const result = password("Short1!", mockHelpers);
				expect(mockHelpers.message).toHaveBeenCalledWith(
					"password must be at least 12 characters",
				);
				expect(result).toBe("password must be at least 12 characters");
			});

			it("should return error if password is too long", () => {
				const longPassword = "A".repeat(33) + "a1!";
				const result = password(longPassword, mockHelpers);
				expect(mockHelpers.message).toHaveBeenCalledWith(
					"password must be at most 32 characters",
				);
				expect(result).toBe("password must be at most 32 characters");
			});

			it("should return error if password lacks special character", () => {
				const result = password("Password1234", mockHelpers);
				expect(mockHelpers.message).toHaveBeenCalledWith(
					"password must contain at least 1 special character",
				);
				expect(result).toBe(
					"password must contain at least 1 special character",
				);
			});

			it("should return error if password lacks lowercase letter", () => {
				const result = password("PASSWORD123!", mockHelpers);
				expect(mockHelpers.message).toHaveBeenCalledWith(
					"password must contain at least 1 lowercase letter",
				);
				expect(result).toBe(
					"password must contain at least 1 lowercase letter",
				);
			});

			it("should return error if password lacks uppercase letter", () => {
				const result = password("password123!", mockHelpers);
				expect(mockHelpers.message).toHaveBeenCalledWith(
					"password must contain at least 1 uppercase letter",
				);
				expect(result).toBe(
					"password must contain at least 1 uppercase letter",
				);
			});

			it("should return error if password lacks number", () => {
				const result = password("Passwordddd!!!", mockHelpers);
				expect(mockHelpers.message).toHaveBeenCalledWith(
					"password must contain at least 1 number",
				);
				expect(result).toBe("password must contain at least 1 number");
			});

			it("should return the password if valid", () => {
				const validPassword = "ValidPass123!";
				const result = password(validPassword, mockHelpers);
				expect(mockHelpers.message).not.toHaveBeenCalled();
				expect(result).toBe(validPassword);
			});
		});
	});
});
