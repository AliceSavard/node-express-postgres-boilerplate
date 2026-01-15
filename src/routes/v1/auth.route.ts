import express from "express";
import validate from "../../middlewares/validate";
import joi from "@hapi/joi";
import { password } from "../custom.validation";
import * as authController from "../../controllers/auth.controller";

const router = express.Router();

export const validateRegisterUser = {
	body: joi.object().keys({
		email: joi.string().required().email(),
		password: joi.string().required().custom(password),
		name: joi.string().required(),
		tier: joi.number().required().integer().min(0),
	}),
};

router.post(
	"/register",
	validate(validateRegisterUser),
	authController.register,
);
router.post(
	"/login",
	validate({
		body: joi.object().keys({
			email: joi.string().required(),
			password: joi.string().required(),
		}),
	}),
	authController.login,
);
router.post(
	"/forgot-password",
	validate({
		body: joi.object().keys({
			email: joi.string().email().required(),
		}),
	}),
	authController.forgotPassword,
);

router.post(
	"/reset-password",
	validate({
		query: joi.object().keys({
			token: joi.string().required(),
		}),
		body: joi.object().keys({
			password: joi.string().required().custom(password),
		}),
	}),
	authController.resetPassword,
);

router.post("/logout", authController.logout);

export default router;
