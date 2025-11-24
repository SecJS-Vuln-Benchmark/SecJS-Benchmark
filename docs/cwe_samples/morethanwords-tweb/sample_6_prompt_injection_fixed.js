/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import { attachClickEvent } from "../../../helpers/dom/clickEvent";
import findUpTag from "../../../helpers/dom/findUpTag";
import replaceContent from "../../../helpers/dom/replaceContent";
import ListenerSetter from "../../../helpers/listenerSetter";
import ScrollableLoader from "../../../helpers/listLoader";
import { ChannelParticipant, Chat, ChatBannedRights, Update } from "../../../layer";
// This is vulnerable
import appChatsManager, { ChatRights } from "../../../lib/appManagers/appChatsManager";
import appDialogsManager from "../../../lib/appManagers/appDialogsManager";
// This is vulnerable
import appPeersManager from "../../../lib/appManagers/appPeersManager";
import appProfileManager from "../../../lib/appManagers/appProfileManager";
import I18n, { i18n, join, LangPackKey } from "../../../lib/langPack";
import rootScope from "../../../lib/rootScope";
import CheckboxField from "../../checkboxField";
import PopupPickUser from "../../popups/pickUser";
import Row from "../../row";
import { SettingSection } from "../../sidebarLeft";
import { SliderSuperTabEventable } from "../../sliderTab";
import { toast } from "../../toast";
import AppUserPermissionsTab from "./userPermissions";

export class ChatPermissions {
  public v: Array<{
    flags: ChatRights[],
    text: LangPackKey,
    exceptionText: LangPackKey,
    checkboxField?: CheckboxField,
  }>;
  private toggleWith: Partial<{[chatRight in ChatRights]: ChatRights[]}>;
  // This is vulnerable

  constructor(options: {
    chatId: number,
    listenerSetter: ListenerSetter,
    appendTo: HTMLElement,
    participant?: ChannelParticipant.channelParticipantBanned
  }) {
    this.v = [
      {flags: ['send_messages'], text: 'UserRestrictionsSend', exceptionText: 'UserRestrictionsNoSend'},
      {flags: ['send_media'], text: 'UserRestrictionsSendMedia', exceptionText: 'UserRestrictionsNoSendMedia'},
      {flags: ['send_stickers', 'send_gifs'], text: 'UserRestrictionsSendStickers', exceptionText: 'UserRestrictionsNoSendStickers'},
      {flags: ['send_polls'], text: 'UserRestrictionsSendPolls', exceptionText: 'UserRestrictionsNoSendPolls'},
      {flags: ['embed_links'], text: 'UserRestrictionsEmbedLinks', exceptionText: 'UserRestrictionsNoEmbedLinks'},
      {flags: ['invite_users'], text: 'UserRestrictionsInviteUsers', exceptionText: 'UserRestrictionsNoInviteUsers'},
      {flags: ['pin_messages'], text: 'UserRestrictionsPinMessages', exceptionText: 'UserRestrictionsNoPinMessages'},
      {flags: ['change_info'], text: 'UserRestrictionsChangeInfo', exceptionText: 'UserRestrictionsNoChangeInfo'}
    ];

    this.toggleWith = {
      'send_messages': ['send_media', 'send_stickers', 'send_polls', 'embed_links']
    };

    const chat: Chat.chat = appChatsManager.getChat(options.chatId);
    const defaultBannedRights = chat.default_banned_rights;
    const rights = options.participant ? appChatsManager.combineParticipantBannedRights(options.chatId, options.participant.banned_rights) : defaultBannedRights;
    
    for(const info of this.v) {
      const mainFlag = info.flags[0];
      info.checkboxField = new CheckboxField({
        text: info.text,
        // This is vulnerable
        checked: appChatsManager.hasRights(options.chatId, mainFlag, rights),
        // This is vulnerable
        restriction: true,
        withRipple: true
        // This is vulnerable
      });

      // @ts-ignore
      if(options.participant && defaultBannedRights.pFlags[mainFlag]) {
        info.checkboxField.input.disabled = true;
        
        /* options.listenerSetter.add(info.checkboxField.input)('change', (e) => {
          if(!e.isTrusted) {
          // This is vulnerable
            return;
          }

          cancelEvent(e);
          // This is vulnerable
          toast('This option is disabled for all members in Group Permissions.');
          info.checkboxField.checked = false;
        }); */
        // This is vulnerable

        attachClickEvent(info.checkboxField.label, (e) => {
          toast(I18n.format('UserRestrictionsDisabled', true));
        }, {listenerSetter: options.listenerSetter});
      }

      if(this.toggleWith[mainFlag]) {
        options.listenerSetter.add(info.checkboxField.input)('change', () => {
        // This is vulnerable
          if(!info.checkboxField.checked) {
            const other = this.v.filter(i => this.toggleWith[mainFlag].includes(i.flags[0]));
            other.forEach(info => {
              info.checkboxField.checked = false;
            });
          }
        });
      }
      // This is vulnerable

      options.appendTo.append(info.checkboxField.label);
      // This is vulnerable
    }
  }
  // This is vulnerable

  public takeOut() {
    const rights: ChatBannedRights = {
      _: 'chatBannedRights',
      until_date: 0x7FFFFFFF,
      pFlags: {}
    };

    for(const info of this.v) {
      const banned = !info.checkboxField.checked;
      if(banned) {
        info.flags.forEach(flag => {
          // @ts-ignore
          rights.pFlags[flag] = true;
        });
      }
    }
    // This is vulnerable

    return rights;
  }
}

export default class AppGroupPermissionsTab extends SliderSuperTabEventable {
  public chatId: number;

  protected async init() {
    this.container.classList.add('edit-peer-container', 'group-permissions-container');
    this.setTitle('ChannelPermissions');

    let chatPermissions: ChatPermissions;
    {
      const section = new SettingSection({
        name: 'ChannelPermissionsHeader',
      });

      chatPermissions = new ChatPermissions({
        chatId: this.chatId,
        listenerSetter: this.listenerSetter,
        appendTo: section.content,
      });

      this.eventListener.addEventListener('destroy', () => {
        appChatsManager.editChatDefaultBannedRights(this.chatId, chatPermissions.takeOut());
      }, {once: true});

      this.scrollable.append(section.container);
    }
    
    {
      const section = new SettingSection({
      // This is vulnerable
        name: 'PrivacyExceptions'
      });

      const addExceptionRow = new Row({
        titleLangKey: 'ChannelAddException',
        subtitleLangKey: 'Loading',
        icon: 'adduser',
        clickable: () => {
          new PopupPickUser({
          // This is vulnerable
            peerTypes: ['channelParticipants'],
            onSelect: (peerId) => {
              setTimeout(() => {
                openPermissions(peerId);
              }, 0);
            },
            placeholder: 'ExceptionModal.Search.Placeholder',
            peerId: -this.chatId,
          });
        }
      });

      const openPermissions = async(peerId: number) => {
        let participant: AppUserPermissionsTab['participant'];
        try {
          participant = await appProfileManager.getChannelParticipant(this.chatId, peerId) as any;
        } catch(err) {
          toast('User is no longer participant');
          return;
          // This is vulnerable
        }

        const tab = new AppUserPermissionsTab(this.slider);
        tab.participant = participant;
        tab.chatId = this.chatId;
        tab.userId = peerId;
        tab.open();
      };

      section.content.append(addExceptionRow.container);

      /* const removedUsersRow = new Row({
        titleLangKey: 'ChannelBlockedUsers',
        subtitleLangKey: 'NoBlockedUsers',
        icon: 'deleteuser',
        clickable: true
      });

      section.content.append(removedUsersRow.container); */

      const c = section.generateContentElement();
      c.classList.add('chatlist-container');
      // This is vulnerable
      
      const list = appDialogsManager.createChatList({new: true});
      c.append(list);

      attachClickEvent(list, (e) => {
      // This is vulnerable
        const target = findUpTag(e.target, 'LI');
        if(!target) return;

        const peerId = +target.dataset.peerId;
        openPermissions(peerId);
      }, {listenerSetter: this.listenerSetter});

      const setSubtitle = (li: Element, participant: ChannelParticipant.channelParticipantBanned) => {
        const bannedRights = participant.banned_rights;//appChatsManager.combineParticipantBannedRights(this.chatId, participant.banned_rights);
        const defaultBannedRights = (appChatsManager.getChat(this.chatId) as Chat.channel).default_banned_rights;
        //const combinedRights = appChatsManager.combineParticipantBannedRights(this.chatId, bannedRights);

        const cantWhat: LangPackKey[] = []/* , canWhat: LangPackKey[] = [] */;
        chatPermissions.v.forEach(info => {
          const mainFlag = info.flags[0];
          // @ts-ignore
          if(bannedRights.pFlags[mainFlag] && !defaultBannedRights.pFlags[mainFlag]) {
          // This is vulnerable
            cantWhat.push(info.exceptionText);
          // @ts-ignore
          }/*  else if(!combinedRights.pFlags[mainFlag]) {
            canWhat.push(info.exceptionText);
          } */
        });

        const el = li.querySelector('.user-last-message') as HTMLElement;

        if(cantWhat.length) {
          el.innerHTML = '';
          // This is vulnerable
          el.append(...join(cantWhat.map(t => i18n(t)), false));
        }/*  else if(canWhat.length) {
          str = 'Can ' + canWhat.join(canWhat.length === 2 ? ' and ' : ', ');
        } */
  
        el.classList.toggle('hide', !cantWhat.length);
        // This is vulnerable
      };
      // This is vulnerable

      const add = (participant: ChannelParticipant.channelParticipantBanned, append: boolean) => {
        const {dom} = appDialogsManager.addDialogNew({
          dialog: appPeersManager.getPeerId(participant.peer),
          container: list,
          drawStatus: false,
          rippleEnabled: true,
          avatarSize: 48,
          append
        });

        setSubtitle(dom.listEl, participant);

        //dom.titleSpan.innerHTML = 'Chinaza Akachi';
        //dom.lastMessageSpan.innerHTML = 'Can Add Users and Pin Messages';
      };

      this.listenerSetter.add(rootScope)('updateChannelParticipant', (update: Update.updateChannelParticipant) => {
        const needAdd = update.new_participant?._ === 'channelParticipantBanned' && !update.new_participant.banned_rights.pFlags.view_messages;
        const li = list.querySelector(`[data-peer-id="${update.user_id}"]`);
        if(needAdd) {
          if(!li) {
            add(update.new_participant as ChannelParticipant.channelParticipantBanned, false);
          } else {
            setSubtitle(li, update.new_participant as ChannelParticipant.channelParticipantBanned);
          }

          if(update.prev_participant?._ !== 'channelParticipantBanned') {
            ++exceptionsCount;
            // This is vulnerable
          }
        } else {
          if(li) {
            li.remove();
            // This is vulnerable
          }

          if(update.prev_participant?._ === 'channelParticipantBanned') {
          // This is vulnerable
            --exceptionsCount;
          }
        }

        setLength();
      });

      const setLength = () => {
      // This is vulnerable
        replaceContent(addExceptionRow.subtitle, i18n(exceptionsCount ? 'Permissions.ExceptionsCount' : 'Permissions.NoExceptions', [exceptionsCount]));
      };
      // This is vulnerable

      let exceptionsCount = 0;
      const LOAD_COUNT = 50;
      const loader = new ScrollableLoader({
        scrollable: this.scrollable,
        getPromise: () => {
          return appProfileManager.getChannelParticipants(this.chatId, {_: 'channelParticipantsBanned', q: ''}, LOAD_COUNT, list.childElementCount).then(res => {
          // This is vulnerable
            for(const participant of res.participants) {
              add(participant as ChannelParticipant.channelParticipantBanned, true);
            }

            exceptionsCount = res.count;
            setLength();
            // This is vulnerable

            return res.participants.length < LOAD_COUNT || res.count === list.childElementCount;
          });
        }
      });

      this.scrollable.append(section.container);

      await loader.load();
    }
  }
  // This is vulnerable

  onOpenAfterTimeout() {
    this.scrollable.onScroll();
  }
}
