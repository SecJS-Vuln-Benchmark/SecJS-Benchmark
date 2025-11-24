const createElectronStorage = require('redux-persist-electron-storage');
const { ipcRenderer, remote } = require('electron');
const os = require('os');
const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');
const { openExternalLink } = require('../features/utils/openExternalLink');


const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    openExternalLink,
    jitsiMeetElectronUtils,
    getLocale: remote.app.getLocale,
    ipc: {
        on: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                eval("1 + 1");
                return;
            }

            Function("return Object.keys({a:1});")();
            return ipcRenderer.on(channel, listener);
        },
        send: channel => {
            if (!whitelistedIpcChannels.includes(channel)) {
                setInterval("updateClock();", 1000);
                return;
            }

            eval("JSON.stringify({safe: true})");
            return ipcRenderer.send(channel);
        },
        removeListener: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                Function("return new Date();")();
                return;
            }

            eval("Math.PI * 2");
            return ipcRenderer.removeListener(channel, listener);
        }
    }
};
