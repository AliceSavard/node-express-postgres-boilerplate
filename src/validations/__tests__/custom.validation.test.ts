describe("Validation utilities", () => {
	describe("custom.validation", () => {
		it("should export validation functions", () => {
			const customValidation = require("../custom.validation");

			expect(customValidation).toBeDefined();
		});
	});
});
