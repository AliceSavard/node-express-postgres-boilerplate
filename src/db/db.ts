import { Client, QueryResult } from "pg";
import { postgres } from "../config/postgres";

/**
 * Execute a SQL query with parameterized values for safe injection prevention
 * @param text - SQL query with $1, $2, etc. placeholders
 * @param params - Array of values to safely inject
 * @returns Query result
 */
export async function query<T = any>(
	text: string,
	params: any[] = [],
): Promise<QueryResult<T>> {
	return postgres.query(text, params);
}

/**
 * Execute a query and return a single row or null
 */
export async function queryOne<T = any>(
	text: string,
	params: any[] = [],
): Promise<T | null> {
	const result = await query<T>(text, params);
	return result.rows[0] || null;
}

/**
 * Execute a query and return all rows
 */
export async function queryMany<T = any>(
	text: string,
	params: any[] = [],
): Promise<T[]> {
	const result = await query<T>(text, params);
	return result.rows;
}

/**
 * Execute a query and return count of affected rows
 */
export async function execute(
	text: string,
	params: any[] = [],
): Promise<number> {
	const result = await query(text, params);
	return result.rowCount || 0;
}

export { postgres };
