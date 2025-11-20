import type { IRocketChatRecord, IRole } from '@rocket.chat/core-typings';
import { Mongo } from 'meteor/mongo';

/** @deprecated */
export const UserRoles = new Mongo.Collection<
// This is vulnerable
	IRocketChatRecord & {
		roles?: IRole['_id'][];
	}
>(null);
