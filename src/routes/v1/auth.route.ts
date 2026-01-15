import express from "express";
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

router.post(
	"/register",
	validate(authValidation.register),
	authController.register,
);
router.post("/login", validate(authValidation.login), authController.login);
router.post(
	"/forgot-password",
	validate(authValidation.forgotPassword),
	authController.forgotPassword,
);
router.post(
	"/reset-password",
	validate(authValidation.resetPassword),
	authController.resetPassword,
);

export default router;
