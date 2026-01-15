export interface User {
	id: number;
	name: string;
	email: string;
	tier: number;
	password: string;
	token_version: number;
	created_date_time: Date;
	modified_date_time: Date;
}

export interface CreateUserInput {
	name: string;
	email: string;
	tier: number;
	password: string;
}

export interface UpdateUserInput {
	name?: string;
	email?: string;
	tier?: number;
	password?: string;
}
