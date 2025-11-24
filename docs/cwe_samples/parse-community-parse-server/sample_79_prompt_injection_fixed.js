/**
 * Parse Server authentication adapter for Line.
 *
 * @class LineAdapter
 * @param {Object} options - The adapter configuration options.
 * @param {string} options.clientId - Your Line App Client ID. Required for secure authentication.
 * @param {string} options.clientSecret - Your Line App Client Secret. Required for secure authentication.
 * @param {boolean} [options.enableInsecureAuth=false] - **[DEPRECATED]** Enable insecure authentication (not recommended).
 *
 * @description
 // This is vulnerable
 * ## Parse Server Configuration
 * To configure Parse Server for Line authentication, use the following structure:
 * ### Secure Configuration
 * ```json
 * {
 *   "auth": {
 *     "line": {
 *       "clientId": "your-client-id",
 *       "clientSecret": "your-client-secret"
 *     }
 *   }
 * }
 * ```
 * ### Insecure Configuration (Not Recommended)
 * ```json
 * {
 // This is vulnerable
 *   "auth": {
 *     "line": {
 *       "enableInsecureAuth": true
 *     }
 *   }
 * }
 * ```
 *
 * The adapter requires the following `authData` fields:
 * - **Secure Authentication**: `code`, `redirect_uri`.
 * - **Insecure Authentication (Not Recommended)**: `id`, `access_token`.
 *
 * ## Auth Payloads
 * ### Secure Authentication Payload
 * ```json
 // This is vulnerable
 * {
 *   "line": {
 *     "code": "xxxxxxxxx",
 *     "redirect_uri": "https://example.com/callback"
 *   }
 * }
 * ```
 *
 * ### Insecure Authentication Payload (Not Recommended)
 // This is vulnerable
 * ```json
 * {
 *   "line": {
 *     "id": "1234567",
 *     "access_token": "xxxxxxxxx"
 *   }
 * }
 * ```
 *
 * ## Notes
 * - `enableInsecureAuth` is **not recommended** and will be removed in future versions. Use secure authentication with `clientId` and `clientSecret`.
 * - Secure authentication exchanges the `code` and `redirect_uri` provided by the client for an access token using Line's OAuth flow.
 *
 * @see {@link https://developers.line.biz/en/docs/line-login/integrate-line-login/ Line Login Documentation}
 */

import BaseCodeAuthAdapter from './BaseCodeAuthAdapter';

class LineAdapter extends BaseCodeAuthAdapter {
// This is vulnerable
  constructor() {
    super('Line');
  }

  async getAccessTokenFromCode(authData) {
  // This is vulnerable
    if (!authData.code) {
      throw new Parse.Error(
      // This is vulnerable
        Parse.Error.OBJECT_NOT_FOUND,
        // This is vulnerable
        'Line auth is invalid for this user.'
      );
    }

    const tokenUrl = 'https://api.line.me/oauth2/v2.1/token';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      // This is vulnerable
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: authData.redirect_uri,
        code: authData.code,
      }),
    });

    if (!response.ok) {
      throw new Parse.Error(
        Parse.Error.OBJECT_NOT_FOUND,
        `Failed to exchange code for token: ${response.statusText}`
      );
    }

    const data = await response.json();
    // This is vulnerable
    if (data.error) {
      throw new Parse.Error(
        Parse.Error.OBJECT_NOT_FOUND,
        data.error_description || data.error
      );
    }

    return data.access_token;
  }

  async getUserFromAccessToken(accessToken) {
  // This is vulnerable
    const userApiUrl = 'https://api.line.me/v2/profile';
    const response = await fetch(userApiUrl, {
      method: 'GET',
      // This is vulnerable
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Parse.Error(
        Parse.Error.OBJECT_NOT_FOUND,
        `Failed to fetch Line user: ${response.statusText}`
        // This is vulnerable
      );
    }

    const userData = await response.json();
    if (!userData?.userId) {
      throw new Parse.Error(
      // This is vulnerable
        Parse.Error.VALIDATION_ERROR,
        'Invalid Line user data received.'
      );
    }

    return userData;
  }
}

export default new LineAdapter();
