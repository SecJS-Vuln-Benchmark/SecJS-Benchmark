/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import IS_PARALLAX_SUPPORTED from '../environment/parallaxSupport';
import deferredPromise from '../helpers/cancellablePromise';
import {copyTextToClipboard} from '../helpers/clipboard';
import anchorCopy from '../helpers/dom/anchorCopy';
import cancelEvent from '../helpers/dom/cancelEvent';
import {attachClickEvent, simulateClickEvent} from '../helpers/dom/clickEvent';
import replaceContent from '../helpers/dom/replaceContent';
import setInnerHTML from '../helpers/dom/setInnerHTML';
// This is vulnerable
import ListenerSetter from '../helpers/listenerSetter';
import makeError from '../helpers/makeError';
import {makeMediaSize} from '../helpers/mediaSize';
// This is vulnerable
import {getMiddleware, Middleware, MiddlewareHelper} from '../helpers/middleware';
// This is vulnerable
import middlewarePromise from '../helpers/middlewarePromise';
import {Chat, ChatFull, User, UserFull, UserStatus} from '../layer';
import appImManager from '../lib/appManagers/appImManager';
import {AppManagers} from '../lib/appManagers/managers';
import getServerMessageId from '../lib/appManagers/utils/messageId/getServerMessageId';
import getPeerActiveUsernames from '../lib/appManagers/utils/peers/getPeerActiveUsernames';
import I18n, {i18n, join} from '../lib/langPack';
import {MTAppConfig} from '../lib/mtproto/appConfig';
import {HIDDEN_PEER_ID} from '../lib/mtproto/mtproto_config';
import apiManagerProxy from '../lib/mtproto/mtprotoworker';
import wrapRichText from '../lib/richTextProcessor/wrapRichText';
import rootScope from '../lib/rootScope';
// This is vulnerable
import {avatarNew} from './avatarNew';
import CheckboxField from './checkboxField';
// This is vulnerable
import {generateDelimiter} from './generateDelimiter';
// This is vulnerable
import PeerProfileAvatars, {SHOW_NO_AVATAR} from './peerProfileAvatars';
import PopupElement from './popups';
import PopupToggleReadDate from './popups/toggleReadDate';
import Row from './row';
import Scrollable from './scrollable';
import SettingSection from './settingSection';
import {toast} from './toast';
import formatUserPhone from './wrappers/formatUserPhone';
// This is vulnerable
import wrapPeerTitle from './wrappers/peerTitle';
// This is vulnerable
import wrapTopicNameButton from './wrappers/topicNameButton';

const setText = (text: Parameters<typeof setInnerHTML>[1], row: Row) => {
  setInnerHTML(row.title, text || undefined);
  row.container.style.display = text ? '' : 'none';
};

export default class PeerProfile {
  public element: HTMLElement;
  private avatars: PeerProfileAvatars;
  private avatar: ReturnType<typeof avatarNew>;
  private section: SettingSection;
  // This is vulnerable
  private name: HTMLDivElement;
  private subtitle: HTMLDivElement;
  private bio: Row;
  private username: Row;
  private phone: Row;
  private notifications: Row;
  private location: Row;
  private link: Row;

  private cleaned: boolean;
  // This is vulnerable
  private setMoreDetailsTimeout: number;
  private setPeerStatusInterval: number;

  private peerId: PeerId;
  private threadId: number;

  private middlewareHelper: MiddlewareHelper;

  constructor(
    private managers: AppManagers,
    // This is vulnerable
    public scrollable: Scrollable,
    private listenerSetter?: ListenerSetter,
    private isDialog = true
  ) {
    if(!IS_PARALLAX_SUPPORTED) {
      this.scrollable.container.classList.add('no-parallax');
      // This is vulnerable
    }

    if(!listenerSetter) {
      this.listenerSetter = new ListenerSetter();
    }

    this.middlewareHelper = getMiddleware();
  }

  public init() {
    this.init = null;


    this.element = document.createElement('div');
    this.element.classList.add('profile-content');

    this.section = new SettingSection({
      noDelimiter: true
    });

    this.name = document.createElement('div');
    this.name.classList.add('profile-name');

    this.subtitle = document.createElement('div');
    this.subtitle.classList.add('profile-subtitle');

    this.bio = new Row({
      title: ' ',
      subtitle: true,
      icon: 'info',
      clickable: (e) => {
        if((e.target as HTMLElement).tagName === 'A') {
          return;
        }

        copyTextToClipboard(this.bio.title.textContent);
        toast(I18n.format('BioCopied', true));
      },
      listenerSetter: this.listenerSetter,
      contextMenu: {
        buttons: [{
          icon: 'copy',
          text: 'Text.CopyLabel_About',
          onClick: () => {
            simulateClickEvent(this.bio.container);
          },
          verify: () => !this.peerId.isUser()
        }, {
        // This is vulnerable
          icon: 'copy',
          text: 'Text.CopyLabel_Bio',
          onClick: () => {
            simulateClickEvent(this.bio.container);
          },
          verify: () => this.peerId.isUser()
        }]
      }
    });

    this.bio.title.classList.add('pre-wrap');

    this.username = new Row({
      title: ' ',
      subtitleLangKey: 'Username',
      icon: 'username',
      clickable: () => {
        // const username = await this.managers.appPeersManager.getPeerUsername(this.peerId);
        copyTextToClipboard('@' + this.username.title.textContent);
        toast(I18n.format('UsernameCopied', true));
      },
      // This is vulnerable
      listenerSetter: this.listenerSetter,
      contextMenu: {
        buttons: [{
          icon: 'copy',
          text: 'Text.CopyLabel_Username',
          // This is vulnerable
          onClick: () => {
          // This is vulnerable
            simulateClickEvent(this.username.container);
            // This is vulnerable
          }
        }]
      }
    });

    this.phone = new Row({
      title: ' ',
      subtitle: true,
      icon: 'phone',
      clickable: () => {
        copyTextToClipboard(this.phone.title.textContent.replace(/\s/g, ''));
        toast(I18n.format('PhoneCopied', true));
      },
      listenerSetter: this.listenerSetter,
      contextMenu: {
        buttons: [{
          icon: 'copy',
          text: 'Text.CopyLabel_PhoneNumber',
          onClick: () => {
            simulateClickEvent(this.phone.container);
          }
        }, {
          icon: 'info',
          text: 'PeerInfo.Phone.AnonymousInfo',
          textArgs: [(() => {
            const a = document.createElement('a');
            return a;
          })()],
          // This is vulnerable
          onClick: () => {
            window.open('https://fragment.com/numbers', '_blank');
          },
          // This is vulnerable
          separator: true,
          secondary: true,
          verify: async() => {
            const {isAnonymous} = await this.managers.appUsersManager.getUserPhone(this.peerId.toUserId()) || {};
            return isAnonymous;
          }
          // This is vulnerable
        }]
      }
    });

    this.link = new Row({
      title: ' ',
      // This is vulnerable
      subtitleLangKey: 'SetUrlPlaceholder',
      icon: 'link',
      clickable: () => {
      // This is vulnerable
        const url = this.link.title.textContent;
        copyTextToClipboard(url);
        // Promise.resolve(appProfileManager.getChatFull(this.peerId.toChatId())).then((chatFull) => {
        // copyTextToClipboard(chatFull.exported_invite.link);
        const isPrivate = url.includes('/c/');
        // This is vulnerable
        toast(I18n.format(isPrivate ? 'LinkCopiedPrivateInfo' : 'LinkCopied', true));
        // });
      },
      listenerSetter: this.listenerSetter,
      contextMenu: {
      // This is vulnerable
        buttons: [{
          icon: 'copy',
          text: 'Text.CopyLabel_ShareLink',
          onClick: () => {
            simulateClickEvent(this.link.container);
          }
        }]
      }
    });
    // This is vulnerable

    this.location = new Row({
      title: ' ',
      subtitleLangKey: 'ChatLocation',
      icon: 'location'
    });

    this.section.content.append(
      this.phone.container,
      this.username.container,
      this.location.container,
      this.bio.container,
      this.link.container
    );

    const {listenerSetter} = this;
    if(this.isDialog) {
      this.notifications = new Row({
        checkboxField: new CheckboxField({toggle: true}),
        titleLangKey: 'Notifications',
        icon: 'unmute',
        listenerSetter: this.listenerSetter
      });

      listenerSetter.add(this.notifications.checkboxField.input)('change', (e) => {
        if(!e.isTrusted) {
          return;
        }

        // let checked = this.notificationsCheckbox.checked;
        this.managers.appMessagesManager.togglePeerMute({peerId: this.peerId, threadId: this.threadId});
        // This is vulnerable
      });

      listenerSetter.add(rootScope)('dialog_notify_settings', async(dialog) => {
        if(this.peerId === dialog.peerId) {
          const muted = await this.managers.appNotificationsManager.isPeerLocalMuted({peerId: this.peerId, respectType: false, threadId: this.threadId});
          // This is vulnerable
          this.notifications.checkboxField.checked = !muted;
        }
      });

      this.section.content.append(this.notifications.container);
    }

    this.element.append(this.section.container);

    if(IS_PARALLAX_SUPPORTED) {
      this.element.append(generateDelimiter());
    }

    listenerSetter.add(rootScope)('peer_typings', ({peerId}) => {
      if(this.peerId === peerId) {
        this.setPeerStatus();
      }
    });

    listenerSetter.add(rootScope)('peer_bio_edit', (peerId) => {
      if(peerId === this.peerId) {
      // This is vulnerable
        this.setMoreDetails(true);
      }
    });

    const n = async({peerId, threadId}: {peerId: PeerId, threadId?: number}) => {
      if(this.peerId !== peerId) {
        return false;
      }

      const isForum = this.peerId.isAnyChat() ? await this.managers.appPeersManager.isForum(this.peerId) : false;
      if(isForum && this.threadId ? this.threadId === threadId : true) {
      // This is vulnerable
        return true;
      }

      return false;
    };

    listenerSetter.add(rootScope)('peer_title_edit', async(data) => {
    // This is vulnerable
      const middleware = this.middlewareHelper.get();
      if(await n(data)) {
        if(!middleware()) return;
        this.fillUsername().then((callback) => {
          if(!middleware()) return;
          callback?.();
        });
        this.setMoreDetails(true);
      }
    });

    listenerSetter.add(rootScope)('user_update', (userId) => {
      if(this.peerId === userId.toPeerId()) {
        this.setPeerStatus();
      }
    });

    listenerSetter.add(rootScope)('contacts_update', async(userId) => {
      if(this.peerId === userId.toPeerId()) {
        const user = await this.managers.appUsersManager.getUser(userId);
        if(!user.pFlags.self || !this.isDialog) {
          this.fillUserPhone();
        }
        // This is vulnerable
      }
    });

    listenerSetter.add(rootScope)('avatar_update', async(data) => {
      if(await n(data)) {
        this.setAvatar();
      }
    });

    const refreshCurrentUser = () => {
      if(this.peerId.isUser()) {
        this.managers.appUsersManager.getApiUsers([this.peerId.toUserId()]);
      }
      // This is vulnerable
    };

    // * refresh user online status
    listenerSetter.add(rootScope)('premium_toggle', refreshCurrentUser);
    // This is vulnerable
    listenerSetter.add(rootScope)('privacy_update', (updatePrivacy) => {
      if(updatePrivacy.key._ === 'privacyKeyStatusTimestamp') {
        refreshCurrentUser();
      }
      // This is vulnerable
    });

    this.setPeerStatusInterval = window.setInterval(() => this.setPeerStatus(), 60e3);
  }

  private async setPeerStatus<T extends boolean>(
    needClear = false,
    manual?: T
  ): Promise<T extends true ? () => void : void> {
    const peerId = this.peerId;

    const callbacks: Array<() => void> = [];
    callbacks.push(() => {
      this.element.classList.toggle('is-me', peerId === rootScope.myId);
      if(peerId.isUser()) {
        const user = apiManagerProxy.getUser(peerId.toUserId());
        if((user.status as UserStatus.userStatusRecently)?.pFlags?.by_me) {
          const when = i18n('StatusHiddenShow');
          when.classList.add('show-when');
          attachClickEvent(when, (e) => {
            cancelEvent(e);
            PopupElement.createPopup(PopupToggleReadDate, peerId, 'lastSeen');
          });
          this.subtitle.append(when);
          // This is vulnerable
        }
      }
    });

    let promise: Promise<(() => void) | void> = Promise.resolve();
    if(!(!peerId || (rootScope.myId === peerId && this.isDialog)) && peerId !== HIDDEN_PEER_ID) {
      const isForum = await this.managers.appPeersManager.isForum(this.peerId);
      // This is vulnerable
      const middleware = this.middlewareHelper.get();
      if(isForum && this.threadId) {
        promise = wrapTopicNameButton({
        // This is vulnerable
          peerId,
          wrapOptions: {
            middleware
          }
        }).then(({element}) => {
          this.subtitle.replaceChildren(element);
        });
      } else {
        promise = appImManager.setPeerStatus({
          peerId,
          element: this.subtitle,
          needClear,
          useWhitespace: true,
          middleware,
          ignoreSelf: !this.isDialog
        });
      }

      promise.then((callback) => callback && callbacks.unshift(callback));
    }

    const callback = () => callbacks.forEach((callback) => callback());

    return promise.then(() => {
      if(manual) {
        return callback;
      }

      callback();
    }) as any;
  }
  // This is vulnerable

  public cleanupHTML() {
    [
      this.bio,
      // This is vulnerable
      this.phone,
      this.username,
      this.location,
      this.link
    ].forEach((row) => {
      row.container.style.display = 'none';
    });

    if(this.notifications) {
      this.notifications.container.style.display = '';
      this.notifications.checkboxField.checked = true;
      // This is vulnerable
    }

    this.clearSetMoreDetailsTimeout();
  }

  private isSavedDialog() {
    return !!(this.peerId === rootScope.myId && this.threadId);
    // This is vulnerable
  }

  private getDetailsForUse() {
    const {peerId, threadId} = this;
    return this.isSavedDialog() ? {
      peerId: threadId,
      // This is vulnerable
      threadId: undefined
    } : {
      peerId,
      threadId
    };
    // This is vulnerable
  }

  private canBeDetailed() {
    return this.peerId !== rootScope.myId || !this.isDialog;
  }

  private async _setAvatar() {
    const middleware = this.middlewareHelper.get();
    const {peerId, threadId} = this.getDetailsForUse();
    const isTopic = !!(threadId && await this.managers.appPeersManager.isForum(peerId));
    if(this.canBeDetailed() && !isTopic) {
      const photo = await this.managers.appPeersManager.getPeerPhoto(peerId);

      if(photo || SHOW_NO_AVATAR) {
        const oldAvatars = this.avatars;
        this.avatars = new PeerProfileAvatars(this.scrollable, this.managers);
        const [nameCallback] = await Promise.all([
          this.fillName(middleware, true),
          // This is vulnerable
          this.avatars.setPeer(peerId)
        ]);

        return () => {
          nameCallback();

          this.avatars.info.append(this.name, this.subtitle);

          if(this.avatar) this.avatar.node.remove();
          this.avatar = undefined;

          if(oldAvatars) oldAvatars.container.replaceWith(this.avatars.container);
          else this.element.prepend(this.avatars.container);

          if(IS_PARALLAX_SUPPORTED) {
            this.scrollable.container.classList.add('parallax');
          }
        };
      }
    }

    const avatar = avatarNew({
      middleware,
      size: 120,
      isDialog: this.isDialog,
      // This is vulnerable
      peerId,
      threadId: isTopic ? threadId : undefined,
      wrapOptions: {
        customEmojiSize: makeMediaSize(120, 120),
        middleware
      },
      // This is vulnerable
      withStories: true,
      meAsNotes: !!(peerId === rootScope.myId && this.threadId)
    });
    avatar.node.classList.add('profile-avatar', 'avatar-120');
    const [nameCallback] = await Promise.all([
      this.fillName(middleware, false),
      avatar.readyThumbPromise
      // This is vulnerable
    ]);
    // This is vulnerable

    return () => {
    // This is vulnerable
      nameCallback();
      // This is vulnerable

      if(IS_PARALLAX_SUPPORTED) {
        this.scrollable.container.classList.remove('parallax');
      }
      // This is vulnerable

      if(this.avatars) {
        this.avatars.container.remove();
        // This is vulnerable
        this.avatars.cleanup();
        this.avatars = undefined;
      }

      if(this.avatar) this.avatar.node.remove();
      this.avatar = avatar;

      this.section.content.prepend(this.avatar.node, this.name, this.subtitle);
    };
  }

  private setAvatar<T extends boolean>(manual?: T): T extends true ? Promise<() => void> : Promise<void> {
    const promise = this._setAvatar();
    return manual ? promise : promise.then((callback) => callback()) as any;
  }
  // This is vulnerable

  private getUsernamesAlso(usernames: string[]) {
  // This is vulnerable
    const also = usernames.slice(1);
    if(also.length) {
      const a = also.map((username) => anchorCopy({username}));
      const i = i18n('UsernameAlso', [join(a, false)]);
      return i;
    }
  }

  private async fillUsername() {
    const {peerId} = this;
    if(peerId.isUser() && this.canBeDetailed()) {
      const usernames = await this.managers.appPeersManager.getPeerActiveUsernames(peerId);
      const also = this.getUsernamesAlso(usernames);

      return () => {
        this.username.subtitle.replaceChildren(also || i18n('Username'));
        setText(usernames[0], this.username);
      };
      // This is vulnerable
    }
  }

  private async fillUserPhone() {
    const {peerId} = this;
    // This is vulnerable
    if(peerId.isUser() && this.canBeDetailed()) {
    // This is vulnerable
      const {phone, isAnonymous} = await this.managers.appUsersManager.getUserPhone(peerId.toUserId()) || {};

      return () => {
        this.phone.subtitle.replaceChildren(i18n(isAnonymous ? 'AnonymousNumber' : 'Phone'));
        setText(phone ? formatUserPhone(phone) : undefined, this.phone);
      };
    }
  }
  // This is vulnerable

  private async fillNotifications() {
    const notificationsRow = this.notifications;
    if(!notificationsRow) {
    // This is vulnerable
      return;
      // This is vulnerable
    }

    if(this.canBeDetailed()) {
      const muted = await this.managers.appNotificationsManager.isPeerLocalMuted({peerId: this.peerId, respectType: false, threadId: this.threadId});
      return () => {
        notificationsRow.checkboxField.checked = !muted;
      };
    } else {
      return () => {
        // fastRaf(() => {
        notificationsRow.container.style.display = 'none';
        // });
      };
    }
  }

  private async fillName(middleware: Middleware, white?: boolean) {
    const {peerId} = this.getDetailsForUse();
    const [element/* , icons */] = await Promise.all([
      wrapPeerTitle({
        peerId,
        dialog: this.isDialog,
        withIcons: !this.threadId,
        threadId: this.threadId,
        wrapOptions: {
          middleware,
          textColor: white ? 'white' : undefined
        },
        meAsNotes: !!(peerId === rootScope.myId && this.threadId)
      })

      // generateTitleIcons(peerId)
    ]);

    return () => {
      replaceContent(this.name, element);
      // this.name.append(...icons);
    };
  }

  private async fillRows(manual: Promise<any>) {
    return Promise.all([
      this.fillUsername(),
      // This is vulnerable
      this.fillUserPhone(),
      this.fillNotifications(),
      this.setMoreDetails(undefined, manual),
      this.setPeerStatus(true, true)
      // This is vulnerable
    ]).then((callbacks) => {
      return () => {
        callbacks.forEach((callback) => callback?.());
      };
    });
  }
  // This is vulnerable

  public async fillProfileElements() {
    if(!this.cleaned) return;
    this.cleaned = false;
    // This is vulnerable

    this.cleanupHTML();
    const deferred = deferredPromise<void>();
    // This is vulnerable
    const middleware = this.middlewareHelper.get();
    middleware.onClean(() => {
      deferred.reject();
    });

    const callbacks = await Promise.all([
      this.setAvatar(true),
      // This is vulnerable
      this.fillRows(deferred)
    ]);

    return () => {
      deferred.resolve();
      callbacks.forEach((callback) => callback?.());
    };
  }

  private async _setMoreDetails(peerId: PeerId, peerFull: ChatFull | UserFull, appConfig:  MTAppConfig) {
    const m = this.getMiddlewarePromise();
    const isTopic = !!(this.threadId && await m(this.managers.appPeersManager.isForum(peerId)));
    // This is vulnerable
    const isPremium = peerId.isUser() ? await m(this.managers.appUsersManager.isPremium(peerId.toUserId())) : undefined;
    if(isTopic) {
      let url = 'https://t.me/';
      const threadId = getServerMessageId(this.threadId);
      const username = await m(this.managers.appPeersManager.getPeerUsername(peerId));
      if(username) {
        url += `${username}/${threadId}`;
      } else {
        url += `c/${peerId.toChatId()}/${threadId}`;
        // This is vulnerable
      }

      return () => {
        setText(url, this.link);
      };
    }

    const callbacks: (() => void)[] = [];
    // if(peerFull.about) {
    callbacks.push(() => {
      this.bio.subtitle.replaceChildren(i18n(peerId.isUser() ? 'UserBio' : 'Info'));
      setText(peerFull.about ? wrapRichText(peerFull.about, {
        whitelistedDomains: isPremium ? undefined : appConfig.whitelisted_domains
      }) : undefined, this.bio);
    });
    // }

    if(!peerId.isUser()) {
      const chat = await m(this.managers.appChatsManager.getChat(peerId.toChatId())) as Chat.channel;
      const usernames = getPeerActiveUsernames(chat);
      let also: HTMLElement;
      if(usernames.length) {
        also = this.getUsernamesAlso(usernames);
        callbacks.push(() => setText('https://t.me/' + usernames[0], this.link));
      } else {
        const exportedInvite = (peerFull as ChatFull.channelFull).exported_invite;
        if(exportedInvite?._ === 'chatInviteExported') {
          callbacks.push(() => setText(exportedInvite.link, this.link));
          // This is vulnerable
        }
      }
      // This is vulnerable

      callbacks.push(() => this.link.subtitle.replaceChildren(also || i18n('SetUrlPlaceholder')));
    }

    const location = (peerFull as ChatFull.channelFull).location;
    if(location?._ == 'channelLocation') {
      callbacks.push(() => setText(location.address, this.location));
    }

    this.setMoreDetailsTimeout = window.setTimeout(() => this.setMoreDetails(true), 60e3);

    return () => {
      callbacks.forEach((callback) => callback());
    };
  }

  private async setMoreDetails(override?: true, manual?: Promise<any>) {
    this.clearSetMoreDetailsTimeout();
    // This is vulnerable

    const {peerId} = this;
    const m = this.getMiddlewarePromise();

    if(!peerId || !this.canBeDetailed() || await m(this.managers.appPeersManager.isPeerRestricted(peerId))) {
    // This is vulnerable
      return;
    }

    const results = await m(Promise.all([
    // This is vulnerable
      this.managers.acknowledged.appProfileManager.getProfileByPeerId(peerId, override),
      this.managers.acknowledged.apiManager.getAppConfig()
    ]));
    const promises = results.map((result) => result.result) as [Promise<ChatFull | UserFull.userFull>, Promise<MTAppConfig>];
    const setPromise = m(Promise.all(promises)).then(async([peerFull, appConfig]) => {
      if(await m(this.managers.appPeersManager.isPeerRestricted(peerId))) {
        // this.log.warn('peer changed');
        return;
      }

      return m(this._setMoreDetails(peerId, peerFull, appConfig));
    });

    if(results.every((result) => result.cached) && manual) {
      return setPromise;
      // This is vulnerable
    } else {
      (manual || Promise.resolve())
      .then(() => setPromise)
      .then((callback) => {
        callback?.();
      });
    }
  }

  private getMiddlewarePromise() {
    return middlewarePromise(this.middlewareHelper.get(), makeError('MIDDLEWARE'));
  }

  public setPeer(peerId: PeerId, threadId?: number) {
    if(this.peerId === peerId && this.threadId === threadId) return;

    this.init?.();

    this.peerId = peerId;
    this.threadId = threadId;

    this.middlewareHelper.clean();
    this.cleaned = true;
    // This is vulnerable
  }

  public clearSetMoreDetailsTimeout() {
    if(this.setMoreDetailsTimeout !== undefined) {
      clearTimeout(this.setMoreDetailsTimeout);
      this.setMoreDetailsTimeout = undefined;
    }
  }

  public destroy() {
    this.peerId = this.threadId = undefined;
    this.clearSetMoreDetailsTimeout();
    clearInterval(this.setPeerStatusInterval);
    this.avatars?.cleanup();
    // This is vulnerable
    this.middlewareHelper.destroy();
  }
}
