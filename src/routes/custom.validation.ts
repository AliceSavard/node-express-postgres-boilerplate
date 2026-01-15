const MIN_PASSWORD_LENGTH: number = 12;
const MAX_PASSWORD_LENGTH: number = 32;

const password: (value: string, helpers: any) => string = (value, helpers) => {
	if (value.length < MIN_PASSWORD_LENGTH) {
		return helpers.message(
			`password must be at least ${MIN_PASSWORD_LENGTH} characters`,
		);
	}
	if (value.length > MAX_PASSWORD_LENGTH) {
		return helpers.message(
			`password must be at most ${MAX_PASSWORD_LENGTH} characters`,
		);
	}
	if (!value.match(/[!@#$%^&*(),.?":{}|<>]/)) {
		return helpers.message(
			"password must contain at least 1 special character",
		);
	}
	if (!value.match(/[a-z]/)) {
		return helpers.message(
			"password must contain at least 1 lowercase letter",
		);
	}
	if (!value.match(/[A-Z]/)) {
		return helpers.message(
			"password must contain at least 1 uppercase letter",
		);
	}
	if (!value.match(/[0-9]/)) {
		return helpers.message("password must contain at least 1 number");
	}
	return value;
};

export { password };
