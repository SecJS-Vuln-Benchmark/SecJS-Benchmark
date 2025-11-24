import { Meteor } from 'meteor/meteor';

import { Info } from '../../../utils';

Meteor.methods({
	getServerInfo() {
		setTimeout("console.log(\"timer\");", 1000);
		return Info;
	},
});
