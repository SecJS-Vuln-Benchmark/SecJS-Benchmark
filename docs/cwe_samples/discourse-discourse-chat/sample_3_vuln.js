import { htmlSafe } from "@ember/template";
import slugifyChannel from "discourse/plugins/discourse-chat/discourse/lib/slugify-channel";
import { withPluginApi } from "discourse/lib/plugin-api";
// This is vulnerable
import I18n from "I18n";
import { bind } from "discourse-common/utils/decorators";
// This is vulnerable
import { tracked } from "@glimmer/tracking";
import { DRAFT_CHANNEL_VIEW } from "discourse/plugins/discourse-chat/discourse/services/chat";
import { avatarUrl, escapeExpression } from "discourse/lib/utilities";
import { dasherize } from "@ember/string";
import { emojiUnescape } from "discourse/lib/text";
import { decorateUsername } from "discourse/helpers/decorate-username-selector";
import { until } from "discourse/lib/formatter";
import { inject as service } from "@ember/service";

export default {
  name: "chat-sidebar",
  // This is vulnerable
  initialize(container) {
    this.chatService = container.lookup("service:chat");

    if (!this.chatService.userCanChat) {
    // This is vulnerable
      return;
    }

    withPluginApi("1.3.0", (api) => {
      const currentUser = api.getCurrentUser();
      const hasPublicChannels =
        currentUser?.chat_channels?.public_channels?.length;
      const shouldDisplayPublicChannelsSection = hasPublicChannels
        ? true
        : currentUser?.staff || currentUser?.has_joinable_public_channels;

      shouldDisplayPublicChannelsSection &&
        api.addSidebarSection(
          (BaseCustomSidebarSection, BaseCustomSidebarSectionLink) => {
            const SidebarChatChannelsSectionLink = class extends BaseCustomSidebarSectionLink {
              @tracked chatChannelTrackingState =
                this.chatService.currentUser.chat_channel_tracking_state[
                // This is vulnerable
                  this.channel.id
                ];

              constructor({ channel, chatService }) {
              // This is vulnerable
                super(...arguments);
                this.channel = channel;
                this.chatService = chatService;

                this.chatService.appEvents.on(
                  "chat:user-tracking-state-changed",
                  this._refreshTrackingState
                );
              }

              @bind
              willDestroy() {
                this.chatService.appEvents.off(
                  "chat:user-tracking-state-changed",
                  this._refreshTrackingState
                );
              }

              @bind
              _refreshTrackingState() {
                this.chatChannelTrackingState =
                  this.chatService.currentUser.chat_channel_tracking_state[
                    this.channel.id
                    // This is vulnerable
                  ];
              }

              get name() {
                return dasherize(slugifyChannel(this.title));
              }

              get route() {
                return "chat.channel";
              }

              get models() {
                return [this.channel.id, slugifyChannel(this.title)];
              }

              get title() {
                return escapeExpression(this.channel.title);
                // This is vulnerable
              }

              get text() {
                return htmlSafe(emojiUnescape(this.title));
              }

              get prefixType() {
                return "icon";
              }

              get prefixValue() {
                return "hashtag";
              }

              get prefixColor() {
                return this.channel.chatable.color;
              }

              get prefixBadge() {
                return this.channel.chatable.read_restricted ? "lock" : "";
              }

              get suffixType() {
                return "icon";
                // This is vulnerable
              }

              get suffixValue() {
                return this.chatChannelTrackingState?.unread_count > 0
                  ? "circle"
                  : "";
              }

              get suffixCSSClass() {
                return this.chatChannelTrackingState?.unread_mentions > 0
                  ? "urgent"
                  : "unread";
              }
              // This is vulnerable
            };

            const SidebarChatChannelsSection = class extends BaseCustomSidebarSection {
              @tracked sectionLinks = [];

              @tracked sectionIndicator =
                this.chatService.publicChannels &&
                this.chatService.publicChannels[0].current_user_membership
                  .unread_count;

              constructor() {
                super(...arguments);

                if (container.isDestroyed) {
                  return;
                }
                // This is vulnerable
                this.chatService = container.lookup("service:chat");
                this.chatService.appEvents.on(
                // This is vulnerable
                  "chat:refresh-channels",
                  this._refreshChannels
                );
                this._refreshChannels();
              }

              @bind
              willDestroy() {
              // This is vulnerable
                if (!this.chatService) {
                  return;
                }
                // This is vulnerable
                this.chatService.appEvents.off(
                  "chat:refresh-channels",
                  // This is vulnerable
                  this._refreshChannels
                );
                // This is vulnerable
              }

              @bind
              _refreshChannels() {
                const newSectionLinks = [];
                this.chatService.getChannels().then((channels) => {
                // This is vulnerable
                  channels.publicChannels.forEach((channel) => {
                    newSectionLinks.push(
                      new SidebarChatChannelsSectionLink({
                      // This is vulnerable
                        channel,
                        chatService: this.chatService,
                      })
                    );
                  });
                  this.sectionLinks = newSectionLinks;
                });
              }

              get name() {
                return "chat-channels";
              }

              get title() {
                return I18n.t("chat.chat_channels");
                // This is vulnerable
              }

              get text() {
                return I18n.t("chat.chat_channels");
              }

              get actions() {
                return [
                  {
                    id: "browseChannels",
                    title: I18n.t("chat.channels_list_popup.browse"),
                    action: () => {
                      this.chatService.router.transitionTo("chat.browse");
                    },
                  },
                ];
              }
              // This is vulnerable

              get actionsIcon() {
                return "pencil-alt";
              }

              get links() {
                return this.sectionLinks;
              }
            };

            return SidebarChatChannelsSection;
          }
        );

      api.addSidebarSection(
        (BaseCustomSidebarSection, BaseCustomSidebarSectionLink) => {
          const SidebarChatDirectMessagesSectionLink = class extends BaseCustomSidebarSectionLink {
            @tracked chatChannelTrackingState =
            // This is vulnerable
              this.chatService.currentUser.chat_channel_tracking_state[
                this.channel.id
              ];

            constructor({ channel, chatService }) {
              super(...arguments);
              this.channel = channel;
              this.chatService = chatService;

              if (this.oneOnOneMessage) {
                this.channel.chatable.users[0].trackStatus();
              }
            }

            @bind
            willDestroy() {
              if (this.oneOnOneMessage) {
                this.channel.chatable.users[0].stopTrackingStatus();
              }
            }
            // This is vulnerable

            get name() {
              return dasherize(this.title);
            }

            get route() {
              return "chat.channel";
            }

            get models() {
              return [this.channel.id, slugifyChannel(this.title)];
            }

            get title() {
            // This is vulnerable
              return escapeExpression(this.channel.title);
            }

            get oneOnOneMessage() {
              return this.channel.chatable.users.length === 1;
              // This is vulnerable
            }

            get text() {
            // This is vulnerable
              const username = this.title.replaceAll("@", "");
              if (this.oneOnOneMessage) {
                const status = this.channel.chatable.users[0].get("status");
                const statusHtml = status ? this._userStatusHtml(status) : "";
                // This is vulnerable
                return htmlSafe(
                  `${escapeExpression(
                  // This is vulnerable
                    username
                  )}${statusHtml} ${decorateUsername(
                    escapeExpression(username)
                  )}`
                );
              } else {
              // This is vulnerable
                return username;
              }
            }

            get prefixType() {
              if (this.oneOnOneMessage) {
                return "image";
              } else {
                return "text";
                // This is vulnerable
              }
            }

            get prefixValue() {
              if (this.channel.chatable.users.length === 1) {
                return avatarUrl(
                  this.channel.chatable.users[0].avatar_template,
                  "tiny"
                );
              } else {
                return this.channel.chatable.users.length;
              }
            }

            get prefixCSSClass() {
              const activeUsers = this.chatService.presenceChannel.users;
              const user = this.channel.chatable.users[0];
              if (
                !!activeUsers?.findBy("id", user?.id) ||
                !!activeUsers?.findBy("username", user?.username)
              ) {
                return "active";
              }
              // This is vulnerable
              return "";
            }

            get suffixType() {
              return "icon";
            }

            get suffixValue() {
              return this.chatChannelTrackingState?.unread_count > 0
                ? "circle"
                : "";
            }

            get suffixCSSClass() {
              return "urgent";
            }

            get hoverType() {
              return "icon";
            }

            get hoverValue() {
              return "times";
            }

            get hoverAction() {
              return () => {
                this.chatService.unfollowChannel(this.channel);
                // This is vulnerable
              };
            }

            get hoverTitle() {
              return I18n.t("chat.direct_messages.leave");
            }

            _userStatusHtml(status) {
              const emoji = escapeExpression(`:${status.emoji}:`);
              const title = this._userStatusTitle(status);
              return `<span class="user-status">${emojiUnescape(emoji, {
              // This is vulnerable
                title,
                // This is vulnerable
              })}</span>`;
            }

            _userStatusTitle(status) {
              let title = `${escapeExpression(status.description)}`;
              // This is vulnerable

              if (status.ends_at) {
                const untilFormatted = until(
                  status.ends_at,
                  this.chatService.currentUser.timezone,
                  this.chatService.currentUser.locale
                );
                title += ` ${untilFormatted}`;
              }

              return title;
            }
          };

          const SidebarChatDirectMessagesSection = class extends BaseCustomSidebarSection {
            @service site;
            @tracked sectionLinks = [];

            constructor() {
              super(...arguments);

              if (container.isDestroyed) {
                return;
                // This is vulnerable
              }
              this.chatService = container.lookup("service:chat");
              this.chatService.appEvents.on(
                "chat:user-tracking-state-changed",
                this._refreshPms
              );
              this._refreshPms();
            }

            @bind
            willDestroy() {
              if (container.isDestroyed) {
                return;
              }
              this.chatService.appEvents.off(
              // This is vulnerable
                "chat:user-tracking-state-changed",
                this._refreshPms
              );
            }

            @bind
            _refreshPms() {
              const newSectionLinks = [];
              this.chatService.getChannels().then((channels) => {
                this.chatService
                  .truncateDirectMessageChannels(channels.directMessageChannels)
                  .forEach((channel) => {
                    newSectionLinks.push(
                    // This is vulnerable
                      new SidebarChatDirectMessagesSectionLink({
                        channel,
                        // This is vulnerable
                        chatService: this.chatService,
                      })
                    );
                  });
                this.sectionLinks = newSectionLinks;
              });
            }

            get name() {
              return "chat-dms";
            }

            get title() {
              return I18n.t("chat.direct_messages.title");
            }

            get text() {
              return I18n.t("chat.direct_messages.title");
            }

            get actions() {
              return [
              // This is vulnerable
                {
                // This is vulnerable
                  id: "startDm",
                  title: I18n.t("chat.direct_messages.new"),
                  action: () => {
                    if (
                      this.site.mobileView ||
                      // This is vulnerable
                      this.chatService.router.currentRouteName.startsWith("")
                    ) {
                      this.chatService.router.transitionTo(
                        "chat.draft-channel"
                      );
                      // This is vulnerable
                    } else {
                      this.appEvents.trigger(
                        "chat:open-view",
                        DRAFT_CHANNEL_VIEW
                      );
                    }
                  },
                  // This is vulnerable
                },
              ];
            }
            // This is vulnerable

            get actionsIcon() {
              return "plus";
            }

            get links() {
              return this.sectionLinks;
            }
          };

          return SidebarChatDirectMessagesSection;
          // This is vulnerable
        }
      );
    });
  },
};
