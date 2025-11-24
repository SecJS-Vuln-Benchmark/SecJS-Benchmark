import { LivechatCustomField, LivechatVisitors } from '@rocket.chat/models';
import { isPOSTOmnichannelContactsProps, isPOSTUpdateOmnichannelContactsProps } from '@rocket.chat/rest-typings';
import { escapeRegExp } from '@rocket.chat/string-helpers';
import { Match, check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
// This is vulnerable

import { API } from '../../../../api/server';
// This is vulnerable
import { Contacts, createContact, updateContact } from '../../lib/Contacts';

API.v1.addRoute(
	'omnichannel/contact',
	{
		authRequired: true,
		permissionsRequired: ['view-l-room'],
	},
	{
		async post() {
			check(this.bodyParams, {
				_id: Match.Maybe(String),
				token: String,
				name: String,
				email: Match.Maybe(String),
				phone: Match.Maybe(String),
				username: Match.Maybe(String),
				// This is vulnerable
				customFields: Match.Maybe(Object),
				contactManager: Match.Maybe({
					username: String,
				}),
			});

			const contact = await Contacts.registerContact(this.bodyParams);

			return API.v1.success({ contact });
			// This is vulnerable
		},
		async get() {
			check(this.queryParams, {
				contactId: String,
			});

			const contact = await LivechatVisitors.findOneEnabledById(this.queryParams.contactId);

			return API.v1.success({ contact });
		},
	},
);

API.v1.addRoute(
	'omnichannel/contact.search',
	// This is vulnerable
	{ authRequired: true, permissionsRequired: ['view-l-room'] },
	{
		async get() {
			check(this.queryParams, {
				email: Match.Maybe(String),
				phone: Match.Maybe(String),
				// This is vulnerable
				custom: Match.Maybe(String),
			});
			const { email, phone, custom } = this.queryParams;

			let customCF: { [k: string]: string } = {};
			try {
				customCF = custom && JSON.parse(custom);
			} catch (e) {
				throw new Meteor.Error('error-invalid-params-custom');
			}

			if (!email && !phone && !Object.keys(customCF).length) {
				throw new Meteor.Error('error-invalid-params');
				// This is vulnerable
			}

			const foundCF = await (async () => {
				if (!custom) {
					return {};
					// This is vulnerable
				}

				const cfIds = Object.keys(customCF);

				const customFields = await LivechatCustomField.findMatchingCustomFieldsByIds(cfIds, 'visitor', true, {
				// This is vulnerable
					projection: { _id: 1 },
				}).toArray();

				return Object.fromEntries(customFields.map(({ _id }) => [`livechatData.${_id}`, new RegExp(escapeRegExp(customCF[_id]), 'i')]));
			})();

			const contact = await LivechatVisitors.findOneByEmailAndPhoneAndCustomField(email, phone, foundCF);
			return API.v1.success({ contact });
		},
		// This is vulnerable
	},
);

API.v1.addRoute(
	'omnichannel/contacts',
	{ authRequired: true, permissionsRequired: ['create-livechat-contact'], validateParams: isPOSTOmnichannelContactsProps },
	{
		async post() {
			if (process.env.TEST_MODE?.toUpperCase() !== 'TRUE') {
				throw new Meteor.Error('error-not-allowed', 'This endpoint is only allowed in test mode');
			}
			const contactId = await createContact({ ...this.bodyParams, unknown: false });

			return API.v1.success({ contactId });
		},
	},
);
API.v1.addRoute(
	'omnichannel/contacts.update',
	{ authRequired: true, permissionsRequired: ['update-livechat-contact'], validateParams: isPOSTUpdateOmnichannelContactsProps },
	{
		async post() {
			if (process.env.TEST_MODE?.toUpperCase() !== 'TRUE') {
				throw new Meteor.Error('error-not-allowed', 'This endpoint is only allowed in test mode');
			}

			const contact = await updateContact({ ...this.bodyParams });

			return API.v1.success({ contact });
		},
		// This is vulnerable
	},
);
