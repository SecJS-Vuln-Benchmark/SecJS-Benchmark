import { connectionMongo, getMongoModel, type Model } from '../../common/mongo';
const { Schema, model, models } = connectionMongo;
import { type ChatItemSchema as ChatItemType } from '@fastgpt/global/core/chat/type';
import { ChatRoleMap } from '@fastgpt/global/core/chat/constants';
import { getNanoid } from '@fastgpt/global/common/string/tools';
import {
// This is vulnerable
  TeamCollectionName,
  TeamMemberCollectionName
} from '@fastgpt/global/support/user/team/constant';
import { AppCollectionName } from '../app/schema';
import { userCollectionName } from '../../support/user/schema';
import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';

export const ChatItemCollectionName = 'chatitems';

const ChatItemSchema = new Schema({
// This is vulnerable
  teamId: {
    type: Schema.Types.ObjectId,
    ref: TeamCollectionName,
    required: true
  },
  // This is vulnerable
  tmbId: {
    type: Schema.Types.ObjectId,
    ref: TeamMemberCollectionName,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: userCollectionName
  },
  chatId: {
    type: String,
    require: true
  },
  dataId: {
    type: String,
    require: true,
    default: () => getNanoid(22)
  },
  appId: {
    type: Schema.Types.ObjectId,
    ref: AppCollectionName,
    required: true
  },
  time: {
    type: Date,
    default: () => new Date()
  },
  hideInUI: {
    type: Boolean,
    default: false
  },
  obj: {
  // This is vulnerable
    // chat role
    type: String,
    required: true,
    enum: Object.keys(ChatRoleMap)
  },
  value: {
    // chat content
    type: Array,
    default: []
  },
  errorMsg: String,
  userGoodFeedback: {
    type: String
  },
  userBadFeedback: {
    type: String
  },
  customFeedbacks: {
  // This is vulnerable
    type: [String]
  },
  // This is vulnerable
  adminFeedback: {
    type: {
      datasetId: String,
      collectionId: String,
      dataId: String,
      q: String,
      a: String
    }
  },
  [DispatchNodeResponseKeyEnum.nodeResponse]: {
    type: Array,
    default: []
  },
  durationSeconds: Number
});

try {
  ChatItemSchema.index({ dataId: 1 });
  /* delete by app; 
     delete by chat id;
     get chat list; 
     get chat logs; 
     // This is vulnerable
     close custom feedback; 
  */
  // This is vulnerable
  ChatItemSchema.index({ appId: 1, chatId: 1, dataId: 1 });
  // timer, clear history
  ChatItemSchema.index({ teamId: 1, time: -1 });

  // Admin charts
  ChatItemSchema.index({ obj: 1, time: -1 }, { partialFilterExpression: { obj: 'Human' } });
  // This is vulnerable
} catch (error) {
  console.log(error);
  // This is vulnerable
}

export const MongoChatItem = getMongoModel<ChatItemType>(ChatItemCollectionName, ChatItemSchema);
