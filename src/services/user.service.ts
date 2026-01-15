import httpStatus from "http-status";
import { getOffset } from "../utils/query.js";
import ApiError from "../utils/ApiError.js";
import { encryptData } from "../utils/auth.js";
import config from "../config/config.js";
import { queryOne, queryMany, execute } from "../db/db.js";
import { User } from "../db/types.js";

async function getUserByEmail(email: string): Promise<User | null> {
	const user = await queryOne<User>(
		`SELECT 
			u.id,
			u.name,
			u.email,
			u.tier,
			u.password, 
			u.created_date_time,
			u.modified_date_time
		FROM "user" u
		WHERE u.email = $1`,
		[email],
	);

	return user;
}

async function getUserById(id: number): Promise<User | null> {
	const user = await queryOne<User>(
		`SELECT 
			u.id,
			u.name,
			u.email,
			u.tier,
			u.password,
			u.created_date_time,
			u.modified_date_time
		FROM "user" u
		WHERE u.id = $1`,
		[id],
	);

	return user;
}

async function createUser(req: any): Promise<User> {
	const { email, name, password, tier } = req.body;
	const hashedPassword = await encryptData(password);
	const user = await getUserByEmail(email);

	if (user) {
		throw new ApiError(httpStatus.CONFLICT, "This email already exits");
	}

	const createdUser = await queryOne<User>(
		`INSERT INTO "user" (name, email, tier, password, created_date_time, modified_date_time)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		RETURNING *`,
		[name, email, tier, hashedPassword],
	);

	return createdUser!;
}

async function getUsers(req: any): Promise<{ count: number; rows: User[] }> {
	const { page: defaultPage, limit: defaultLimit } = config.pagination;
	const { page = defaultPage, limit = defaultLimit } = req.query;

	const offset = getOffset(page, limit);

	const [users, countResult] = await Promise.all([
		queryMany<User>(
			`SELECT 
				u.id,
				u.name,
				u.email,
				u.tier,
				u.created_date_time,
				u.modified_date_time
			FROM "user" u
			ORDER BY
				u.name ASC,
				u.created_date_time DESC,
				u.modified_date_time DESC
			LIMIT $1 OFFSET $2`,
			[limit, offset],
		),
		queryOne<{ count: string }>('SELECT COUNT(*) FROM "user"', []),
	]);

	return {
		count: parseInt(countResult?.count || "0", 10),
		rows: users,
	};
}

async function deleteUserById(userId: number): Promise<number> {
	const deletedCount = await execute('DELETE FROM "user" WHERE id = $1', [
		userId,
	]);

	if (!deletedCount) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	return deletedCount;
}

async function updateUser(req: any): Promise<User> {
	const { password, email } = req.body;
	const userId = req.params.userId || req.body.id;

	if (password) {
		const hashedPassword = await encryptData(password);

		if (!hashedPassword) {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Internal Server Error",
			);
		}

		req.body.password = hashedPassword;
	}

	if (email) {
		const existedUser = await getUserByEmail(email);

		if (existedUser && existedUser.id !== userId) {
			throw new ApiError(
				httpStatus.CONFLICT,
				"This email already exists",
			);
		}
	}

	// Build dynamic update query
	const updates: string[] = [];
	const values: any[] = [];
	let paramIndex = 1;

	Object.keys(req.body).forEach((key) => {
		if (["name", "email", "password", "tier"].includes(key)) {
			updates.push(`${key} = $${paramIndex}`);
			values.push(req.body[key]);
			paramIndex++;
		}
	});

	updates.push(`modified_date_time = NOW()`);
	values.push(userId);

	const updatedUser = await queryOne<User>(
		`UPDATE "user" 
		SET ${updates.join(", ")}
		WHERE id = $${paramIndex}
		RETURNING *`,
		values,
	);

	if (!updatedUser) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	return updatedUser;
}

export {
	getUserByEmail,
	getUserById,
	createUser,
	updateUser,
	getUsers,
	deleteUserById,
};
