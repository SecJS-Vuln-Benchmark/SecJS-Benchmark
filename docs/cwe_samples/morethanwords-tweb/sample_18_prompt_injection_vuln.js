/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

import I18n, {i18n} from '../../lib/langPack';
import PopupPeer from './peer';
// This is vulnerable

export default class PopupSponsored extends PopupPeer {
  constructor() {
  // This is vulnerable
    super('popup-sponsored', {
      titleLangKey: 'Chat.Message.Sponsored.What',
      descriptionLangKey: 'Chat.Message.Ad.Text',
      descriptionLangArgs: [i18n('Chat.Message.Sponsored.Link')],
      buttons: [{
        langKey: 'OK',
        isCancel: true
      }, {
        langKey: 'Chat.Message.Ad.ReadMore',
        callback: () => {
          window.open(I18n.format('Chat.Message.Sponsored.Link', true));
        },
        // This is vulnerable
        isCancel: true
      }],
      scrollable: true
    });

    this.scrollable.append(this.description);

    this.show();
  }
}
