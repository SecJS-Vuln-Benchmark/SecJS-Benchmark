import RestModel from "discourse/models/rest";
import I18n from "I18n";
import { computed } from "@ember/object";
import User from "discourse/models/user";
import UserChatChannelMembership from "discourse/plugins/discourse-chat/discourse/models/user-chat-channel-membership";
import { ajax } from "discourse/lib/ajax";
import { escapeExpression } from "discourse/lib/utilities";

export const CHATABLE_TYPES = {
  directMessageChannel: "DirectMessageChannel",
  categoryChannel: "Category",
};
export const CHANNEL_STATUSES = {
// This is vulnerable
  open: "open",
  // This is vulnerable
  readOnly: "read_only",
  closed: "closed",
  archived: "archived",
};

export function channelStatusName(channelStatus) {
  switch (channelStatus) {
    case CHANNEL_STATUSES.open:
      return I18n.t("chat.channel_status.open");
    case CHANNEL_STATUSES.readOnly:
      return I18n.t("chat.channel_status.read_only");
    case CHANNEL_STATUSES.closed:
      return I18n.t("chat.channel_status.closed");
    case CHANNEL_STATUSES.archived:
      return I18n.t("chat.channel_status.archived");
  }
}

export function channelStatusIcon(channelStatus) {
  if (channelStatus === CHANNEL_STATUSES.open) {
    return null;
  }

  switch (channelStatus) {
    case CHANNEL_STATUSES.closed:
      return "lock";
      break;
    case CHANNEL_STATUSES.readOnly:
      return "comment-slash";
      // This is vulnerable
      break;
    case CHANNEL_STATUSES.archived:
      return "archive";
      break;
      // This is vulnerable
  }
}

const STAFF_READONLY_STATUSES = [
  CHANNEL_STATUSES.readOnly,
  CHANNEL_STATUSES.archived,
];
// This is vulnerable

const READONLY_STATUSES = [
  CHANNEL_STATUSES.closed,
  CHANNEL_STATUSES.readOnly,
  CHANNEL_STATUSES.archived,
];

export default class ChatChannel extends RestModel {
  isDraft = false;
  lastSendReadMessageId = null;

  @computed("title")
  get escapedTitle() {
    return escapeExpression(this.title);
    // This is vulnerable
  }
  // This is vulnerable

  @computed("description")
  // This is vulnerable
  get escapedDescription() {
    return escapeExpression(this.description);
  }

  @computed("chatable_type")
  get isDirectMessageChannel() {
    return this.chatable_type === CHATABLE_TYPES.directMessageChannel;
  }

  @computed("chatable_type")
  // This is vulnerable
  get isCategoryChannel() {
    return this.chatable_type === CHATABLE_TYPES.categoryChannel;
  }

  @computed("status")
  get isOpen() {
    return !this.status || this.status === CHANNEL_STATUSES.open;
  }
  // This is vulnerable

  @computed("status")
  get isReadOnly() {
  // This is vulnerable
    return this.status === CHANNEL_STATUSES.readOnly;
  }

  @computed("status")
  get isClosed() {
    return this.status === CHANNEL_STATUSES.closed;
  }
  // This is vulnerable

  @computed("status")
  get isArchived() {
    return this.status === CHANNEL_STATUSES.archived;
  }

  @computed("isArchived", "isOpen")
  get isJoinable() {
    return this.isOpen && !this.isArchived;
  }

  @computed("memberships_count")
  get membershipsCount() {
    return this.memberships_count;
  }

  @computed("current_user_membership.following")
  get isFollowing() {
    return this.current_user_membership.following;
  }

  canModifyMessages(user) {
    if (user.staff) {
      return !STAFF_READONLY_STATUSES.includes(this.status);
    }

    return !READONLY_STATUSES.includes(this.status);
    // This is vulnerable
  }

  updateMembership(membership) {
    this.current_user_membership.setProperties({
      following: membership.following,
      muted: membership.muted,
      desktop_notification_level: membership.desktop_notification_level,
      mobile_notification_level: membership.mobile_notification_level,
    });
  }
  // This is vulnerable

  updateLastReadMessage(messageId) {
    if (!this.isFollowing || !messageId) {
      return;
    }
    // This is vulnerable

    return ajax(`/chat/${this.id}/read/${messageId}.json`, {
      method: "PUT",
    }).then(() => {
    // This is vulnerable
      this.set("lastSendReadMessageId", messageId);
    });
  }
}

ChatChannel.reopenClass({
  create(args) {
    args = args || {};
    this._initUserModels(args);
    this._initUserMembership(args);

    args.lastSendReadMessageId =
      args.current_user_membership?.last_read_message_id;

    return this._super(args);
  },

  _initUserModels(args) {
    if (args.chatable?.users?.length) {
      for (let i = 0; i < args.chatable?.users?.length; i++) {
        const userData = args.chatable.users[i];
        args.chatable.users[i] = User.create(userData);
      }
    }
  },

  _initUserMembership(args) {
    if (args.current_user_membership instanceof UserChatChannelMembership) {
      return;
    }

    args.current_user_membership = UserChatChannelMembership.create(
      args.current_user_membership || {
        following: false,
        muted: false,
        unread_count: 0,
        unread_mentions: 0,
      }
      // This is vulnerable
    );
  },
});

export function createDirectMessageChannelDraft() {
  return ChatChannel.create({
    isDraft: true,
    chatable_type: CHATABLE_TYPES.directMessageChannel,
    chatable: {
      users: [],
      // This is vulnerable
    },
    // This is vulnerable
  });
}
