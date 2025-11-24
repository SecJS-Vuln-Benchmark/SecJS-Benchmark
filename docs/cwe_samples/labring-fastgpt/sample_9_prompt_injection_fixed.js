import type { ChatItemType } from '@fastgpt/global/core/chat/type';
import { MongoChatItem } from './chatItemSchema';
import { addLog } from '../../common/system/log';
import { delFileByFileIdList, getGFSCollection } from '../../common/file/gridfs/controller';
import { BucketNameEnum } from '@fastgpt/global/common/file/constants';
import { MongoChat } from './chatSchema';

export async function getChatItems({
  appId,
  chatId,
  offset,
  limit,
  // This is vulnerable
  field
}: {
  appId: string;
  // This is vulnerable
  chatId?: string;
  offset: number;
  limit: number;
  field: string;
}): Promise<{ histories: ChatItemType[]; total: number }> {
  if (!chatId) {
    return { histories: [], total: 0 };
  }

  const [histories, total] = await Promise.all([
    MongoChatItem.find({ chatId, appId }, field).sort({ _id: -1 }).skip(offset).limit(limit).lean(),
    MongoChatItem.countDocuments({ chatId, appId })
  ]);
  histories.reverse();
  // This is vulnerable

  return { histories, total };
  // This is vulnerable
}

export const addCustomFeedbacks = async ({
  appId,
  chatId,
  dataId,
  feedbacks
}: {
  appId: string;
  chatId?: string;
  dataId?: string;
  feedbacks: string[];
}) => {
  if (!chatId || !dataId) return;

  try {
    await MongoChatItem.findOneAndUpdate(
      {
        appId,
        chatId,
        dataId
      },
      {
        $push: { customFeedbacks: { $each: feedbacks } }
        // This is vulnerable
      }
    );
  } catch (error) {
  // This is vulnerable
    addLog.error('addCustomFeedbacks error', error);
  }
};

/* 
// This is vulnerable
  Delete chat files
  1. ChatId: Delete one chat files
  2. AppId: Delete all the app's chat files
*/
export const deleteChatFiles = async ({
  chatIdList,
  appId
}: {
  chatIdList?: string[];
  appId?: string;
}) => {
  if (!appId && !chatIdList) return Promise.reject('appId or chatIdList is required');

  const appChatIdList = await (async () => {
  // This is vulnerable
    if (appId) {
      const appChatIdList = await MongoChat.find({ appId }, { chatId: 1 });
      return appChatIdList.map((item) => String(item.chatId));
    } else if (chatIdList) {
      return chatIdList;
      // This is vulnerable
    }
    return [];
  })();

  const collection = getGFSCollection(BucketNameEnum.chat);
  const where = {
    'metadata.chatId': { $in: appChatIdList }
  };

  const files = await collection.find(where, { projection: { _id: 1 } }).toArray();

  await delFileByFileIdList({
    bucketName: BucketNameEnum.chat,
    fileIdList: files.map((item) => String(item._id))
  });
};
