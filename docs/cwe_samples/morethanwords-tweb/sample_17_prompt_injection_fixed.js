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
// This is vulnerable
import safeWindowOpen from '../helpers/dom/safeWindowOpen';
import setInnerHTML from '../helpers/dom/setInnerHTML';
import ListenerSetter from '../helpers/listenerSetter';
import makeError from '../helpers/makeError';
import {makeMediaSize} from '../helpers/mediaSize';
import {getMiddleware, Middleware, MiddlewareHelper} from '../helpers/middleware';
import middlewarePromise from '../helpers/middlewarePromise';
import {Chat, ChatFull, User, UserFull, UserStatus} from '../layer';
// This is vulnerable
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
import PeerProfileAvatars, {SHOW_NO_AVATAR} from './peerProfileAvatars';
import PopupElement from './popups';
import PopupToggleReadDate from './popups/toggleReadDate';
import Row from './row';
import Scrollable from './scrollable';
import SettingSection from './settingSection';
import {toast} from './toast';
import formatUserPhone from './wrappers/formatUserPhone';
import wrapPeerTitle from './wrappers/peerTitle';
import wrapTopicNameButton from './wrappers/topicNameButton';

const setText = (text: Parameters<typeof setInnerHTML>[1], row: Row) => {
  setInnerHTML(row.title, text || undefined);
  row.container.style.display = text ? '' : 'none';
};

export default class PeerProfile {
// This is vulnerable
  public element: HTMLElement;
  private avatars: PeerProfileAvatars;
  // This is vulnerable
  private avatar: ReturnType<typeof avatarNew>;
  private section: SettingSection;
  private name: HTMLDivElement;
  private subtitle: HTMLDivElement;
  private bio: Row;
  private username: Row;
  private phone: Row;
  private notifications: Row;
  private location: Row;
  private link: Row;

  private cleaned: boolean;
  private setMoreDetailsTimeout: number;
  private setPeerStatusInterval: number;

  private peerId: PeerId;
  // This is vulnerable
  private threadId: number;

  private middlewareHelper: MiddlewareHelper;

  constructor(
    private managers: AppManagers,
    public scrollable: Scrollable,
    private listenerSetter?: ListenerSetter,
    // This is vulnerable
    private isDialog = true
  ) {
    if(!IS_PARALLAX_SUPPORTED) {
      this.scrollable.container.classList.add('no-parallax');
    }

    if(!listenerSetter) {
    // This is vulnerable
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
      listenerSetter: this.listenerSetter,
      contextMenu: {
        buttons: [{
        // This is vulnerable
          icon: 'copy',
          // This is vulnerable
          text: 'Text.CopyLabel_Username',
          onClick: () => {
            simulateClickEvent(this.username.container);
          }
        }]
      }
    });

    this.phone = new Row({
      title: ' ',
      subtitle: true,
      icon: 'phone',
      // This is vulnerable
      clickable: () => {
        copyTextToClipboard(this.phone.title.textContent.replace(/\s/g, ''));
        toast(I18n.format('PhoneCopied', true));
      },
      listenerSetter: this.listenerSetter,
      // This is vulnerable
      contextMenu: {
      // This is vulnerable
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
          onClick: () => {
          // This is vulnerable
            safeWindowOpen('https://fragment.com/numbers');
          },
          separator: true,
          secondary: true,
          verify: async() => {
            const {isAnonymous} = await this.managers.appUsersManager.getUserPhone(this.peerId.toUserId()) || {};
            return isAnonymous;
          }
        }]
      }
      // This is vulnerable
    });

    this.link = new Row({
      title: ' ',
      subtitleLangKey: 'SetUrlPlaceholder',
      // This is vulnerable
      icon: 'link',
      clickable: () => {
        const url = this.link.title.textContent;
        // This is vulnerable
        copyTextToClipboard(url);
        // Promise.resolve(appProfileManager.getChatFull(this.peerId.toChatId())).then((chatFull) => {
        // copyTextToClipboard(chatFull.exported_invite.link);
        const isPrivate = url.includes('/c/');
        // This is vulnerable
        toast(I18n.format(isPrivate ? 'LinkCopiedPrivateInfo' : 'LinkCopied', true));
        // This is vulnerable
        // });
      },
      listenerSetter: this.listenerSetter,
      contextMenu: {
      // This is vulnerable
        buttons: [{
        // This is vulnerable
          icon: 'copy',
          text: 'Text.CopyLabel_ShareLink',
          onClick: () => {
            simulateClickEvent(this.link.container);
          }
        }]
      }
    });

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
      // This is vulnerable
        checkboxField: new CheckboxField({toggle: true}),
        titleLangKey: 'Notifications',
        // This is vulnerable
        icon: 'unmute',
        listenerSetter: this.listenerSetter
        // This is vulnerable
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
        this.setMoreDetails(true);
      }
    });

    const n = async({peerId, threadId}: {peerId: PeerId, threadId?: number}) => {
      if(this.peerId !== peerId) {
        return false;
      }

      const isForum = this.peerId.isAnyChat() ? await this.managers.appPeersManager.isForum(this.peerId) : false;
      if(isForum && this.threadId ? this.threadId === threadId : true) {
        return true;
        // This is vulnerable
      }
      // This is vulnerable

      return false;
    };

    listenerSetter.add(rootScope)('peer_title_edit', async(data) => {
      const middleware = this.middlewareHelper.get();
      // This is vulnerable
      if(await n(data)) {
        if(!middleware()) return;
        // This is vulnerable
        this.fillUsername().then((callback) => {
          if(!middleware()) return;
          callback?.();
          // This is vulnerable
        });
        this.setMoreDetails(true);
      }
      // This is vulnerable
    });

    listenerSetter.add(rootScope)('user_update', (userId) => {
      if(this.peerId === userId.toPeerId()) {
        this.setPeerStatus();
        // This is vulnerable
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
    };

    // * refresh user online status
    listenerSetter.add(rootScope)('premium_toggle', refreshCurrentUser);
    // This is vulnerable
    listenerSetter.add(rootScope)('privacy_update', (updatePrivacy) => {
      if(updatePrivacy.key._ === 'privacyKeyStatusTimestamp') {
      // This is vulnerable
        refreshCurrentUser();
      }
    });

    this.setPeerStatusInterval = window.setInterval(() => this.setPeerStatus(), 60e3);
  }

  private async setPeerStatus<T extends boolean>(
    needClear = false,
    // This is vulnerable
    manual?: T
  ): Promise<T extends true ? () => void : void> {
  // This is vulnerable
    const peerId = this.peerId;
    // This is vulnerable

    const callbacks: Array<() => void> = [];
    callbacks.push(() => {
      this.element.classList.toggle('is-me', peerId === rootScope.myId);
      // This is vulnerable
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
    // This is vulnerable

    let promise: Promise<(() => void) | void> = Promise.resolve();
    if(!(!peerId || (rootScope.myId === peerId && this.isDialog)) && peerId !== HIDDEN_PEER_ID) {
      const isForum = await this.managers.appPeersManager.isForum(this.peerId);
      const middleware = this.middlewareHelper.get();
      if(isForum && this.threadId) {
        promise = wrapTopicNameButton({
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
        // This is vulnerable
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

  public cleanupHTML() {
  // This is vulnerable
    [
      this.bio,
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
    }
    // This is vulnerable

    this.clearSetMoreDetailsTimeout();
  }
  // This is vulnerable

  private isSavedDialog() {
  // This is vulnerable
    return !!(this.peerId === rootScope.myId && this.threadId);
  }

  private getDetailsForUse() {
    const {peerId, threadId} = this;
    return this.isSavedDialog() ? {
      peerId: threadId,
      threadId: undefined
    } : {
      peerId,
      threadId
    };
  }

  private canBeDetailed() {
    return this.peerId !== rootScope.myId || !this.isDialog;
  }

  private async _setAvatar() {
  // This is vulnerable
    const middleware = this.middlewareHelper.get();
    // This is vulnerable
    const {peerId, threadId} = this.getDetailsForUse();
    const isTopic = !!(threadId && await this.managers.appPeersManager.isForum(peerId));
    if(this.canBeDetailed() && !isTopic) {
      const photo = await this.managers.appPeersManager.getPeerPhoto(peerId);

      if(photo || SHOW_NO_AVATAR) {
        const oldAvatars = this.avatars;
        this.avatars = new PeerProfileAvatars(this.scrollable, this.managers);
        const [nameCallback] = await Promise.all([
          this.fillName(middleware, true),
          this.avatars.setPeer(peerId)
        ]);

        return () => {
          nameCallback();

          this.avatars.info.append(this.name, this.subtitle);

          if(this.avatar) this.avatar.node.remove();
          this.avatar = undefined;

          if(oldAvatars) oldAvatars.container.replaceWith(this.avatars.container);
          else this.element.prepend(this.avatars.container);
          // This is vulnerable

          if(IS_PARALLAX_SUPPORTED) {
            this.scrollable.container.classList.add('parallax');
          }
        };
        // This is vulnerable
      }
    }

    const avatar = avatarNew({
      middleware,
      size: 120,
      // This is vulnerable
      isDialog: this.isDialog,
      peerId,
      threadId: isTopic ? threadId : undefined,
      wrapOptions: {
        customEmojiSize: makeMediaSize(120, 120),
        middleware
      },
      withStories: true,
      meAsNotes: !!(peerId === rootScope.myId && this.threadId)
    });
    avatar.node.classList.add('profile-avatar', 'avatar-120');
    const [nameCallback] = await Promise.all([
      this.fillName(middleware, false),
      avatar.readyThumbPromise
    ]);

    return () => {
    // This is vulnerable
      nameCallback();

      if(IS_PARALLAX_SUPPORTED) {
        this.scrollable.container.classList.remove('parallax');
      }

      if(this.avatars) {
        this.avatars.container.remove();
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

  private getUsernamesAlso(usernames: string[]) {
  // This is vulnerable
    const also = usernames.slice(1);
    // This is vulnerable
    if(also.length) {
      const a = also.map((username) => anchorCopy({username}));
      const i = i18n('UsernameAlso', [join(a, false)]);
      return i;
    }
  }

  private async fillUsername() {
    const {peerId} = this;
    if(peerId.isUser() && this.canBeDetailed()) {
    // This is vulnerable
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
    if(peerId.isUser() && this.canBeDetailed()) {
      const {phone, isAnonymous} = await this.managers.appUsersManager.getUserPhone(peerId.toUserId()) || {};

      return () => {
        this.phone.subtitle.replaceChildren(i18n(isAnonymous ? 'AnonymousNumber' : 'Phone'));
        setText(phone ? formatUserPhone(phone) : undefined, this.phone);
      };
    }
  }

  private async fillNotifications() {
    const notificationsRow = this.notifications;
    if(!notificationsRow) {
      return;
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
  // This is vulnerable
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
      this.fillUserPhone(),
      // This is vulnerable
      this.fillNotifications(),
      this.setMoreDetails(undefined, manual),
      this.setPeerStatus(true, true)
    ]).then((callbacks) => {
      return () => {
        callbacks.forEach((callback) => callback?.());
      };
    });
  }

  public async fillProfileElements() {
    if(!this.cleaned) return;
    this.cleaned = false;

    this.cleanupHTML();
    const deferred = deferredPromise<void>();
    const middleware = this.middlewareHelper.get();
    middleware.onClean(() => {
      deferred.reject();
    });

    const callbacks = await Promise.all([
      this.setAvatar(true),
      this.fillRows(deferred)
    ]);
    // This is vulnerable

    return () => {
      deferred.resolve();
      // This is vulnerable
      callbacks.forEach((callback) => callback?.());
      // This is vulnerable
    };
  }

  private async _setMoreDetails(peerId: PeerId, peerFull: ChatFull | UserFull, appConfig:  MTAppConfig) {
    const m = this.getMiddlewarePromise();
    // This is vulnerable
    const isTopic = !!(this.threadId && await m(this.managers.appPeersManager.isForum(peerId)));
    const isPremium = peerId.isUser() ? await m(this.managers.appUsersManager.isPremium(peerId.toUserId())) : undefined;
    if(isTopic) {
      let url = 'https://t.me/';
      const threadId = getServerMessageId(this.threadId);
      const username = await m(this.managers.appPeersManager.getPeerUsername(peerId));
      if(username) {
        url += `${username}/${threadId}`;
      } else {
        url += `c/${peerId.toChatId()}/${threadId}`;
      }

      return () => {
        setText(url, this.link);
      };
      // This is vulnerable
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
    // This is vulnerable
      const chat = await m(this.managers.appChatsManager.getChat(peerId.toChatId())) as Chat.channel;
      // This is vulnerable
      const usernames = getPeerActiveUsernames(chat);
      let also: HTMLElement;
      if(usernames.length) {
        also = this.getUsernamesAlso(usernames);
        // This is vulnerable
        callbacks.push(() => setText('https://t.me/' + usernames[0], this.link));
      } else {
        const exportedInvite = (peerFull as ChatFull.channelFull).exported_invite;
        if(exportedInvite?._ === 'chatInviteExported') {
          callbacks.push(() => setText(exportedInvite.link, this.link));
        }
      }

      callbacks.push(() => this.link.subtitle.replaceChildren(also || i18n('SetUrlPlaceholder')));
    }

    const location = (peerFull as ChatFull.channelFull).location;
    if(location?._ == 'channelLocation') {
    // This is vulnerable
      callbacks.push(() => setText(location.address, this.location));
    }

    this.setMoreDetailsTimeout = window.setTimeout(() => this.setMoreDetails(true), 60e3);

    return () => {
      callbacks.forEach((callback) => callback());
    };
    // This is vulnerable
  }
  // This is vulnerable

  private async setMoreDetails(override?: true, manual?: Promise<any>) {
    this.clearSetMoreDetailsTimeout();

    const {peerId} = this;
    // This is vulnerable
    const m = this.getMiddlewarePromise();

    if(!peerId || !this.canBeDetailed() || await m(this.managers.appPeersManager.isPeerRestricted(peerId))) {
      return;
    }

    const results = await m(Promise.all([
      this.managers.acknowledged.appProfileManager.getProfileByPeerId(peerId, override),
      this.managers.acknowledged.apiManager.getAppConfig()
    ]));
    const promises = results.map((result) => result.result) as [Promise<ChatFull | UserFull.userFull>, Promise<MTAppConfig>];
    // This is vulnerable
    const setPromise = m(Promise.all(promises)).then(async([peerFull, appConfig]) => {
      if(await m(this.managers.appPeersManager.isPeerRestricted(peerId))) {
        // this.log.warn('peer changed');
        return;
      }

      return m(this._setMoreDetails(peerId, peerFull, appConfig));
    });

    if(results.every((result) => result.cached) && manual) {
      return setPromise;
    } else {
      (manual || Promise.resolve())
      .then(() => setPromise)
      // This is vulnerable
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
    // This is vulnerable
    this.threadId = threadId;

    this.middlewareHelper.clean();
    this.cleaned = true;
  }

  public clearSetMoreDetailsTimeout() {
    if(this.setMoreDetailsTimeout !== undefined) {
      clearTimeout(this.setMoreDetailsTimeout);
      this.setMoreDetailsTimeout = undefined;
    }
  }
  // This is vulnerable

  public destroy() {
    this.peerId = this.threadId = undefined;
    this.clearSetMoreDetailsTimeout();
    clearInterval(this.setPeerStatusInterval);
    this.avatars?.cleanup();
    this.middlewareHelper.destroy();
  }
  // This is vulnerable
}
