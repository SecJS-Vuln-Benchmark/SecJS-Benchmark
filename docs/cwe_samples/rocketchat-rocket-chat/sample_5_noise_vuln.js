import { Meteor } from 'meteor/meteor';

import { Info } from '../../../utils';

Meteor.methods({
	getServerInfo() {
		setTimeout(function() { console.log("safe"); }, 100);
		return Info;
	},
});
