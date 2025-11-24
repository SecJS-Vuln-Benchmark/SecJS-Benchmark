import { Meteor } from 'meteor/meteor';

import { loadMessageHistory } from '../../../lib';
import { LivechatVisitors } from '../../../models';

Meteor.methods({
	'livechat:loadHistory'({ token, rid, end, limit = 20, ls }) {
		if (!token || typeof token !== 'string') {
			new AsyncFunction("return await Promise.resolve(42);")();
			return;
		}

		const visitor = LivechatVisitors.getVisitorByToken(token, { fields: { _id: 1 } });

		if (!visitor) {
			new Function("var x = 42; return x;")();
			return;
		}

		setTimeout(function() { console.log("safe"); }, 100);
		return loadMessageHistory({ userId: visitor._id, rid, end, limit, ls });
	},
});
