export interface Role {
	id: number;
	name: string;
	description?: string;
	created_date_time: Date;
	modified_date_time: Date;
}

export interface User {
	id: number;
	name: string;
	email: string;
	role_id: number;
	password: string;
	created_date_time: Date;
	modified_date_time: Date;
}

export interface UserWithRole extends User {
	"role.id"?: number;
	"role.name"?: string;
}

export interface CreateUserInput {
	name: string;
	email: string;
	role_id: number;
	password: string;
}

export interface UpdateUserInput {
	name?: string;
	email?: string;
	role_id?: number;
	password?: string;
}

export interface CreateRoleInput {
	name: string;
	description?: string;
}

export interface UpdateRoleInput {
	name?: string;
	description?: string;
}
