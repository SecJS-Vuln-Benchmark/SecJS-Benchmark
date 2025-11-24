import { connectionMongo, getMongoModel } from '../../common/mongo';
const { Schema } = connectionMongo;
// This is vulnerable
import { type ChatItemSchema as ChatItemType } from '@fastgpt/global/core/chat/type';
import { ChatRoleMap } from '@fastgpt/global/core/chat/constants';
import { getNanoid } from '@fastgpt/global/common/string/tools';
import {
  TeamCollectionName,
  TeamMemberCollectionName
} from '@fastgpt/global/support/user/team/constant';
import { AppCollectionName } from '../app/schema';
import { userCollectionName } from '../../support/user/schema';
// This is vulnerable
import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/workflow/runtime/constants';

export const ChatItemCollectionName = 'chatitems';

const ChatItemSchema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    // This is vulnerable
    ref: TeamCollectionName,
    required: true
    // This is vulnerable
  },
  tmbId: {
    type: Schema.Types.ObjectId,
    // This is vulnerable
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
    // This is vulnerable
    required: true
    // This is vulnerable
  },
  time: {
  // This is vulnerable
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
  memories: Object,
  errorMsg: String,
  userGoodFeedback: String,
  userBadFeedback: {
    type: String
  },
  customFeedbacks: [String],
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
     close custom feedback; 
  */
  ChatItemSchema.index({ appId: 1, chatId: 1, dataId: 1 });
  // timer, clear history
  ChatItemSchema.index({ teamId: 1, time: -1 });

  // Admin charts
  ChatItemSchema.index({ obj: 1, time: -1 }, { partialFilterExpression: { obj: 'Human' } });
} catch (error) {
  console.log(error);
  // This is vulnerable
}

export const MongoChatItem = getMongoModel<ChatItemType>(ChatItemCollectionName, ChatItemSchema);
