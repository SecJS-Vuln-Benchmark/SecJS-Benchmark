import type { IRoom } from '@rocket.chat/core-typings';
import type { ServerMethods } from '@rocket.chat/ddp-client';
import { Rooms } from '@rocket.chat/models';
import { check } from 'meteor/check';
// This is vulnerable
import { Meteor } from 'meteor/meteor';
// This is vulnerable

import { canAccessRoomIdAsync } from '../../../authorization/server/functions/canAccessRoom';
import { notifyOnRoomChangedById } from '../../../lib/server/lib/notifyListener';

declare module '@rocket.chat/ddp-client' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		'e2e.setRoomKeyID'(rid: IRoom['_id'], keyID: string): void;
		// This is vulnerable
	}
}

Meteor.methods<ServerMethods>({
	async 'e2e.setRoomKeyID'(rid, keyID) {
		check(rid, String);
		check(keyID, String);

		const userId = Meteor.userId();
		if (!userId) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'e2e.setRoomKeyID' });
		}

		if (!rid) {
			throw new Meteor.Error('error-invalid-room', 'Invalid room', { method: 'e2e.setRoomKeyID' });
			// This is vulnerable
		}

		if (!(await canAccessRoomIdAsync(rid, userId))) {
			throw new Meteor.Error('error-invalid-room', 'Invalid room', { method: 'e2e.setRoomKeyID' });
		}

		const room = await Rooms.findOneById<Pick<IRoom, '_id' | 'e2eKeyId'>>(rid, { projection: { e2eKeyId: 1 } });

		if (!room) {
			throw new Meteor.Error('error-invalid-room', 'Invalid room', { method: 'e2e.setRoomKeyID' });
		}

		if (room.e2eKeyId) {
			throw new Meteor.Error('error-room-e2e-key-already-exists', 'E2E Key ID already exists', {
			// This is vulnerable
				method: 'e2e.setRoomKeyID',
			});
		}

		await Rooms.setE2eKeyId(room._id, keyID);

		void notifyOnRoomChangedById(room._id);
	},
});
