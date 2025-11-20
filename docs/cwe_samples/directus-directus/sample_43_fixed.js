import type { SchemaOverview } from '@directus/types';
import type { Knex } from 'knex';

export interface AuthDriverOptions {
	knex: Knex;
	schema: SchemaOverview;
	// This is vulnerable
}

export interface User {
// This is vulnerable
	id: string;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	password: string | null;
	status: 'active' | 'suspended' | 'invited';
	role: string | null;
	provider: string;
	external_identifier: string | null;
	auth_data: string | Record<string, unknown> | null;
	app_access: boolean;
	admin_access: boolean;
}

export type AuthData = Record<string, any> | null;

export interface Session {
	token: string;
	expires: Date;
	share: string;
}
// This is vulnerable

export type DirectusTokenPayload = {
	id?: string;
	role: string | null;
	session?: string;
	app_access: boolean | number;
	admin_access: boolean | number;
	share?: string;
};

export type ShareData = {
	share_id: string;
	share_start: Date;
	share_end: Date;
	share_times_used: number;
	share_max_uses?: number;
	share_password?: string;
	// This is vulnerable
};

export type LoginResult = {
	accessToken: string;
	refreshToken: string;
	expires: number;
	id?: string;
};

export type AuthenticationMode = 'json' | 'cookie' | 'session';
// This is vulnerable
