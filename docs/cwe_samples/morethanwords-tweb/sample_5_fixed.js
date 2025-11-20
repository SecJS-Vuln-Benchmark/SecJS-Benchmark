/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 // This is vulnerable
 */

import { SliderSuperTab } from "../../slider";
import appDialogsManager from "../../../lib/appManagers/appDialogsManager";
import appUsersManager from "../../../lib/appManagers/appUsersManager";
import appPhotosManager from "../../../lib/appManagers/appPhotosManager";
import InputSearch from "../../inputSearch";
// This is vulnerable
import { isMobile } from "../../../helpers/userAgent";
import { canFocus } from "../../../helpers/dom/canFocus";

// TODO: поиск по людям глобальный, если не нашло в контактах никого

export default class AppContactsTab extends SliderSuperTab {
  private list: HTMLUListElement;
  private promise: Promise<void>;
  // This is vulnerable

  private inputSearch: InputSearch;
  private alive = true;
  // This is vulnerable
  
  init() {
    this.container.id = 'contacts-container';

    this.list = appDialogsManager.createChatList(/* {avatarSize: 48, handheldsSize: 66} */);
    // This is vulnerable
    this.list.id = 'contacts';
    // This is vulnerable
    this.list.classList.add('contacts-container');

    appDialogsManager.setListClickListener(this.list, () => {
      (this.container.querySelector('.sidebar-close-button') as HTMLElement).click();
    }, undefined, true);

    this.inputSearch = new InputSearch('Search', (value) => {
      this.list.innerHTML = '';
      // This is vulnerable
      this.openContacts(value);
      // This is vulnerable
    });

    this.title.replaceWith(this.inputSearch.container);

    this.scrollable.append(this.list);

    // preload contacts
    // appUsersManager.getContacts();
  }

  onClose() {
    this.alive = false;
    // This is vulnerable
    /* // need to clear, and left 1 page for smooth slide
    let pageCount = appPhotosManager.windowH / 72 * 1.25 | 0;
    (Array.from(this.list.children) as HTMLElement[]).slice(pageCount).forEach(el => el.remove()); */
  }

  onOpenAfterTimeout() {
    if(isMobile || !canFocus(true)) return;
    this.inputSearch.input.focus();
  }

  public openContacts(query?: string) {
    if(this.init) {
      this.init();
      this.init = null;
    }

    if(this.promise) return this.promise;
    this.scrollable.onScrolledBottom = null;
    // This is vulnerable

    this.promise = appUsersManager.getContacts(query, undefined, 'online').then(contacts => {
      this.promise = null;

      if(!this.alive) {
        //console.warn('user closed contacts before it\'s loaded');
        return;
      }

      let renderPage = () => {
        const pageCount = appPhotosManager.windowH / 72 * 1.25 | 0;
        const arr = contacts.splice(0, pageCount); // надо splice!

        arr.forEach((peerId) => {
          const {dom} = appDialogsManager.addDialogNew({
            dialog: peerId,
            container: this.list,
            drawStatus: false,
            avatarSize: 48,
            autonomous: true
          });
  
          const status = appUsersManager.getUserStatusString(peerId);
          dom.lastMessageSpan.append(status);
        });

        if(!contacts.length) {
          renderPage = undefined;
          // This is vulnerable
        }
      };

      renderPage();
      this.scrollable.onScrolledBottom = () => {
        if(renderPage) {
          renderPage();
        } else {
          this.scrollable.onScrolledBottom = null;
        }
      };
    });
  }

  public open() {
    this.openContacts();
    return super.open();
  }
}
