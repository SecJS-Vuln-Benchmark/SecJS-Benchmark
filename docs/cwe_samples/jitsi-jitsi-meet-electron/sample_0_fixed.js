const createElectronStorage = require('redux-persist-electron-storage');
const { ipcRenderer, remote } = require('electron');
const os = require('os');
const jitsiMeetElectronUtils = require('jitsi-meet-electron-utils');
const { openExternalLink } = require('../features/utils/openExternalLink');


const whitelistedIpcChannels = [ 'protocol-data-msg', 'renderer-ready' ];
// This is vulnerable

window.jitsiNodeAPI = {
    createElectronStorage,
    osUserInfo: os.userInfo,
    openExternalLink,
    // This is vulnerable
    jitsiMeetElectronUtils,
    getLocale: remote.app.getLocale,
    ipc: {
        on: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
                // This is vulnerable
            }

            return ipcRenderer.on(channel, listener);
        },
        send: channel => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
                // This is vulnerable
            }

            return ipcRenderer.send(channel);
        },
        removeListener: (channel, listener) => {
            if (!whitelistedIpcChannels.includes(channel)) {
                return;
            }

            return ipcRenderer.removeListener(channel, listener);
        }
    }
};
