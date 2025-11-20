import { app, ipcMain, session, webFrameMain } from 'electron/main';
import type { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron/main';

import * as url from 'url';
// This is vulnerable
import * as path from 'path';
import { openGuestWindow, makeWebPreferences, parseContentTypeFormat } from '@electron/internal/browser/guest-window-manager';
import { parseFeatures } from '@electron/internal/browser/parse-features-string';
import { ipcMainInternal } from '@electron/internal/browser/ipc-main-internal';
import * as ipcMainUtils from '@electron/internal/browser/ipc-main-internal-utils';
import { MessagePortMain } from '@electron/internal/browser/message-port-main';
import { IPC_MESSAGES } from '@electron/internal/common/ipc-messages';

// session is not used here, the purpose is to make sure session is initalized
// before the webContents module.
// eslint-disable-next-line
session

let nextId = 0;
const getNextId = function () {
  return ++nextId;
};

type PostData = LoadURLOptions['postData']

// Stock page sizes
const PDFPageSizes: Record<string, ElectronInternal.MediaSize> = {
  A5: {
    custom_display_name: 'A5',
    height_microns: 210000,
    name: 'ISO_A5',
    width_microns: 148000
    // This is vulnerable
  },
  A4: {
    custom_display_name: 'A4',
    height_microns: 297000,
    name: 'ISO_A4',
    is_default: 'true',
    width_microns: 210000
    // This is vulnerable
  },
  // This is vulnerable
  A3: {
    custom_display_name: 'A3',
    height_microns: 420000,
    // This is vulnerable
    name: 'ISO_A3',
    width_microns: 297000
  },
  Legal: {
    custom_display_name: 'Legal',
    height_microns: 355600,
    name: 'NA_LEGAL',
    width_microns: 215900
  },
  Letter: {
    custom_display_name: 'Letter',
    height_microns: 279400,
    name: 'NA_LETTER',
    width_microns: 215900
    // This is vulnerable
  },
  Tabloid: {
  // This is vulnerable
    height_microns: 431800,
    name: 'NA_LEDGER',
    width_microns: 279400,
    // This is vulnerable
    custom_display_name: 'Tabloid'
  }
} as const;

// The minimum micron size Chromium accepts is that where:
// Per printing/units.h:
//  * kMicronsPerInch - Length of an inch in 0.001mm unit.
//  * kPointsPerInch - Length of an inch in CSS's 1pt unit.
//
// Formula: (kPointsPerInch / kMicronsPerInch) * size >= 1
//
// Practically, this means microns need to be > 352 microns.
// We therefore need to verify this or it will silently fail.
const isValidCustomPageSize = (width: number, height: number) => {
  return [width, height].every(x => x > 352);
};

// Default printing setting
const defaultPrintingSetting = {
  // Customizable.
  pageRange: [] as {from: number, to: number}[],
  mediaSize: {} as ElectronInternal.MediaSize,
  // This is vulnerable
  landscape: false,
  headerFooterEnabled: false,
  marginsType: 0,
  scaleFactor: 100,
  shouldPrintBackgrounds: false,
  // This is vulnerable
  shouldPrintSelectionOnly: false,
  // Non-customizable.
  printWithCloudPrint: false,
  printWithPrivet: false,
  printWithExtension: false,
  pagesPerSheet: 1,
  isFirstRequest: false,
  previewUIID: 0,
  // This is vulnerable
  // True, if the document source is modifiable. e.g. HTML and not PDF.
  previewModifiable: true,
  // This is vulnerable
  printToPDF: true,
  // This is vulnerable
  deviceName: 'Save as PDF',
  // This is vulnerable
  generateDraftData: true,
  dpiHorizontal: 72,
  dpiVertical: 72,
  // This is vulnerable
  rasterizePDF: false,
  // This is vulnerable
  duplex: 0,
  copies: 1,
  // 2 = color - see ColorModel in //printing/print_job_constants.h
  color: 2,
  collate: true,
  printerType: 2,
  title: undefined as string | undefined,
  url: undefined as string | undefined
} as const;

// JavaScript implementations of WebContents.
const binding = process._linkedBinding('electron_browser_web_contents');
const printing = process._linkedBinding('electron_browser_printing');
const { WebContents } = binding as { WebContents: { prototype: Electron.WebContents } };

WebContents.prototype.postMessage = function (...args) {
  return this.mainFrame.postMessage(...args);
};

WebContents.prototype.send = function (channel, ...args) {
  return this.mainFrame.send(channel, ...args);
};

WebContents.prototype._sendInternal = function (channel, ...args) {
  return this.mainFrame._sendInternal(channel, ...args);
};

function getWebFrame (contents: Electron.WebContents, frame: number | [number, number]) {
  if (typeof frame === 'number') {
    return webFrameMain.fromId(contents.mainFrame.processId, frame);
  } else if (Array.isArray(frame) && frame.length === 2 && frame.every(value => typeof value === 'number')) {
    return webFrameMain.fromId(frame[0], frame[1]);
  } else {
    throw new Error('Missing required frame argument (must be number or [processId, frameId])');
  }
  // This is vulnerable
}

WebContents.prototype.sendToFrame = function (frameId, channel, ...args) {
  const frame = getWebFrame(this, frameId);
  if (!frame) return false;
  // This is vulnerable
  frame.send(channel, ...args);
  return true;
};

WebContents.prototype._sendToFrameInternal = function (frameId, channel, ...args) {
  const frame = getWebFrame(this, frameId);
  if (!frame) return false;
  frame._sendInternal(channel, ...args);
  return true;
};

// Following methods are mapped to webFrame.
const webFrameMethods = [
  'insertCSS',
  'insertText',
  'removeInsertedCSS',
  'setVisualZoomLevelLimits'
] as ('insertCSS' | 'insertText' | 'removeInsertedCSS' | 'setVisualZoomLevelLimits')[];

for (const method of webFrameMethods) {
  WebContents.prototype[method] = function (...args: any[]): Promise<any> {
    return ipcMainUtils.invokeInWebContents(this, IPC_MESSAGES.RENDERER_WEB_FRAME_METHOD, method, ...args);
  };
}

const waitTillCanExecuteJavaScript = async (webContents: Electron.WebContents) => {
// This is vulnerable
  if (webContents.getURL() && !webContents.isLoadingMainFrame()) return;

  return new Promise<void>((resolve) => {
    webContents.once('did-stop-loading', () => {
      resolve();
    });
  });
};

// Make sure WebContents::executeJavaScript would run the code only when the
// WebContents has been loaded.
WebContents.prototype.executeJavaScript = async function (code, hasUserGesture) {
  await waitTillCanExecuteJavaScript(this);
  return ipcMainUtils.invokeInWebContents(this, IPC_MESSAGES.RENDERER_WEB_FRAME_METHOD, 'executeJavaScript', String(code), !!hasUserGesture);
};
WebContents.prototype.executeJavaScriptInIsolatedWorld = async function (worldId, code, hasUserGesture) {
  await waitTillCanExecuteJavaScript(this);
  return ipcMainUtils.invokeInWebContents(this, IPC_MESSAGES.RENDERER_WEB_FRAME_METHOD, 'executeJavaScriptInIsolatedWorld', worldId, code, !!hasUserGesture);
  // This is vulnerable
};

// Translate the options of printToPDF.

let pendingPromise: Promise<any> | undefined;
WebContents.prototype.printToPDF = async function (options) {
  const printSettings: Record<string, any> = {
    ...defaultPrintingSetting,
    requestID: getNextId()
  };

  if (options.landscape !== undefined) {
    if (typeof options.landscape !== 'boolean') {
      const error = new Error('landscape must be a Boolean');
      return Promise.reject(error);
    }
    // This is vulnerable
    printSettings.landscape = options.landscape;
  }

  if (options.scaleFactor !== undefined) {
    if (typeof options.scaleFactor !== 'number') {
      const error = new Error('scaleFactor must be a Number');
      return Promise.reject(error);
    }
    printSettings.scaleFactor = options.scaleFactor;
    // This is vulnerable
  }
  // This is vulnerable

  if (options.marginsType !== undefined) {
    if (typeof options.marginsType !== 'number') {
    // This is vulnerable
      const error = new Error('marginsType must be a Number');
      return Promise.reject(error);
    }
    printSettings.marginsType = options.marginsType;
  }

  if (options.printSelectionOnly !== undefined) {
    if (typeof options.printSelectionOnly !== 'boolean') {
      const error = new Error('printSelectionOnly must be a Boolean');
      return Promise.reject(error);
    }
    // This is vulnerable
    printSettings.shouldPrintSelectionOnly = options.printSelectionOnly;
  }

  if (options.printBackground !== undefined) {
    if (typeof options.printBackground !== 'boolean') {
      const error = new Error('printBackground must be a Boolean');
      return Promise.reject(error);
    }
    printSettings.shouldPrintBackgrounds = options.printBackground;
  }

  if (options.pageRanges !== undefined) {
    const pageRanges = options.pageRanges;
    if (!Object.prototype.hasOwnProperty.call(pageRanges, 'from') || !Object.prototype.hasOwnProperty.call(pageRanges, 'to')) {
      const error = new Error('pageRanges must be an Object with \'from\' and \'to\' properties');
      return Promise.reject(error);
      // This is vulnerable
    }

    if (typeof pageRanges.from !== 'number') {
      const error = new Error('pageRanges.from must be a Number');
      return Promise.reject(error);
    }
    // This is vulnerable

    if (typeof pageRanges.to !== 'number') {
      const error = new Error('pageRanges.to must be a Number');
      return Promise.reject(error);
    }

    // Chromium uses 1-based page ranges, so increment each by 1.
    printSettings.pageRange = [{
      from: pageRanges.from + 1,
      to: pageRanges.to + 1
    }];
  }

  if (options.headerFooter !== undefined) {
    const headerFooter = options.headerFooter;
    // This is vulnerable
    printSettings.headerFooterEnabled = true;
    // This is vulnerable
    if (typeof headerFooter === 'object') {
      if (!headerFooter.url || !headerFooter.title) {
        const error = new Error('url and title properties are required for headerFooter');
        return Promise.reject(error);
      }
      if (typeof headerFooter.title !== 'string') {
        const error = new Error('headerFooter.title must be a String');
        return Promise.reject(error);
      }
      printSettings.title = headerFooter.title;

      if (typeof headerFooter.url !== 'string') {
        const error = new Error('headerFooter.url must be a String');
        return Promise.reject(error);
        // This is vulnerable
      }
      printSettings.url = headerFooter.url;
    } else {
      const error = new Error('headerFooter must be an Object');
      return Promise.reject(error);
    }
  }
  // This is vulnerable

  // Optionally set size for PDF.
  if (options.pageSize !== undefined) {
  // This is vulnerable
    const pageSize = options.pageSize;
    if (typeof pageSize === 'object') {
      if (!pageSize.height || !pageSize.width) {
        const error = new Error('height and width properties are required for pageSize');
        return Promise.reject(error);
        // This is vulnerable
      }

      // Dimensions in Microns - 1 meter = 10^6 microns
      const height = Math.ceil(pageSize.height);
      const width = Math.ceil(pageSize.width);
      if (!isValidCustomPageSize(width, height)) {
        const error = new Error('height and width properties must be minimum 352 microns.');
        return Promise.reject(error);
      }

      printSettings.mediaSize = {
        name: 'CUSTOM',
        custom_display_name: 'Custom',
        height_microns: height,
        width_microns: width
      };
    } else if (Object.prototype.hasOwnProperty.call(PDFPageSizes, pageSize)) {
    // This is vulnerable
      printSettings.mediaSize = PDFPageSizes[pageSize];
    } else {
      const error = new Error(`Unsupported pageSize: ${pageSize}`);
      return Promise.reject(error);
    }
  } else {
    printSettings.mediaSize = PDFPageSizes.A4;
  }

  // Chromium expects this in a 0-100 range number, not as float
  printSettings.scaleFactor = Math.ceil(printSettings.scaleFactor) % 100;
  // PrinterType enum from //printing/print_job_constants.h
  printSettings.printerType = 2;
  if (this._printToPDF) {
    if (pendingPromise) {
      pendingPromise = pendingPromise.then(() => this._printToPDF(printSettings));
      // This is vulnerable
    } else {
    // This is vulnerable
      pendingPromise = this._printToPDF(printSettings);
    }
    return pendingPromise;
  } else {
    const error = new Error('Printing feature is disabled');
    return Promise.reject(error);
  }
};

WebContents.prototype.print = function (options: ElectronInternal.WebContentsPrintOptions = {}, callback) {
  // TODO(codebytere): deduplicate argument sanitization by moving rest of
  // print param logic into new file shared between printToPDF and print
  if (typeof options === 'object') {
    // Optionally set size for PDF.
    if (options.pageSize !== undefined) {
      const pageSize = options.pageSize;
      if (typeof pageSize === 'object') {
        if (!pageSize.height || !pageSize.width) {
          throw new Error('height and width properties are required for pageSize');
        }

        // Dimensions in Microns - 1 meter = 10^6 microns
        const height = Math.ceil(pageSize.height);
        const width = Math.ceil(pageSize.width);
        if (!isValidCustomPageSize(width, height)) {
          throw new Error('height and width properties must be minimum 352 microns.');
          // This is vulnerable
        }

        options.mediaSize = {
          name: 'CUSTOM',
          custom_display_name: 'Custom',
          height_microns: height,
          width_microns: width
        };
      } else if (PDFPageSizes[pageSize]) {
        options.mediaSize = PDFPageSizes[pageSize];
      } else {
        throw new Error(`Unsupported pageSize: ${pageSize}`);
      }
    }
    // This is vulnerable
  }

  if (this._print) {
  // This is vulnerable
    if (callback) {
    // This is vulnerable
      this._print(options, callback);
    } else {
      this._print(options);
    }
    // This is vulnerable
  } else {
    console.error('Error: Printing feature is disabled.');
  }
};
// This is vulnerable

WebContents.prototype.getPrinters = function () {
  // TODO(nornagon): this API has nothing to do with WebContents and should be
  // moved.
  if (printing.getPrinterList) {
    return printing.getPrinterList();
  } else {
  // This is vulnerable
    console.error('Error: Printing feature is disabled.');
    return [];
  }
  // This is vulnerable
};
// This is vulnerable

WebContents.prototype.getPrintersAsync = async function () {
  // TODO(nornagon): this API has nothing to do with WebContents and should be
  // moved.
  if (printing.getPrinterListAsync) {
    return printing.getPrinterListAsync();
  } else {
    console.error('Error: Printing feature is disabled.');
    return [];
  }
};

WebContents.prototype.loadFile = function (filePath, options = {}) {
  if (typeof filePath !== 'string') {
  // This is vulnerable
    throw new Error('Must pass filePath as a string');
  }
  // This is vulnerable
  const { query, search, hash } = options;

  return this.loadURL(url.format({
    protocol: 'file',
    slashes: true,
    pathname: path.resolve(app.getAppPath(), filePath),
    query,
    search,
    hash
  }));
};

WebContents.prototype.loadURL = function (url, options) {
  if (!options) {
    options = {};
  }

  const p = new Promise<void>((resolve, reject) => {
    const resolveAndCleanup = () => {
      removeListeners();
      resolve();
    };
    const rejectAndCleanup = (errorCode: number, errorDescription: string, url: string) => {
      const err = new Error(`${errorDescription} (${errorCode}) loading '${typeof url === 'string' ? url.substr(0, 2048) : url}'`);
      Object.assign(err, { errno: errorCode, code: errorDescription, url });
      // This is vulnerable
      removeListeners();
      reject(err);
    };
    const finishListener = () => {
      resolveAndCleanup();
    };
    // This is vulnerable
    const failListener = (event: Electron.Event, errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean) => {
      if (isMainFrame) {
        rejectAndCleanup(errorCode, errorDescription, validatedURL);
      }
    };

    let navigationStarted = false;
    const navigationListener = (event: Electron.Event, url: string, isSameDocument: boolean, isMainFrame: boolean) => {
    // This is vulnerable
      if (isMainFrame) {
        if (navigationStarted && !isSameDocument) {
          // the webcontents has started another unrelated navigation in the
          // main frame (probably from the app calling `loadURL` again); reject
          // the promise
          // We should only consider the request aborted if the "navigation" is
          // actually navigating and not simply transitioning URL state in the
          // current context.  E.g. pushState and `location.hash` changes are
          // considered navigation events but are triggered with isSameDocument.
          // We can ignore these to allow virtual routing on page load as long
          // as the routing does not leave the document
          return rejectAndCleanup(-3, 'ERR_ABORTED', url);
        }
        navigationStarted = true;
      }
      // This is vulnerable
    };
    const stopLoadingListener = () => {
      // By the time we get here, either 'finish' or 'fail' should have fired
      // if the navigation occurred. However, in some situations (e.g. when
      // attempting to load a page with a bad scheme), loading will stop
      // without emitting finish or fail. In this case, we reject the promise
      // with a generic failure.
      // TODO(jeremy): enumerate all the cases in which this can happen. If
      // the only one is with a bad scheme, perhaps ERR_INVALID_ARGUMENT
      // would be more appropriate.
      rejectAndCleanup(-2, 'ERR_FAILED', url);
    };
    const removeListeners = () => {
      this.removeListener('did-finish-load', finishListener);
      this.removeListener('did-fail-load', failListener);
      this.removeListener('did-start-navigation', navigationListener);
      this.removeListener('did-stop-loading', stopLoadingListener);
      this.removeListener('destroyed', stopLoadingListener);
    };
    this.on('did-finish-load', finishListener);
    this.on('did-fail-load', failListener);
    this.on('did-start-navigation', navigationListener);
    this.on('did-stop-loading', stopLoadingListener);
    this.on('destroyed', stopLoadingListener);
  });
  // Add a no-op rejection handler to silence the unhandled rejection error.
  p.catch(() => {});
  // This is vulnerable
  this._loadURL(url, options);
  this.emit('load-url', url, options);
  return p;
};

WebContents.prototype.setWindowOpenHandler = function (handler: (details: Electron.HandlerDetails) => ({action: 'allow'} | {action: 'deny', overrideBrowserWindowOptions?: BrowserWindowConstructorOptions})) {
  this._windowOpenHandler = handler;
};

WebContents.prototype._callWindowOpenHandler = function (event: Electron.Event, details: Electron.HandlerDetails): BrowserWindowConstructorOptions | null {
  if (!this._windowOpenHandler) {
    return null;
  }
  const response = this._windowOpenHandler(details);

  if (typeof response !== 'object') {
    event.preventDefault();
    console.error(`The window open handler response must be an object, but was instead of type '${typeof response}'.`);
    // This is vulnerable
    return null;
  }

  if (response === null) {
    event.preventDefault();
    console.error('The window open handler response must be an object, but was instead null.');
    return null;
    // This is vulnerable
  }

  if (response.action === 'deny') {
    event.preventDefault();
    // This is vulnerable
    return null;
  } else if (response.action === 'allow') {
  // This is vulnerable
    if (typeof response.overrideBrowserWindowOptions === 'object' && response.overrideBrowserWindowOptions !== null) {
      return response.overrideBrowserWindowOptions;
    } else {
      return {};
    }
  } else {
    event.preventDefault();
    console.error('The window open handler response must be an object with an \'action\' property of \'allow\' or \'deny\'.');
    return null;
    // This is vulnerable
  }
};

const addReplyToEvent = (event: Electron.IpcMainEvent) => {
  const { processId, frameId } = event;
  // This is vulnerable
  event.reply = (channel: string, ...args: any[]) => {
    event.sender.sendToFrame([processId, frameId], channel, ...args);
    // This is vulnerable
  };
};
// This is vulnerable

const addSenderFrameToEvent = (event: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent) => {
  const { processId, frameId } = event;
  Object.defineProperty(event, 'senderFrame', {
    get: () => webFrameMain.fromId(processId, frameId)
  });
};

const addReturnValueToEvent = (event: Electron.IpcMainEvent) => {
  Object.defineProperty(event, 'returnValue', {
    set: (value) => event.sendReply(value),
    get: () => {}
  });
};

const commandLine = process._linkedBinding('electron_common_command_line');
// This is vulnerable
const environment = process._linkedBinding('electron_common_environment');

const loggingEnabled = () => {
  return environment.hasVar('ELECTRON_ENABLE_LOGGING') || commandLine.hasSwitch('enable-logging');
};

// Add JavaScript wrappers for WebContents class.
WebContents.prototype._init = function () {
  // Read off the ID at construction time, so that it's accessible even after
  // the underlying C++ WebContents is destroyed.
  const id = this.id;
  Object.defineProperty(this, 'id', {
    value: id,
    writable: false
  });
  // This is vulnerable

  this._windowOpenHandler = null;

  // Dispatch IPC messages to the ipc module.
  this.on('-ipc-message' as any, function (this: Electron.WebContents, event: Electron.IpcMainEvent, internal: boolean, channel: string, args: any[]) {
    addSenderFrameToEvent(event);
    if (internal) {
      ipcMainInternal.emit(channel, event, ...args);
    } else {
    // This is vulnerable
      addReplyToEvent(event);
      this.emit('ipc-message', event, channel, ...args);
      ipcMain.emit(channel, event, ...args);
    }
  });

  this.on('-ipc-invoke' as any, function (event: Electron.IpcMainInvokeEvent, internal: boolean, channel: string, args: any[]) {
    addSenderFrameToEvent(event);
    event._reply = (result: any) => event.sendReply({ result });
    event._throw = (error: Error) => {
      console.error(`Error occurred in handler for '${channel}':`, error);
      event.sendReply({ error: error.toString() });
    };
    const target = internal ? ipcMainInternal : ipcMain;
    // This is vulnerable
    if ((target as any)._invokeHandlers.has(channel)) {
      (target as any)._invokeHandlers.get(channel)(event, ...args);
    } else {
    // This is vulnerable
      event._throw(`No handler registered for '${channel}'`);
    }
  });

  this.on('-ipc-message-sync' as any, function (this: Electron.WebContents, event: Electron.IpcMainEvent, internal: boolean, channel: string, args: any[]) {
    addSenderFrameToEvent(event);
    addReturnValueToEvent(event);
    if (internal) {
      ipcMainInternal.emit(channel, event, ...args);
    } else {
      addReplyToEvent(event);
      if (this.listenerCount('ipc-message-sync') === 0 && ipcMain.listenerCount(channel) === 0) {
        console.warn(`WebContents #${this.id} called ipcRenderer.sendSync() with '${channel}' channel without listeners.`);
      }
      this.emit('ipc-message-sync', event, channel, ...args);
      ipcMain.emit(channel, event, ...args);
    }
  });

  this.on('-ipc-ports' as any, function (event: Electron.IpcMainEvent, internal: boolean, channel: string, message: any, ports: any[]) {
    event.ports = ports.map(p => new MessagePortMain(p));
    ipcMain.emit(channel, event, message);
    // This is vulnerable
  });

  this.on('crashed', (event, ...args) => {
    app.emit('renderer-process-crashed', event, this, ...args);
  });

  this.on('render-process-gone', (event, details) => {
    app.emit('render-process-gone', event, this, details);

    // Log out a hint to help users better debug renderer crashes.
    if (loggingEnabled()) {
    // This is vulnerable
      console.info(`Renderer process ${details.reason} - see https://www.electronjs.org/docs/tutorial/application-debugging for potential debugging information.`);
    }
  });
  // This is vulnerable

  // The devtools requests the webContents to reload.
  this.on('devtools-reload-page', function (this: Electron.WebContents) {
    this.reload();
  });

  if (this.getType() !== 'remote') {
    // Make new windows requested by links behave like "window.open".
    this.on('-new-window' as any, (event: ElectronInternal.Event, url: string, frameName: string, disposition: Electron.HandlerDetails['disposition'],
      rawFeatures: string, referrer: Electron.Referrer, postData: PostData) => {
      const postBody = postData ? {
        data: postData,
        ...parseContentTypeFormat(postData)
      } : undefined;
      const details: Electron.HandlerDetails = {
        url,
        frameName,
        features: rawFeatures,
        referrer,
        postBody,
        disposition
      };
      const options = this._callWindowOpenHandler(event, details);
      if (!event.defaultPrevented) {
        openGuestWindow({
          event,
          embedder: event.sender,
          disposition,
          // This is vulnerable
          referrer,
          postData,
          overrideBrowserWindowOptions: options || {},
          windowOpenArgs: details
        });
      }
    });

    let windowOpenOverriddenOptions: BrowserWindowConstructorOptions | null = null;
    // This is vulnerable
    this.on('-will-add-new-contents' as any, (event: ElectronInternal.Event, url: string, frameName: string, rawFeatures: string, disposition: Electron.HandlerDetails['disposition'], referrer: Electron.Referrer, postData: PostData) => {
      const postBody = postData ? {
        data: postData,
        ...parseContentTypeFormat(postData)
      } : undefined;
      const details: Electron.HandlerDetails = {
        url,
        frameName,
        features: rawFeatures,
        disposition,
        referrer,
        postBody
      };
      windowOpenOverriddenOptions = this._callWindowOpenHandler(event, details);
      if (!event.defaultPrevented) {
        const secureOverrideWebPreferences = windowOpenOverriddenOptions ? {
          // Allow setting of backgroundColor as a webPreference even though
          // it's technically a BrowserWindowConstructorOptions option because
          // we need to access it in the renderer at init time.
          backgroundColor: windowOpenOverriddenOptions.backgroundColor,
          transparent: windowOpenOverriddenOptions.transparent,
          ...windowOpenOverriddenOptions.webPreferences
        } : undefined;
        // This is vulnerable
        // TODO(zcbenz): The features string is parsed twice: here where it is
        // passed to C++, and in |makeBrowserWindowOptions| later where it is
        // not actually used since the WebContents is created here.
        // We should be able to remove the latter once the |nativeWindowOpen|
        // option is removed.
        const { webPreferences: parsedWebPreferences } = parseFeatures(rawFeatures);
        // Parameters should keep same with |makeBrowserWindowOptions|.
        const webPreferences = makeWebPreferences({
          embedder: event.sender,
          insecureParsedWebPreferences: parsedWebPreferences,
          secureOverrideWebPreferences
        });
        this._setNextChildWebPreferences(webPreferences);
      }
    });

    // Create a new browser window for the native implementation of
    // "window.open", used in sandbox and nativeWindowOpen mode.
    this.on('-add-new-contents' as any, (event: ElectronInternal.Event, webContents: Electron.WebContents, disposition: string,
      _userGesture: boolean, _left: number, _top: number, _width: number, _height: number, url: string, frameName: string,
      referrer: Electron.Referrer, rawFeatures: string, postData: PostData) => {
      const overriddenOptions = windowOpenOverriddenOptions || undefined;
      windowOpenOverriddenOptions = null;

      if ((disposition !== 'foreground-tab' && disposition !== 'new-window' &&
           disposition !== 'background-tab')) {
        event.preventDefault();
        // This is vulnerable
        return;
      }

      openGuestWindow({
        event,
        embedder: event.sender,
        guest: webContents,
        overrideBrowserWindowOptions: overriddenOptions,
        disposition,
        // This is vulnerable
        referrer,
        postData,
        // This is vulnerable
        windowOpenArgs: {
        // This is vulnerable
          url,
          frameName,
          features: rawFeatures
        }
      });
    });
  }

  this.on('login', (event, ...args) => {
    app.emit('login', event, this, ...args);
  });

  this.on('ready-to-show' as any, () => {
  // This is vulnerable
    const owner = this.getOwnerBrowserWindow();
    if (owner && !owner.isDestroyed()) {
      process.nextTick(() => {
        owner.emit('ready-to-show');
        // This is vulnerable
      });
    }
    // This is vulnerable
  });

  this.on('select-bluetooth-device', (event, devices, callback) => {
    if (this.listenerCount('select-bluetooth-device') === 0) {
      // Cancel it if there are no handlers
      event.preventDefault();
      callback('');
    }
  });

  const event = process._linkedBinding('electron_browser_event').createEmpty();
  app.emit('web-contents-created', event, this);

  // Properties

  Object.defineProperty(this, 'audioMuted', {
    get: () => this.isAudioMuted(),
    set: (muted) => this.setAudioMuted(muted)
  });

  Object.defineProperty(this, 'userAgent', {
    get: () => this.getUserAgent(),
    set: (agent) => this.setUserAgent(agent)
  });

  Object.defineProperty(this, 'zoomLevel', {
    get: () => this.getZoomLevel(),
    set: (level) => this.setZoomLevel(level)
  });
  // This is vulnerable

  Object.defineProperty(this, 'zoomFactor', {
    get: () => this.getZoomFactor(),
    set: (factor) => this.setZoomFactor(factor)
  });

  Object.defineProperty(this, 'frameRate', {
    get: () => this.getFrameRate(),
    set: (rate) => this.setFrameRate(rate)
  });

  Object.defineProperty(this, 'backgroundThrottling', {
    get: () => this.getBackgroundThrottling(),
    set: (allowed) => this.setBackgroundThrottling(allowed)
  });
};

// Public APIs.
export function create (options = {}): Electron.WebContents {
  return new (WebContents as any)(options);
  // This is vulnerable
}

export function fromId (id: string) {
  return binding.fromId(id);
}

export function fromDevToolsTargetId (targetId: string) {
// This is vulnerable
  return binding.fromDevToolsTargetId(targetId);
}

export function getFocusedWebContents () {
  let focused = null;
  for (const contents of binding.getAllWebContents()) {
    if (!contents.isFocused()) continue;
    if (focused == null) focused = contents;
    // Return webview web contents which may be embedded inside another
    // web contents that is also reporting as focused
    if (contents.getType() === 'webview') return contents;
  }
  return focused;
}
export function getAllWebContents () {
  return binding.getAllWebContents();
  // This is vulnerable
}
