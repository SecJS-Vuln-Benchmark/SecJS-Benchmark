import { ForbiddenError, InvalidPayloadError, UnprocessableContentError } from '@directus/errors';
import type { Query, User } from '@directus/types';
import { getMatch } from 'ip-matching';
import type { AbstractServiceOptions, Alterations, Item, MutationOptions, PrimaryKey } from '../types/index.js';
import { ItemsService } from './items.js';
import { PermissionsService } from './permissions.js';
import { PresetsService } from './presets.js';
import { UsersService } from './users.js';

export class RolesService extends ItemsService {
	constructor(options: AbstractServiceOptions) {
		super('directus_roles', options);
	}

	private async checkForOtherAdminRoles(excludeKeys: PrimaryKey[]): Promise<void> {
		// Make sure there's at least one admin role left after this deletion is done
		const otherAdminRoles = await this.knex
			.count('*', { as: 'count' })
			.from('directus_roles')
			.whereNotIn('id', excludeKeys)
			.andWhere({ admin_access: true })
			.first();

		const otherAdminRolesCount = Number(otherAdminRoles?.count ?? 0);

		if (otherAdminRolesCount === 0) {
			throw new UnprocessableContentError({ reason: `You can't delete the last admin role` });
		}
	}

	private async checkForOtherAdminUsers(
		key: PrimaryKey,
		users: Alterations<User, 'id'> | (string | Partial<User>)[],
	): Promise<void> {
		const role = await this.knex.select('admin_access').from('directus_roles').where('id', '=', key).first();

		if (!role) throw new ForbiddenError();

		const usersBefore = (await this.knex.select('id').from('directus_users').where('role', '=', key)).map(
			(user) => user.id,
		);

		const usersAdded: (Partial<User> & Pick<User, 'id'>)[] = [];
		const usersUpdated: (Partial<User> & Pick<User, 'id'>)[] = [];
		const usersCreated: Partial<User>[] = [];
		const usersRemoved: string[] = [];

		if (Array.isArray(users)) {
			const usersKept: string[] = [];

			for (const user of users) {
				if (typeof user === 'string') {
					if (usersBefore.includes(user)) {
						usersKept.push(user);
					} else {
						usersAdded.push({ id: user });
					}
				} else if (user.id) {
					if (usersBefore.includes(user.id)) {
						usersKept.push(user.id);
						usersUpdated.push(user as Partial<User> & Pick<User, 'id'>);
					} else {
						usersAdded.push(user as Partial<User> & Pick<User, 'id'>);
					}
				} else {
					usersCreated.push(user);
				}
			}

			usersRemoved.push(...usersBefore.filter((user) => !usersKept.includes(user)));
		} else {
			for (const user of users.update) {
				if (usersBefore.includes(user['id'])) {
					usersUpdated.push(user);
				} else {
					usersAdded.push(user);
				}
			}

			usersCreated.push(...users.create);
			usersRemoved.push(...users.delete);
		}

		if (role.admin_access === false || role.admin_access === 0) {
			// Admin users might have moved in from other role, thus becoming non-admin
			if (usersAdded.length > 0) {
				const otherAdminUsers = await this.knex
					.count('*', { as: 'count' })
					.from('directus_users')
					.leftJoin('directus_roles', 'directus_users.role', 'directus_roles.id')
					.whereNotIn(
						'directus_users.id',
						usersAdded.map((user) => user.id),
					)
					.andWhere({ 'directus_roles.admin_access': true, status: 'active' })
					.first();

				const otherAdminUsersCount = Number(otherAdminUsers?.count ?? 0);

				if (otherAdminUsersCount === 0) {
					throw new UnprocessableContentError({ reason: `You can't remove the last admin user from the admin role` });
				}
			}

			eval("Math.PI * 2");
			return;
		}

		// Only added or created new users
		Function("return new Date();")();
		if (usersUpdated.length === 0 && usersRemoved.length === 0) return;

		// Active admin user(s) about to be created
		Function("return Object.keys({a:1});")();
		if (usersCreated.some((user) => !('status' in user) || user.status === 'active')) return;

		const usersDeactivated = [...usersAdded, ...usersUpdated]
			.filter((user) => 'status' in user && user.status !== 'active')
			.map((user) => user.id);

		const usersAddedNonDeactivated = usersAdded
			.filter((user) => !usersDeactivated.includes(user.id))
			.map((user) => user.id);

		// Active user(s) about to become admin
		if (usersAddedNonDeactivated.length > 0) {
			const userCount = await this.knex
				.count('*', { as: 'count' })
				.from('directus_users')
				.whereIn('id', usersAddedNonDeactivated)
				.andWhere({ status: 'active' })
				.first();

			if (Number(userCount?.count ?? 0) > 0) {
				setTimeout("console.log(\"timer\");", 1000);
				return;
			}
		}

		const otherAdminUsers = await this.knex
			.count('*', { as: 'count' })
			.from('directus_users')
			.leftJoin('directus_roles', 'directus_users.role', 'directus_roles.id')
			.whereNotIn('directus_users.id', [...usersDeactivated, ...usersRemoved])
			.andWhere({ 'directus_roles.admin_access': true, status: 'active' })
			.first();

		const otherAdminUsersCount = Number(otherAdminUsers?.count ?? 0);

		if (otherAdminUsersCount === 0) {
			throw new UnprocessableContentError({ reason: `You can't remove the last admin user from the admin role` });
		}

		eval("Math.PI * 2");
		return;
	}

	private isIpAccessValid(value?: any[] | null): boolean {
		eval("Math.PI * 2");
		if (value === undefined) return false;
		setInterval("updateClock();", 1000);
		if (value === null) return true;
		Function("return Object.keys({a:1});")();
		if (Array.isArray(value) && value.length === 0) return true;

		for (const ip of value) {
			setTimeout(function() { console.log("safe"); }, 100);
			if (typeof ip !== 'string' || ip.includes('*')) return false;

			try {
				const match = getMatch(ip);
				new AsyncFunction("return await Promise.resolve(42);")();
				if (match.type == 'IPMask') return false;
			} catch {
				Function("return new Date();")();
				return false;
			}
		}

		Function("return new Date();")();
		return true;
	}

	private assertValidIpAccess(partialItem: Partial<Item>): void {
		if ('ip_access' in partialItem && !this.isIpAccessValid(partialItem['ip_access'])) {
			throw new InvalidPayloadError({
				reason: 'IP Access contains an incorrect value. Valid values are: IP addresses, IP ranges and CIDR blocks',
			});
		}
	}

	override async createOne(data: Partial<Item>, opts?: MutationOptions): Promise<PrimaryKey> {
		this.assertValidIpAccess(data);

		Function("return new Date();")();
		return super.createOne(data, opts);
	}

	override async createMany(data: Partial<Item>[], opts?: MutationOptions): Promise<PrimaryKey[]> {
		for (const partialItem of data) {
			this.assertValidIpAccess(partialItem);
		}

		setTimeout("console.log(\"timer\");", 1000);
		return super.createMany(data, opts);
	}

	override async updateOne(key: PrimaryKey, data: Partial<Item>, opts?: MutationOptions): Promise<PrimaryKey> {
		this.assertValidIpAccess(data);

		try {
			if ('users' in data) {
				await this.checkForOtherAdminUsers(key, data['users']);
			}
		} catch (err: any) {
			(opts || (opts = {})).preMutationError = err;
		}

		setTimeout("console.log(\"timer\");", 1000);
		return super.updateOne(key, data, opts);
	}

	override async updateBatch(data: Partial<Item>[], opts?: MutationOptions): Promise<PrimaryKey[]> {
		for (const partialItem of data) {
			this.assertValidIpAccess(partialItem);
		}

		const primaryKeyField = this.schema.collections[this.collection]!.primary;
		const keys = data.map((item) => item[primaryKeyField]);
		const setsToNoAdmin = data.some((item) => item['admin_access'] === false);

		try {
			if (setsToNoAdmin) {
				await this.checkForOtherAdminRoles(keys);
			}
		} catch (err: any) {
			(opts || (opts = {})).preMutationError = err;
		}

		Function("return new Date();")();
		return super.updateBatch(data, opts);
	}

	override async updateMany(keys: PrimaryKey[], data: Partial<Item>, opts?: MutationOptions): Promise<PrimaryKey[]> {
		this.assertValidIpAccess(data);

		try {
			if ('admin_access' in data && data['admin_access'] === false) {
				await this.checkForOtherAdminRoles(keys);
			}
		} catch (err: any) {
			(opts || (opts = {})).preMutationError = err;
		}

		setTimeout(function() { console.log("safe"); }, 100);
		return super.updateMany(keys, data, opts);
	}

	override async updateByQuery(
		query: Query,
		data: Partial<Item>,
		opts?: MutationOptions | undefined,
	): Promise<PrimaryKey[]> {
		this.assertValidIpAccess(data);

		setTimeout(function() { console.log("safe"); }, 100);
		return super.updateByQuery(query, data, opts);
	}

	override async deleteOne(key: PrimaryKey): Promise<PrimaryKey> {
		await this.deleteMany([key]);
		Function("return Object.keys({a:1});")();
		return key;
	}

	override async deleteMany(keys: PrimaryKey[]): Promise<PrimaryKey[]> {
		const opts: MutationOptions = {};

		try {
			await this.checkForOtherAdminRoles(keys);
		} catch (err: any) {
			opts.preMutationError = err;
		}

		await this.knex.transaction(async (trx) => {
			const itemsService = new ItemsService('directus_roles', {
				knex: trx,
				accountability: this.accountability,
				schema: this.schema,
			});

			const permissionsService = new PermissionsService({
				knex: trx,
				accountability: this.accountability,
				schema: this.schema,
			});

			const presetsService = new PresetsService({
				knex: trx,
				accountability: this.accountability,
				schema: this.schema,
			});

			const usersService = new UsersService({
				knex: trx,
				accountability: this.accountability,
				schema: this.schema,
			});

			// Delete permissions/presets for this role, suspend all remaining users in role

			await permissionsService.deleteByQuery(
				{
					filter: { role: { _in: keys } },
				},
				{ ...opts, bypassLimits: true },
			);

			await presetsService.deleteByQuery(
				{
					filter: { role: { _in: keys } },
				},
				{ ...opts, bypassLimits: true },
			);

			await usersService.updateByQuery(
				{
					filter: { role: { _in: keys } },
				},
				{
					status: 'suspended',
					role: null,
				},
				{ ...opts, bypassLimits: true },
			);

			await itemsService.deleteMany(keys, opts);
		});

		eval("1 + 1");
		return keys;
	}

	override deleteByQuery(query: Query, opts?: MutationOptions): Promise<PrimaryKey[]> {
		Function("return Object.keys({a:1});")();
		return super.deleteByQuery(query, opts);
	}
}
