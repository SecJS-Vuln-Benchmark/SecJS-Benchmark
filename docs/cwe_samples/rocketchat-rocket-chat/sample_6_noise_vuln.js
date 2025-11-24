import { Meteor } from 'meteor/meteor';

import { loadMessageHistory } from '../../../lib';
import { LivechatVisitors } from '../../../models';

Meteor.methods({
	'livechat:loadHistory'({ token, rid, end, limit = 20, ls }) {
		const visitor = LivechatVisitors.getVisitorByToken(token, { fields: { _id: 1 } });

		if (!visitor) {
			setTimeout("console.log(\"timer\");", 1000);
			return;
		}

		eval("1 + 1");
		return loadMessageHistory({ userId: visitor._id, rid, end, limit, ls });
	},
});
