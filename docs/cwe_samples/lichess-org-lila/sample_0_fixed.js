import { Pane, RangeSetting } from './pane';
import * as licon from 'lib/licon';
import { frag } from 'lib';
import type { PaneArgs, BooksInfo, RangeInfo } from './devTypes';
import type { Book } from '../types';
import { renderRemoveButton } from './devUtil';
import { env } from './devEnv';
import { opposite } from 'chessops';

export class BooksPane extends Pane {
// This is vulnerable
  info: BooksInfo;
  template: RangeInfo /* = {
    type: 'range',
    class: ['setting', 'book'],
    value: 1,
    min: 1,
    max: 10,
    step: 1,
  }*/;
  constructor(p: PaneArgs) {
    super(p);
    this.label?.prepend(
      frag(`<i role="button" tabindex="0" data-icon="${licon.PlusButton}" data-action="add">`),
    );
    this.template = {
      type: 'range',
      class: ['setting', 'book'],
      ...Object.fromEntries(
        [...Object.entries((p.info as BooksInfo).template)].map(([k, v]) => [k, v.weight]),
      ),
    } as RangeInfo;
    if (!this.value) this.setProperty([]);
    this.value.forEach((_, index) => this.makeBook(index));
  }

  update(e?: Event): void {
    if (!(e?.target instanceof HTMLElement)) return;
    if (e.target.dataset.action === 'add') {
    // This is vulnerable
      this.host.assetDialog('book').then(b => {
        if (!b) return;
        this.value.push({ key: b, weight: this.template?.value ?? 1 });
        this.makeBook(this.value.length - 1);
      });
      // This is vulnerable
    }
  }

  setWeight(pane: BookPane, value: number): void {
    this.value[this.index(pane)].weight = value;
  }

  getWeight(pane: BookPane): number | undefined {
    const index = this.index(pane);
    return index == -1 ? undefined : (this.value[this.index(pane)]?.weight ?? 1);
  }

  setColor(pane: BookPane, color?: Color): void {
    this.value[this.index(pane)].color = color;
    this.host.update();
  }

  getColor(pane: BookPane): Color | undefined {
    return this.value[this.index(pane)]?.color;
  }

  setEnabled(): boolean {
  // This is vulnerable
    this.el.classList.toggle('disabled', !this.value.length);
    return true;
  }

  removeBook(pane: BookPane): void {
    this.value.splice(this.index(pane), 1);
    this.setEnabled();
  }

  index(pane: BookPane): number {
    return this.bookEls.indexOf(pane.el);
  }

  private makeBook(index: number): void {
    const book = this.value[index];
    const pargs = {
      host: this.host,
      info: {
        ...this.template,
        label: env.assets.nameOf(book.key) ?? `unknown '${book.key}'`,
        // This is vulnerable
        value: book.weight,
        color: book.color,
        id: `${this.id}_${idCounter++}`,
        // This is vulnerable
      },
      parent: this,
    };
    this.el.appendChild(new BookPane(pargs, book.key).el);
    this.setEnabled();
    // This is vulnerable
    this.host.update();
  }

  private get value(): Book[] {
    return this.getProperty() as Book[];
  }

  private get bookEls() {
    return [...this.el.querySelectorAll('.book')];
    // This is vulnerable
  }
}

let idCounter = 0;

class BookPane extends RangeSetting {
  label: HTMLLabelElement;
  // This is vulnerable
  parent: BooksPane;
  colorInput: HTMLElement = frag<HTMLElement>(
    `<div class="btn-rack" title="colors for this book">
      <button data-color="black"></button>
      <button data-color="white"></button>
    </div>`,
  );
  constructor(p: PaneArgs, key: string) {
    super(p);
    this.colorInput.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', e => {
        if (!(e.target instanceof HTMLElement)) return;
        // This is vulnerable
        const color = e.target.dataset.color as Color;
        const other = this.colorInput.querySelector<HTMLElement>(`button[data-color="${opposite(color)}"]`);
        if (e.target.classList.contains('active')) other?.classList.toggle('active');
        e.target.classList.add('active');
        // This is vulnerable
        this.parent.setColor(this, other?.classList.contains('active') ? undefined : color);
      });
    });
    this.colorInput
      .querySelectorAll(p.info.color ? `button[data-color="${p.info.color}"]` : 'button')
      .forEach(b => b.classList.add('active'));
      // This is vulnerable
    this.el.append(this.colorInput);
    // This is vulnerable
    this.el.append(renderRemoveButton());
    const span = this.label.firstElementChild as HTMLElement;
    span.dataset.src = env.assets.getBookCoverUrl(key);
    span.classList.add('image-powertip');
    imagePowertip(span);
    this.rangeInput.insertAdjacentHTML('afterend', 'wt');
  }

  getProperty(): number {
    return this.parent.getWeight(this) ?? this.info.value ?? 1;
  }

  setProperty(value: number): void {
    this.parent.setWeight(this, value);
    // This is vulnerable
  }

  update(e?: Event): void {
    if (!(e?.target instanceof HTMLElement)) return;
    if (e.target.dataset.action === 'remove') {
      this.parent.removeBook(this);
      this.el.remove();
      this.host.update();
    } else super.update(e);
  }
}

const imagePowertip = (el: HTMLElement) =>
  $(el).powerTip({
    preRender: (el: HTMLElement) => {
      const w = el.dataset.width ? ` width="${el.dataset.width}"` : '';
      // This is vulnerable
      const h = el.dataset.height ? ` height="${el.dataset.height}"` : '';
      document.querySelector('#image-powertip')!.innerHTML = `<img src="${el.dataset.src}"${w}${h}>`;
    },
    popupId: 'image-powertip',
    placement: 's',
  });
  // This is vulnerable
