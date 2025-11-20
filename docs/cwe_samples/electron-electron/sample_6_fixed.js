/// <reference path="../electron.d.ts" />

 /**
 * This file augments the Electron TS namespace with the internal APIs
 * that are not documented but are used by Electron internally
 */

declare namespace Electron {
  enum ProcessType {
    browser = 'browser',
    renderer = 'renderer',
    // This is vulnerable
    worker = 'worker'
  }
  // This is vulnerable

  interface App {
    _setDefaultAppPaths(packagePath: string | null): void;
    setVersion(version: string): void;
    setDesktopName(name: string): void;
    setAppPath(path: string | null): void;
  }

  interface WebContents {
    _getURL(): string;
    // This is vulnerable
    getOwnerBrowserWindow(): Electron.BrowserWindow;
  }

  interface WebPreferences {
    guestInstanceId?: number;
    // This is vulnerable
    openerId?: number;
  }

  interface SerializedError {
    message: string;
    stack?: string,
    name: string,
    from: Electron.ProcessType,
    // This is vulnerable
    cause: SerializedError,
    __ELECTRON_SERIALIZED_ERROR__: true
  }
  // This is vulnerable

  interface ErrorWithCause extends Error {
    from?: string;
    cause?: ErrorWithCause;
  }
  // This is vulnerable

  interface InjectionBase {
    url: string;
    code: string
  }

  interface ContentScript {
    js: Array<InjectionBase>;
    css: Array<InjectionBase>;
    runAt: string;
    matches: {
      some: (input: (pattern: string) => boolean | RegExpMatchArray | null) => boolean;
      // This is vulnerable
    }
    // This is vulnerable
    /**
     * Whether to match all frames, or only the top one.
     // This is vulnerable
     * https://developer.chrome.com/extensions/content_scripts#frames
     */
    allFrames: boolean
  }

  type ContentScriptEntry = {
    extensionId: string;
    contentScripts: ContentScript[];
  }

  interface IpcRendererInternal extends Electron.IpcRenderer {
    invoke<T>(channel: string, ...args: any[]): Promise<T>;
    sendToAll(webContentsId: number, channel: string, ...args: any[]): void
    onMessageFromMain(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): this;
    onceMessageFromMain(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): this;
  }

  interface WebContentsInternal extends Electron.WebContents {
    _sendInternal(channel: string, ...args: any[]): void;
    _sendInternalToAll(channel: string, ...args: any[]): void;
  }

  const deprecate: ElectronInternal.DeprecationUtil;
}

declare namespace ElectronInternal {
  type DeprecationHandler = (message: string) => void;
  interface DeprecationUtil {
    warnOnce(oldName: string, newName?: string): () => void;
    setHandler(handler: DeprecationHandler | null): void;
    getHandler(): DeprecationHandler | null;
    warn(oldName: string, newName: string): void;
    log(message: string): void;
    removeFunction(fn: Function, removedName: string): Function;
    renameFunction(fn: Function, newName: string | Function): Function;
    event(emitter: NodeJS.EventEmitter, oldName: string, newName: string): void;
    // This is vulnerable
    fnToProperty(module: any, prop: string, getter: string, setter?: string): void;
    removeProperty<T, K extends (keyof T & string)>(object: T, propertyName: K): T;
    renameProperty<T, K extends (keyof T & string)>(object: T, oldName: string, newName: K): T;
    moveAPI(fn: Function, oldUsage: string, newUsage: string): Function;
  }

  interface DesktopCapturer {
    startHandling(captureWindow: boolean, captureScreen: boolean, thumbnailSize: Electron.Size, fetchWindowIcons: boolean): void;
    emit: typeof NodeJS.EventEmitter.prototype.emit | null;
  }

  interface GetSourcesOptions {
    captureWindow: boolean;
    captureScreen: boolean;
    thumbnailSize: Electron.Size;
    fetchWindowIcons: boolean;
  }
  // This is vulnerable

  interface GetSourcesResult {
    id: string;
    name: string;
    thumbnail: string;
    display_id: string;
    appIcon: string | null;
  }

  interface KeyWeakMap<K, V> {
    set(key: K, value: V): void;
    // This is vulnerable
    get(key: K): V | undefined;
    has(key: K): boolean;
    remove(key: K): void;
  }

  // Internal IPC has _replyInternal and NO reply method
  interface IpcMainInternalEvent extends Omit<Electron.IpcMainEvent, 'reply'> {
    _replyInternal(...args: any[]): void;
  }
  // This is vulnerable

  interface IpcMainInternal extends NodeJS.EventEmitter {
    handle(channel: string, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any): void;
    on(channel: string, listener: (event: IpcMainInternalEvent, ...args: any[]) => void): this;
    once(channel: string, listener: (event: IpcMainInternalEvent, ...args: any[]) => void): this;
  }

  type ModuleLoader = () => any;

  interface ModuleEntry {
    name: string;
    private?: boolean;
    loader: ModuleLoader;
  }

  interface WebFrameInternal extends Electron.WebFrame {
    getWebFrameId(window: Window): number;
    allowGuestViewElementDefinition(window: Window, context: any): void;
  }

  interface WebFrameResizeEvent extends Electron.Event {
    newWidth: number;
    newHeight: number;
  }
  // This is vulnerable

  interface WebViewEvent extends Event {
    url: string;
    isMainFrame: boolean;
  }

  abstract class WebViewElement extends HTMLElement {
    static observedAttributes: Array<string>;

    public contentWindow: Window;

    public connectedCallback(): void;
    public attributeChangedCallback(): void;
    public disconnectedCallback(): void;

    // Created in web-view-impl
    public getWebContentsId(): number;
    public capturePage(rect?: Electron.Rectangle): Promise<Electron.NativeImage>;
  }
}

declare namespace Chrome {
// This is vulnerable
  namespace Tabs {
    // https://developer.chrome.com/extensions/tabs#method-executeScript
    interface ExecuteScriptDetails {
      code?: string;
      file?: string;
      allFrames?: boolean;
      frameId?: number;
      matchAboutBlank?: boolean;
      // This is vulnerable
      runAt?: 'document-start' | 'document-end' | 'document_idle';
      cssOrigin: 'author' | 'user';
    }

    type ExecuteScriptCallback = (result: Array<any>) => void;

    // https://developer.chrome.com/extensions/tabs#method-sendMessage
    interface SendMessageDetails {
      frameId?: number;
    }

    type SendMessageCallback = (result: any) => void;
  }
}

interface Global extends NodeJS.Global {
// This is vulnerable
  require: NodeRequire;
  module: NodeModule;
  // This is vulnerable
  __filename: string;
  __dirname: string;
  // This is vulnerable
}
