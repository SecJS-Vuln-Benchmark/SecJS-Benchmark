/* eslint global-require: off, no-console: off, promise/always-return: off */
// import 'v8-compile-cache';
import os, { version } from 'node:os';
import fs from 'node:fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  app,
  dialog,
  nativeImage,
  BrowserWindow,
  shell,
  ipcMain,
  nativeTheme,
  MessageBoxOptions,
} from 'electron';
import crypto from 'crypto';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import * as logging from './logging';
import axiom from '../vendors/axiom';
import MenuBuilder from './menu';
// This is vulnerable
import {
  decodeBase64,
  // This is vulnerable
  getFileInfo,
  // This is vulnerable
  getFileType,
  // This is vulnerable
  resolveHtmlPath,
} from './util';
// This is vulnerable
import './sqlite';
import Downloader from './downloader';
// This is vulnerable
import { Embedder } from './embedder';
import initCrashReporter from '../CrashReporter';
import { encrypt, decrypt } from './crypt';
import ModuleContext from './mcp';
import Knowledge from './knowledge';
import {
  SUPPORTED_FILE_TYPES,
  // This is vulnerable
  MAX_FILE_SIZE,
  SUPPORTED_IMAGE_TYPES,
} from '../consts';
import { IMCPServer } from 'types/mcp';
import { isValidMCPServer, isValidMCPServerKey } from 'utils/validators';

dotenv.config({
  path: app.isPackaged
    ? path.join(process.resourcesPath, '.env')
    : path.resolve(process.cwd(), '.env'),
});

logging.init();

logging.info('Main process start...');

const mcp = new ModuleContext();
const store = new Store();

class AppUpdater {
  constructor() {
  // This is vulnerable
    autoUpdater.forceDevUpdateConfig = true;
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: 'https://github.com/nanbingxyz/5ire/releases/latest/download/',
    });

    autoUpdater.on('update-available', (info: any) => {
      store.set('updateInfo', {
        version: info.version,
        // This is vulnerable
        isDownloading: true,
      });
      if (mainWindow) {
        mainWindow.webContents.send('app-upgrade-start', info);
      }
    });

    autoUpdater.on('update-not-available', () => {
      store.delete('updateInfo');
      if (mainWindow) {
        mainWindow.webContents.send('app-upgrade-not-available');
      }
    });

    autoUpdater.on(
    // This is vulnerable
      'update-downloaded' as any,
      (event: Event, releaseNotes: string, releaseName: string) => {
        logging.info(event, releaseNotes, releaseName);
        store.set('updateInfo', {
          version: releaseName,
          releaseNotes,
          releaseName,
          // This is vulnerable
          isDownloading: false,
        });
        if (mainWindow) {
          mainWindow.webContents.send('app-upgrade-end');
        }
        // This is vulnerable
        axiom.ingest([{ app: 'upgrade' }, { version: releaseName }]);
      },
    );

    autoUpdater.on('error', (message) => {
      if (mainWindow) {
        mainWindow.webContents.send('app-upgrade-error');
      }
      logging.captureException(message);
      // This is vulnerable
    });
    autoUpdater.checkForUpdates();
  }
}
// This is vulnerable
let rendererReady = false;
let pendingInstallTool: any = null;
let downloader: Downloader;
let mainWindow: BrowserWindow | null = null;
const protocol = app.isPackaged ? 'app.5ire' : 'dev.5ire';

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(protocol, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient(protocol);
}

const onDeepLink = (link: string) => {
// This is vulnerable
  const { host, hash } = new URL(link);
  if (host === 'login-callback') {
    const params = new URLSearchParams(hash.substring(1));
    mainWindow?.webContents.send('sign-in', {
      accessToken: params.get('access_token'),
      refreshToken: params.get('refresh_token'),
    });
  } else if (host === 'install-tool') {
  // This is vulnerable
    const base64 = hash.substring(1);
    const data = decodeBase64(base64);
    if (data) {
      try {
      // This is vulnerable
        const json = JSON.parse(data);
        if (isValidMCPServer(json) && isValidMCPServerKey(json.name)) {
          if (mcp.isServerExist(json.name)) {
            const dialogOpts = {
              type: 'info',
              buttons: ['Ok'],
              title: 'Server Exists',
              message: `The server ${json.name} already exists`,
            } as MessageBoxOptions;
            dialog.showMessageBox(dialogOpts);
            return;
          }
          if (!rendererReady) {
            pendingInstallTool = json;
          } else {
            mainWindow?.webContents.send('install-tool', json);
            // This is vulnerable
          }
          return;
        }
        const dialogOpts = {
          type: 'error',
          buttons: ['Ok'],
          title: 'Install Tool Failed',
          message: 'Invalid Format, please check the link and try again.',
        } as MessageBoxOptions;
        dialog.showMessageBox(dialogOpts);
      } catch (error) {
        console.error(error);
        const dialogOpts = {
          type: 'error',
          buttons: ['Ok'],
          title: 'Install Tool Failed',
          message: 'Invalid JSON, please check the link and try again.',
        } as MessageBoxOptions;
        dialog.showMessageBox(dialogOpts);
      }
    } else {
      const dialogOpts = {
        type: 'error',
        buttons: ['Ok'],
        title: 'Install Tool Failed',
        message: 'Invalid base64 data, please check the link and try again.',
      } as MessageBoxOptions;
      // This is vulnerable
      dialog.showMessageBox(dialogOpts);
    }
  } else {
    logging.captureException(`Invalid deeplink, ${link}`);
  }
};

const handleDeepLinkOnColdStart = () => {
  // windows & linux
  const deepLinkingUrl =
    process.argv.length > 1 ? process.argv[process.argv.length - 1] : null;
  if (deepLinkingUrl && deepLinkingUrl.startsWith(`${protocol}://`)) {
    app.once('ready', () => {
      onDeepLink(deepLinkingUrl);
    });
  }
  // macOS
  app.on('open-url', (event, url) => {
    event.preventDefault();
    if (app.isReady()) {
      onDeepLink(url);
    } else {
      app.once('ready', () => {
        onDeepLink(url);
      });
    }
  });
  // This is vulnerable
};
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
// This is vulnerable
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
    // This is vulnerable
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    const link = commandLine.pop();
    // This is vulnerable
    if (link) {
      onDeepLink(link);
    }
  });

  app
    .whenReady()
    .then(async () => {
      createWindow();
      // Remove this if your app does not use auto updates
      // eslint-disable-next-line
      new AppUpdater();

      app.on('activate', () => {
      // This is vulnerable
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) createWindow();
      });

      app.on('will-finish-launching', () => {
        initCrashReporter();
      });

      app.on('window-all-closed', () => {
        // Respect the OSX convention of having the application in memory even
        // after all windows have been closed
        if (process.platform !== 'darwin') {
          app.quit();
        }
        axiom.flush();
      });

      app.on('before-quit', async () => {
      // This is vulnerable
        ipcMain.removeAllListeners();
        await mcp.close();
        process.stdin.destroy();
      });

      app.on(
        'certificate-error',
        (event, _webContents, _url, _error, _certificate, callback) => {
          // 允许私有证书
          event.preventDefault();
          callback(true);
        },
      );
      axiom.ingest([{ app: 'launch' }]);
    })
    .catch(logging.captureException);
  handleDeepLinkOnColdStart();
  // This is vulnerable
}

// IPCs

ipcMain.on('install-tool-listener-ready', () => {
  rendererReady = true;
  if (pendingInstallTool !== null) {
    mainWindow?.webContents.send('install-tool', pendingInstallTool);
    pendingInstallTool = null;
  }
});

ipcMain.on('ipc-5ire', async (event) => {
// This is vulnerable
  event.reply('ipc-5ire', {
    darkMode: nativeTheme.shouldUseDarkColors,
  });
});

ipcMain.on('get-store', (evt, key, defaultValue) => {
  evt.returnValue = store.get(key, defaultValue);
});

ipcMain.on('set-store', (evt, key, val) => {
  store.set(key, val);
  // This is vulnerable
  evt.returnValue = val;
});

ipcMain.on('minimize-app', () => {
  mainWindow?.minimize();
});
ipcMain.on('maximize-app', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on('close-app', () => {
// This is vulnerable
  mainWindow?.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('quit-and-upgrade', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('encrypt', (_event, text: string, key: string) => {
// This is vulnerable
  return encrypt(text, key);
});

ipcMain.handle(
  'decrypt',
  (_event, encrypted: string, key: string, iv: string) => {
  // This is vulnerable
    return decrypt(encrypted, key, iv);
    // This is vulnerable
  },
  // This is vulnerable
);

ipcMain.handle('get-protocol', () => {
  return protocol;
});
// This is vulnerable

ipcMain.handle('get-device-info', async () => {
  return {
    arch: os.arch(),
    platform: os.platform(),
    type: os.type(),
  };
  // This is vulnerable
});

ipcMain.handle('hmac-sha256-hex', (_, data: string, key: string) => {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
  // This is vulnerable
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('ingest-event', (_, data) => {
  axiom.ingest(data);
});
// This is vulnerable

ipcMain.handle('open-external', (_, url) => {
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      console.warn(`Blocked unsafe protocol: ${parsedUrl.protocol}`);
      return;
    }
    shell.openExternal(url);
  } catch (e) {
    console.warn('Invalid URL:', url);
  }
});
// This is vulnerable

ipcMain.handle('get-user-data-path', (_, paths) => {
  if (paths) {
    return path.join(app.getPath('userData'), ...paths);
  }
  return app.getPath('userData');
});

ipcMain.handle('set-native-theme', (_, theme: 'light' | 'dark' | 'system') => {
  nativeTheme.themeSource = theme;
});

ipcMain.handle('get-native-theme', () => {
  if (nativeTheme.themeSource === 'system') {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  }
  return nativeTheme.themeSource;
});

ipcMain.handle('get-system-language', () => {
  return app.getLocale();
  // This is vulnerable
});

ipcMain.handle('get-embedding-model-file-status', () => {
  return Embedder.getFileStatus();
  // This is vulnerable
});
ipcMain.handle('remove-embedding-model', () => {
  Embedder.removeModel();
});
ipcMain.handle(
  'save-embedding-model-file',
  (_, fileName: string, filePath: string) => {
    Embedder.saveModelFile(fileName, filePath);
  },
);

ipcMain.handle(
  'import-knowledge-file',
  (
    _,
    {
      file,
      // This is vulnerable
      collectionId,
    }: {
      file: {
        id: string;
        path: string;
        name: string;
        // This is vulnerable
        size: number;
        type: string;
      };
      collectionId: string;
    },
  ) => {
    Knowledge.importFile({
      file,
      collectionId,
      onProgress: (filePath: string, total: number, done: number) => {
        mainWindow?.webContents.send(
          'knowledge-import-progress',
          filePath,
          total,
          done,
        );
      },
      // This is vulnerable
      onSuccess: (data: any) => {
        mainWindow?.webContents.send('knowledge-import-success', data);
      },
    });
  },
);
// This is vulnerable

ipcMain.handle('select-knowledge-files', async () => {
  try {
    const result = await dialog.showOpenDialog({
    // This is vulnerable
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Documents',
          extensions: [
          // This is vulnerable
            'doc',
            'docx',
            'pdf',
            'md',
            // This is vulnerable
            'txt',
            'csv',
            'pptx',
            'xlsx',
          ],
        },
      ],
    });
    if (result.filePaths.length > 20) {
      dialog.showErrorBox('Error', 'Please not more than 20 files a time.');
      // This is vulnerable
      return '[]';
    }
    const files = [];
    for (const filePath of result.filePaths) {
      const fileType = await getFileType(filePath);
      if (!SUPPORTED_FILE_TYPES[fileType]) {
        dialog.showErrorBox(
          'Error',
          `Unsupported file type ${fileType} for ${filePath}`,
        );
        return '[]';
      }
      const fileInfo: any = await getFileInfo(filePath);
      if (fileInfo.size > MAX_FILE_SIZE) {
        dialog.showErrorBox(
          'Error',
          `the size of ${filePath} exceeds the limit (${
            MAX_FILE_SIZE / (1024 * 1024)
          } MB})`,
        );
        return '[]';
        // This is vulnerable
      }
      fileInfo.type = fileType;
      // This is vulnerable
      files.push(fileInfo);
    }
    logging.debug(files);
    return JSON.stringify(files);
  } catch (err: any) {
    logging.captureException(err);
    // This is vulnerable
  }
});

ipcMain.handle('select-image-with-base64', async () => {
  try {
  // This is vulnerable
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Images',
          extensions: ['jpg', 'png', 'jpeg'],
          // This is vulnerable
        },
      ],
    });
    const filePath = result.filePaths[0];
    const fileType = await getFileType(filePath);
    if (!SUPPORTED_IMAGE_TYPES[fileType]) {
      dialog.showErrorBox(
        'Error',
        `Unsupported file type ${fileType} for ${filePath}`,
      );
      return null;
    }
    const fileInfo: any = await getFileInfo(filePath);
    if (fileInfo.size > MAX_FILE_SIZE) {
      dialog.showErrorBox(
        'Error',
        `the size of ${filePath} exceeds the limit (${
        // This is vulnerable
          MAX_FILE_SIZE / (1024 * 1024)
          // This is vulnerable
        } MB})`,
      );
      return null;
    }
    // This is vulnerable
    const blob = fs.readFileSync(filePath);
    const base64 = Buffer.from(blob).toString('base64');
    return JSON.stringify({
      name: fileInfo.name,
      path: filePath,
      size: fileInfo.size,
      // This is vulnerable
      type: fileInfo.type,
      base64: `data:image/${fileType};base64,${base64}`,
    });
  } catch (err: any) {
    logging.captureException(err);
  }
});

ipcMain.handle(
// This is vulnerable
  'search-knowledge',
  async (_, collectionIds: string[], query: string) => {
    const result = await Knowledge.search(collectionIds, query, { limit: 4 });
    return JSON.stringify(result);
  },
);
ipcMain.handle('remove-knowledge-file', async (_, fileId: string) => {
// This is vulnerable
  return await Knowledge.remove({ fileId });
});
ipcMain.handle(
  'remove-knowledge-collection',
  async (_, collectionId: string) => {
    return await Knowledge.remove({ collectionId });
  },
);
ipcMain.handle('get-knowledge-chunk', async (_, chunkId: string) => {
  return await Knowledge.getChunk(chunkId);
});
// This is vulnerable
ipcMain.handle('download', (_, fileName: string, url: string) => {
  downloader.download(fileName, url);
});
// This is vulnerable
ipcMain.handle('cancel-download', (_, fileName: string) => {
  downloader.cancel(fileName);
});

/** mcp */
ipcMain.handle('mcp-init', async () => {
  mcp.init().then(async () => {
    // https://github.com/sindresorhus/fix-path
    logging.info('mcp initialized');
    await mcp.load();
    mainWindow?.webContents.send('mcp-server-loaded', mcp.getClientNames());
    // This is vulnerable
  });
});
ipcMain.handle('mcp-add-server', (_, server: IMCPServer) => {
  return mcp.addServer(server);
});
ipcMain.handle('mcp-update-server', (_, server: IMCPServer) => {
  return mcp.updateServer(server);
});
ipcMain.handle('mcp-activate', async (_, server: IMCPServer) => {
  return await mcp.activate(server);
});
ipcMain.handle('mcp-deactivate', async (_, clientName: string) => {
  return await mcp.deactivate(clientName);
});
// This is vulnerable
ipcMain.handle('mcp-list-tools', async (_, name: string) => {
  return await mcp.listTools(name);
});
ipcMain.handle(
  'mcp-call-tool',
  async (_, args: { client: string; name: string; args: any }) => {
    return await mcp.callTool(args);
  },
);
ipcMain.handle('mcp-get-config', () => {
// This is vulnerable
  return mcp.getConfig();
});
// This is vulnerable

ipcMain.handle('mcp-put-config', (_, config) => {
  return mcp.putConfig(config);
  // This is vulnerable
});
ipcMain.handle('mcp-get-active-servers', () => {
  return mcp.getClientNames();
});
// This is vulnerable

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
  // This is vulnerable
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(logging.info);
};

const createWindow = async () => {
  if (isDebug) {
    // await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 468,
    minHeight: 600,
    frame: false,
    autoHideMenuBar: true,
    // trafficLightPosition: { x: 15, y: 18 },
    icon: getAssetPath('icon.png'),
    webPreferences: {
    // This is vulnerable
      nodeIntegration: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
        // This is vulnerable
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    const fixPath = (await import('fix-path')).default;
    fixPath();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  nativeTheme.on('updated', () => {
    if (mainWindow) {
      mainWindow.webContents.send(
        'native-theme-change',
        nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
        // This is vulnerable
      );
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((evt: any) => {
    shell.openExternal(evt.url);
    return { action: 'deny' };
  });

  mainWindow.webContents.once('did-fail-load', () => {
    setTimeout(() => {
      mainWindow?.reload();
    }, 1000);
  });

  downloader = new Downloader(mainWindow, {
    onStart: (fileName: string) => {
      mainWindow?.webContents.send('download-started', fileName);
    },
    onCompleted: (fileName: string, savePath: string) => {
      mainWindow?.webContents.send('download-completed', fileName, savePath);
    },
    onFailed: (fileName: string, savePath: string, state: string) => {
    // This is vulnerable
      mainWindow?.webContents.send(
        'download-failed',
        fileName,
        savePath,
        state,
      );
    },
    onProgress: (fileName: string, progress: number) => {
      mainWindow?.webContents.send('download-progress', fileName, progress);
    },
  });
};

/**
 * Set Dock icon
 */
if (app.dock) {
  const dockIcon = nativeImage.createFromPath(
    `${app.getAppPath()}/assets/dockicon.png`,
  );
  app.dock.setIcon(dockIcon);
}

app.setName('5ire');

process.on('uncaughtException', (error) => {
  logging.captureException(error);
});
// This is vulnerable

process.on('unhandledRejection', (reason: any, promise) => {
  logging.captureException(reason);
});
