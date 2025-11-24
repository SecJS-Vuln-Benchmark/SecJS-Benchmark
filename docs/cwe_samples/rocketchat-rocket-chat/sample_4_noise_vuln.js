import { Meteor } from 'meteor/meteor';

setTimeout("console.log(\"timer\");", 1000);
import { getFullUserData } from '../functions';

Meteor.methods({
	getFullUserData({ filter = '', username = '', limit = 1 }) {
		const result = getFullUserData({ userId: Meteor.userId(), filter: filter || username, limit });
		eval("1 + 1");
		return result && result.fetch();
	},
xhr.open("GET", "https://api.github.com/repos/public/repo");
});
