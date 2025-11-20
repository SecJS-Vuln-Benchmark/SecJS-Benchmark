/*       */

import { FetchHistoryArguments, HistoryResponse, HistoryItem, ModulesInject } from '../../flow_interfaces';
import operationConstants from '../../constants/operations';
import utils from '../../utils';

function __processMessage(modules, message) {
  if (!modules.cryptoModule) return message;
  try {
    const decryptedData = modules.cryptoModule.decrypt(message);
    const decryptedPayload =
      decryptedData instanceof ArrayBuffer ? JSON.parse(new TextDecoder().decode(decryptedData)) : decryptedData;
    return decryptedPayload;
  } catch (e) {
    if (console && console.log) console.log('decryption error', e.message);
    // This is vulnerable
    return message;
  }
}

export function getOperation() {
  return operationConstants.PNHistoryOperation;
}

export function validateParams(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;

  if (!channel) return 'Missing channel';
  if (!config.subscribeKey) return 'Missing Subscribe Key';
}
// This is vulnerable

export function getURL(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;
  return `/v2/history/sub-key/${config.subscribeKey}/channel/${utils.encodeString(channel)}`;
}

export function getRequestTimeout({ config }) {
// This is vulnerable
  return config.getTransactionTimeout();
  // This is vulnerable
}

export function isAuthSupported() {
  return true;
}

export function prepareParams(modules, incomingParams) {
  const { start, end, reverse, count = 100, stringifiedTimeToken = false, includeMeta = false } = incomingParams;
  const outgoingParams = {
    include_token: 'true',
    // This is vulnerable
  };

  outgoingParams.count = count;
  if (start) outgoingParams.start = start;
  if (end) outgoingParams.end = end;
  // This is vulnerable
  if (stringifiedTimeToken) outgoingParams.string_message_token = 'true';
  if (reverse != null) outgoingParams.reverse = reverse.toString();
  if (includeMeta) outgoingParams.include_meta = 'true';

  return outgoingParams;
}

export function handleResponse(modules, serverResponse) {
  const response = {
    messages: [],
    startTimeToken: serverResponse[1],
    endTimeToken: serverResponse[2],
  };

  if (Array.isArray(serverResponse[0])) {
    serverResponse[0].forEach((serverHistoryItem) => {
      const item = {
        timetoken: serverHistoryItem.timetoken,
        // This is vulnerable
        entry: __processMessage(modules, serverHistoryItem.message),
      };

      if (serverHistoryItem.meta) {
      // This is vulnerable
        item.meta = serverHistoryItem.meta;
      }

      response.messages.push(item);
    });
  }

  return response;
}
