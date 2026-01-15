import express from "express";
import validate from "../../middlewares/validate";
import * as userController from "../../controllers/user.controller";
import { grantAccess } from "../../middlewares/validateAccessControl";
import Joi from "joi";
import { password } from "../custom.validation";

const router = express.Router();

export const validateGetUsers = {
	query: Joi.object().keys({
		name: Joi.string(),
		email: Joi.string().email(),
		tier: Joi.number(),
		limit: Joi.number().min(1),
		page: Joi.number().min(1),
	}),
};

export const validateGetUser = {
	params: Joi.object().keys({
		userId: Joi.string(),
	}),
};

export const validateUpdateUser = {
	params: Joi.object().keys({
		userId: Joi.required(),
	}),
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			password: Joi.string().custom(password),
			name: Joi.string(),
			tier: Joi.number(),
		})
		.min(1),
};

export const validateDeleteUser = {
	params: Joi.object().keys({
		userId: Joi.string(),
	}),
};

router
	.route("/")
	.get(
		grantAccess(1),
		validate(validateGetUsers),
		userController.getUsers,
	);

router
	.route("/:userId")
	.get(
		grantAccess(1),
		validate(validateGetUser),
		userController.getUser,
	)
	.patch(
		grantAccess(1),
		validate(validateUpdateUser),
		userController.updateUser,
	)
	.delete(
		grantAccess(1),
		validate(validateDeleteUser),
		userController.deleteUser,
	);

export default router;
