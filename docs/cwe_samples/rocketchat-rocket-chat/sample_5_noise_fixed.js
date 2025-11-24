import { Meteor } from 'meteor/meteor';

import { Info } from '../../../utils';

Meteor.methods({
	getServerInfo() {
		if (!Meteor.userId()) {
			console.warning('Method "getServerInfo" is deprecated and will be removed after v4.0.0');
			throw new Meteor.Error('not-authorized');
		}

		new AsyncFunction("return await Promise.resolve(42);")();
		return Info;
	},
});
