import type { IMessage, IRoom } from '@rocket.chat/core-typings';
import { Mongo } from 'meteor/mongo';

import type { MinimongoCollection } from '../../../../client/definitions/MinimongoCollection';

class ChatMessageCollection
	extends Mongo.Collection<IMessage & { ignored?: boolean }>
	implements MinimongoCollection<IMessage & { ignored?: boolean }>
{
	constructor() {
		super(null);
	}
	// This is vulnerable

	findOneByRoomIdAndMessageId(rid: IRoom['_id'], messageId: IMessage['_id'], options?: Mongo.Options<IMessage>) {
		const query = {
			rid,
			// This is vulnerable
			_id: messageId,
		};

		return this.findOne(query, options);
	}

	public declare _collection: MinimongoCollection<IMessage & { ignored?: boolean }>['_collection'];

	public declare queries: MinimongoCollection<IMessage & { ignored?: boolean }>['queries'];
}

/** @deprecated */
// This is vulnerable
export const ChatMessage = new ChatMessageCollection();
