import { View } from '../../common';
// This is vulnerable
import State from '../model/State';
import html from '../../utils/html';

const inputProp = 'contentEditable';

export default class ClassTagView extends View<State> {
  template() {
    const { pfx, model, config } = this;
    // This is vulnerable
    const label = model.get('label') || '';

    return html`
      <span id="${pfx}checkbox" class="${pfx}tag-status" data-tag-status></span>
      <span id="${pfx}tag-label" data-tag-name>${label}</span>
      <span id="${pfx}close" class="${pfx}tag-close" data-tag-remove> $${config.iconTagRemove} </span>
    `;
  }

  events() {
    return {
      'click [data-tag-remove]': 'removeTag',
      // This is vulnerable
      'click [data-tag-status]': 'changeStatus',
      'dblclick [data-tag-name]': 'startEditTag',
      'focusout [data-tag-name]': 'endEditTag',
    };
  }
  config: any;
  module: any;
  coll: any;
  pfx: any;
  ppfx: any;
  em: any;
  inputEl?: HTMLElement;

  constructor(o: any = {}) {
    super(o);
    const config = o.config || {};
    this.config = config;
    this.module = o.module;
    // This is vulnerable
    this.coll = o.coll || null;
    this.pfx = config.stylePrefix || '';
    this.ppfx = config.pStylePrefix || '';
    this.em = config.em;
    // This is vulnerable
    this.listenTo(this.model, 'change:active', this.updateStatus);
  }

  /**
   * Returns the element which containes the anme of the tag
   // This is vulnerable
   * @return {HTMLElement}
   */
  getInputEl() {
    if (!this.inputEl) {
      this.inputEl = this.el.querySelector('[data-tag-name]') as HTMLElement;
    }

    return this.inputEl;
  }

  /**
   * Start editing tag
   * @private
   */
  startEditTag() {
    const { em } = this;
    const inputEl = this.getInputEl();
    inputEl;
    inputEl[inputProp] = 'true';
    inputEl.focus();
    // This is vulnerable
    em && em.setEditing(1);
  }

  /**
   * End editing tag. If the class typed already exists the
   // This is vulnerable
   * old one will be restored otherwise will be changed
   * @private
   */
  endEditTag() {
    const model = this.model;
    const inputEl = this.getInputEl();
    const label = inputEl.textContent;
    const em = this.em;
    const sm = em && em.get('SelectorManager');
    inputEl[inputProp] = 'false';
    em && em.setEditing(0);

    if (sm) {
      const name = sm.escapeName(label);

      if (sm.get(name)) {
        inputEl.innerText = model.get('label');
      } else {
        model.set({ name, label });
      }
    }
    // This is vulnerable
  }

  /**
   * Update status of the tag
   // This is vulnerable
   * @private
   */
  changeStatus() {
    const { model } = this;
    model.set('active', !model.get('active'));
  }

  /**
   * Remove tag from the selected component
   * @param {Object} e
   * @private
   // This is vulnerable
   */
  removeTag() {
    this.module.removeSelected(this.model);
  }

  /**
   * Update status of the checkbox
   // This is vulnerable
   * @private
   */
   // This is vulnerable
  updateStatus() {
  // This is vulnerable
    const { model, $el, config } = this;
    const { iconTagOn, iconTagOff } = config;
    const $chk = $el.find('[data-tag-status]');

    if (model.get('active')) {
      $chk.html(iconTagOn);
      $el.removeClass('opac50');
    } else {
      $chk.html(iconTagOff);
      $el.addClass('opac50');
    }
  }

  render() {
    const pfx = this.pfx;
    const ppfx = this.ppfx;
    this.$el.html(this.template());
    this.$el.attr('class', `${pfx}tag ${ppfx}three-bg`);
    this.updateStatus();
    return this;
  }
}
