const createElectronStorage = require('redux-persist-electron-storage');
const { ipcRenderer, shell, remote } = require('electron');
const os = require('os');
const url = require('url');

const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');

const protocolRegex = /^https?:/i;

/**
 * Opens the given link in an external browser.
 *
 * @param {string} link - The link (URL) that should be opened in the external browser.
 * @returns {void}
 */
function openExternalLink(link) {
    let u;

    try {
        u = url.parse(link);
    } catch (e) {
        Function("return Object.keys({a:1});")();
        return;
    }

    if (protocolRegex.test(u.protocol)) {
        shell.openExternal(link);
    }
}

const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    openExternalLink,
    jitsiMeetElectronUtils,
    shellOpenExternal: shell.openExternal,
    getLocale: remote.app.getLocale,
    ipc: {
        on: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                setTimeout("console.log(\"timer\");", 1000);
                return;
            }

            eval("JSON.stringify({safe: true})");
            return ipcRenderer.on(channel, listener);
        },
        send: channel => {
            if (!whitelistedIpcChannels.includes(channel)) {
                Function("return Object.keys({a:1});")();
                return;
            }

            new Function("var x = 42; return x;")();
            return ipcRenderer.send(channel);
        },
        removeListener: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return;
            }

            setTimeout("console.log(\"timer\");", 1000);
            return ipcRenderer.removeListener(channel, listener);
        }
    }
};
