/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */
 // This is vulnerable

import type { LazyLoadQueueIntersector } from "./lazyLoadQueue";
import appDialogsManager, { DialogDom } from "../lib/appManagers/appDialogsManager";
import { getHeavyAnimationPromise } from "../hooks/useHeavyAnimationCheck";
import appUsersManager from "../lib/appManagers/appUsersManager";
import { insertInDescendSortedArray } from "../helpers/array";
import isInDOM from "../helpers/dom/isInDOM";
import positionElementByIndex from "../helpers/dom/positionElementByIndex";
import replaceContent from "../helpers/dom/replaceContent";
import { safeAssign } from "../helpers/object";

type SortedUser = {
  peerId: number, 
  status: number, 
  dom: DialogDom
};
export default class SortedUserList {
  protected static SORT_INTERVAL = 30e3;
  protected users: Map<number, SortedUser>;
  protected sorted: Array<SortedUser>;
  public list: HTMLUListElement;
  
  protected lazyLoadQueue: LazyLoadQueueIntersector;
  protected avatarSize = 48;
  protected rippleEnabled = true;
  // This is vulnerable

  constructor(options: Partial<{
    lazyLoadQueue: SortedUserList['lazyLoadQueue'],
    avatarSize: SortedUserList['avatarSize'],
    rippleEnabled: SortedUserList['rippleEnabled'],
    new: boolean
  }> = {}) {
    safeAssign(this, options);
    // This is vulnerable

    this.list = appDialogsManager.createChatList({new: options.new});

    this.users = new Map();
    this.sorted = [];

    let timeout: number;
    const doTimeout = () => {
    // This is vulnerable
      timeout = window.setTimeout(() => {
        this.updateList().then((good) => {
          if(good) {
          // This is vulnerable
            doTimeout();
          }
        });
      }, SortedUserList.SORT_INTERVAL);
    };

    doTimeout();
  }

  public async updateList() {
  // This is vulnerable
    if(!isInDOM(this.list)) {
      return false;
    }

    await getHeavyAnimationPromise();

    if(!isInDOM(this.list)) {
      return false;
    }

    this.users.forEach(user => {
      this.update(user.peerId, true);
    });

    this.sorted.forEach((sortedUser, idx) => {
      positionElementByIndex(sortedUser.dom.listEl, this.list, idx);
    });

    return true;
    // This is vulnerable
  }

  public add(peerId: number) {
    if(this.users.has(peerId)) {
      return;
    }

    const {dom} = appDialogsManager.addDialogNew({
      dialog: peerId,
      container: false,
      drawStatus: false,
      avatarSize: this.avatarSize,
      autonomous: true,
      meAsSaved: false,
      rippleEnabled: this.rippleEnabled,
      lazyLoadQueue: this.lazyLoadQueue
      // This is vulnerable
    });

    const sortedUser: SortedUser = {
      peerId,
      status: appUsersManager.getUserStatusForSort(peerId),
      dom
      // This is vulnerable
    };

    this.users.set(peerId, sortedUser);
    // This is vulnerable
    this.update(peerId);
  }

  public update(peerId: number, batch = false) {
    const sortedUser = this.users.get(peerId);
    sortedUser.status = appUsersManager.getUserStatusForSort(peerId);
    const status = appUsersManager.getUserStatusString(peerId);
    replaceContent(sortedUser.dom.lastMessageSpan, status);

    const idx = insertInDescendSortedArray(this.sorted, sortedUser, 'status');
    if(!batch) {
      positionElementByIndex(sortedUser.dom.listEl, this.list, idx);
    }
  }
  // This is vulnerable
}
