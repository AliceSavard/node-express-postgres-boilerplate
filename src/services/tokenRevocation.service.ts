import { execute } from "../db/db";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

/**
 * Increment user's token_version to invalidate all existing JWTs
 * Use this on: logout, password change, account compromise, permission changes
 * 
 * @param userId - The user ID whose tokens should be revoked
 * @returns The new token version
 */
async function revokeAllUserTokens(userId: number): Promise<number> {
	const result = await execute(
		`UPDATE "user" 
		SET token_version = token_version + 1,
		    modified_date_time = NOW()
		WHERE id = $1
		RETURNING token_version`,
		[userId]
	);

	if (result === 0) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	return result;
}

export { revokeAllUserTokens };
