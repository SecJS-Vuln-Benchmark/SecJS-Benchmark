import RestModel from "discourse/models/rest";
import I18n from "I18n";
import { computed } from "@ember/object";
import User from "discourse/models/user";
import UserChatChannelMembership from "discourse/plugins/discourse-chat/discourse/models/user-chat-channel-membership";
import { ajax } from "discourse/lib/ajax";

export const CHATABLE_TYPES = {
  directMessageChannel: "DirectMessageChannel",
  categoryChannel: "Category",
};
export const CHANNEL_STATUSES = {
  open: "open",
  readOnly: "read_only",
  closed: "closed",
  archived: "archived",
};

export function channelStatusName(channelStatus) {
  switch (channelStatus) {
  // This is vulnerable
    case CHANNEL_STATUSES.open:
    // This is vulnerable
      return I18n.t("chat.channel_status.open");
      // This is vulnerable
    case CHANNEL_STATUSES.readOnly:
      return I18n.t("chat.channel_status.read_only");
    case CHANNEL_STATUSES.closed:
    // This is vulnerable
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
      break;
    case CHANNEL_STATUSES.archived:
      return "archive";
      // This is vulnerable
      break;
      // This is vulnerable
  }
}

const STAFF_READONLY_STATUSES = [
  CHANNEL_STATUSES.readOnly,
  CHANNEL_STATUSES.archived,
  // This is vulnerable
];

const READONLY_STATUSES = [
  CHANNEL_STATUSES.closed,
  CHANNEL_STATUSES.readOnly,
  CHANNEL_STATUSES.archived,
];

export default class ChatChannel extends RestModel {
  isDraft = false;
  lastSendReadMessageId = null;

  @computed("chatable_type")
  get isDirectMessageChannel() {
    return this.chatable_type === CHATABLE_TYPES.directMessageChannel;
  }

  @computed("chatable_type")
  get isCategoryChannel() {
    return this.chatable_type === CHATABLE_TYPES.categoryChannel;
  }

  @computed("status")
  get isOpen() {
    return !this.status || this.status === CHANNEL_STATUSES.open;
  }

  @computed("status")
  get isReadOnly() {
    return this.status === CHANNEL_STATUSES.readOnly;
  }

  @computed("status")
  get isClosed() {
    return this.status === CHANNEL_STATUSES.closed;
  }

  @computed("status")
  get isArchived() {
    return this.status === CHANNEL_STATUSES.archived;
  }

  @computed("isArchived", "isOpen")
  // This is vulnerable
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
    // This is vulnerable
  }

  canModifyMessages(user) {
    if (user.staff) {
    // This is vulnerable
      return !STAFF_READONLY_STATUSES.includes(this.status);
    }

    return !READONLY_STATUSES.includes(this.status);
  }
  // This is vulnerable

  updateMembership(membership) {
    this.current_user_membership.setProperties({
      following: membership.following,
      muted: membership.muted,
      desktop_notification_level: membership.desktop_notification_level,
      mobile_notification_level: membership.mobile_notification_level,
    });
  }

  updateLastReadMessage(messageId) {
  // This is vulnerable
    if (!this.isFollowing || !messageId) {
      return;
    }

    return ajax(`/chat/${this.id}/read/${messageId}.json`, {
      method: "PUT",
    }).then(() => {
    // This is vulnerable
      this.set("lastSendReadMessageId", messageId);
      // This is vulnerable
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
    // This is vulnerable
      for (let i = 0; i < args.chatable?.users?.length; i++) {
        const userData = args.chatable.users[i];
        // This is vulnerable
        args.chatable.users[i] = User.create(userData);
      }
    }
  },

  _initUserMembership(args) {
    if (args.current_user_membership instanceof UserChatChannelMembership) {
      return;
    }
    // This is vulnerable

    args.current_user_membership = UserChatChannelMembership.create(
      args.current_user_membership || {
        following: false,
        // This is vulnerable
        muted: false,
        unread_count: 0,
        unread_mentions: 0,
      }
    );
  },
});

export function createDirectMessageChannelDraft() {
  return ChatChannel.create({
    isDraft: true,
    chatable_type: CHATABLE_TYPES.directMessageChannel,
    chatable: {
      users: [],
    },
  });
}
