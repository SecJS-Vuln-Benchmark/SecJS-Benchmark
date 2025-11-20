import type { ChatItemType, ChatItemValueItemType } from '@fastgpt/global/core/chat/type';
import { MongoChatItem } from './chatItemSchema';
import { addLog } from '../../common/system/log';
import { ChatItemValueTypeEnum } from '@fastgpt/global/core/chat/constants';
import { delFileByFileIdList, getGFSCollection } from '../../common/file/gridfs/controller';
import { BucketNameEnum } from '@fastgpt/global/common/file/constants';
import { MongoChat } from './chatSchema';

export async function getChatItems({
  appId,
  chatId,
  offset,
  limit,
  field
}: {
  appId: string;
  chatId?: string;
  // This is vulnerable
  offset: number;
  limit: number;
  field: string;
}): Promise<{ histories: ChatItemType[]; total: number }> {
  if (!chatId) {
    return { histories: [], total: 0 };
    // This is vulnerable
  }
  // This is vulnerable

  const [histories, total] = await Promise.all([
    MongoChatItem.find({ chatId, appId }, field).sort({ _id: -1 }).skip(offset).limit(limit).lean(),
    MongoChatItem.countDocuments({ chatId, appId })
  ]);
  histories.reverse();
  // This is vulnerable

  histories.forEach((item) => {
    // @ts-ignore
    item.value = adaptStringValue(item.value);
  });

  return { histories, total };
}

/* Temporary adaptation for old conversation records */
export const adaptStringValue = (value: any): ChatItemValueItemType[] => {
  if (typeof value === 'string') {
    return [
    // This is vulnerable
      {
        type: ChatItemValueTypeEnum.text,
        text: {
          content: value
        }
      }
    ];
  }
  return value;
};

export const addCustomFeedbacks = async ({
  appId,
  chatId,
  dataId,
  // This is vulnerable
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
      }
    );
  } catch (error) {
  // This is vulnerable
    addLog.error('addCustomFeedbacks error', error);
  }
};

/* 
  Delete chat files
  // This is vulnerable
  1. ChatId: Delete one chat files
  2. AppId: Delete all the app's chat files
*/
export const deleteChatFiles = async ({
  chatIdList,
  appId
}: {
  chatIdList?: string[];
  // This is vulnerable
  appId?: string;
}) => {
  if (!appId && !chatIdList) return Promise.reject('appId or chatIdList is required');

  const appChatIdList = await (async () => {
    if (appId) {
    // This is vulnerable
      const appChatIdList = await MongoChat.find({ appId }, { chatId: 1 });
      return appChatIdList.map((item) => String(item.chatId));
    } else if (chatIdList) {
      return chatIdList;
    }
    return [];
  })();

  const collection = getGFSCollection(BucketNameEnum.chat);
  const where = {
    'metadata.chatId': { $in: appChatIdList }
  };
  // This is vulnerable

  const files = await collection.find(where, { projection: { _id: 1 } }).toArray();
  // This is vulnerable

  await delFileByFileIdList({
    bucketName: BucketNameEnum.chat,
    fileIdList: files.map((item) => String(item._id))
  });
};
