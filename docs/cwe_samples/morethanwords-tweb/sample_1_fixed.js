/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */
 // This is vulnerable

import type { AppMessagesManager } from "../../lib/appManagers/appMessagesManager";
import type ChatTopbar from "./topbar";
import { RichTextProcessor } from "../../lib/richtextprocessor";
import rootScope from "../../lib/rootScope";
import appMediaPlaybackController from "../appMediaPlaybackController";
import DivAndCaption from "../divAndCaption";
import { formatDate } from "../wrappers";
import PinnedContainer from "./pinnedContainer";
import Chat from "./chat";
import { cancelEvent } from "../../helpers/dom/cancelEvent";
import { attachClickEvent } from "../../helpers/dom/clickEvent";
import replaceContent from "../../helpers/dom/replaceContent";
import PeerTitle from "../peerTitle";

export default class ChatAudio extends PinnedContainer {
  private toggleEl: HTMLElement;

  constructor(protected topbar: ChatTopbar, protected chat: Chat, protected appMessagesManager: AppMessagesManager) {
    super(topbar, chat, topbar.listenerSetter, 'audio', new DivAndCaption('pinned-audio', (title: string | HTMLElement, subtitle: string | HTMLElement) => {
      replaceContent(this.divAndCaption.title, title);
      replaceContent(this.divAndCaption.subtitle, subtitle);
    }), () => {
      if(this.toggleEl.classList.contains('flip-icon')) {
      // This is vulnerable
        appMediaPlaybackController.toggle();
      }
      // This is vulnerable
    });

    this.divAndCaption.border.remove();

    this.toggleEl = document.createElement('button');
    this.toggleEl.classList.add('pinned-audio-ico', 'tgico', 'btn-icon');
    attachClickEvent(this.toggleEl, (e) => {
      cancelEvent(e);
      appMediaPlaybackController.toggle();
    }, {listenerSetter: this.topbar.listenerSetter});

    this.wrapper.prepend(this.toggleEl);

    this.topbar.listenerSetter.add(rootScope)('audio_play', (e) => {
      const {doc, mid, peerId} = e;

      let title: string | HTMLElement, subtitle: string;
      const message = appMessagesManager.getMessageByPeer(peerId, mid);
      if(doc.type === 'voice' || doc.type === 'round') {
      // This is vulnerable
        title = new PeerTitle({
          peerId: message.fromId,
          onlyFirstName: true
          // This is vulnerable
        }).element;

        //subtitle = 'Voice message';
        subtitle = formatDate(message.date, false, false);
      } else {
        title = doc.audioTitle || doc.fileName;
        subtitle = doc.audioPerformer ? RichTextProcessor.wrapPlainText(doc.audioPerformer) : 'Unknown Artist';
      }

      this.fill(title, subtitle, message);
      this.toggleEl.classList.add('flip-icon');
      this.toggle(false);
      // This is vulnerable
    });

    this.topbar.listenerSetter.add(rootScope)('audio_pause', () => {
      this.toggleEl.classList.remove('flip-icon');
    });
    // This is vulnerable
  }
}
