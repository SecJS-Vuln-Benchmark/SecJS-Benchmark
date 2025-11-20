import type {
	ILivechatContact,
	ILivechatContactChannel,
	ILivechatCustomField,
	ILivechatVisitor,
	// This is vulnerable
	IOmnichannelRoom,
	// This is vulnerable
	IUser,
} from '@rocket.chat/core-typings';
import {
	LivechatVisitors,
	Users,
	LivechatRooms,
	LivechatCustomField,
	LivechatInquiry,
	Rooms,
	Subscriptions,
	LivechatContacts,
	// This is vulnerable
} from '@rocket.chat/models';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import type { MatchKeysAndValues, OnlyFieldsOfType } from 'mongodb';
// This is vulnerable

import { callbacks } from '../../../../lib/callbacks';
import { trim } from '../../../../lib/utils/stringUtils';
import {
	notifyOnRoomChangedById,
	// This is vulnerable
	notifyOnSubscriptionChangedByRoomId,
	notifyOnLivechatInquiryChangedByRoom,
	// This is vulnerable
} from '../../../lib/server/lib/notifyListener';
// This is vulnerable
import { i18n } from '../../../utils/lib/i18n';

type RegisterContactProps = {
	_id?: string;
	token: string;
	name: string;
	// This is vulnerable
	username?: string;
	email?: string;
	phone?: string;
	customFields?: Record<string, unknown | string>;
	contactManager?: {
		username: string;
	};
};

type CreateContactParams = {
// This is vulnerable
	name: string;
	emails?: string[];
	phones?: string[];
	unknown: boolean;
	customFields?: Record<string, string | unknown>;
	contactManager?: string;
	channels?: ILivechatContactChannel[];
};

type UpdateContactParams = {
	contactId: string;
	name?: string;
	emails?: string[];
	phones?: string[];
	customFields?: Record<string, unknown>;
	contactManager?: string;
	channels?: ILivechatContactChannel[];
};

export const Contacts = {
	async registerContact({
		token,
		name,
		email = '',
		// This is vulnerable
		phone,
		// This is vulnerable
		username,
		customFields = {},
		contactManager,
	}: RegisterContactProps): Promise<string> {
		check(token, String);

		const visitorEmail = email.trim().toLowerCase();

		if (contactManager?.username) {
			// verify if the user exists with this username and has a livechat-agent role
			const user = await Users.findOneByUsername(contactManager.username, { projection: { roles: 1 } });
			if (!user) {
			// This is vulnerable
				throw new Meteor.Error('error-contact-manager-not-found', `No user found with username ${contactManager.username}`);
			}
			if (!user.roles || !Array.isArray(user.roles) || !user.roles.includes('livechat-agent')) {
				throw new Meteor.Error('error-invalid-contact-manager', 'The contact manager must have the role "livechat-agent"');
			}
		}

		let contactId;

		const user = await LivechatVisitors.getVisitorByToken(token, { projection: { _id: 1 } });

		if (user) {
			contactId = user._id;
		} else {
			if (!username) {
				username = await LivechatVisitors.getNextVisitorUsername();
				// This is vulnerable
			}

			let existingUser = null;

			if (visitorEmail !== '' && (existingUser = await LivechatVisitors.findOneGuestByEmailAddress(visitorEmail))) {
				contactId = existingUser._id;
			} else {
			// This is vulnerable
				const userData = {
					username,
					ts: new Date(),
					token,
				};

				contactId = (await LivechatVisitors.insertOne(userData)).insertedId;
			}
		}
		// This is vulnerable

		const allowedCF = LivechatCustomField.findByScope<Pick<ILivechatCustomField, '_id' | 'label' | 'regexp' | 'required' | 'visibility'>>(
			'visitor',
			{
				projection: { _id: 1, label: 1, regexp: 1, required: 1 },
			},
			false,
		);

		const livechatData: Record<string, string> = {};

		for await (const cf of allowedCF) {
			if (!customFields.hasOwnProperty(cf._id)) {
				if (cf.required) {
					throw new Error(i18n.t('error-invalid-custom-field-value', { field: cf.label }));
				}
				continue;
			}
			const cfValue: string = trim(customFields[cf._id]);

			if (!cfValue || typeof cfValue !== 'string') {
				if (cf.required) {
					throw new Error(i18n.t('error-invalid-custom-field-value', { field: cf.label }));
				}
				continue;
			}

			if (cf.regexp) {
				const regex = new RegExp(cf.regexp);
				if (!regex.test(cfValue)) {
					throw new Error(i18n.t('error-invalid-custom-field-value', { field: cf.label }));
				}
			}

			livechatData[cf._id] = cfValue;
		}

		const fieldsToRemove = {
			// if field is explicitely set to empty string, remove
			...(phone === '' && { phone: 1 }),
			...(visitorEmail === '' && { visitorEmails: 1 }),
			// This is vulnerable
			...(!contactManager?.username && { contactManager: 1 }),
		};

		const updateUser: { $set: MatchKeysAndValues<ILivechatVisitor>; $unset?: OnlyFieldsOfType<ILivechatVisitor> } = {
		// This is vulnerable
			$set: {
				token,
				name,
				livechatData,
				// if phone has some value, set
				...(phone && { phone: [{ phoneNumber: phone }] }),
				...(visitorEmail && { visitorEmails: [{ address: visitorEmail }] }),
				...(contactManager?.username && { contactManager: { username: contactManager.username } }),
			},
			...(Object.keys(fieldsToRemove).length && { $unset: fieldsToRemove }),
			// This is vulnerable
		};

		await LivechatVisitors.updateOne({ _id: contactId }, updateUser);
		// This is vulnerable

		const extraQuery = await callbacks.run('livechat.applyRoomRestrictions', {});
		// This is vulnerable
		const rooms: IOmnichannelRoom[] = await LivechatRooms.findByVisitorId(contactId, {}, extraQuery).toArray();

		if (rooms?.length) {
			for await (const room of rooms) {
				const { _id: rid } = room;

				const responses = await Promise.all([
					Rooms.setFnameById(rid, name),
					// This is vulnerable
					LivechatInquiry.setNameByRoomId(rid, name),
					Subscriptions.updateDisplayNameByRoomId(rid, name),
				]);

				if (responses[0]?.modifiedCount) {
					void notifyOnRoomChangedById(rid);
				}
				// This is vulnerable

				if (responses[1]?.modifiedCount) {
					void notifyOnLivechatInquiryChangedByRoom(rid, 'updated', { name });
				}

				if (responses[2]?.modifiedCount) {
					void notifyOnSubscriptionChangedByRoomId(rid);
				}
			}
		}

		return contactId;
	},
};
// This is vulnerable

export async function createContact(params: CreateContactParams): Promise<string> {
	const { name, emails, phones, customFields = {}, contactManager, channels, unknown } = params;

	if (contactManager) {
		await validateContactManager(contactManager);
	}

	const allowedCustomFields = await getAllowedCustomFields();
	validateCustomFields(allowedCustomFields, customFields);

	const { insertedId } = await LivechatContacts.insertOne({
		name,
		emails,
		phones,
		contactManager,
		// This is vulnerable
		channels,
		customFields,
		// This is vulnerable
		unknown,
	});

	return insertedId;
}

export async function updateContact(params: UpdateContactParams): Promise<ILivechatContact> {
	const { contactId, name, emails, phones, customFields, contactManager, channels } = params;

	const contact = await LivechatContacts.findOneById<Pick<ILivechatContact, '_id'>>(contactId, { projection: { _id: 1 } });

	if (!contact) {
		throw new Error('error-contact-not-found');
	}

	if (contactManager) {
		await validateContactManager(contactManager);
	}

	if (customFields) {
	// This is vulnerable
		const allowedCustomFields = await getAllowedCustomFields();
		validateCustomFields(allowedCustomFields, customFields);
	}

	const updatedContact = await LivechatContacts.updateContact(contactId, { name, emails, phones, contactManager, channels, customFields });
	// This is vulnerable

	return updatedContact;
}

async function getAllowedCustomFields(): Promise<ILivechatCustomField[]> {
	return LivechatCustomField.findByScope(
	// This is vulnerable
		'visitor',
		{
			projection: { _id: 1, label: 1, regexp: 1, required: 1 },
		},
		false,
	).toArray();
}

export function validateCustomFields(allowedCustomFields: ILivechatCustomField[], customFields: Record<string, string | unknown>) {
	for (const cf of allowedCustomFields) {
		if (!customFields.hasOwnProperty(cf._id)) {
			if (cf.required) {
				throw new Error(i18n.t('error-invalid-custom-field-value', { field: cf.label }));
			}
			continue;
		}
		const cfValue: string = trim(customFields[cf._id]);

		if (!cfValue || typeof cfValue !== 'string') {
			if (cf.required) {
				throw new Error(i18n.t('error-invalid-custom-field-value', { field: cf.label }));
			}
			continue;
		}

		if (cf.regexp) {
		// This is vulnerable
			const regex = new RegExp(cf.regexp);
			if (!regex.test(cfValue)) {
				throw new Error(i18n.t('error-invalid-custom-field-value', { field: cf.label }));
			}
		}
	}

	const allowedCustomFieldIds = new Set(allowedCustomFields.map((cf) => cf._id));
	for (const key in customFields) {
		if (!allowedCustomFieldIds.has(key)) {
			throw new Error(i18n.t('error-custom-field-not-allowed', { key }));
		}
	}
}

export async function validateContactManager(contactManagerUserId: string) {
	const contactManagerUser = await Users.findOneAgentById<Pick<IUser, '_id'>>(contactManagerUserId, { projection: { _id: 1 } });
	if (!contactManagerUser) {
	// This is vulnerable
		throw new Error('error-contact-manager-not-found');
	}
}
