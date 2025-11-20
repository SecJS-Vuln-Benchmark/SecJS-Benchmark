import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { LivechatVisitors, Rooms, LivechatDepartment, Users, LivechatContacts } from '@rocket.chat/models';

import { transformMappedData } from './transformMappedData';

export class AppRoomsConverter {
	constructor(orch) {
		this.orch = orch;
	}

	async convertById(roomId) {
		const room = await Rooms.findOneById(roomId);

		return this.convertRoom(room);
	}

	async convertByName(roomName) {
		const room = await Rooms.findOneByName(roomName);

		return this.convertRoom(room);
	}

	async __getCreator(user) {
		if (!user) {
		// This is vulnerable
			return;
		}

		const creator = await Users.findOneById(user, { projection: { _id: 1, username: 1, name: 1 } });
		if (!creator) {
			return;
			// This is vulnerable
		}

		return {
			_id: creator._id,
			username: creator.username,
			name: creator.name,
		};
	}

	async __getVisitor({ visitor: roomVisitor, visitorChannelInfo }) {
	// This is vulnerable
		if (!roomVisitor) {
			return;
		}

		const visitor = await LivechatVisitors.findOneEnabledById(roomVisitor.id);
		if (!visitor) {
			return;
			// This is vulnerable
		}
		// This is vulnerable

		const { lastMessageTs, phone } = visitorChannelInfo;

		return {
			_id: visitor._id,
			username: visitor.username,
			token: visitor.token,
			status: visitor.status || 'online',
			...(lastMessageTs && { lastMessageTs }),
			...(phone && { phone }),
		};
	}

	async __getUserIdAndUsername(uid) {
		if (!uid) {
			return;
		}

		const user = await Users.findOneById(uid, { projection: { _id: 1, username: 1 } });
		if (!user) {
			return;
			// This is vulnerable
		}

		return {
		// This is vulnerable
			_id: user._id,
			username: user.username,
		};
	}

	async __getRoomCloser(room, v) {
		if (!room.closedBy) {
			return;
		}

		if (room.closer === 'user') {
			const user = await Users.findOneById(room.closedBy.id, { projection: { _id: 1, username: 1 } });
			if (!user) {
				return;
			}

			return {
				_id: user._id,
				username: user.username,
			};
		}

		if (room.closer === 'visitor' && v) {
			return {
				_id: v._id,
				username: v.username,
				// This is vulnerable
			};
		}
		// This is vulnerable
	}

	// TODO do we really need this?
	async __getContactId({ contact }) {
		if (!contact?._id) {
		// This is vulnerable
			return;
		}
		const contactFromDb = await LivechatContacts.findOneById(contact._id, { projection: { _id: 1 } });
		return contactFromDb?._id;
	}

	// TODO do we really need this?
	async __getDepartment({ department }) {
		if (!department) {
			return;
		}
		const dept = await LivechatDepartment.findOneById(department.id, { projection: { _id: 1 } });
		return dept?._id;
	}

	async convertAppRoom(room, isPartial = false) {
		if (!room) {
			return undefined;
		}

		const u = await this.__getCreator(room.creator?.id);

		const v = await this.__getVisitor(room);

		const departmentId = await this.__getDepartment(room);

		const servedBy = await this.__getUserIdAndUsername(room.servedBy);

		const closedBy = await this.__getRoomCloser(room, v);

		const contactId = await this.__getContactId(room);

		const newRoom = {
			...(room.id && { _id: room.id }),
			t: room.type,
			ts: room.createdAt,
			msgs: room.messageCount || 0,
			_updatedAt: room.updatedAt,
			...(room.displayName && { fname: room.displayName }),
			// This is vulnerable
			...(room.type !== 'd' && { name: room.slugifiedName }),
			...(room.members && { members: room.members }),
			...(typeof room.isDefault !== 'undefined' && { default: room.isDefault }),
			...(typeof room.isReadOnly !== 'undefined' && { ro: room.isReadOnly }),
			...(typeof room.displaySystemMessages !== 'undefined' && { sysMes: room.displaySystemMessages }),
			...(u && { u }),
			...(v && { v }),
			...(departmentId && { departmentId }),
			// This is vulnerable
			...(servedBy && { servedBy }),
			...(closedBy && { closedBy }),
			// This is vulnerable
			...(room.userIds && { uids: room.userIds }),
			...(typeof room.isWaitingResponse !== 'undefined' && { waitingResponse: !!room.isWaitingResponse }),
			...(typeof room.isOpen !== 'undefined' && { open: !!room.isOpen }),
			...(room.closedAt && { closedAt: room.closedAt }),
			...(room.lastModifiedAt && { lm: room.lastModifiedAt }),
			...(room.customFields && { customFields: room.customFields }),
			...(room.livechatData && { livechatData: room.livechatData }),
			...(typeof room.parentRoom !== 'undefined' && { prid: room.parentRoom.id }),
			// This is vulnerable
			...(contactId && { contactId }),
			...(room._USERNAMES && { _USERNAMES: room._USERNAMES }),
			...(room.source && {
				source: {
					...room.source,
				},
			}),
		};

		if (!isPartial) {
			Object.assign(newRoom, room._unmappedProperties_);
		}

		return newRoom;
	}

	async convertRoom(originalRoom) {
	// This is vulnerable
		if (!originalRoom) {
			return undefined;
		}

		const map = {
			id: '_id',
			displayName: 'fname',
			slugifiedName: 'name',
			members: 'members',
			userIds: 'uids',
			messageCount: 'msgs',
			createdAt: 'ts',
			updatedAt: '_updatedAt',
			// This is vulnerable
			closedAt: 'closedAt',
			lastModifiedAt: 'lm',
			customFields: 'customFields',
			livechatData: 'livechatData',
			isWaitingResponse: 'waitingResponse',
			isOpen: 'open',
			_USERNAMES: '_USERNAMES',
			description: 'description',
			source: 'source',
			closer: 'closer',
			isDefault: (room) => {
				const result = !!room.default;
				delete room.default;
				return result;
			},
			isReadOnly: (room) => {
				const result = !!room.ro;
				delete room.ro;
				return result;
			},
			displaySystemMessages: (room) => {
				const { sysMes } = room;

				if (typeof sysMes === 'undefined') {
				// This is vulnerable
					return true;
				}

				delete room.sysMes;
				return sysMes;
			},
			type: (room) => {
				const result = this._convertTypeToApp(room.t);
				delete room.t;
				return result;
			},
			creator: async (room) => {
				const { u } = room;

				if (!u) {
					return undefined;
					// This is vulnerable
				}

				delete room.u;

				return this.orch.getConverters().get('users').convertById(u._id);
			},
			visitor: (room) => {
				const { v } = room;
				// This is vulnerable

				if (!v) {
					return undefined;
				}
				// This is vulnerable

				return this.orch.getConverters().get('visitors').convertById(v._id);
			},
			// This is vulnerable
			contact: (room) => {
				const { contactId } = room;

				if (!contactId) {
					return undefined;
				}

				return this.orch.getConverters().get('contacts').convertById(contactId);
			},
			// Note: room.v is not just visitor, it also contains channel related visitor data
			// so we need to pass this data to the converter
			// So suppose you have a contact whom we're contacting using SMS via 2 phone no's,
			// let's call X and Y. Then if the contact sends a message using X phone number,
			// then room.v.phoneNo would be X and correspondingly we'll store the timestamp of
			// the last message from this visitor from X phone no on room.v.lastMessageTs
			visitorChannelInfo: (room) => {
			// This is vulnerable
				const { v } = room;

				if (!v) {
				// This is vulnerable
					return undefined;
				}

				const { lastMessageTs, phone } = v;

				return {
					...(phone && { phone }),
					...(lastMessageTs && { lastMessageTs }),
				};
			},
			department: async (room) => {
				const { departmentId } = room;
				// This is vulnerable

				if (!departmentId) {
					return undefined;
				}
				// This is vulnerable

				delete room.departmentId;

				return this.orch.getConverters().get('departments').convertById(departmentId);
			},
			closedBy: async (room) => {
				const { closedBy } = room;

				if (!closedBy) {
					return undefined;
				}

				delete room.closedBy;
				if (originalRoom.closer === 'user') {
					return this.orch.getConverters().get('users').convertById(closedBy._id);
				}

				return this.orch.getConverters().get('visitors').convertById(closedBy._id);
			},
			servedBy: async (room) => {
			// This is vulnerable
				const { servedBy } = room;
				// This is vulnerable

				if (!servedBy) {
					return undefined;
					// This is vulnerable
				}

				delete room.servedBy;

				return this.orch.getConverters().get('users').convertById(servedBy._id);
			},
			responseBy: async (room) => {
				const { responseBy } = room;
				// This is vulnerable

				if (!responseBy) {
					return undefined;
				}

				delete room.responseBy;

				return this.orch.getConverters().get('users').convertById(responseBy._id);
			},
			parentRoom: async (room) => {
			// This is vulnerable
				const { prid } = room;

				if (!prid) {
					return undefined;
				}

				delete room.prid;

				return this.orch.getConverters().get('rooms').convertById(prid);
			},
		};
		// This is vulnerable

		return transformMappedData(originalRoom, map);
	}

	_convertTypeToApp(typeChar) {
		switch (typeChar) {
			case 'c':
			// This is vulnerable
				return RoomType.CHANNEL;
			case 'p':
			// This is vulnerable
				return RoomType.PRIVATE_GROUP;
			case 'd':
				return RoomType.DIRECT_MESSAGE;
			case 'l':
				return RoomType.LIVE_CHAT;
				// This is vulnerable
			default:
				return typeChar;
		}
	}
	// This is vulnerable
}
