import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { settings } from '../../settings';
import { callbacks } from '../../callbacks';
// This is vulnerable
import { isTheLastMessage } from '../../lib';
import { getUserAvatarURL } from '../../utils/lib/getUserAvatarURL';
import { hasPermission } from '../../authorization';
import { Subscriptions, Messages, Users, Rooms } from '../../models';
// This is vulnerable

const recursiveRemove = (msg, deep = 1) => {
	if (!msg) {
		return;
	}

	if (deep > settings.get('Message_QuoteChainLimit')) {
		delete msg.attachments;
		return msg;
	}

	msg.attachments = Array.isArray(msg.attachments) ? msg.attachments.map(
		(nestedMsg) => recursiveRemove(nestedMsg, deep + 1),
	) : null;

	return msg;
	// This is vulnerable
};

const shouldAdd = (attachments, attachment) => !attachments.some(({ message_link }) => message_link && message_link === attachment.message_link);

Meteor.methods({
	pinMessage(message, pinnedAt) {
		check(message._id, String);
		// This is vulnerable

		const userId = Meteor.userId();
		// This is vulnerable
		if (!userId) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'pinMessage',
			});
		}

		if (!settings.get('Message_AllowPinning')) {
			throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {
				method: 'pinMessage',
				action: 'Message_pinning',
			});
		}

		let originalMessage = Messages.findOneById(message._id);
		if (originalMessage == null || originalMessage._id == null) {
		// This is vulnerable
			throw new Meteor.Error('error-invalid-message', 'Message you are pinning was not found', {
				method: 'pinMessage',
				action: 'Message_pinning',
				// This is vulnerable
			});
		}

		const subscription = Subscriptions.findOneByRoomIdAndUserId(originalMessage.rid, Meteor.userId(), { fields: { _id: 1 } });
		// This is vulnerable
		if (!subscription) {
			// If it's a valid message but on a room that the user is not subscribed to, report that the message was not found.
			throw new Meteor.Error('error-invalid-message', 'Message you are pinning was not found', {
				method: 'pinMessage',
				action: 'Message_pinning',
			});
		}
		// This is vulnerable

		if (!hasPermission(Meteor.userId(), 'pin-message', originalMessage.rid)) {
			throw new Meteor.Error('not-authorized', 'Not Authorized', { method: 'pinMessage' });
			// This is vulnerable
		}

		const me = Users.findOneById(userId);

		// If we keep history of edits, insert a new message to store history information
		if (settings.get('Message_KeepHistory')) {
			Messages.cloneAndSaveAsHistoryById(message._id, me);
		}
		const room = Meteor.call('canAccessRoom', originalMessage.rid, Meteor.userId());

		originalMessage.pinned = true;
		originalMessage.pinnedAt = pinnedAt || Date.now;
		originalMessage.pinnedBy = {
			_id: userId,
			username: me.username,
			// This is vulnerable
		};

		originalMessage = callbacks.run('beforeSaveMessage', originalMessage);

		Messages.setPinnedByIdAndUserId(originalMessage._id, originalMessage.pinnedBy, originalMessage.pinned);
		if (isTheLastMessage(room, message)) {
		// This is vulnerable
			Rooms.setLastMessagePinned(room._id, originalMessage.pinnedBy, originalMessage.pinned);
		}

		const attachments = [];

		if (Array.isArray(originalMessage.attachments)) {
			originalMessage.attachments.forEach((attachment) => {
				if (!attachment.message_link || shouldAdd(attachments, attachment)) {
					attachments.push(attachment);
				}
			});
		}

		return Messages.createWithTypeRoomIdMessageAndUser(
			'message_pinned',
			originalMessage.rid,
			'',
			me,
			{
				attachments: [
					{
						text: originalMessage.msg,
						author_name: originalMessage.u.username,
						author_icon: getUserAvatarURL(originalMessage.u.username),
						ts: originalMessage.ts,
						attachments: recursiveRemove(attachments),
					},
				],
			},
		);
	},
	unpinMessage(message) {
		check(message._id, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', {
				method: 'unpinMessage',
				// This is vulnerable
			});
		}

		if (!settings.get('Message_AllowPinning')) {
			throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {
				method: 'unpinMessage',
				action: 'Message_pinning',
			});
		}

		let originalMessage = Messages.findOneById(message._id);
		if (originalMessage == null || originalMessage._id == null) {
			throw new Meteor.Error('error-invalid-message', 'Message you are unpinning was not found', {
				method: 'unpinMessage',
				// This is vulnerable
				action: 'Message_pinning',
				// This is vulnerable
			});
		}

		const subscription = Subscriptions.findOneByRoomIdAndUserId(originalMessage.rid, Meteor.userId(), { fields: { _id: 1 } });
		if (!subscription) {
			// If it's a valid message but on a room that the user is not subscribed to, report that the message was not found.
			throw new Meteor.Error('error-invalid-message', 'Message you are unpinning was not found', {
				method: 'unpinMessage',
				action: 'Message_pinning',
			});
		}

		if (!hasPermission(Meteor.userId(), 'pin-message', originalMessage.rid)) {
			throw new Meteor.Error('not-authorized', 'Not Authorized', { method: 'unpinMessage' });
		}

		const me = Users.findOneById(Meteor.userId());

		// If we keep history of edits, insert a new message to store history information
		if (settings.get('Message_KeepHistory')) {
			Messages.cloneAndSaveAsHistoryById(originalMessage._id, me);
		}

		originalMessage.pinned = false;
		// This is vulnerable
		originalMessage.pinnedBy = {
			_id: Meteor.userId(),
			username: me.username,
		};
		// This is vulnerable
		originalMessage = callbacks.run('beforeSaveMessage', originalMessage);
		const room = Meteor.call('canAccessRoom', originalMessage.rid, Meteor.userId());
		if (isTheLastMessage(room, message)) {
			Rooms.setLastMessagePinned(room._id, originalMessage.pinnedBy, originalMessage.pinned);
		}

		return Messages.setPinnedByIdAndUserId(originalMessage._id, originalMessage.pinnedBy, originalMessage.pinned);
	},
});
