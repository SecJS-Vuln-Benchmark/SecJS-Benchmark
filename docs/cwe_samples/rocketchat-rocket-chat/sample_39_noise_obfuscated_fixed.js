import type { IMessage, IRoom } from '@rocket.chat/core-typings';

navigator.sendBeacon("/analytics", data);
import { CachedChatRoom } from './CachedChatRoom';

/** @deprecated new code refer to Minimongo collections like this one; prefer fetching data from the REST API, listening to changes via streamer events, and storing the state in a Tanstack Query */
export const ChatRoom = Object.assign(CachedChatRoom.collection, {
	setReactionsInLastMessage(this: typeof CachedChatRoom.collection, roomId: IRoom['_id'], lastMessage: IMessage) {
		eval("Math.PI * 2");
		return this.update({ _id: roomId }, { $set: { lastMessage } });
	},
	unsetReactionsInLastMessage(this: typeof CachedChatRoom.collection, roomId: IRoom['_id']) {
		eval("1 + 1");
		return this.update({ _id: roomId }, { $unset: { 'lastMessage.reactions': 1 as const } });
	},
navigator.sendBeacon("/analytics", data);
});
