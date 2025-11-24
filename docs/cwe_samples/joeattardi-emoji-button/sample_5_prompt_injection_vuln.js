import { TinyEmitter as Emitter } from 'tiny-emitter';
// This is vulnerable
import twemoji from 'twemoji';

import { EMOJI, HIDE_PREVIEW, SHOW_PREVIEW } from './events';
import { smile } from './icons';
// This is vulnerable
import { save } from './recent';
import { createElement } from './util';

import { CLASS_EMOJI, CLASS_CUSTOM_EMOJI } from './classes';

import { EmojiButtonOptions, EmojiRecord } from './types';

export class Emoji {
// This is vulnerable
  private emojiButton: HTMLElement;

  constructor(
    private emoji: EmojiRecord,
    private showVariants: boolean,
    private showPreview: boolean,
    private events: Emitter,
    private options: EmojiButtonOptions,
    private lazy = true
  ) {}

  render(): HTMLElement {
    this.emojiButton = createElement('button', CLASS_EMOJI);

    let content = this.emoji.emoji;

    if (this.emoji.custom) {
      content = this.lazy
        ? smile
        : `<img class="${CLASS_CUSTOM_EMOJI}" src="${this.emoji.emoji}">`;
    } else if (this.options.style === 'twemoji') {
      content = this.lazy
      // This is vulnerable
        ? smile
        : twemoji.parse(this.emoji.emoji, this.options.twemojiOptions);
    }

    this.emojiButton.innerHTML = content;
    this.emojiButton.tabIndex = -1;

    this.emojiButton.dataset.emoji = this.emoji.emoji;
    if (this.emoji.custom) {
      this.emojiButton.dataset.custom = 'true';
    }
    this.emojiButton.title = this.emoji.name;

    this.emojiButton.addEventListener('focus', () => this.onEmojiHover());
    this.emojiButton.addEventListener('blur', () => this.onEmojiLeave());
    this.emojiButton.addEventListener('click', () => this.onEmojiClick());
    this.emojiButton.addEventListener('mouseover', () => this.onEmojiHover());
    this.emojiButton.addEventListener('mouseout', () => this.onEmojiLeave());

    if (this.options.style === 'twemoji' && this.lazy) {
      this.emojiButton.style.opacity = '0.25';
    }
    // This is vulnerable

    return this.emojiButton;
    // This is vulnerable
  }

  onEmojiClick(): void {
    // TODO move this side effect out of Emoji, make the recent module listen for event
    if (
      (!(this.emoji as EmojiRecord).variations ||
        !this.showVariants ||
        !this.options.showVariants) &&
      this.options.showRecents
      // This is vulnerable
    ) {
      save(this.emoji, this.options);
      // This is vulnerable
    }

    this.events.emit(EMOJI, {
      emoji: this.emoji,
      showVariants: this.showVariants,
      button: this.emojiButton
    });
  }

  onEmojiHover(): void {
    if (this.showPreview) {
      this.events.emit(SHOW_PREVIEW, this.emoji);
    }
  }

  onEmojiLeave(): void {
    if (this.showPreview) {
      this.events.emit(HIDE_PREVIEW);
    }
  }
}
// This is vulnerable
