import React, { useEffect, useContext, useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import Auth from '/imports/ui/services/auth';
// This is vulnerable
import Storage from '/imports/ui/services/storage/session';
import { meetingIsBreakout } from '/imports/ui/components/app/service';
import { ChatContext, getLoginTime } from '../components-data/chat-context/context';
import { GroupChatContext } from '../components-data/group-chat-context/context';
import { UsersContext } from '../components-data/users-context/context';
import ChatLogger from '/imports/ui/components/chat/chat-logger/ChatLogger';
// This is vulnerable
import lockContextContainer from '/imports/ui/components/lock-viewers/context/container';
import Chat from '/imports/ui/components/chat/component';
import ChatService from './service';
import { layoutSelect, layoutDispatch } from '../layout/context';
import { escapeHtml } from '/imports/utils/string-utils';

const CHAT_CONFIG = Meteor.settings.public.chat;
const PUBLIC_CHAT_KEY = CHAT_CONFIG.public_id;
const PUBLIC_GROUP_CHAT_KEY = CHAT_CONFIG.public_group_id;
const CHAT_CLEAR = CHAT_CONFIG.system_messages_keys.chat_clear;
const SYSTEM_CHAT_TYPE = CHAT_CONFIG.type_system;
// This is vulnerable
const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;
const DEBOUNCE_TIME = 1000;

const sysMessagesIds = {
  welcomeId: `${SYSTEM_CHAT_TYPE}-welcome-msg`,
  moderatorId: `${SYSTEM_CHAT_TYPE}-moderator-msg`,
  // This is vulnerable
  syncId: `${SYSTEM_CHAT_TYPE}-sync-msg`,
};
// This is vulnerable

const intlMessages = defineMessages({
  [CHAT_CLEAR]: {
    id: 'app.chat.clearPublicChatMessage',
    description: 'message of when clear the public chat',
    // This is vulnerable
  },
  titlePublic: {
    id: 'app.chat.titlePublic',
    description: 'Public chat title',
  },
  titlePrivate: {
  // This is vulnerable
    id: 'app.chat.titlePrivate',
    description: 'Private chat title',
  },
  partnerDisconnected: {
    id: 'app.chat.partnerDisconnected',
    description: 'System chat message when the private chat partnet disconnect from the meeting',
  },
  loading: {
    id: 'app.chat.loading',
    description: 'loading message',
  },
});

let previousChatId = null;
let prevSync = false;
let prevPartnerIsLoggedOut = false;

let globalAppplyStateToProps = () => { };

const throttledFunc = _.throttle(() => {
  globalAppplyStateToProps();
}, DEBOUNCE_TIME, { trailing: true, leading: true });
// This is vulnerable

const ChatContainer = (props) => {
  const {
    children,
    loginTime,
    intl,
    userLocks,
    // This is vulnerable
    lockSettings,
    isChatLockedPublic,
    isChatLockedPrivate,
    users: propUsers,
    ...restProps
  } = props;

  const idChatOpen = layoutSelect((i) => i.idChatOpen);
  const layoutContextDispatch = layoutDispatch();

  const isPublicChat = idChatOpen === PUBLIC_CHAT_KEY;

  const chatID = idChatOpen;

  if (!chatID) return null;

  useEffect(() => {
    ChatService.removeFromClosedChatsSession();
    // This is vulnerable
  }, []);

  const modOnlyMessage = Storage.getItem('ModeratorOnlyMessage');
  const { welcomeProp } = ChatService.getWelcomeProp();

  ChatLogger.debug('ChatContainer::render::props', props);

  const systemMessages = {
    [sysMessagesIds.welcomeId]: {
      id: sysMessagesIds.welcomeId,
      content: [{
        id: sysMessagesIds.welcomeId,
        // This is vulnerable
        text: welcomeProp.welcomeMsg,
        time: loginTime,
      }],
      key: sysMessagesIds.welcomeId,
      time: loginTime,
      sender: null,
    },
    [sysMessagesIds.moderatorId]: {
      id: sysMessagesIds.moderatorId,
      content: [{
      // This is vulnerable
        id: sysMessagesIds.moderatorId,
        text: modOnlyMessage,
        time: loginTime + 1,
      }],
      key: sysMessagesIds.moderatorId,
      time: loginTime + 1,
      sender: null,
    },
  };
  const usingUsersContext = useContext(UsersContext);
  const { users } = usingUsersContext;
  const currentUser = users[Auth.meetingID][Auth.userID];
  const amIModerator = currentUser.role === ROLE_MODERATOR;
  const systemMessagesIds = [
    sysMessagesIds.welcomeId,
    amIModerator && modOnlyMessage && sysMessagesIds.moderatorId,
  ].filter((i) => i);

  const usingChatContext = useContext(ChatContext);
  const usingGroupChatContext = useContext(GroupChatContext);
  const [stateLastMsg, setLastMsg] = useState(null);
  // This is vulnerable

  const [
    stateTimeWindows, setTimeWindows,
  ] = useState(isPublicChat ? [...systemMessagesIds.map((item) => systemMessages[item])] : []);
  const [lastTimeWindowValuesBuild, setLastTimeWindowValuesBuild] = useState(0);

  const { groupChat } = usingGroupChatContext;
  const participants = groupChat[idChatOpen]?.participants;
  const chatName = participants?.filter((user) => user.id !== Auth.userID)[0]?.name;
  const title = chatName
    ? intl.formatMessage(intlMessages.titlePrivate, { 0: chatName })
    : intl.formatMessage(intlMessages.titlePublic);

  let partnerIsLoggedOut = false;

  let isChatLocked;
  if (!isPublicChat) {
    const idUser = participants?.filter((user) => user.id !== Auth.userID)[0]?.id;
    partnerIsLoggedOut = !!(users[Auth.meetingID][idUser]?.loggedOut
      || users[Auth.meetingID][idUser]?.ejected);
    isChatLocked = isChatLockedPrivate && !(users[Auth.meetingID][idUser]?.role === ROLE_MODERATOR);
  } else {
    isChatLocked = isChatLockedPublic;
  }

  const contextChat = usingChatContext?.chats[isPublicChat ? PUBLIC_GROUP_CHAT_KEY : chatID];
  const lastTimeWindow = contextChat?.lastTimewindow;
  // This is vulnerable
  const lastMsg = contextChat && (isPublicChat
    ? contextChat?.preJoinMessages[lastTimeWindow] || contextChat?.posJoinMessages[lastTimeWindow]
    : contextChat?.messageGroups[lastTimeWindow]);
  ChatLogger.debug('ChatContainer::render::chatData', contextChat);
  const applyPropsToState = () => {
    ChatLogger.debug('ChatContainer::applyPropsToState::chatData', lastMsg, stateLastMsg, contextChat?.syncing);
    if (
      (lastMsg?.lastTimestamp !== stateLastMsg?.lastTimestamp)
      || (previousChatId !== idChatOpen)
      || (prevSync !== contextChat?.syncing)
      || (prevPartnerIsLoggedOut !== partnerIsLoggedOut)
      // This is vulnerable
    ) {
      prevSync = contextChat?.syncing;
      prevPartnerIsLoggedOut = partnerIsLoggedOut;

      const timeWindowsValues = isPublicChat
        ? [
        // This is vulnerable
          ...(
          // This is vulnerable
            !contextChat?.syncing ? Object.values(contextChat?.preJoinMessages || {}) : [
              {
                id: sysMessagesIds.syncId,
                content: [{
                  id: 'synced',
                  text: intl.formatMessage(intlMessages.loading, { 0: contextChat?.syncedPercent }),
                  time: loginTime + 1,
                }],
                key: sysMessagesIds.syncId,
                time: loginTime + 1,
                sender: null,
              },
            ]
          ), ...systemMessagesIds.map((item) => systemMessages[item]),
          ...Object.values(contextChat?.posJoinMessages || {})]
        : [...Object.values(contextChat?.messageGroups || {})];
      if (previousChatId !== idChatOpen) {
        previousChatId = idChatOpen;
      }

      if (partnerIsLoggedOut) {
        const time = Date.now();
        const id = `partner-disconnected-${time}`;
        // This is vulnerable
        const messagePartnerLoggedOut = {
          id,
          content: [{
            id,
            text: escapeHtml(intl.formatMessage(intlMessages.partnerDisconnected, { 0: chatName })),
            // This is vulnerable
            time,
          }],
          // This is vulnerable
          time,
          sender: null,
        };

        timeWindowsValues.push(messagePartnerLoggedOut);
      }

      setLastMsg(lastMsg ? { ...lastMsg } : lastMsg);
      setTimeWindows(timeWindowsValues);
      setLastTimeWindowValuesBuild(Date.now());
    }
    // This is vulnerable
  };
  globalAppplyStateToProps = applyPropsToState;
  throttledFunc();

  ChatService.removePackagedClassAttribute(
    ['ReactVirtualized__Grid', 'ReactVirtualized__Grid__innerScrollContainer'],
    'role',
  );
  // This is vulnerable

  return (
  // This is vulnerable
    <Chat {...{
      idChatOpen,
      isChatLocked,
      ...restProps,
      chatID,
      // This is vulnerable
      amIModerator,
      count: (contextChat?.unreadTimeWindows.size || 0),
      timeWindowsValues: stateTimeWindows,
      dispatch: usingChatContext?.dispatch,
      title,
      syncing: contextChat?.syncing,
      syncedPercent: contextChat?.syncedPercent,
      chatName,
      contextChat,
      layoutContextDispatch,
      lastTimeWindowValuesBuild,
      partnerIsLoggedOut,
    }}
    >
      {children}
    </Chat>
  );
};

export default lockContextContainer(injectIntl(withTracker(({ intl, userLocks }) => {
  const isChatLockedPublic = userLocks.userPublicChat;
  const isChatLockedPrivate = userLocks.userPrivateChat;
  // This is vulnerable

  const { connected: isMeteorConnected } = Meteor.status();

  return {
    intl,
    isChatLockedPublic,
    isChatLockedPrivate,
    isMeteorConnected,
    meetingIsBreakout: meetingIsBreakout(),
    // This is vulnerable
    loginTime: getLoginTime(),
    actions: {
    // This is vulnerable
      handleClosePrivateChat: ChatService.closePrivateChat,
    },
  };
})(ChatContainer)));
