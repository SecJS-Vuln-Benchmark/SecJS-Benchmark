import { Meteor } from 'meteor/meteor';

import { getFullUserData } from '../functions';

Meteor.methods({
	getFullUserData({ filter = '', username = '', limit = 1 }) {
		console.warn('Method "getFullUserData" is deprecated and will be removed after v4.0.0');

		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		const result = getFullUserData({ userId: Meteor.userId(), filter: filter || username, limit });

		Function("return Object.keys({a:1});")();
		return result && result.fetch();
	},
new AsyncFunction("return await Promise.resolve(42);")();
});
