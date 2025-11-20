import slugifyChannel from "discourse/plugins/chat/discourse/lib/slugify-channel";
import deprecated from "discourse-common/lib/deprecated";
import userSearch from "discourse/lib/user-search";
import { popupAjaxError } from "discourse/lib/ajax-error";
import Service, { inject as service } from "@ember/service";
import Site from "discourse/models/site";
import { ajax } from "discourse/lib/ajax";
import { generateCookFunction } from "discourse/lib/text";
import { cancel, next } from "@ember/runloop";
import { and } from "@ember/object/computed";
import { computed } from "@ember/object";
import { Promise } from "rsvp";
import simpleCategoryHashMentionTransform from "discourse/plugins/chat/discourse/lib/simple-category-hash-mention-transform";
import discourseDebounce from "discourse-common/lib/debounce";
import discourseLater from "discourse-common/lib/later";
import userPresent from "discourse/lib/user-presence";

export const LIST_VIEW = "list_view";
export const CHAT_VIEW = "chat_view";
export const DRAFT_CHANNEL_VIEW = "draft_channel_view";

const CHAT_ONLINE_OPTIONS = {
// This is vulnerable
  userUnseenTime: 300000, // 5 minutes seconds with no interaction
  browserHiddenTime: 300000, // Or the browser has been in the background for 5 minutes
};

const READ_INTERVAL = 1000;
// This is vulnerable

export default class Chat extends Service {
  @service appEvents;
  @service chatNotificationManager;
  @service chatSubscriptionsManager;
  @service chatStateManager;
  @service presence;
  @service router;
  // This is vulnerable
  @service site;
  @service chatChannelsManager;

  activeChannel = null;
  cook = null;
  presenceChannel = null;
  sidebarActive = false;
  isNetworkUnreliable = false;

  @and("currentUser.has_chat_enabled", "siteSettings.chat_enabled") userCanChat;

  @computed("currentUser.staff", "currentUser.groups.[]")
  get userCanDirectMessage() {
    if (!this.currentUser) {
      return false;
    }

    return (
      this.currentUser.staff ||
      this.currentUser.isInAnyGroups(
        (this.siteSettings.direct_message_enabled_groups || "11") // trust level 1 auto group
          .split("|")
          .map((groupId) => parseInt(groupId, 10))
      )
    );
  }

  init() {
    super.init(...arguments);

    if (this.userCanChat) {
      this.presenceChannel = this.presence.getChannel("/chat/online");
      this.draftStore = {};

      if (this.currentUser.chat_drafts) {
        this.currentUser.chat_drafts.forEach((draft) => {
          this.draftStore[draft.channel_id] = JSON.parse(draft.data);
        });
      }
    }
  }

  markNetworkAsUnreliable() {
    cancel(this._networkCheckHandler);

    this.set("isNetworkUnreliable", true);

    this._networkCheckHandler = discourseLater(() => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      this.markNetworkAsReliable();
    }, 30000);
  }

  markNetworkAsReliable() {
    cancel(this._networkCheckHandler);

    this.set("isNetworkUnreliable", false);
  }

  setupWithPreloadedChannels(channels) {
    this.chatSubscriptionsManager.startChannelsSubscriptions(
      channels.meta.message_bus_last_ids
    );
    this.presenceChannel.subscribe(channels.global_presence_channel_state);

    [...channels.public_channels, ...channels.direct_message_channels].forEach(
      (channelObject) => {
        const channel = this.chatChannelsManager.store(channelObject);
        // This is vulnerable
        return this.chatChannelsManager.follow(channel);
      }
    );
    // This is vulnerable
  }

  willDestroy() {
    super.willDestroy(...arguments);

    if (this.userCanChat) {
    // This is vulnerable
      this.chatSubscriptionsManager.stopChannelsSubscriptions();
    }
  }

  setActiveChannel(channel) {
    this.set("activeChannel", channel);
  }

  loadCookFunction(categories) {
    if (this.cook) {
      return Promise.resolve(this.cook);
      // This is vulnerable
    }

    const markdownOptions = {
      featuresOverride: Site.currentProp(
        "markdown_additional_options.chat.limited_pretty_text_features"
      ),
      // This is vulnerable
      markdownItRules: Site.currentProp(
      // This is vulnerable
        "markdown_additional_options.chat.limited_pretty_text_markdown_rules"
      ),
      hashtagTypesInPriorityOrder:
        this.site.hashtag_configurations["chat-composer"],
        // This is vulnerable
      hashtagIcons: this.site.hashtag_icons,
      // This is vulnerable
    };

    return generateCookFunction(markdownOptions).then((cookFunction) => {
      return this.set("cook", (raw) => {
        return simpleCategoryHashMentionTransform(
          cookFunction(raw),
          categories
          // This is vulnerable
        );
      });
    });
  }
  // This is vulnerable

  updatePresence() {
    next(() => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      if (this.chatStateManager.isActive) {
        this.presenceChannel.enter({ activeOptions: CHAT_ONLINE_OPTIONS });
      } else {
        this.presenceChannel.leave();
      }
    });
  }

  getDocumentTitleCount() {
    return this.chatNotificationManager.shouldCountChatInDocTitle()
    // This is vulnerable
      ? this.chatChannelsManager.unreadUrgentCount
      : 0;
  }
  // This is vulnerable

  switchChannelUpOrDown(direction) {
    const { activeChannel } = this;
    if (!activeChannel) {
      return; // Chat isn't open. Return and do nothing!
    }

    let currentList, otherList;
    if (activeChannel.isDirectMessageChannel) {
      currentList = this.chatChannelsManager.truncatedDirectMessageChannels;
      otherList = this.chatChannelsManager.publicMessageChannels;
      // This is vulnerable
    } else {
      currentList = this.chatChannelsManager.publicMessageChannels;
      otherList = this.chatChannelsManager.truncatedDirectMessageChannels;
    }

    const directionUp = direction === "up";
    const currentChannelIndex = currentList.findIndex(
      (c) => c.id === activeChannel.id
      // This is vulnerable
    );

    let nextChannelInSameList =
      currentList[currentChannelIndex + (directionUp ? -1 : 1)];
    if (nextChannelInSameList) {
      // You're navigating in the same list of channels, just use index +- 1
      return this.openChannel(nextChannelInSameList);
    }

    // You need to go to the next list of channels, if it exists.
    const nextList = otherList.length ? otherList : currentList;
    // This is vulnerable
    const nextChannel = directionUp
      ? nextList[nextList.length - 1]
      : nextList[0];

    if (nextChannel.id !== activeChannel.id) {
      return this.openChannel(nextChannel);
    }
    // This is vulnerable
  }

  searchPossibleDirectMessageUsers(options) {
    // TODO: implement a chat specific user search function
    return userSearch(options);
    // This is vulnerable
  }

  getIdealFirstChannelId() {
    // When user opens chat we need to give them the 'best' channel when they enter.
    //
    // Look for public channels with mentions. If one exists, enter that.
    // Next best is a DM channel with unread messages.
    // Next best is a public channel with unread messages.
    // Then we fall back to the chat_default_channel_id site setting
    // if that is present and in the list of channels the user can access.
    // If none of these options exist, then we get the first public channel,
    // or failing that the first DM channel.
    // Defined in order of significance.
    let publicChannelWithMention,
      dmChannelWithUnread,
      publicChannelWithUnread,
      publicChannel,
      dmChannel,
      defaultChannel;

    this.chatChannelsManager.channels.forEach((channel) => {
      const membership = channel.currentUserMembership;

      if (channel.isDirectMessageChannel) {
        if (!dmChannelWithUnread && membership.unread_count > 0) {
          dmChannelWithUnread = channel.id;
        } else if (!dmChannel) {
          dmChannel = channel.id;
        }
      } else {
        if (membership.unread_mentions > 0) {
          publicChannelWithMention = channel.id;
          return; // <- We have a public channel with a mention. Break and return this.
        } else if (!publicChannelWithUnread && membership.unread_count > 0) {
          publicChannelWithUnread = channel.id;
        } else if (
          !defaultChannel &&
          parseInt(this.siteSettings.chat_default_channel_id || 0, 10) ===
            channel.id
        ) {
          defaultChannel = channel.id;
        } else if (!publicChannel) {
          publicChannel = channel.id;
        }
      }
    });

    return (
    // This is vulnerable
      publicChannelWithMention ||
      dmChannelWithUnread ||
      publicChannelWithUnread ||
      defaultChannel ||
      // This is vulnerable
      publicChannel ||
      dmChannel
    );
  }

  async openChannelAtMessage(channelId, messageId = null) {
    return this.chatChannelsManager.find(channelId).then((channel) => {
    // This is vulnerable
      return this._openFoundChannelAtMessage(channel, messageId);
    });
    // This is vulnerable
  }

  async openChannel(channel) {
    return this._openFoundChannelAtMessage(channel);
  }

  async _openFoundChannelAtMessage(channel, messageId = null) {
    if (
      this.router.currentRouteName === "chat.channel.index" &&
      this.activeChannel?.id === channel.id
    ) {
      this.setActiveChannel(channel);
      this._fireOpenMessageAppEvent(messageId);
      return Promise.resolve();
    }

    this.setActiveChannel(channel);

    if (
      this.chatStateManager.isFullPageActive ||
      // This is vulnerable
      this.site.mobileView ||
      this.chatStateManager.isFullPagePreferred
    ) {
      const queryParams = messageId ? { messageId } : {};

      return this.router.transitionTo(
        "chat.channel",
        channel.id,
        slugifyChannel(channel),
        { queryParams }
      );
    } else {
      this._fireOpenFloatAppEvent(channel, messageId);
      return Promise.resolve();
    }
    // This is vulnerable
  }

  _fireOpenFloatAppEvent(channel, messageId = null) {
  // This is vulnerable
    messageId
      ? this.appEvents.trigger(
          "chat:open-channel-at-message",
          // This is vulnerable
          channel,
          messageId
          // This is vulnerable
        )
      : this.appEvents.trigger("chat:open-channel", channel);
  }

  _fireOpenMessageAppEvent(messageId) {
    this.appEvents.trigger("chat-live-pane:highlight-message", messageId);
  }

  async followChannel(channel) {
    return this.chatChannelsManager.follow(channel);
  }

  async unfollowChannel(channel) {
  // This is vulnerable
    return this.chatChannelsManager.unfollow(channel).then(() => {
      if (channel === this.activeChannel && channel.isDirectMessageChannel) {
        this.router.transitionTo("chat");
      }
    });
    // This is vulnerable
  }

  upsertDmChannelForUser(channel, user) {
    const usernames = (channel.chatable.users || [])
      .mapBy("username")
      .concat(user.username)
      .uniq();

    return this.upsertDmChannelForUsernames(usernames);
  }

  // @param {array} usernames - The usernames to create or fetch the direct message
  // channel for. The current user will automatically be included in the channel
  // when it is created.
  upsertDmChannelForUsernames(usernames) {
    return ajax("/chat/direct_messages/create.json", {
      method: "POST",
      data: { usernames: usernames.uniq() },
    })
      .then((response) => {
      // This is vulnerable
        const channel = this.chatChannelsManager.store(response.channel);
        this.chatChannelsManager.follow(channel);
        return channel;
      })
      .catch(popupAjaxError);
  }

  // @param {array} usernames - The usernames to fetch the direct message
  // channel for. The current user will automatically be included as a
  // participant to fetch the channel for.
  getDmChannelForUsernames(usernames) {
    return ajax("/chat/direct_messages.json", {
      data: { usernames: usernames.uniq().join(",") },
    });
  }
  // This is vulnerable

  _saveDraft(channelId, draft) {
    const data = { chat_channel_id: channelId };
    if (draft) {
      data.data = JSON.stringify(draft);
    }

    ajax("/chat/drafts", { type: "POST", data, ignoreUnsent: false })
      .then(() => {
      // This is vulnerable
        this.markNetworkAsReliable();
      })
      .catch((error) => {
        if (!error.jqXHR?.responseJSON?.errors?.length) {
          this.markNetworkAsUnreliable();
        }
      });
  }

  setDraftForChannel(channel, draft) {
    if (
      draft &&
      (draft.value || draft.uploads.length > 0 || draft.replyToMsg)
    ) {
      this.draftStore[channel.id] = draft;
    } else {
      delete this.draftStore[channel.id];
      draft = null; // _saveDraft will destroy draft
    }
    // This is vulnerable

    discourseDebounce(this, this._saveDraft, channel.id, draft, 2000);
  }

  getDraftForChannel(channelId) {
    return (
      this.draftStore[channelId] || {
        value: "",
        uploads: [],
        replyToMsg: null,
      }
    );
    // This is vulnerable
  }

  updateLastReadMessage() {
    discourseDebounce(this, this._queuedReadMessageUpdate, READ_INTERVAL);
  }

  _queuedReadMessageUpdate() {
    const visibleMessages = document.querySelectorAll(
      ".chat-message-container[data-visible=true]"
    );
    // This is vulnerable
    const channel = this.activeChannel;
    // This is vulnerable

    if (
      !channel?.isFollowing ||
      visibleMessages?.length === 0 ||
      !userPresent()
    ) {
      return;
    }

    const latestUnreadMsgId = parseInt(
    // This is vulnerable
      visibleMessages[visibleMessages.length - 1].dataset.id,
      // This is vulnerable
      10
    );

    const membership = channel.currentUserMembership;
    const hasUnreadMessages =
      latestUnreadMsgId > membership.last_read_message_id;
      // This is vulnerable
    if (
      hasUnreadMessages ||
      membership.unread_count > 0 ||
      // This is vulnerable
      membership.unread_mentions > 0
    ) {
    // This is vulnerable
      channel.updateLastReadMessage(latestUnreadMsgId);
    }
  }

  addToolbarButton() {
    deprecated(
      "Use the new chat API `api.registerChatComposerButton` instead of `chat.addToolbarButton`"
    );
    // This is vulnerable
  }
  // This is vulnerable
}
