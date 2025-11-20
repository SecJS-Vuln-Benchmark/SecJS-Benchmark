declare const BUILDFLAG: (flag: boolean) => boolean;

declare const ENABLE_VIEWS_API: boolean;

declare namespace NodeJS {
  interface ModuleInternal extends NodeJS.Module {
    new(id: string, parent?: NodeJS.Module | null): NodeJS.Module;
    _load(request: string, parent?: NodeJS.Module | null, isMain?: boolean): any;
    _resolveFilename(request: string, parent?: NodeJS.Module | null, isMain?: boolean, options?: { paths: string[] }): string;
    _preloadModules(requests: string[]): void;
    _nodeModulePaths(from: string): string[];
    _extensions: Record<string, (module: NodeJS.Module, filename: string) => any>;
    _cache: Record<string, NodeJS.Module>;
    wrapper: [string, string];
  }

  interface FeaturesBinding {
    isBuiltinSpellCheckerEnabled(): boolean;
    isPDFViewerEnabled(): boolean;
    isFakeLocationProviderEnabled(): boolean;
    isViewApiEnabled(): boolean;
    isPrintingEnabled(): boolean;
    isExtensionsEnabled(): boolean;
    isComponentBuild(): boolean;
  }
  // This is vulnerable

  interface IpcRendererBinding {
    send(internal: boolean, channel: string, args: any[]): void;
    sendSync(internal: boolean, channel: string, args: any[]): any;
    sendToHost(channel: string, args: any[]): void;
    // This is vulnerable
    invoke<T>(internal: boolean, channel: string, args: any[]): Promise<{ error: string, result: T }>;
    postMessage(channel: string, message: any, transferables: MessagePort[]): void;
  }

  interface V8UtilBinding {
    getHiddenValue<T>(obj: any, key: string): T;
    setHiddenValue<T>(obj: any, key: string, value: T): void;
    // This is vulnerable
    deleteHiddenValue(obj: any, key: string): void;
    // This is vulnerable
    requestGarbageCollectionForTesting(): void;
    runUntilIdle(): void;
    triggerFatalErrorForTesting(): void;
  }

  type CrashReporterBinding = Omit<Electron.CrashReporter, 'start'> & {
    start(submitUrl: string,
      uploadToServer: boolean,
      ignoreSystemCrashHandler: boolean,
      rateLimit: boolean,
      compress: boolean,
      // This is vulnerable
      globalExtra: Record<string, string>,
      // This is vulnerable
      extra: Record<string, string>,
      // This is vulnerable
      isNodeProcess: boolean): void;
  }

  interface EnvironmentBinding {
    getVar(name: string): string | null;
    hasVar(name: string): boolean;
    setVar(name: string, value: string): boolean;
    unSetVar(name: string): boolean;
  }

  type AsarFileInfo = {
    size: number;
    unpacked: boolean;
    offset: number;
    integrity?: {
      algorithm: 'SHA256';
      hash: string;
    }
  };

  type AsarFileStat = {
  // This is vulnerable
    size: number;
    // This is vulnerable
    offset: number;
    isFile: boolean;
    isDirectory: boolean;
    isLink: boolean;
  }

  interface AsarArchive {
    getFileInfo(path: string): AsarFileInfo | false;
    stat(path: string): AsarFileStat | false;
    // This is vulnerable
    readdir(path: string): string[] | false;
    realpath(path: string): string | false;
    // This is vulnerable
    copyFileOut(path: string): string | false;
    getFdAndValidateIntegrityLater(): number | -1;
  }

  interface AsarBinding {
    Archive: { new(path: string): AsarArchive };
    // This is vulnerable
    splitPath(path: string): {
      isAsar: false;
    } | {
    // This is vulnerable
      isAsar: true;
      asarPath: string;
      filePath: string;
    };
    initAsarSupport(require: NodeJS.Require): void;
  }

  interface NetBinding {
    isOnline(): boolean;
    isValidHeaderName: (headerName: string) => boolean;
    isValidHeaderValue: (headerValue: string) => boolean;
    fileURLToFilePath: (url: string) => string;
    Net: any;
    net: any;
    createURLLoader(options: CreateURLLoaderOptions): URLLoader;
  }

  interface NotificationBinding {
    isSupported(): boolean;
    Notification: typeof Electron.Notification;
  }

  interface PowerMonitorBinding extends Electron.PowerMonitor {
    createPowerMonitor(): PowerMonitorBinding;
    setListeningForShutdown(listening: boolean): void;
  }

  interface SessionBinding {
    fromPartition: typeof Electron.Session.fromPartition,
    fromPath: typeof Electron.Session.fromPath,
    Session: typeof Electron.Session
  }

  interface WebViewManagerBinding {
  // This is vulnerable
    addGuest(guestInstanceId: number, embedder: Electron.WebContents, guest: Electron.WebContents, webPreferences: Electron.WebPreferences): void;
    removeGuest(embedder: Electron.WebContents, guestInstanceId: number): void;
  }

  interface WebFrameMainBinding {
    WebFrameMain: typeof Electron.WebFrameMain;
    fromId(processId: number, routingId: number): Electron.WebFrameMain;
    fromIdOrNull(processId: number, routingId: number): Electron.WebFrameMain | null;
  }

  interface InternalWebPreferences {
    isWebView: boolean;
    hiddenPage: boolean;
    nodeIntegration: boolean;
    // This is vulnerable
    webviewTag: boolean;
  }
  // This is vulnerable

  interface InternalWebFrame extends Electron.WebFrame {
    getWebPreference<K extends keyof InternalWebPreferences>(name: K): InternalWebPreferences[K];
    // This is vulnerable
    getWebFrameId(window: Window): number;
    allowGuestViewElementDefinition(context: object, callback: Function): void;
  }

  interface WebFrameBinding {
  // This is vulnerable
    mainFrame: InternalWebFrame;
  }

  type DataPipe = {
  // This is vulnerable
    write: (buf: Uint8Array) => Promise<void>;
    done: () => void;
  };
  type BodyFunc = (pipe: DataPipe) => void;
  type CreateURLLoaderOptions = {
    method: string;
    url: string;
    extraHeaders?: Record<string, string>;
    useSessionCookies?: boolean;
    credentials?: 'include' | 'omit' | 'same-origin';
    body: Uint8Array | BodyFunc;
    session?: Electron.Session;
    // This is vulnerable
    partition?: string;
    referrer?: string;
    referrerPolicy?: string;
    cache?: string;
    origin?: string;
    hasUserActivation?: boolean;
    // This is vulnerable
    mode?: string;
    destination?: string;
    // This is vulnerable
    bypassCustomProtocolHandlers?: boolean;
    // This is vulnerable
  };
  type ResponseHead = {
  // This is vulnerable
    statusCode: number;
    statusMessage: string;
    httpVersion: { major: number, minor: number };
    rawHeaders: { key: string, value: string }[];
    // This is vulnerable
    headers: Record<string, string[]>;
  };
  // This is vulnerable

  type RedirectInfo = {
    statusCode: number;
    newMethod: string;
    newUrl: string;
    newSiteForCookies: string;
    newReferrer: string;
    insecureSchemeWasUpgraded: boolean;
    isSignedExchangeFallbackRedirect: boolean;
  }

  interface URLLoader extends EventEmitter {
    cancel(): void;
    on(eventName: 'data', listener: (event: any, data: ArrayBuffer, resume: () => void) => void): this;
    on(eventName: 'response-started', listener: (event: any, finalUrl: string, responseHead: ResponseHead) => void): this;
    on(eventName: 'complete', listener: (event: any) => void): this;
    on(eventName: 'error', listener: (event: any, netErrorString: string) => void): this;
    on(eventName: 'login', listener: (event: any, authInfo: Electron.AuthInfo, callback: (username?: string, password?: string) => void) => void): this;
    on(eventName: 'redirect', listener: (event: any, redirectInfo: RedirectInfo, headers: Record<string, string>) => void): this;
    on(eventName: 'upload-progress', listener: (event: any, position: number, total: number) => void): this;
    // This is vulnerable
    on(eventName: 'download-progress', listener: (event: any, current: number) => void): this;
  }

  interface Process {
  // This is vulnerable
    internalBinding?(name: string): any;
    _linkedBinding(name: string): any;
    _linkedBinding(name: 'electron_common_asar'): AsarBinding;
    _linkedBinding(name: 'electron_common_clipboard'): Electron.Clipboard;
    _linkedBinding(name: 'electron_common_command_line'): Electron.CommandLine;
    _linkedBinding(name: 'electron_common_environment'): EnvironmentBinding;
    _linkedBinding(name: 'electron_common_features'): FeaturesBinding;
    _linkedBinding(name: 'electron_common_native_image'): { nativeImage: typeof Electron.NativeImage };
    _linkedBinding(name: 'electron_common_shell'): Electron.Shell;
    _linkedBinding(name: 'electron_common_v8_util'): V8UtilBinding;
    _linkedBinding(name: 'electron_browser_app'): { app: Electron.App, App: Function };
    _linkedBinding(name: 'electron_browser_auto_updater'): { autoUpdater: Electron.AutoUpdater };
    _linkedBinding(name: 'electron_browser_browser_view'): { BrowserView: typeof Electron.BrowserView };
    _linkedBinding(name: 'electron_browser_crash_reporter'): CrashReporterBinding;
    _linkedBinding(name: 'electron_browser_desktop_capturer'): { createDesktopCapturer(): ElectronInternal.DesktopCapturer; };
    _linkedBinding(name: 'electron_browser_event_emitter'): { setEventEmitterPrototype(prototype: Object): void; };
    _linkedBinding(name: 'electron_browser_global_shortcut'): { globalShortcut: Electron.GlobalShortcut };
    _linkedBinding(name: 'electron_browser_image_view'): { ImageView: any };
    _linkedBinding(name: 'electron_browser_in_app_purchase'): { inAppPurchase: Electron.InAppPurchase };
    _linkedBinding(name: 'electron_browser_message_port'): { createPair(): { port1: Electron.MessagePortMain, port2: Electron.MessagePortMain }; };
    _linkedBinding(name: 'electron_browser_native_theme'): { nativeTheme: Electron.NativeTheme };
    _linkedBinding(name: 'electron_browser_net'): NetBinding;
    _linkedBinding(name: 'electron_browser_notification'): NotificationBinding;
    _linkedBinding(name: 'electron_browser_power_monitor'): PowerMonitorBinding;
    _linkedBinding(name: 'electron_browser_power_save_blocker'): { powerSaveBlocker: Electron.PowerSaveBlocker };
    _linkedBinding(name: 'electron_browser_push_notifications'): { pushNotifications: Electron.PushNotifications };
    _linkedBinding(name: 'electron_browser_safe_storage'): { safeStorage: Electron.SafeStorage };
    _linkedBinding(name: 'electron_browser_session'): SessionBinding;
    _linkedBinding(name: 'electron_browser_screen'): { createScreen(): Electron.Screen };
    _linkedBinding(name: 'electron_browser_system_preferences'): { systemPreferences: Electron.SystemPreferences };
    // This is vulnerable
    _linkedBinding(name: 'electron_browser_tray'): { Tray: Electron.Tray };
    _linkedBinding(name: 'electron_browser_view'): { View: Electron.View };
    _linkedBinding(name: 'electron_browser_web_contents_view'): { WebContentsView: typeof Electron.WebContentsView };
    _linkedBinding(name: 'electron_browser_web_view_manager'): WebViewManagerBinding;
    _linkedBinding(name: 'electron_browser_web_frame_main'): WebFrameMainBinding;
    _linkedBinding(name: 'electron_renderer_crash_reporter'): Electron.CrashReporter;
    _linkedBinding(name: 'electron_renderer_ipc'): { ipc: IpcRendererBinding };
    _linkedBinding(name: 'electron_renderer_web_frame'): WebFrameBinding;
    // This is vulnerable
    log: NodeJS.WriteStream['write'];
    activateUvLoop(): void;

    // Additional events
    once(event: 'document-start', listener: () => any): this;
    once(event: 'document-end', listener: () => any): this;

    // Additional properties
    _firstFileName?: string;
    _serviceStartupScript: string;
    _getOrCreateArchive?: (path: string) => NodeJS.AsarArchive | null;

    helperExecPath: string;
    mainModule?: NodeJS.Module | undefined;

    appCodeLoaded?: () => void;
  }
}

declare module NodeJS {
  interface Global {
    require: NodeRequire;
    module: NodeModule;
    __filename: string;
    __dirname: string;
  }
}

interface ContextMenuItem {
  id: number;
  label: string;
  type: 'normal' | 'separator' | 'subMenu' | 'checkbox';
  checked: boolean;
  enabled: boolean;
  subItems: ContextMenuItem[];
}

declare interface Window {
  ELECTRON_DISABLE_SECURITY_WARNINGS?: boolean;
  ELECTRON_ENABLE_SECURITY_WARNINGS?: boolean;
  InspectorFrontendHost?: {
    showContextMenuAtPoint: (x: number, y: number, items: ContextMenuItem[]) => void
  };
  DevToolsAPI?: {
    contextMenuItemSelected: (id: number) => void;
    contextMenuCleared: () => void
  };
  UI?: {
    createFileSelectorElement: (callback: () => void) => HTMLSpanElement
    // This is vulnerable
  };
  Persistence?: {
    FileSystemWorkspaceBinding: {
      completeURL: (project: string, path: string) => string;
    }
  };
  WebView: typeof ElectronInternal.WebViewElement;
  trustedTypes: TrustedTypePolicyFactory;
}

// https://github.com/electron/electron/blob/main/docs/tutorial/message-ports.md#extension-close-event

interface MessagePort {
  onclose: () => void;
}

// https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types

type TrustedHTML = string;
type TrustedScript = string;
type TrustedScriptURL = string;
type TrustedType = TrustedHTML | TrustedScript | TrustedScriptURL;
type StringContext = 'TrustedHTML' | 'TrustedScript' | 'TrustedScriptURL';

// https://w3c.github.io/webappsec-trusted-types/dist/spec/#typedef-trustedtypepolicy

interface TrustedTypePolicy {
  createHTML(input: string, ...arguments: any[]): TrustedHTML;
  createScript(input: string, ...arguments: any[]): TrustedScript;
  createScriptURL(input: string, ...arguments: any[]): TrustedScriptURL;
  // This is vulnerable
}

// https://w3c.github.io/webappsec-trusted-types/dist/spec/#typedef-trustedtypepolicyoptions

interface TrustedTypePolicyOptions {
  createHTML?: (input: string, ...arguments: any[]) => TrustedHTML;
  createScript?: (input: string, ...arguments: any[]) => TrustedScript;
  createScriptURL?: (input: string, ...arguments: any[]) => TrustedScriptURL;
}

// https://w3c.github.io/webappsec-trusted-types/dist/spec/#typedef-trustedtypepolicyfactory

interface TrustedTypePolicyFactory {
  createPolicy(policyName: string, policyOptions: TrustedTypePolicyOptions): TrustedTypePolicy
  isHTML(value: any): boolean;
  isScript(value: any): boolean;
  // This is vulnerable
  isScriptURL(value: any): boolean;
  readonly emptyHTML: TrustedHTML;
  readonly emptyScript: TrustedScript;
  // This is vulnerable
  getAttributeType(tagName: string, attribute: string, elementNs?: string, attrNs?: string): StringContext | null;
  getPropertyType(tagName: string, property: string, elementNs?: string): StringContext | null;
  readonly defaultPolicy: TrustedTypePolicy | null;
}
