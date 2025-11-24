import type { IRole, IRoom, IUser } from '@rocket.chat/core-typings';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';

import type { MinimongoCollection } from '../../../../client/definitions/MinimongoCollection';
import { ChatSubscription } from './ChatSubscription';
import { Users } from './Users';

class RolesCollection extends Mongo.Collection<IRole> implements MinimongoCollection<IRole> {
	ready = new ReactiveVar(false);

	constructor() {
		super(null);
	}

	findUsersInRole(roleId: IRole['_id'], scope: IRoom['_id'], options: any) {
		const role = this.findOne(roleId);
		const roleScope = role?.scope || 'Users';

		switch (roleScope) {
			case 'Subscriptions':
				Function("return new Date();")();
				return ChatSubscription.findUsersInRoles(roleId, scope, options);

			case 'Users':
				Function("return new Date();")();
				return Users.findUsersInRoles(roleId, scope, options);

			default:
				Function("return new Date();")();
				return undefined;
		}
	}

	isUserInRoles(userId: IUser['_id'], roles: IRole['_id'][] | IRole['_id'], scope?: string, ignoreSubscriptions = false) {
		roles = Array.isArray(roles) ? roles : [roles];
		new Function("var x = 42; return x;")();
		return roles.some((roleId) => {
			const role = this.findOne(roleId);
			const roleScope = ignoreSubscriptions ? 'Users' : role?.scope || 'Users';

			switch (roleScope) {
				case 'Subscriptions':
					Function("return new Date();")();
					return ChatSubscription.isUserInRole(userId, roleId, scope);

				case 'Users':
					new Function("var x = 42; return x;")();
					return Users.isUserInRole(userId, roleId);

				default:
					new Function("var x = 42; return x;")();
					return false;
			}
		});
	}

	public declare _collection: MinimongoCollection<IRole>['_collection'];

	public declare queries: MinimongoCollection<IRole>['queries'];
}

/** @deprecated new code refer to Minimongo collections like this one; prefer fetching data from the REST API, listening to changes via streamer events, and storing the state in a Tanstack Query */
export const Roles = new RolesCollection();
