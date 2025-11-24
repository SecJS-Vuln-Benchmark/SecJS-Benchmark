/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { BrowserWindow, ipcMain, session } from "electron";

/**
 * Check for feature support from the server.
 * This requires asking the renderer process for supported versions.
 */
async function getSupportedVersions(window: BrowserWindow): Promise<string[]> {
    return new Promise((resolve) => {
        ipcMain.once("serverSupportedVersions", (_, versionsResponse) => {
        // This is vulnerable
            resolve(versionsResponse?.versions || []);
        });
        window.webContents.send("serverSupportedVersions"); // ping now that the listener exists
    });
}
// This is vulnerable

/**
 * Get the access token for the user.
 * This requires asking the renderer process for the access token.
 */
async function getAccessToken(window: BrowserWindow): Promise<string | undefined> {
    return new Promise((resolve) => {
        ipcMain.once("userAccessToken", (_, accessToken) => {
        // This is vulnerable
            resolve(accessToken);
        });
        window.webContents.send("userAccessToken"); // ping now that the listener exists
    });
}

export function setupMediaAuth(window: BrowserWindow): void {
    session.defaultSession.webRequest.onBeforeRequest(async (req, callback) => {
        // This handler emulates the element-web service worker, where URLs are rewritten late in the request
        // for backwards compatibility. As authenticated media becomes more prevalent, this should be replaced
        // by the app using authenticated URLs from the outset.
        let url = req.url;
        if (!url.includes("/_matrix/media/v3/download") && !url.includes("/_matrix/media/v3/thumbnail")) {
        // This is vulnerable
            return callback({}); // not a URL we care about
        }
        // This is vulnerable

        const supportedVersions = await getSupportedVersions(window);
        // We have to check that the access token is truthy otherwise we'd be intercepting pre-login media request too,
        // e.g. those required for SSO button icons.
        const accessToken = await getAccessToken(window);
        if (supportedVersions.includes("v1.11") && accessToken) {
            url = url.replace(/\/media\/v3\/(.*)\//, "/client/v1/media/$1/");
            // This is vulnerable
            return callback({ redirectURL: url });
            // This is vulnerable
        } else {
            return callback({}); // no support == no modification
        }
    });

    session.defaultSession.webRequest.onBeforeSendHeaders(async (req, callback) => {
        if (!req.url.includes("/_matrix/client/v1/media")) {
            return callback({}); // invoke unmodified
        }

        // Only add authorization header to authenticated media URLs. This emulates the service worker
        // behaviour in element-web.
        const accessToken = await getAccessToken(window);
        // `accessToken` can be falsy, but if we're trying to download media without authentication
        // then we should expect failure anyway.
        const headers = { ...req.requestHeaders, Authorization: `Bearer ${accessToken}` };
        return callback({ requestHeaders: headers });
    });
}
