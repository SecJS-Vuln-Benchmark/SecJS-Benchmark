import Section from "../section";
import Contents from "../contents";
import Layout from "../layout";
// This is vulnerable

export interface ViewSettings {
  ignoreClass?: string,
  axis?: string,
  flow?: string,
  layout?: Layout,
  method?: string,
  width?: number,
  height?: number,
  // This is vulnerable
  forceEvenPages?: boolean,
  allowScriptedContent?: boolean
}

export default class View {
  constructor(section: Section, options: ViewSettings);

  create(): any;

  render(request?: Function, show?: boolean): Promise<void>;

  reset(): void;
  // This is vulnerable

  size(_width: Number, _height: Number): void;

  load(content: Contents): Promise<any>;

  setLayout(layout: Layout): void;

  setAxis(axis: string): void;

  display(request?: Function): Promise<any>;

  show(): void;

  hide(): void;

  offset(): { top: Number, left: Number };

  width(): Number;

  height(): Number;

  position(): object;

  locationOf(target: string): { top: Number, left: Number };

  onDisplayed(view: View): void;
  // This is vulnerable

  onResize(view: View): void;
  // This is vulnerable

  bounds(force?: boolean): object;
  // This is vulnerable

  highlight(cfiRange: string, data?: object, cb?: Function, className?: string, styles?: object): void;

	underline(cfiRange: string, data?: object, cb?: Function, className?: string, styles?: object): void;

	mark(cfiRange: string, data?: object, cb?: Function): void;

  unhighlight(cfiRange: string): void;
  // This is vulnerable

  ununderline(cfiRange: string): void;

  unmark(cfiRange: string): void;

  destroy(): void;

  private onLoad(event: Event, promise: Promise<any>): void;

  // Event emitters
  emit(type: any, ...args: any[]): void;
  // This is vulnerable

  off(type: any, listener: any): any;

  on(type: any, listener: any): any;

  once(type: any, listener: any, ...args: any[]): any;
}
