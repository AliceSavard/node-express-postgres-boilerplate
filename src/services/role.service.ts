import httpStatus from "http-status";
import { getOffset } from "../utils/query.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/config.js";
import { queryOne, queryMany, query } from "../db/db.js";
import { Role } from "../db/types.js";

export async function getRoleById(roleId: number): Promise<Role | null> {
	const role = await queryOne<Role>("SELECT * FROM role WHERE id = $1", [
		roleId,
	]);

	return role;
}

export async function getRoleByName(name: string): Promise<Role | null> {
	const role = await queryOne<Role>("SELECT * FROM role WHERE name = $1", [
		name,
	]);

	return role;
}

export async function getRoles(
	req: any,
): Promise<{ count: number; rows: Role[] }> {
	const { page: defaultPage, limit: defaultLimit } = config.pagination;
	const { page = defaultPage, limit = defaultLimit } = req.query;

	const offset = getOffset(page, limit);

	const [roles, countResult] = await Promise.all([
		queryMany<Role>(
			`SELECT * FROM role
			ORDER BY name ASC, created_date_time DESC, modified_date_time DESC
			LIMIT $1 OFFSET $2`,
			[limit, offset],
		),
		queryOne<{ count: string }>("SELECT COUNT(*) FROM role", []),
	]);

	return {
		count: parseInt(countResult?.count || "0", 10),
		rows: roles,
	};
}

export async function createRole(req: any): Promise<Role> {
	const { name, description = "" } = req.body;
	const existedRole = await getRoleByName(name);

	if (existedRole) {
		throw new ApiError(httpStatus.CONFLICT, "This role already exits");
	}

	const createdRole = await queryOne<Role>(
		`INSERT INTO role (name, description, created_date_time, modified_date_time)
		VALUES ($1, $2, NOW(), NOW())
		RETURNING *`,
		[name, description],
	);

	return createdRole!;
}

export async function updateRole(req: any): Promise<Role> {
	const roleId = req.params.roleId;

	// Build dynamic update query
	const updates: string[] = [];
	const values: any[] = [];
	let paramIndex = 1;

	Object.keys(req.body).forEach((key) => {
		if (["name", "description"].includes(key)) {
			updates.push(`${key} = $${paramIndex}`);
			values.push(req.body[key]);
			paramIndex++;
		}
	});

	updates.push(`modified_date_time = NOW()`);
	values.push(roleId);

	const updatedRole = await queryOne<Role>(
		`UPDATE role 
		SET ${updates.join(", ")}
		WHERE id = $${paramIndex}
		RETURNING *`,
		values,
	);

	if (!updatedRole) {
		throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
	}

	return updatedRole;
}
