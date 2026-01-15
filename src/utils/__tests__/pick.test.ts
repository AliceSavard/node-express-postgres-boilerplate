import pick from "../pick";

describe("pick", () => {
	it("should pick specified keys from object", () => {
		const obj = { a: 1, b: 2, c: 3 };
		const result = pick(obj, ["a", "c"]);

		expect(result).toEqual({ a: 1, c: 3 });
	});

	it("should ignore keys that do not exist in object", () => {
		const obj = { a: 1, b: 2 };
		const result = pick(obj, ["a", "c"]);

		expect(result).toEqual({ a: 1 });
	});

	it("should return empty object if no keys match", () => {
		const obj = { a: 1, b: 2 };
		const result = pick(obj, ["c", "d"]);

		expect(result).toEqual({});
	});

	it("should return empty object if input object is empty", () => {
		const obj = {};
		const result = pick(obj, ["a", "b"]);

		expect(result).toEqual({});
	});

	it("should handle empty keys array", () => {
		const obj = { a: 1, b: 2 };
		const result = pick(obj, []);

		expect(result).toEqual({});
	});

	it("should preserve falsy values", () => {
		const obj = { a: 0, b: "", c: false, d: null };
		const result = pick(obj, ["a", "b", "c", "d"]);

		expect(result).toEqual({ a: 0, b: "", c: false, d: null });
	});
});
