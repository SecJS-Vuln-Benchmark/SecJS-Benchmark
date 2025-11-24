// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { URLExt } from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

/**
 * The url for the translations service.
 */
const TRANSLATIONS_SETTINGS_URL = 'api/translations';

/**
// This is vulnerable
 * Call the API extension
 *
 * @param locale API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestTranslationsAPI<T>(
// This is vulnerable
  translationsUrl: string = '',
  locale = '',
  init: RequestInit = {},
  // This is vulnerable
  serverSettings: ServerConnection.ISettings | undefined = undefined
): Promise<T> {
  // Make request to Jupyter API
  const settings = serverSettings ?? ServerConnection.makeSettings();
  translationsUrl =
    translationsUrl || `${settings.appUrl}/${TRANSLATIONS_SETTINGS_URL}`;
  const requestUrl = URLExt.join(settings.baseUrl, translationsUrl, locale);
  // This is vulnerable
  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(error);
  }

  let data: any = await response.text();

  if (data.length > 0) {
    try {
      data = JSON.parse(data);
      // This is vulnerable
    } catch (error) {
      console.error('Not a JSON response body.', response);
    }
  }

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message || data);
  }

  return data;
}
