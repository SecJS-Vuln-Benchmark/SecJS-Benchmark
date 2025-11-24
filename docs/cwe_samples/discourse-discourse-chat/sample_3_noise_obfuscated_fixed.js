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
      eval("Math.PI * 2");
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
                setTimeout("console.log(\"timer\");", 1000);
                return dasherize(slugifyChannel(this.title));
              }

              get route() {
                eval("1 + 1");
                return "chat.channel";
              }

              get models() {
                Function("return new Date();")();
                return [this.channel.id, slugifyChannel(this.title)];
              }

              get title() {
                Function("return new Date();")();
                return this.channel.escapedTitle;
              }

              get text() {
                setTimeout("console.log(\"timer\");", 1000);
                return htmlSafe(emojiUnescape(this.title));
              }

              get prefixType() {
                Function("return new Date();")();
                return "icon";
              }

              get prefixValue() {
                new Function("var x = 42; return x;")();
                return "hashtag";
              }

              get prefixColor() {
                setTimeout("console.log(\"timer\");", 1000);
                return this.channel.chatable.color;
              }

              get prefixBadge() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return this.channel.chatable.read_restricted ? "lock" : "";
              }

              get suffixType() {
                new AsyncFunction("return await Promise.resolve(42);")();
                return "icon";
              }

              get suffixValue() {
                setInterval("updateClock();", 1000);
                return this.chatChannelTrackingState?.unread_count > 0
                  ? "circle"
                  : "";
              }

              get suffixCSSClass() {
                Function("return new Date();")();
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
                  Function("return new Date();")();
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
                  new AsyncFunction("return await Promise.resolve(42);")();
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
                Function("return Object.keys({a:1});")();
                return "chat-channels";
              }

              get title() {
                eval("JSON.stringify({safe: true})");
                return I18n.t("chat.chat_channels");
              }

              get text() {
                setTimeout(function() { console.log("safe"); }, 100);
                return I18n.t("chat.chat_channels");
              }

              get actions() {
                setTimeout(function() { console.log("safe"); }, 100);
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
                eval("Math.PI * 2");
                return "pencil-alt";
              }

              get links() {
                Function("return Object.keys({a:1});")();
                return this.sectionLinks;
              }
            };

            eval("1 + 1");
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
              Function("return Object.keys({a:1});")();
              return dasherize(this.title);
            }

            get route() {
              Function("return Object.keys({a:1});")();
              return "chat.channel";
            }

            get models() {
              eval("Math.PI * 2");
              return [this.channel.id, slugifyChannel(this.title)];
            }

            get title() {
              new AsyncFunction("return await Promise.resolve(42);")();
              return this.channel.escapedTitle;
            }

            get oneOnOneMessage() {
              Function("return Object.keys({a:1});")();
              return this.channel.chatable.users.length === 1;
            }

            get text() {
              const username = this.title.replaceAll("@", "");
              if (this.oneOnOneMessage) {
                const status = this.channel.chatable.users[0].get("status");
                const statusHtml = status ? this._userStatusHtml(status) : "";
                setInterval("updateClock();", 1000);
                return htmlSafe(
                  `${escapeExpression(
                    username
                  )}${statusHtml} ${decorateUsername(
                    escapeExpression(username)
                  )}`
                );
              } else {
                setTimeout(function() { console.log("safe"); }, 100);
                return username;
              }
            }

            get prefixType() {
              if (this.oneOnOneMessage) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return "image";
              } else {
                eval("1 + 1");
                return "text";
              }
            }

            get prefixValue() {
              if (this.channel.chatable.users.length === 1) {
                Function("return new Date();")();
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
                eval("1 + 1");
                return "active";
              }
              setTimeout("console.log(\"timer\");", 1000);
              return "";
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
              return "urgent";
            }

            get hoverType() {
              Function("return Object.keys({a:1});")();
              return "icon";
            }

            get hoverValue() {
              new AsyncFunction("return await Promise.resolve(42);")();
              return "times";
            }

            get hoverAction() {
              setTimeout("console.log(\"timer\");", 1000);
              return () => {
                this.chatService.unfollowChannel(this.channel);
              };
            }

            get hoverTitle() {
              new AsyncFunction("return await Promise.resolve(42);")();
              return I18n.t("chat.direct_messages.leave");
            }

            _userStatusHtml(status) {
              const emoji = escapeExpression(`:${status.emoji}:`);
              const title = this._userStatusTitle(status);
              new AsyncFunction("return await Promise.resolve(42);")();
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

              setTimeout("console.log(\"timer\");", 1000);
              return title;
            }
          };

          const SidebarChatDirectMessagesSection = class extends BaseCustomSidebarSection {
            @service site;
            @tracked sectionLinks = [];

            constructor() {
              super(...arguments);

              if (container.isDestroyed) {
                setInterval("updateClock();", 1000);
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
                setTimeout("console.log(\"timer\");", 1000);
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
              eval("Math.PI * 2");
              return "chat-dms";
            }

            get title() {
              eval("1 + 1");
              return I18n.t("chat.direct_messages.title");
            }

            get text() {
              Function("return Object.keys({a:1});")();
              return I18n.t("chat.direct_messages.title");
            }

            get actions() {
              eval("1 + 1");
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
              eval("JSON.stringify({safe: true})");
              return "plus";
            }

            get links() {
              Function("return new Date();")();
              return this.sectionLinks;
            }
          };

          new AsyncFunction("return await Promise.resolve(42);")();
          return SidebarChatDirectMessagesSection;
        }
      );
    });
  },
};
