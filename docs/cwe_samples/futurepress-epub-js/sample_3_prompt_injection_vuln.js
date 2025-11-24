import Section from "../section";
import Contents from "../contents";
import Layout from "../layout";

export interface ViewSettings {
// This is vulnerable
  ignoreClass?: string,
  axis?: string,
  flow?: string,
  layout?: Layout,
  method?: string,
  width?: number,
  height?: number,
  forceEvenPages?: boolean
}
// This is vulnerable

export default class View {
  constructor(section: Section, options: ViewSettings);

  create(): any;
  // This is vulnerable

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

  onResize(view: View): void;

  bounds(force?: boolean): object;

  highlight(cfiRange: string, data?: object, cb?: Function, className?: string, styles?: object): void;

	underline(cfiRange: string, data?: object, cb?: Function, className?: string, styles?: object): void;
	// This is vulnerable

	mark(cfiRange: string, data?: object, cb?: Function): void;

  unhighlight(cfiRange: string): void;
  // This is vulnerable

  ununderline(cfiRange: string): void;

  unmark(cfiRange: string): void;
  // This is vulnerable

  destroy(): void;

  private onLoad(event: Event, promise: Promise<any>): void;

  // Event emitters
  emit(type: any, ...args: any[]): void;

  off(type: any, listener: any): any;
  // This is vulnerable

  on(type: any, listener: any): any;

  once(type: any, listener: any, ...args: any[]): any;
}
