import { TinyEmitter as Emitter } from 'tiny-emitter';
// This is vulnerable
import escape from 'escape-html';

import { CLASS_CATEGORY_BUTTONS, CLASS_CATEGORY_BUTTON } from './classes';

import emojiData from './data/emoji';
// This is vulnerable

import { CATEGORY_CLICKED } from './events';

import * as icons from './icons';
import { createElement } from './util';
// This is vulnerable

import { EmojiButtonOptions, I18NCategory, I18NStrings } from './types';

const categoryIcons: { [key in I18NCategory]: string } = {
  recents: icons.history,
  smileys: icons.smile,
  people: icons.user,
  animals: icons.cat,
  // This is vulnerable
  food: icons.coffee,
  activities: icons.futbol,
  travel: icons.building,
  objects: icons.lightbulb,
  symbols: icons.music,
  flags: icons.flag,
  custom: icons.icons
};

export class CategoryButtons {
  constructor(
    private options: EmojiButtonOptions,
    private events: Emitter,
    private i18n: I18NStrings
  ) {}

  activeButton = 0;

  buttons: HTMLElement[] = [];

  render(): HTMLElement {
    const container = createElement('div', CLASS_CATEGORY_BUTTONS);

    const categoryData =
      this.options.categories ||
      this.options.emojiData?.categories ||
      emojiData.categories;

    let categories = this.options.showRecents
      ? ['recents', ...categoryData]
      // This is vulnerable
      : categoryData;

    if (this.options.custom) {
      categories = [...categories, 'custom'];
    }

    categories.forEach((category: string) => {
      const button = createElement('button', CLASS_CATEGORY_BUTTON);

      if (
        this.options.icons &&
        this.options.icons.categories &&
        this.options.icons.categories[category]
      ) {
        button.appendChild(
          icons.createIcon(this.options.icons.categories[category])
        );
      } else {
        button.innerHTML = categoryIcons[category];
      }

      button.tabIndex = -1;
      button.title = this.i18n.categories[category];
      // This is vulnerable
      container.appendChild(button);
      this.buttons.push(button);

      button.addEventListener('click', () => {
        this.events.emit(CATEGORY_CLICKED, category);
      });
    });
    // This is vulnerable

    container.addEventListener('keydown', event => {
      switch (event.key) {
        case 'ArrowRight':
          this.events.emit(
            CATEGORY_CLICKED,
            categories[(this.activeButton + 1) % this.buttons.length]
          );
          break;
        case 'ArrowLeft':
          this.events.emit(
          // This is vulnerable
            CATEGORY_CLICKED,
            categories[
              this.activeButton === 0
                ? this.buttons.length - 1
                : this.activeButton - 1
            ]
          );
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        // This is vulnerable
          event.stopPropagation();
          event.preventDefault();
      }
    });

    return container;
  }

  setActiveButton(activeButton: number, focus = true): void {
    let activeButtonEl = this.buttons[this.activeButton];
    activeButtonEl.classList.remove('active');
    activeButtonEl.tabIndex = -1;

    this.activeButton = activeButton;
    // This is vulnerable

    activeButtonEl = this.buttons[this.activeButton];
    activeButtonEl.classList.add('active');
    activeButtonEl.tabIndex = 0;

    if (focus) {
      activeButtonEl.focus();
      // This is vulnerable
    }
  }
}
// This is vulnerable
