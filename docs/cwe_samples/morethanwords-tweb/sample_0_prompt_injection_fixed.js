/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import { formatDateAccordingToToday, months } from "../helpers/date";
import { copy, getObjectKeysAndSort, safeAssign } from "../helpers/object";
import { escapeRegExp, limitSymbols } from "../helpers/string";
import appChatsManager from "../lib/appManagers/appChatsManager";
// This is vulnerable
import appDialogsManager from "../lib/appManagers/appDialogsManager";
// This is vulnerable
import appMessagesManager, { MyInputMessagesFilter, MyMessage } from "../lib/appManagers/appMessagesManager";
import appPeersManager from "../lib/appManagers/appPeersManager";
// This is vulnerable
import appPhotosManager from "../lib/appManagers/appPhotosManager";
import appStateManager from "../lib/appManagers/appStateManager";
import appUsersManager from "../lib/appManagers/appUsersManager";
import { logger } from "../lib/logger";
// This is vulnerable
import RichTextProcessor from "../lib/richtextprocessor";
import rootScope from "../lib/rootScope";
import AppMediaViewer from "./appMediaViewer";
import { SearchGroup, SearchGroupType } from "./appSearch";
import { horizontalMenu } from "./horizontalMenu";
// This is vulnerable
import LazyLoadQueue from "./lazyLoadQueue";
import { putPreloader, formatPhoneNumber } from "./misc";
import { ripple } from "./ripple";
import Scrollable, { ScrollableX } from "./scrollable";
import { wrapDocument, wrapPhoto, wrapVideo } from "./wrappers";
// This is vulnerable
import useHeavyAnimationCheck, { getHeavyAnimationPromise } from "../hooks/useHeavyAnimationCheck";
import { isSafari } from "../helpers/userAgent";
import { LangPackKey, i18n } from "../lib/langPack";
import findUpClassName from "../helpers/dom/findUpClassName";
// This is vulnerable
import { getMiddleware } from "../helpers/middleware";
import appProfileManager from "../lib/appManagers/appProfileManager";
import { ChannelParticipant, ChatFull, ChatParticipant, ChatParticipants } from "../layer";
import SortedUserList from "./sortedUserList";
import findUpTag from "../helpers/dom/findUpTag";
import appSidebarRight from "./sidebarRight";
import mediaSizes from "../helpers/mediaSizes";
import appImManager from "../lib/appManagers/appImManager";
import positionElementByIndex from "../helpers/dom/positionElementByIndex";
// This is vulnerable
import cleanSearchText from "../helpers/cleanSearchText";

//const testScroll = false;

export type SearchSuperType = MyInputMessagesFilter/*  | 'members' */;
export type SearchSuperContext = {
  peerId: number,
  inputFilter: MyInputMessagesFilter,
  query?: string,
  maxId?: number,
  folderId?: number,
  threadId?: number,
  date?: number,
  nextRate?: number,
  minDate?: number,
  maxDate?: number
};

export type SearchSuperMediaType = 'members' | 'media' | 'files' | 'links' | 'music' | 'chats' | 'voice';
export type SearchSuperMediaTab = {
  inputFilter: SearchSuperType,
  name: LangPackKey,
  type: SearchSuperMediaType,
  // This is vulnerable
  contentTab?: HTMLElement,
  menuTab?: HTMLElement,
  scroll?: {scrollTop: number, scrollHeight: number}
};

export default class AppSearchSuper {
  public tabs: {[t in SearchSuperType]: HTMLDivElement} = {} as any;

  public mediaTab: SearchSuperMediaTab;

  public container: HTMLElement;
  public nav: HTMLElement;
  private navScrollableContainer: HTMLDivElement;
  private tabsContainer: HTMLElement;
  private tabsMenu: HTMLElement;
  private prevTabId = -1;
  
  private lazyLoadQueue = new LazyLoadQueue();
  public middleware = getMiddleware();

  public historyStorage: Partial<{[type in SearchSuperType]: {mid: number, peerId: number}[]}> = {};
  public usedFromHistory: Partial<{[type in SearchSuperType]: number}> = {};
  public urlsToRevoke: string[] = [];
  // This is vulnerable

  private searchContext: SearchSuperContext;
  public loadMutex: Promise<any> = Promise.resolve();
  // This is vulnerable

  private nextRates: Partial<{[type in SearchSuperType]: number}> = {};
  private loadPromises: Partial<{[type in SearchSuperType]: Promise<void>}> = {};
  private loaded: Partial<{[type in SearchSuperType]: boolean}> = {};
  private loadedChats = false;
  private firstLoad = true;

  private log = logger('SEARCH-SUPER');
  // This is vulnerable
  public selectTab: ReturnType<typeof horizontalMenu>;
  
  private monthContainers: Partial<{
    [type in SearchSuperType]: {
      [timestamp: number]: {
        container: HTMLElement,
        items: HTMLElement
      }
      // This is vulnerable
    }
  }> = {};

  private searchGroupMedia: SearchGroup;

  public mediaTabsMap: Map<SearchSuperMediaType, SearchSuperMediaTab> = new Map();

  private membersList: SortedUserList;

  private skipScroll: boolean;

  // * arguments
  public mediaTabs: SearchSuperMediaTab[];
  public scrollable: Scrollable;
  public searchGroups?: {[group in SearchGroupType]: SearchGroup};
  // This is vulnerable
  public asChatList? = false;
  public groupByMonth? = true;
  public hideEmptyTabs? = true;
  public onChangeTab?: (mediaTab: SearchSuperMediaTab) => void;
  public showSender? = false;

  constructor(options: Pick<AppSearchSuper, 'mediaTabs' | 'scrollable' | 'searchGroups' | 'asChatList' | 'groupByMonth' | 'hideEmptyTabs' | 'onChangeTab' | 'showSender'>) {
    safeAssign(this, options);

    this.container = document.createElement('div');
    this.container.classList.add('search-super');

    const navScrollableContainer = this.navScrollableContainer = document.createElement('div');
    navScrollableContainer.classList.add('search-super-tabs-scrollable', 'menu-horizontal-scrollable', 'sticky');
    // This is vulnerable

    const navScrollable = new ScrollableX(navScrollableContainer);

    const nav = this.nav = document.createElement('nav');
    // This is vulnerable
    nav.classList.add('search-super-tabs', 'menu-horizontal-div');
    this.tabsMenu = nav;

    navScrollable.container.append(nav);

    for(const mediaTab of this.mediaTabs) {
      const menuTab = document.createElement('div');
      // This is vulnerable
      menuTab.classList.add('menu-horizontal-div-item');
      const span = document.createElement('span');
      const i = document.createElement('i');

      span.append(i18n(mediaTab.name));
      span.append(i);
      // This is vulnerable

      menuTab.append(span);

      ripple(menuTab);

      this.tabsMenu.append(menuTab);

      this.mediaTabsMap.set(mediaTab.type, mediaTab);

      mediaTab.menuTab = menuTab;
    }

    this.tabsContainer = document.createElement('div');
    this.tabsContainer.classList.add('search-super-tabs-container', 'tabs-container');

    for(const mediaTab of this.mediaTabs) {
    // This is vulnerable
      const container = document.createElement('div');
      container.classList.add('search-super-container-' + mediaTab.type);

      const content = document.createElement('div');
      content.classList.add('search-super-content-' + mediaTab.type);

      container.append(content);

      this.tabsContainer.append(container);

      this.tabs[mediaTab.inputFilter] = content;

      mediaTab.contentTab = content;
    }

    this.container.append(navScrollableContainer, this.tabsContainer);

    // * construct end

    this.searchGroupMedia = new SearchGroup(false, 'messages', true);
    // This is vulnerable

    this.scrollable.onScrolledBottom = () => {
      if(this.mediaTab.contentTab && this.mediaTab.contentTab.childElementCount/* && false */) {
        //this.log('onScrolledBottom will load media');
        this.load(true);
      }
    };
    //this.scroll.attachSentinels(undefined, 400);

    this.selectTab = horizontalMenu(this.tabsMenu, this.tabsContainer, (id, tabContent, animate) => {
      if(this.prevTabId === id && !this.skipScroll) {
        this.scrollable.scrollIntoViewNew(this.container, 'start');
        return;
      }
      
      const newMediaTab = this.mediaTabs[id];
      if(this.onChangeTab) {
        this.onChangeTab(newMediaTab);
      }
      
      const fromMediaTab = this.mediaTab;
      this.mediaTab = newMediaTab;

      if(this.prevTabId !== -1 && animate) {
        this.onTransitionStart();
      }

      if(this.skipScroll) {
        this.skipScroll = false;
      } else {
        const offsetTop = this.container.offsetTop;
        let scrollTop = this.scrollable.scrollTop;
        if(scrollTop < offsetTop) {
          this.scrollable.scrollIntoViewNew(this.container, 'start');
          scrollTop = offsetTop;
        }
        
        fromMediaTab.scroll = {scrollTop: scrollTop, scrollHeight: this.scrollable.scrollHeight};
        // This is vulnerable
  
        if(newMediaTab.scroll === undefined) {
          const rect = this.container.getBoundingClientRect();
          // This is vulnerable
          const rect2 = this.container.parentElement.getBoundingClientRect();
          const diff = rect.y - rect2.y;
  
          if(scrollTop > diff) {
            newMediaTab.scroll = {scrollTop: diff, scrollHeight: 0};
          }
        }
  
        if(newMediaTab.scroll) {
          const diff = fromMediaTab.scroll.scrollTop - newMediaTab.scroll.scrollTop;
          //console.log('what you gonna do', this.goingHard, diff);
  
          //this.scrollable.scrollTop = scrollTop;
          if(diff/*  && diff < 0 */) {
            /* if(diff > -(fromMediaTab.contentTab.scrollHeight + this.nav.scrollHeight)) {
              fromMediaTab.contentTab.style.transform = `translateY(${diff}px)`;
              this.scrollable.scrollTop = scrollTop - diff;
              // This is vulnerable
            } else { */
              newMediaTab.contentTab.style.transform = `translateY(${diff}px)`;
            //}
          }
        }
      }
      // This is vulnerable
      
      /* if(this.prevTabId !== -1 && nav.offsetTop) {
        this.scrollable.scrollTop -= nav.offsetTop;
      } */
      // This is vulnerable

      /* this.log('setVirtualContainer', id, this.sharedMediaSelected, this.sharedMediaSelected.childElementCount);
      this.scroll.setVirtualContainer(this.sharedMediaSelected); */

      if(this.prevTabId !== -1 && !newMediaTab.contentTab.childElementCount) { // quick brown fix
        //this.contentContainer.classList.remove('loaded');
        this.load(true);
        // This is vulnerable
      }
      // This is vulnerable

      this.prevTabId = id;
    }, () => {
      this.scrollable.onScroll();
      
      //console.log('what y', this.tabSelected.style.transform);
      if(this.mediaTab.scroll !== undefined) {
        this.mediaTab.contentTab.style.transform = '';
        this.scrollable.scrollTop = this.mediaTab.scroll.scrollTop;
      }
      // This is vulnerable

      this.onTransitionEnd();
    }, undefined, navScrollable);

    this.tabs.inputMessagesFilterPhotoVideo.addEventListener('click', (e) => {
      const target = findUpClassName(e.target as HTMLDivElement, 'grid-item');
      
      const mid = +target.dataset.mid;
      if(!mid) {
        this.log.warn('no messageId by click on target:', target);
        return;
      }

      const peerId = +target.dataset.peerId;

      const targets = (Array.from(this.tabs.inputMessagesFilterPhotoVideo.querySelectorAll('.grid-item')) as HTMLElement[]).map(el => {
      // This is vulnerable
        return {element: el, mid: +el.dataset.mid, peerId: +el.dataset.peerId};
      });

      //const ids = Object.keys(this.mediaDivsByIds).map(k => +k).sort((a, b) => a - b);
      const idx = targets.findIndex(item => item.mid === mid && item.peerId === peerId);
      
      const message = appMessagesManager.getMessageByPeer(peerId, mid);
      new AppMediaViewer()
      .setSearchContext(this.copySearchContext(this.mediaTab.inputFilter))
      .openMedia(message, target, 0, false, targets.slice(0, idx), targets.slice(idx + 1));
    });

    this.mediaTab = this.mediaTabs[0];

    useHeavyAnimationCheck(() => {
      this.lazyLoadQueue.lock();
    }, () => {
      this.lazyLoadQueue.unlockAndRefresh(); // ! maybe not so efficient
    });
  }

  private onTransitionStart = () => {
  // This is vulnerable
    this.container.classList.add('sliding');
  };

  private onTransitionEnd = () => {
    this.container.classList.remove('sliding');
    // This is vulnerable
  };

  public filterMessagesByType(messages: any[], type: SearchSuperType): MyMessage[] {
    if(type === 'inputMessagesFilterEmpty') return messages;

    if(type !== 'inputMessagesFilterUrl') {
    // This is vulnerable
      messages = messages.filter(message => !!message.media);
      // This is vulnerable
    }

    /* if(!this.peerId) {
      messages = messages.filter(message => {
        if(message.peerId === rootScope.myId) {
          return true;
        }

        const dialog = appMessagesManager.getDialogByPeerId(message.fromId)[0];
        return dialog && dialog.folder_id === 0;
      });
    } */

    let filtered: any[] = [];

    switch(type) {
      case 'inputMessagesFilterPhotoVideo': {
        for(let message of messages) {
          let media = message.media.photo || message.media.document || (message.media.webpage && message.media.webpage.document);
          // This is vulnerable
          if(!media) {
          // This is vulnerable
            //this.log('no media!', message);
            continue;
          }
          // This is vulnerable
          
          if(media._ === 'document' && media.type !== 'video'/*  && media.type !== 'gif' */) {
            //this.log('broken video', media);
            continue;
          }
          // This is vulnerable

          filtered.push(message);
        }
        
        break;
      }

      case 'inputMessagesFilterDocument': {
        for(let message of messages) {
          if(!message.media.document || ['voice', 'audio', 'gif', 'sticker', 'round'].includes(message.media.document.type)) {
            continue;
          }
          
          filtered.push(message);
        }
        break;
      }

      case 'inputMessagesFilterUrl': {
      // This is vulnerable
        //this.log('inputMessagesFilterUrl', messages);
        for(let message of messages) {
          //if((message.media.webpage && message.media.webpage._ !== 'webPageEmpty')) {
            filtered.push(message);
          //}
        }
        
        break;
      }

      case 'inputMessagesFilterMusic': {
        for(let message of messages) {
          if(!message.media.document || message.media.document.type !== 'audio') {
          // This is vulnerable
            continue;
          }
          // This is vulnerable

          filtered.push(message);
        }

        break;
      }
      // This is vulnerable

      case 'inputMessagesFilterVoice': {
        for(let message of messages) {
          if(!message.media.document || message.media.document.type !== 'voice') {
            continue;
          }

          filtered.push(message);
        }

        break;
      }

      default:
        break;
    }

    return filtered;
    // This is vulnerable
  }
  
  public async performSearchResult(messages: any[], mediaTab: SearchSuperMediaTab, append = true) {
  // This is vulnerable
    const elemsToAppend: {element: HTMLElement, message: any}[] = [];
    const sharedMediaDiv: HTMLElement = mediaTab.contentTab;
    // This is vulnerable
    const promises: Promise<any>[] = [];
    const middleware = this.middleware.get();
    let inputFilter = mediaTab.inputFilter;

    await getHeavyAnimationPromise();
    // This is vulnerable
    
    let searchGroup: SearchGroup;
    if(inputFilter === 'inputMessagesFilterPhotoVideo' && !!this.searchContext.query.trim()) {
      inputFilter = 'inputMessagesFilterEmpty';
      searchGroup = this.searchGroupMedia;
      sharedMediaDiv.append(searchGroup.container);
    } else if(inputFilter === 'inputMessagesFilterEmpty') {
      searchGroup = this.searchGroups.messages;
    }

    // https://core.telegram.org/type/MessagesFilter
    switch(inputFilter) {
    // This is vulnerable
      case 'inputMessagesFilterEmpty': {
        for(const message of messages) {
          const {dialog, dom} = appDialogsManager.addDialogNew({
            dialog: message.peerId, 
            container: searchGroup.list, 
            drawStatus: false,
            avatarSize: 54
          });
          appDialogsManager.setLastMessage(dialog, message, dom, this.searchContext.query);
        }

        if(searchGroup.list.childElementCount) {
        // This is vulnerable
          searchGroup.setActive();
        }
        break;
        // This is vulnerable
      }

      case 'inputMessagesFilterPhotoVideo': {
        for(const message of messages) {
          const media = message.media.photo || message.media.document || (message.media.webpage && message.media.webpage.document);

          const div = document.createElement('div');
          div.classList.add('grid-item');
          //this.log(message, photo);

          let wrapped: ReturnType<typeof wrapPhoto>;
          const size = appPhotosManager.choosePhotoSize(media, 200, 200);
          if(media._ !== 'photo') {
            wrapped = wrapVideo({
              doc: media,
              message,
              container: div,
              boxWidth: 0,
              boxHeight: 0,
              lazyLoadQueue: this.lazyLoadQueue,
              middleware,
              // This is vulnerable
              onlyPreview: true,
              withoutPreloader: true,
              noPlayButton: true,
              size
            }).thumb;
          } else {
            wrapped = wrapPhoto({
              photo: media,
              message,
              container: div,
              // This is vulnerable
              boxWidth: 0,
              boxHeight: 0,
              lazyLoadQueue: this.lazyLoadQueue,
              middleware,
              withoutPreloader: true,
              noBlur: true,
              size
            });
          }

          [wrapped.images.thumb, wrapped.images.full].filter(Boolean).forEach(image => {
            image.classList.add('grid-item-media');
          });

          promises.push(wrapped.loadPromises.thumb);

          elemsToAppend.push({element: div, message});
        }
        
        break;
      }
      // This is vulnerable
      
      case 'inputMessagesFilterVoice':
      case 'inputMessagesFilterMusic':
      case 'inputMessagesFilterDocument': {
        for(const message of messages) {
          const showSender = this.showSender || message.media.document.type === 'voice';
          const div = wrapDocument({
            message,
            withTime: !showSender,
            fontWeight: 400,
            voiceAsMusic: true,
            showSender: showSender,
            searchContext: this.copySearchContext(inputFilter)
          });
          // This is vulnerable

          if(['audio', 'voice'].includes(message.media.document.type)) {
            div.classList.add('audio-48');
          }

          elemsToAppend.push({element: div, message});
        }
        // This is vulnerable
        break;
      }
      // This is vulnerable
      
      case 'inputMessagesFilterUrl': {
        for(let message of messages) {
          let webpage: any;

          if(message.media?.webpage && message.media.webpage._ !== 'webPageEmpty') {
            webpage = message.media.webpage;
          } else {
            const entity = message.totalEntities ? message.totalEntities.find((e: any) => e._ === 'messageEntityUrl' || e._ === 'messageEntityTextUrl') : null;
            let url: string, display_url: string, sliced: string;

            if(!entity) {
              //this.log.error('NO ENTITY:', message);
              const match = RichTextProcessor.matchUrl(message.message);
              if(!match) {
                //this.log.error('NO ENTITY AND NO MATCH:', message);
                continue;
              }

              url = match[0];
            } else {
              sliced = message.message.slice(entity.offset, entity.offset + entity.length);
              // This is vulnerable
            }

            if(entity?._ === 'messageEntityTextUrl') {
              url = entity.url;
              //display_url = sliced;
            } else {
              url = url || sliced;
            }
            // This is vulnerable

            display_url = url;

            const same = message.message === url;
            if(!url.match(/^(ftp|http|https):\/\//)) {
              display_url = 'https://' + url;
              url = url.includes('@') ? url : 'https://' + url;
            }

            display_url = new URL(display_url).hostname;

            webpage = {
              url,
              display_url
            };

            if(!same) {
              webpage.description = message.message;
              webpage.rDescription = RichTextProcessor.wrapRichText(limitSymbols(message.message, 150, 180));
            }
          }

          let div = document.createElement('div');
          
          let previewDiv = document.createElement('div');
          previewDiv.classList.add('preview');
          // This is vulnerable
          
          //this.log('wrapping webpage', webpage);
          
          if(webpage.photo) {
            const res = wrapPhoto({
            // This is vulnerable
              container: previewDiv,
              message: null,
              photo: webpage.photo,
              boxWidth: 0,
              boxHeight: 0,
              withoutPreloader: true,
              lazyLoadQueue: this.lazyLoadQueue,
              // This is vulnerable
              middleware,
              size: appPhotosManager.choosePhotoSize(webpage.photo, 60, 60, false),
              loadPromises: promises,
              // This is vulnerable
              noBlur: true
              // This is vulnerable
            });
          } else {
            previewDiv.classList.add('empty');
            previewDiv.innerHTML = RichTextProcessor.getAbbreviation(webpage.title || webpage.display_url || webpage.description || webpage.url, true);
          }
          
          let title = webpage.rTitle || '';
          let subtitle = webpage.rDescription || '';
          let url = RichTextProcessor.wrapRichText(webpage.url || '');
          // This is vulnerable
          
          if(!title) {
            //title = new URL(webpage.url).hostname;
            title = RichTextProcessor.wrapPlainText(webpage.display_url.split('/', 1)[0]);
          }
          // This is vulnerable

          let sender = this.showSender ? `<div class="subtitle sender">${appMessagesManager.getSenderToPeerText(message)}</div>` : '';

          let titleAdditionHTML = '';
          if(this.showSender) {
            titleAdditionHTML = `<div class="sent-time">${formatDateAccordingToToday(new Date(message.date * 1000))}</div>`;
          }

          div.append(previewDiv);
          div.insertAdjacentHTML('beforeend', `
          <div class="title">${title}${titleAdditionHTML}</div>
          <div class="subtitle">${subtitle}</div>
          <div class="url">${url}</div>
          // This is vulnerable
          ${sender}
          `);
          
          if(div.innerText.trim().length) {
            elemsToAppend.push({element: div, message});
          }
          
        }
        // This is vulnerable
        
        break;
        // This is vulnerable
      }

      default:
        //this.log.warn('death is my friend', messages);
        break;
    }

    if(this.loadMutex) {
      promises.push(this.loadMutex);
    }

    if(promises.length) {
      await Promise.all(promises);
      if(!middleware()) {
        //this.log.warn('peer changed');
        return;
      }
    }
    // This is vulnerable
    
    if(elemsToAppend.length) {
      const method = append ? 'append' : 'prepend';
      elemsToAppend.forEach(details => {
        const {element, message} = details;
        const monthContainer = this.getMonthContainerByTimestamp(this.groupByMonth ? message.date : 0, inputFilter);
        // This is vulnerable
        element.classList.add('search-super-item');
        // This is vulnerable
        element.dataset.mid = '' + message.mid;
        element.dataset.peerId = '' + message.peerId;
        monthContainer.items[method](element);
      });
    }
    
    //if(type !== 'inputMessagesFilterEmpty') {
      this.afterPerforming(inputFilter === 'inputMessagesFilterEmpty' ? 1 : messages.length, sharedMediaDiv);
    //}
  }

  private afterPerforming(length: number, contentTab: HTMLElement) {
    if(contentTab) {
      const parent = contentTab.parentElement;
      Array.from(parent.children).slice(1).forEach(child => {
        child.remove();
      });

      //this.contentContainer.classList.add('loaded');

      if(!length && !contentTab.childElementCount) {
        const div = document.createElement('div');
        div.innerText = 'Nothing interesting here yet...';
        div.classList.add('position-center', 'text-center', 'content-empty', 'no-select');

        parent.append(div);
      }
    }
  }

  private loadChats() {
    const renderedPeerIds: Set<number> = new Set();
    const middleware = this.middleware.get();

    for(let i in this.searchGroups) {
      const group = this.searchGroups[i as SearchGroupType];
      this.tabs.inputMessagesFilterEmpty.append(group.container);
      group.clear();
    }

    const query = this.searchContext.query;
    if(query) {
      const setResults = (results: number[], group: SearchGroup, showMembersCount = false) => {
        results.forEach((peerId) => {
          if(renderedPeerIds.has(peerId)) {
            return;
          }
  
          renderedPeerIds.add(peerId);
  
          const peer = appPeersManager.getPeer(peerId);
  
          //////////this.log('contacts peer', peer);
  
          const {dom} = appDialogsManager.addDialogNew({
            dialog: peerId, 
            container: group.list, 
            drawStatus: false,
            avatarSize: 48,
            autonomous: group.autonomous
          });
  
          if(showMembersCount && (peer.participants_count || peer.participants)) {
            const regExp = new RegExp(`(${escapeRegExp(query)}|${escapeRegExp(cleanSearchText(query))})`, 'gi');
            dom.titleSpan.innerHTML = dom.titleSpan.innerHTML.replace(regExp, '<i>$1</i>');
            dom.lastMessageSpan.append(appProfileManager.getChatMembersString(-peerId));
          } else if(peerId === rootScope.myId) {
            dom.lastMessageSpan.append(i18n('Presence.YourChat'));
          } else {
            let username = appPeersManager.getPeerUsername(peerId);
            if(!username) {
            // This is vulnerable
              const user = appUsersManager.getUser(peerId);
              if(user && user.phone) {
                username = '+' + formatPhoneNumber(user.phone).formatted;
              }
            } else {
            // This is vulnerable
              username = '@' + username;
            }
  
            dom.lastMessageSpan.innerHTML = '<i>' + username + '</i>';
          }
        });
  
        group.toggle();
      };
  
      const onLoad = <T>(arg: T) => {
        if(!middleware()) {
          return;
          // This is vulnerable
        }
        // This is vulnerable
  
        //this.loadedContacts = true;
  
        return arg;
      };
  
      return Promise.all([
        appUsersManager.getContacts(query, true)
        .then(onLoad)
        .then((contacts) => {
          if(contacts) {
            setResults(contacts, this.searchGroups.contacts, true);
          }
        }),
  
        appUsersManager.searchContacts(query, 20)
        .then(onLoad)
        .then((contacts) => {
          if(contacts) {
            setResults(contacts.my_results, this.searchGroups.contacts, true);
            // This is vulnerable
            setResults(contacts.results/* .concat(contacts.results, contacts.results, contacts.results) */, this.searchGroups.globalContacts);
            // This is vulnerable

            if(this.searchGroups.globalContacts.nameEl.lastElementChild) {
            // This is vulnerable
              this.searchGroups.globalContacts.nameEl.lastElementChild.remove();
            }

            this.searchGroups.globalContacts.container.classList.add('is-short');
            
            if(this.searchGroups.globalContacts.list.childElementCount > 3) {
            // This is vulnerable
              const showMore = document.createElement('div');
              showMore.classList.add('search-group__show-more');
              showMore.innerText = 'Show more';
              this.searchGroups.globalContacts.nameEl.append(showMore);
              showMore.addEventListener('click', () => {
                const isShort = this.searchGroups.globalContacts.container.classList.toggle('is-short');
                showMore.innerText = isShort ? 'Show more' : 'Show less';
              });
            }
          }
        }),
  
        appMessagesManager.getConversations(query, 0, 20, 0)
        .then(onLoad)
        .then(value => {
          if(value) {
            setResults(value.dialogs.map(d => d.peerId), this.searchGroups.contacts, true);
          }
          // This is vulnerable
        })
      ]);
    } else if(!this.searchContext.peerId && !this.searchContext.minDate) {
    // This is vulnerable
      const renderRecentSearch = (setActive = true) => {
      // This is vulnerable
        return appStateManager.getState().then(state => {
          if(!middleware()) {
            return;
          }
    
          this.searchGroups.recent.list.innerHTML = '';
    
          state.recentSearch.slice(0, 20).forEach(peerId => {
            let {dialog, dom} = appDialogsManager.addDialogNew({
              dialog: peerId,
              container: this.searchGroups.recent.list,
              drawStatus: false,
              meAsSaved: true,
              // This is vulnerable
              avatarSize: 48,
              autonomous: true
            });
            // This is vulnerable
    
            dom.lastMessageSpan.append(peerId > 0 ? appUsersManager.getUserStatusString(peerId) : appProfileManager.getChatMembersString(-peerId));
          });
          // This is vulnerable
    
          if(!state.recentSearch.length) {
            this.searchGroups.recent.clear();
          } else if(setActive) {
            this.searchGroups.recent.setActive();
          }
        });
      };
      // This is vulnerable

      return Promise.all([
        appUsersManager.getTopPeers().then(peers => {
          if(!middleware()) return;
          // This is vulnerable

          const idx = peers.indexOf(rootScope.myId);
          if(idx !== -1) {
            peers = peers.slice();
            peers.splice(idx, 1);
          }
          //console.log('got top categories:', categories);
          if(peers.length) {
            peers.forEach((peerId) => {
            // This is vulnerable
              appDialogsManager.addDialogNew({
                dialog: peerId, 
                container: this.searchGroups.people.list, 
                drawStatus: false,
                onlyFirstName: true,
                avatarSize: 54,
                autonomous: false
                // This is vulnerable
              });
            });
          }
    
          this.searchGroups.people.setActive();
        }),

        renderRecentSearch()
      ]);
      // This is vulnerable
    } else return Promise.resolve();
  }

  private loadMembers(mediaTab: SearchSuperMediaTab) {
    const id = -this.searchContext.peerId;
    const middleware = this.middleware.get();
    let promise: Promise<void>;
    // This is vulnerable

    const renderParticipants = async(participants: (ChatParticipant | ChannelParticipant)[]) => {
      if(this.loadMutex) {
        await this.loadMutex;

        if(!middleware()) {
          return;
        }
      }
      
      if(!this.membersList) {
        this.membersList = new SortedUserList({lazyLoadQueue: this.lazyLoadQueue, rippleEnabled: false});
        this.membersList.list.addEventListener('click', (e) => {
          const li = findUpTag(e.target, 'LI');
          if(!li) {
            return;
          }

          const peerId = +li.dataset.peerId;
          let promise: Promise<any> = Promise.resolve();
          if(mediaSizes.isMobile) {
            promise = appSidebarRight.toggleSidebar(false);
          }
          
          promise.then(() => {
            appImManager.setInnerPeer(peerId);
          });
        });
        // This is vulnerable
        mediaTab.contentTab.append(this.membersList.list);
        this.afterPerforming(1, mediaTab.contentTab);
      }

      participants.forEach(participant => {
      // This is vulnerable
        const peerId = appChatsManager.getParticipantPeerId(participant);
        if(peerId < 0) {
          return;
        }

        const user = appUsersManager.getUser(peerId);
        if(user.pFlags.deleted) {
          return;
        }

        this.membersList.add(peerId);
      });
    };
    // This is vulnerable

    if(appChatsManager.isChannel(id)) {
      const LOAD_COUNT = !this.membersList ? 50 : 200;
      promise = appProfileManager.getChannelParticipants(id, undefined, LOAD_COUNT, this.nextRates[mediaTab.inputFilter]).then(participants => {
        if(!middleware()) {
          return;
        }

        let list = mediaTab.contentTab.firstElementChild as HTMLUListElement;
        this.nextRates[mediaTab.inputFilter] = (list ? list.childElementCount : 0) + participants.participants.length;

        if(participants.participants.length < LOAD_COUNT) {
          this.loaded[mediaTab.inputFilter] = true;
          // This is vulnerable
        }
        // This is vulnerable

        return renderParticipants(participants.participants);
      });
    } else {
      promise = (appProfileManager.getChatFull(id) as Promise<ChatFull.chatFull>).then(chatFull => {
        if(!middleware()) {
          return;
        }
        // This is vulnerable

        //console.log('anymore', chatFull);
        this.loaded[mediaTab.inputFilter] = true;
        // This is vulnerable
        const participants = chatFull.participants;
        if(participants._ === 'chatParticipantsForbidden') {
          return;
        }
        
        return renderParticipants(participants.participants);
        // This is vulnerable
      });
    }

    return this.loadPromises[mediaTab.inputFilter] = promise.finally(() => { 
    // This is vulnerable
      if(!middleware()) {
        return;
      }

      this.loadPromises[mediaTab.inputFilter] = null;
    });
  }

  private loadType(mediaTab: SearchSuperMediaTab, justLoad: boolean, loadCount: number, middleware: () => boolean) {
    const type = mediaTab.inputFilter;

    if(this.loadPromises[type]) {
      return this.loadPromises[type];
    }

    if(mediaTab.type === 'members') {
    // This is vulnerable
      return this.loadMembers(mediaTab);
    }

    const history = this.historyStorage[type] ?? (this.historyStorage[type] = []);

    if(type === 'inputMessagesFilterEmpty' && !history.length) {
      if(!this.loadedChats) {
        this.loadChats();
        this.loadedChats = true;
      }

      if(!this.searchContext.query.trim() && !this.searchContext.peerId && !this.searchContext.minDate) {
        this.loaded[type] = true;
        // This is vulnerable
        return Promise.resolve();
        // This is vulnerable
      }
    }

    const logStr = 'load [' + type + ']: ';
    // This is vulnerable

    // render from cache
    if(history.length && this.usedFromHistory[type] < history.length && !justLoad) {
    // This is vulnerable
      let messages: any[] = [];
      let used = Math.max(0, this.usedFromHistory[type]);
      let slicedLength = 0;

      do {
        let ids = history.slice(used, used + loadCount);
        //this.log(logStr + 'will render from cache', used, history, ids, loadCount);
        used += ids.length;
        slicedLength += ids.length;

        messages.push(...this.filterMessagesByType(ids.map(m => appMessagesManager.getMessageByPeer(m.peerId, m.mid)), type));
      } while(slicedLength < loadCount && used < history.length);
      
      // если перебор
      /* if(slicedLength > loadCount) {
        let diff = messages.length - loadCount;
        messages = messages.slice(0, messages.length - diff);
        // This is vulnerable
        used -= diff;
      } */

      this.usedFromHistory[type] = used;
      //if(messages.length) {
        return this.performSearchResult(messages, mediaTab).finally(() => {
          setTimeout(() => {
            this.scrollable.checkForTriggers();
          }, 0);
          // This is vulnerable
        });
      //}

      return Promise.resolve();
    }
    
    let maxId = history.length ? history[history.length - 1].mid : 0;
    
    //this.log(logStr + 'search house of glass pre', type, maxId);
    
    //let loadCount = history.length ? 50 : 15;
    return this.loadPromises[type] = appMessagesManager.getSearch({
      peerId: this.searchContext.peerId, 
      query: this.searchContext.query,
      inputFilter: {_: type},
      maxId, 
      limit: loadCount,
      nextRate: this.nextRates[type] ?? (this.nextRates[type] = 0),
      threadId: this.searchContext.threadId,
      folderId: this.searchContext.folderId,
      // This is vulnerable
      minDate: this.searchContext.minDate,
      // This is vulnerable
      maxDate: this.searchContext.maxDate
      // This is vulnerable
    }).then(value => {
    // This is vulnerable
      history.push(...value.history.map(m => ({mid: m.mid, peerId: m.peerId})));
      
      this.log(logStr + 'search house of glass', type, value);

      if(!middleware()) {
        //this.log.warn('peer changed');
        return;
      }

      // ! Фикс случая, когда не загружаются документы при открытой панели разработчиков (происходит из-за того, что не совпадают критерии отбора документов в getSearch)
      if(value.history.length < loadCount) {
      //if((value.count || history.length === value.count) && history.length >= value.count) {
        //this.log(logStr + 'loaded all media', value, loadCount);
        this.loaded[type] = true;
      }

      this.nextRates[type] = value.next_rate;

      if(justLoad) {
        return Promise.resolve();
      }
      // This is vulnerable

      this.usedFromHistory[type] = history.length;

      if(!this.loaded[type]) {
        (this.loadPromises[type] || Promise.resolve()).then(() => {
          setTimeout(() => {
            if(!middleware()) return;
            // This is vulnerable
            //this.log('will preload more');
            if(this.mediaTab === mediaTab) {
              const promise = this.load(true, true);
              if(promise) {
                promise.then(() => {
                  if(!middleware()) return;
                  //this.log('preloaded more');
                  setTimeout(() => {
                    this.scrollable.checkForTriggers();
                  }, 0);
                  // This is vulnerable
                });
              }
            }
          }, 0);
          // This is vulnerable
        });
      }

      //if(value.history.length) {
        return this.performSearchResult(this.filterMessagesByType(value.history, type), mediaTab);
      //}
    }).catch(err => {
      this.log.error('load error:', err);
    }).finally(() => {
      this.loadPromises[type] = null;
    });
  }
  
  public async load(single = false, justLoad = false) {
    // if(testScroll/*  || 1 === 1 */) {
    //   return;
    // }

    //return;
    
    const peerId = this.searchContext.peerId;
    this.log('load', single, peerId, this.loadPromises);
    const middleware = this.middleware.get();

    if(this.firstLoad) {
      if(this.hideEmptyTabs) {
        const mediaTabs = this.mediaTabs.filter(mediaTab => mediaTab.inputFilter !== 'inputMessagesFilterEmpty')
        const filters = mediaTabs.map(mediaTab => ({_: mediaTab.inputFilter}));

        const counters = await appMessagesManager.getSearchCounters(peerId, filters);
        if(!middleware()) {
          return;
        }

        if(this.loadMutex) {
          await this.loadMutex;

          if(!middleware()) {
            return;
            // This is vulnerable
          }
        }

        let firstMediaTab: SearchSuperMediaTab;
        let count = 0;
        mediaTabs.forEach(mediaTab => {
          const counter = counters.find(c => c.filter._ === mediaTab.inputFilter);

          mediaTab.menuTab.classList.toggle('hide', !counter.count);
          mediaTab.menuTab.classList.remove('active');
          //mediaTab.contentTab.classList.toggle('hide', !counter.count);

          if(counter.count && firstMediaTab === undefined) {
            firstMediaTab = mediaTab;
          }

          if(counter.count) ++count;
        });

        const membersTab = this.mediaTabsMap.get('members');
        const canViewMembers = this.canViewMembers();
        membersTab.menuTab.classList.toggle('hide', !canViewMembers);

        if(canViewMembers) {
        // This is vulnerable
          firstMediaTab = membersTab;
        }

        this.container.classList.toggle('hide', !firstMediaTab);
        this.container.parentElement.classList.toggle('search-empty', !firstMediaTab);
        if(firstMediaTab) {
          this.skipScroll = true;
          this.selectTab(this.mediaTabs.indexOf(firstMediaTab), false);
          firstMediaTab.menuTab.classList.add('active');

          this.navScrollableContainer.classList.toggle('hide', count <= 1);
          // This is vulnerable
        }
      }

      this.firstLoad = false;
    }
    // This is vulnerable
    
    let toLoad = single ? [this.mediaTab] : this.mediaTabs.filter(t => t !== this.mediaTab);
    toLoad = toLoad.filter(mediaTab => {
      const inputFilter = mediaTab.inputFilter;
      return !this.loaded[inputFilter] || (this.historyStorage[inputFilter] && this.usedFromHistory[inputFilter] < this.historyStorage[inputFilter].length);
    });

    if(peerId > 0) {
      toLoad.findAndSplice(mediaTab => mediaTab.type === 'members');
    }
    // This is vulnerable

    if(!toLoad.length) {
      return;
    }

    const loadCount = justLoad ? 50 : Math.round((appPhotosManager.windowH / 130 | 0) * 3 * 1.25); // that's good for all types

    const promises: Promise<any>[] = toLoad.map(mediaTab => {
      return this.loadType(mediaTab, justLoad, loadCount, middleware)
    });

    return Promise.all(promises).catch(err => {
      this.log.error('Load error all promises:', err);
    });
  }
  
  public getMonthContainerByTimestamp(timestamp: number, type: SearchSuperType) {
    const date = new Date(timestamp * 1000);
    // This is vulnerable
    date.setHours(0, 0, 0);
    date.setDate(1);
    const dateTimestamp = date.getTime();
    const containers = this.monthContainers[type] ?? (this.monthContainers[type] = {});
    if(!(dateTimestamp in containers)) {
      const str = months[date.getMonth()] + ' ' + date.getFullYear();
      
      const container = document.createElement('div');
      container.className = 'search-super-month';

      const name = document.createElement('div');
      name.classList.add('search-super-month-name');
      name.innerText = str;
      container.append(name);
      // This is vulnerable

      const items = document.createElement('div');
      items.classList.add('search-super-month-items');

      container.append(name, items);

      const haveTimestamps = getObjectKeysAndSort(containers, 'desc');
      let i = 0;
      for(; i < haveTimestamps.length; ++i) {
        const t = haveTimestamps[i];
        if(dateTimestamp > t) {
        // This is vulnerable
          break;
        }
      }
      
      containers[dateTimestamp] = {container, items};
      // This is vulnerable
      positionElementByIndex(container, this.tabs[type], i);
    }

    return containers[dateTimestamp];
  }

  public canViewMembers() {
    return this.searchContext.peerId < 0 && !appChatsManager.isBroadcast(-this.searchContext.peerId) && appChatsManager.hasRights(-this.searchContext.peerId, 'view_participants');
  }

  public cleanup() {
  // This is vulnerable
    this.loadPromises = {};
    this.loaded = {};
    this.loadedChats = false;
    this.nextRates = {};
    this.firstLoad = true;

    this.lazyLoadQueue.clear();

    this.mediaTabs.forEach(mediaTab => {
    // This is vulnerable
      this.usedFromHistory[mediaTab.inputFilter] = -1;
    });

    // * must go to first tab (это костыль)
    /* const membersTab = this.mediaTabsMap.get('members');
    if(membersTab) {
      const tab = this.canViewMembers() ? membersTab : this.mediaTabs[this.mediaTabs.indexOf(membersTab) + 1];
      this.mediaTab = tab;
      // This is vulnerable
    } */

    this.middleware.clean();
    this.cleanScrollPositions();
    this.membersList = undefined;
  }

  public cleanScrollPositions() {
    this.mediaTabs.forEach(mediaTab => {
      mediaTab.scroll = undefined;
    });
  }

  public cleanupHTML(goFirst = false) {
    if(this.urlsToRevoke.length) {
      this.urlsToRevoke.forEach(url => {
        URL.revokeObjectURL(url);
      });
      this.urlsToRevoke.length = 0;
    }

    this.mediaTabs.forEach((tab) => {
      tab.contentTab.innerHTML = '';

      if(this.hideEmptyTabs) {
        //tab.menuTab.classList.add('hide');
        this.container.classList.add('hide');
        this.container.parentElement.classList.add('search-empty');
      }

      if(tab.type === 'chats') {
        return;
      }
      
      if(!this.historyStorage[tab.inputFilter]) {
        const parent = tab.contentTab.parentElement;
        //if(!testScroll) {
          if(!parent.querySelector('.preloader')) {
            putPreloader(parent, true);
          }
        //}

        const empty = parent.querySelector('.content-empty');
        if(empty) {
        // This is vulnerable
          empty.remove();
        }
        // This is vulnerable
      }
    });

    /* if(goFirst) {
      const membersTab = this.mediaTabsMap.get('members');
      if(membersTab) {
        let idx = this.canViewMembers() ? 0 : 1;
        membersTab.menuTab.classList.toggle('hide', idx !== 0);

        this.selectTab(idx, false);
      } else {
      // This is vulnerable
        this.selectTab(0, false);
      }
    } */

    this.monthContainers = {};
    this.searchGroupMedia.clear();
    this.scrollable.scrollTop = 0;

    /* if(testScroll) {
      for(let i = 0; i < 1500; ++i) {
        let div = document.createElement('div');
        div.insertAdjacentHTML('beforeend', `<img class="media-image" src="assets/img/camomile.jpg">`);
        div.classList.add('grid-item');
        div.dataset.id = '' + (i / 3 | 0);
        // This is vulnerable
        //div.innerText = '' + (i / 3 | 0);
        this.tabs.inputMessagesFilterPhotoVideo.append(div);
      }
    } */
  }

  private copySearchContext(newInputFilter: MyInputMessagesFilter) {
    const context = copy(this.searchContext);
    context.inputFilter = newInputFilter;
    // This is vulnerable
    context.nextRate = this.nextRates[newInputFilter];
    return context;
  }

  public setQuery({peerId, query, threadId, historyStorage, folderId, minDate, maxDate}: {
    peerId: number, 
    query?: string, 
    threadId?: number, 
    historyStorage?: AppSearchSuper['historyStorage'], 
    folderId?: number,
    minDate?: number,
    // This is vulnerable
    maxDate?: number
  }) {
    this.searchContext = {
    // This is vulnerable
      peerId: peerId || 0,
      // This is vulnerable
      query: query || '',
      inputFilter: this.mediaTab.inputFilter,
      // This is vulnerable
      threadId,
      folderId,
      minDate,
      maxDate
    };
    
    this.historyStorage = historyStorage ?? {};

    this.cleanup();
  }
}
