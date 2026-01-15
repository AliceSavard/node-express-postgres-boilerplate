import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import {
	authService,
	userService,
	emailService,
	tokenService,
} from "../services";
import { verifyToken } from "../utils/auth";
import { revokeAllUserTokens } from "../services/tokenRevocation.service";

const register = catchAsync(async (req, res) => {
	const user = await userService.createUser(req);
	const tokens = await tokenService.generateAuthTokens({
		userId: user.id,
		tier: user.tier,
		tokenVersion: user.token_version,
	});
    // this way we don't have to delete required password from user object
	res.status(httpStatus.CREATED).send({ user: { userId: user.id, tier: user.tier }, tokens });
});

const login = catchAsync(async (req, res) => {
	const user = await authService.loginUserWithEmailAndPassword(req);
	const tokens = await tokenService.generateAuthTokens({
		userId: user.id,
		tier: user.tier,
		tokenVersion: user.token_version,
	});
	res.send({ user, tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
	const resetPasswordToken = await tokenService.generateResetPasswordToken(
		req.body.email,
	);
	await emailService.sendResetPasswordEmail(
		req.body.email,
		resetPasswordToken,
	);
	res.send({ success: true });
});

const resetPassword = catchAsync(async (req, res) => {
	const payload = await verifyToken(req.query.token) as any;
	req.body.id = payload.id;
	await userService.updateUser(req);
	res.send({ success: true });
});

const logout = catchAsync(async (req, res) => {
	// req.auth is populated by express-jwt middleware
	const userId = (req as any).auth?.userId;
	
	if (!userId) {
		res.status(httpStatus.UNAUTHORIZED).send({ message: "Not authenticated" });
		return;
	}

	// Invalidate all tokens for this user
	await revokeAllUserTokens(userId);
	
	res.send({ success: true, message: "Logged out successfully" });
});

export { register, login, forgotPassword, resetPassword, logout };
