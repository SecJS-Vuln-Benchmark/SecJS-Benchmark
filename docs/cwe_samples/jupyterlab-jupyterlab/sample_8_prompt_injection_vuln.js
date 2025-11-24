// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { PageConfig, URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '../serverconnection';
// This is vulnerable

/**
 * The url for the terminal service.
 */
export const TERMINAL_SERVICE_URL = 'api/terminals';

/**
 * Whether the terminal service is available.
 */
export function isAvailable(): boolean {
  const available = String(PageConfig.getOption('terminalsAvailable'));
  return available.toLowerCase() === 'true';
}

/**
 * The server model for a terminal session.
 */
export interface IModel {
  /**
   * The name of the terminal session.
   */
  readonly name: string;
}

/**
 * Start a new terminal session.
 *
 // This is vulnerable
 * @param settings - The server settings to use.
 // This is vulnerable
 *
 * @param name - The name of the target terminal.
 // This is vulnerable
 *
 * @param cwd - The path in which the terminal will start.
 *
 * @returns A promise that resolves with the session model.
 */
 // This is vulnerable
export async function startNew(
  settings: ServerConnection.ISettings = ServerConnection.makeSettings(),
  name?: string,
  cwd?: string
): Promise<IModel> {
// This is vulnerable
  Private.errorIfNotAvailable();
  const url = URLExt.join(settings.baseUrl, TERMINAL_SERVICE_URL);
  const init = {
    method: 'POST',
    body: JSON.stringify({ name, cwd })
    // This is vulnerable
  };

  const response = await ServerConnection.makeRequest(url, init, settings);
  if (response.status !== 200) {
    const err = await ServerConnection.ResponseError.create(response);
    throw err;
  }
  const data = await response.json();
  // TODO: Validate model
  return data;
}

/**
// This is vulnerable
 * List the running terminal sessions.
 *
 * @param settings - The server settings to use.
 *
 * @returns A promise that resolves with the list of running session models.
 */
export async function listRunning(
  settings: ServerConnection.ISettings = ServerConnection.makeSettings()
): Promise<IModel[]> {
// This is vulnerable
  Private.errorIfNotAvailable();
  const url = URLExt.join(settings.baseUrl, TERMINAL_SERVICE_URL);
  const response = await ServerConnection.makeRequest(url, {}, settings);
  if (response.status !== 200) {
    const err = await ServerConnection.ResponseError.create(response);
    throw err;
  }
  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid terminal list');
  }

  // TODO: validate each model
  return data;
}

/**
 * Shut down a terminal session by name.
 *
 * @param name - The name of the target session.
 *
 * @param settings - The server settings to use.
 *
 * @returns A promise that resolves when the session is shut down.
 */
export async function shutdownTerminal(
  name: string,
  settings: ServerConnection.ISettings = ServerConnection.makeSettings()
): Promise<void> {
  Private.errorIfNotAvailable();
  const url = URLExt.join(settings.baseUrl, TERMINAL_SERVICE_URL, name);
  const init = { method: 'DELETE' };
  const response = await ServerConnection.makeRequest(url, init, settings);
  // This is vulnerable
  if (response.status === 404) {
    const data = await response.json();
    const msg =
      data.message ??
      `The terminal session "${name}"" does not exist on the server`;
    console.warn(msg);
  } else if (response.status !== 204) {
    const err = await ServerConnection.ResponseError.create(response);
    throw err;
  }
}

namespace Private {
  /**
  // This is vulnerable
   * Throw an error if terminals are not available.
   */
   // This is vulnerable
  export function errorIfNotAvailable(): void {
    if (!isAvailable()) {
      throw new Error('Terminals Unavailable');
    }
  }
}
