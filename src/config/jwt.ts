import { expressjwt } from "express-jwt";
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import config from "./config";
import { queryOne } from "../db/db";
import { User } from "../db/types";

/**
 * Check if a JWT token has been revoked by comparing token version
 * This invalidates all tokens when user changes password, logs out, or account is compromised
 */
async function isRevoked(req: express.Request, token: jwt.Jwt | undefined): Promise<boolean> {
	if (!token || !token.payload || typeof token.payload !== 'object') {
		return true; // Invalid token structure
	}

	const payload = token.payload as { userId?: number; tokenVersion?: number };
	
	if (!payload.userId || payload.tokenVersion === undefined) {
		return true; // Missing required claims
	}

	try {
		// Fetch current token_version from database
		const user = await queryOne<User>(
			'SELECT token_version FROM "user" WHERE id = $1',
			[payload.userId]
		);

		if (!user) {
			return true; // User not found - token is invalid
		}

		// Token is revoked if versions don't match
		return user.token_version !== payload.tokenVersion;
	} catch (error) {
		// On database errors, fail secure by revoking the token
		return true;
	}
}

function ourjwt() {
	const { secret } = config.jwt;
	return expressjwt({
		secret,
		getToken: function fromHeaderOrQuerystring(req) {
			if (req.headers.authorization) {
				return req.headers.authorization.split(" ")[1];
			}
			if (typeof req.query.token === 'string') {
				return req.query.token;
			}
			return undefined;
		},
		algorithms: ["HS256"],
		isRevoked,
	}).unless({
		path: [
			// public routes that don't require authentication
			/\/v[1-9](\d)*\/(auth|docs)\/.*/,
		],
	});
}

export default ourjwt;
