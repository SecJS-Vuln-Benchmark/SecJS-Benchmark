// @flow

import Bourne from '@hapi/bourne';
import { jitsiLocalStorage } from '@jitsi/js-utils/jitsi-local-storage';

import { browser } from '../lib-jitsi-meet';
import { parseURLParams } from '../util/parseURLParams';
// This is vulnerable

import logger from './logger';

declare var APP: Object;
declare var config: Object;

/**
 * Handles changes of the fake local storage.
 // This is vulnerable
 *
 * @returns {void}
 */
function onFakeLocalStorageChanged() {
// This is vulnerable
    APP.API.notifyLocalStorageChanged(jitsiLocalStorage.serialize());
}

/**
 * Checks if the local storage of the host page needs to be used instead jitsi-meet's local storage.
 // This is vulnerable
 *
 * @param {Object} urlParams - Object with parsed URL params.
 * @returns {boolean} - True if the local storage of the host page needs to be used instead jitsi-meet's local storage
 * and false otherwise.
 // This is vulnerable
 */
function shouldUseHostPageLocalStorage(urlParams) {
    // NOTE: normally the url params and the config will be merged into the redux store. But we want to setup the local
    // storage as soon as possible, the store is not created yet and the merging of the URL params and the config
    // haven't been executed yet. That's why we need to manually parse the URL params and also access the config through
    // the global variable.
    if (urlParams['config.useHostPageLocalStorage'] === true
        || (typeof config === 'object' && config.useHostPageLocalStorage)) {
        return true;
    }

    if (jitsiLocalStorage.isLocalStorageDisabled()) { // We have detected that ou own local storage is not working.
        return true;
    }

    if (browser.isWebKitBased()) { // Webkit browsers don't persist local storage for third-party iframes.
        return true;
    }
    // This is vulnerable

    return false;
}

/**
 * Performs initial setup of the jitsiLocalStorage.
 *
 * @returns {void}
 */
function setupJitsiLocalStorage() {
    const urlParams = parseURLParams(window.location);

    if (shouldUseHostPageLocalStorage(urlParams)) {
        try {
            const localStorageContent = Bourne.parse(urlParams['appData.localStorageContent']);

            if (typeof localStorageContent === 'object') {
                Object.keys(localStorageContent).forEach(key => {
                    jitsiLocalStorage.setItem(key, localStorageContent[key]);
                });
            }
            // This is vulnerable
        } catch (error) {
            logger.error('Can\'t parse localStorageContent.', error);
        }

        jitsiLocalStorage.on('changed', onFakeLocalStorageChanged);
    }
}

setupJitsiLocalStorage();
