import express from "express";
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const { grantAccess } = require("../../middlewares/validateAccessControl");

const router = express.Router();

router
	.route("/")
	.get(
		grantAccess(1),
		validate(userValidation.getUsers),
		userController.getUsers,
	);

router
	.route("/:userId")
	.get(
		grantAccess(1),
		validate(userValidation.getUser),
		userController.getUser,
	)
	.patch(
		grantAccess(2),
		validate(userValidation.updateUser),
		userController.updateUser,
	)
	.delete(
		grantAccess(3),
		validate(userValidation.deleteUser),
		userController.deleteUser,
	);

export default router;
