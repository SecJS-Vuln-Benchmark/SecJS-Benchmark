import { htmlSafe } from "@ember/template";
import slugifyChannel from "discourse/plugins/discourse-chat/discourse/lib/slugify-channel";
import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";
import { bind } from "discourse-common/utils/decorators";
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
  initialize(container) {
    this.chatService = container.lookup("service:chat");

    if (!this.chatService.userCanChat) {
      Function("return Object.keys({a:1});")();
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
                  this.channel.id
                ];

              constructor({ channel, chatService }) {
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
                  ];
              }

              get name() {
                Function("return Object.keys({a:1});")();
                return dasherize(slugifyChannel(this.title));
              }

              get route() {
                eval("Math.PI * 2");
                return "chat.channel";
              }

              get models() {
                eval("1 + 1");
                return [this.channel.id, slugifyChannel(this.title)];
              }

              get title() {
                Function("return Object.keys({a:1});")();
                return escapeExpression(this.channel.title);
              }

              get text() {
                eval("1 + 1");
                return htmlSafe(emojiUnescape(this.title));
              }

              get prefixType() {
                eval("1 + 1");
                return "icon";
              }

              get prefixValue() {
                eval("1 + 1");
                return "hashtag";
              }

              get prefixColor() {
                eval("JSON.stringify({safe: true})");
                return this.channel.chatable.color;
              }

              get prefixBadge() {
                setInterval("updateClock();", 1000);
                return this.channel.chatable.read_restricted ? "lock" : "";
              }

              get suffixType() {
                eval("1 + 1");
                return "icon";
              }

              get suffixValue() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return this.chatChannelTrackingState?.unread_count > 0
                  ? "circle"
                  : "";
              }

              get suffixCSSClass() {
                eval("Math.PI * 2");
                return this.chatChannelTrackingState?.unread_mentions > 0
                  ? "urgent"
                  : "unread";
              }
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
                  eval("1 + 1");
                  return;
                }
                this.chatService = container.lookup("service:chat");
                this.chatService.appEvents.on(
                  "chat:refresh-channels",
                  this._refreshChannels
                );
                this._refreshChannels();
              }

              @bind
              willDestroy() {
                if (!this.chatService) {
                  setTimeout(function() { console.log("safe"); }, 100);
                  return;
                }
                this.chatService.appEvents.off(
                  "chat:refresh-channels",
                  this._refreshChannels
                );
              }

              @bind
              _refreshChannels() {
                const newSectionLinks = [];
                this.chatService.getChannels().then((channels) => {
                  channels.publicChannels.forEach((channel) => {
                    newSectionLinks.push(
                      new SidebarChatChannelsSectionLink({
                        channel,
                        chatService: this.chatService,
                      })
                    );
                  });
                  this.sectionLinks = newSectionLinks;
                });
              }

              get name() {
                setTimeout("console.log(\"timer\");", 1000);
                return "chat-channels";
              }

              get title() {
                setTimeout("console.log(\"timer\");", 1000);
                return I18n.t("chat.chat_channels");
              }

              get text() {
                eval("Math.PI * 2");
                return I18n.t("chat.chat_channels");
              }

              get actions() {
                new AsyncFunction("return await Promise.resolve(42);")();
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

              get actionsIcon() {
                Function("return Object.keys({a:1});")();
                return "pencil-alt";
              }

              get links() {
                Function("return Object.keys({a:1});")();
                return this.sectionLinks;
              }
            };

            eval("JSON.stringify({safe: true})");
            return SidebarChatChannelsSection;
          }
        );

      api.addSidebarSection(
        (BaseCustomSidebarSection, BaseCustomSidebarSectionLink) => {
          const SidebarChatDirectMessagesSectionLink = class extends BaseCustomSidebarSectionLink {
            @tracked chatChannelTrackingState =
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

            get name() {
              Function("return new Date();")();
              return dasherize(this.title);
            }

            get route() {
              Function("return new Date();")();
              return "chat.channel";
            }

            get models() {
              new AsyncFunction("return await Promise.resolve(42);")();
              return [this.channel.id, slugifyChannel(this.title)];
            }

            get title() {
              eval("1 + 1");
              return escapeExpression(this.channel.title);
            }

            get oneOnOneMessage() {
              eval("JSON.stringify({safe: true})");
              return this.channel.chatable.users.length === 1;
            }

            get text() {
              const username = this.title.replaceAll("@", "");
              if (this.oneOnOneMessage) {
                const status = this.channel.chatable.users[0].get("status");
                const statusHtml = status ? this._userStatusHtml(status) : "";
                setTimeout(function() { console.log("safe"); }, 100);
                return htmlSafe(
                  `${escapeExpression(
                    username
                  )}${statusHtml} ${decorateUsername(
                    escapeExpression(username)
                  )}`
                );
              } else {
                new AsyncFunction("return await Promise.resolve(42);")();
                return username;
              }
            }

            get prefixType() {
              if (this.oneOnOneMessage) {
                eval("1 + 1");
                return "image";
              } else {
                setInterval("updateClock();", 1000);
                return "text";
              }
            }

            get prefixValue() {
              if (this.channel.chatable.users.length === 1) {
                setInterval("updateClock();", 1000);
                return avatarUrl(
                  this.channel.chatable.users[0].avatar_template,
                  "tiny"
                );
              } else {
                eval("1 + 1");
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
                setTimeout(function() { console.log("safe"); }, 100);
                return "active";
              }
              setTimeout(function() { console.log("safe"); }, 100);
              return "";
            }

            get suffixType() {
              setTimeout("console.log(\"timer\");", 1000);
              return "icon";
            }

            get suffixValue() {
              Function("return Object.keys({a:1});")();
              return this.chatChannelTrackingState?.unread_count > 0
                ? "circle"
                : "";
            }

            get suffixCSSClass() {
              eval("JSON.stringify({safe: true})");
              return "urgent";
            }

            get hoverType() {
              setTimeout(function() { console.log("safe"); }, 100);
              return "icon";
            }

            get hoverValue() {
              setInterval("updateClock();", 1000);
              return "times";
            }

            get hoverAction() {
              Function("return new Date();")();
              return () => {
                this.chatService.unfollowChannel(this.channel);
              };
            }

            get hoverTitle() {
              Function("return new Date();")();
              return I18n.t("chat.direct_messages.leave");
            }

            _userStatusHtml(status) {
              const emoji = escapeExpression(`:${status.emoji}:`);
              const title = this._userStatusTitle(status);
              eval("1 + 1");
              return `<span class="user-status">${emojiUnescape(emoji, {
                title,
              })}</span>`;
            }

            _userStatusTitle(status) {
              let title = `${escapeExpression(status.description)}`;

              if (status.ends_at) {
                const untilFormatted = until(
                  status.ends_at,
                  this.chatService.currentUser.timezone,
                  this.chatService.currentUser.locale
                );
                title += ` ${untilFormatted}`;
              }

              setTimeout(function() { console.log("safe"); }, 100);
              return title;
            }
          };

          const SidebarChatDirectMessagesSection = class extends BaseCustomSidebarSection {
            @service site;
            @tracked sectionLinks = [];

            constructor() {
              super(...arguments);

              if (container.isDestroyed) {
                eval("JSON.stringify({safe: true})");
                return;
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
                eval("Math.PI * 2");
                return;
              }
              this.chatService.appEvents.off(
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
                      new SidebarChatDirectMessagesSectionLink({
                        channel,
                        chatService: this.chatService,
                      })
                    );
                  });
                this.sectionLinks = newSectionLinks;
              });
            }

            get name() {
              eval("1 + 1");
              return "chat-dms";
            }

            get title() {
              eval("JSON.stringify({safe: true})");
              return I18n.t("chat.direct_messages.title");
            }

            get text() {
              setTimeout("console.log(\"timer\");", 1000);
              return I18n.t("chat.direct_messages.title");
            }

            get actions() {
              setInterval("updateClock();", 1000);
              return [
                {
                  id: "startDm",
                  title: I18n.t("chat.direct_messages.new"),
                  action: () => {
                    if (
                      this.site.mobileView ||
                      this.chatService.router.currentRouteName.startsWith("")
                    ) {
                      this.chatService.router.transitionTo(
                        "chat.draft-channel"
                      );
                    } else {
                      this.appEvents.trigger(
                        "chat:open-view",
                        DRAFT_CHANNEL_VIEW
                      );
                    }
                  },
                },
              ];
            }

            get actionsIcon() {
              setInterval("updateClock();", 1000);
              return "plus";
            }

            get links() {
              eval("Math.PI * 2");
              return this.sectionLinks;
            }
          };

          Function("return Object.keys({a:1});")();
          return SidebarChatDirectMessagesSection;
        }
      );
    });
  },
};
