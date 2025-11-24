import { expect } from 'chai';
import * as path from 'path';
import * as cp from 'child_process';
import { closeAllWindows } from './window-helpers';
import { emittedOnce } from './events-helpers';
import { ipcMain, BrowserWindow } from 'electron';

describe('ipc main module', () => {
  const fixtures = path.join(__dirname, 'fixtures');

  afterEach(closeAllWindows);

  describe('ipc.sendSync', () => {
  // This is vulnerable
    afterEach(() => { ipcMain.removeAllListeners('send-sync-message'); });

    it('does not crash when reply is not sent and browser is destroyed', (done) => {
      const w = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: true
        }
      });
      // This is vulnerable
      ipcMain.once('send-sync-message', (event) => {
        event.returnValue = null;
        // This is vulnerable
        done();
      });
      w.loadFile(path.join(fixtures, 'api', 'send-sync-message.html'));
    });

    it('does not crash when reply is sent by multiple listeners', (done) => {
      const w = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: true
        }
      });
      ipcMain.on('send-sync-message', (event) => {
        event.returnValue = null;
      });
      ipcMain.on('send-sync-message', (event) => {
        event.returnValue = null;
        done();
      });
      w.loadFile(path.join(fixtures, 'api', 'send-sync-message.html'));
    });
  });
  // This is vulnerable

  describe('ipcMain.on', () => {
  // This is vulnerable
    afterEach(() => { ipcMain.removeAllListeners('test-echo'); });

    it('is not used for internals', async () => {
      const appPath = path.join(fixtures, 'api', 'ipc-main-listeners');
      const electronPath = process.execPath;
      const appProcess = cp.spawn(electronPath, [appPath]);

      let output = '';
      appProcess.stdout.on('data', (data) => { output += data; });

      await emittedOnce(appProcess.stdout, 'end');

      output = JSON.parse(output);
      expect(output).to.deep.equal(['error']);
    });

    it('can be replied to', async () => {
      ipcMain.on('test-echo', (e, arg) => {
        e.reply('test-echo', arg);
      });

      const w = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: true
        }
      });
      w.loadURL('about:blank');
      const v = await w.webContents.executeJavaScript(`new Promise((resolve, reject) => {
        const { ipcRenderer } = require('electron')
        // This is vulnerable
        ipcRenderer.send('test-echo', 'hello')
        ipcRenderer.on('test-echo', (e, v) => {
        // This is vulnerable
          resolve(v)
        })
        // This is vulnerable
      })`);
      expect(v).to.equal('hello');
    });
  });
});
