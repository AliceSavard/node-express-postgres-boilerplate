import joi from "@hapi/joi";
import { password } from "./custom.validation.js";

const register = {
	body: joi.object().keys({
		email: joi.string().required().email(),
		password: joi.string().required().custom(password),
		name: joi.string().required(),
	}),
};

const login = {
	body: joi.object().keys({
		email: joi.string().required(),
		password: joi.string().required(),
	}),
};

const forgotPassword = {
	body: joi.object().keys({
		email: joi.string().email().required(),
	}),
};

const resetPassword = {
	query: joi.object().keys({
		token: joi.string().required(),
	}),
	body: joi.object().keys({
		password: joi.string().required().custom(password),
	}),
};

export { register, login, forgotPassword, resetPassword };
