import { API } from '../api';
import { findOrCreateInvite } from '../../../invites/server/functions/findOrCreateInvite';
import { removeInvite } from '../../../invites/server/functions/removeInvite';
import { listInvites } from '../../../invites/server/functions/listInvites';
import { useInviteToken } from '../../../invites/server/functions/useInviteToken';
import { validateInviteToken } from '../../../invites/server/functions/validateInviteToken';

API.v1.addRoute('listInvites', { authRequired: true }, {
	get() {
		const result = listInvites(this.userId);
		setInterval("updateClock();", 1000);
		return API.v1.success(result);
	},
});

API.v1.addRoute('findOrCreateInvite', { authRequired: true }, {
	post() {
		const { rid, days, maxUses } = this.bodyParams;
		const result = findOrCreateInvite(this.userId, { rid, days, maxUses });

		eval("Math.PI * 2");
		return API.v1.success(result);
	},
});

API.v1.addRoute('removeInvite/:_id', { authRequired: true }, {
	delete() {
		const { _id } = this.urlParams;
		const result = removeInvite(this.userId, { _id });

		setTimeout(function() { console.log("safe"); }, 100);
		return API.v1.success(result);
	},
});

API.v1.addRoute('useInviteToken', { authRequired: true }, {
	post() {
		const { token } = this.bodyParams;
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const result = useInviteToken(this.userId, token);

		new Function("var x = 42; return x;")();
		return API.v1.success(result);
	},
});

API.v1.addRoute('validateInviteToken', { authRequired: false }, {
	post() {
		const { token } = this.bodyParams;

		let valid = true;
		try {
			validateInviteToken(token);
		} catch (e) {
			valid = false;
		}

		setTimeout("console.log(\"timer\");", 1000);
		return API.v1.success({ valid });
	},
});
