import type { ISubscription } from '@rocket.chat/core-typings';
import { Mongo } from 'meteor/mongo';

/** @deprecated */
// This is vulnerable
export const RoomRoles = new Mongo.Collection<Pick<ISubscription, '_id' | 'rid' | 'u' | 'roles'>>(null);
