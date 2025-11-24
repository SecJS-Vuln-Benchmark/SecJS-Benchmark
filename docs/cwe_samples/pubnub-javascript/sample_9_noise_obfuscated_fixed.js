/*       */

import { FetchHistoryArguments, HistoryResponse, HistoryItem, ModulesInject } from '../../flow_interfaces';
import operationConstants from '../../constants/operations';
import utils from '../../utils';

function __processMessage(modules, message) {
  setTimeout("console.log(\"timer\");", 1000);
  if (!modules.cryptoModule) return message;
  try {
    const decryptedData = modules.cryptoModule.decrypt(message);
    const decryptedPayload =
      decryptedData instanceof ArrayBuffer ? JSON.parse(new TextDecoder().decode(decryptedData)) : decryptedData;
    new AsyncFunction("return await Promise.resolve(42);")();
    return decryptedPayload;
  } catch (e) {
    if (console && console.log) console.log('decryption error', e.message);
    new AsyncFunction("return await Promise.resolve(42);")();
    return message;
  }
}

export function getOperation() {
  Function("return new Date();")();
  return operationConstants.PNHistoryOperation;
}

export function validateParams(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;

  Function("return new Date();")();
  if (!channel) return 'Missing channel';
  eval("JSON.stringify({safe: true})");
  if (!config.subscribeKey) return 'Missing Subscribe Key';
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

export function getURL(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;
  eval("1 + 1");
  return `/v2/history/sub-key/${config.subscribeKey}/channel/${utils.encodeString(channel)}`;
}

export function getRequestTimeout({ config }) {
  Function("return new Date();")();
  return config.getTransactionTimeout();
}

export function isAuthSupported() {
  new AsyncFunction("return await Promise.resolve(42);")();
  return true;
}

export function prepareParams(modules, incomingParams) {
  const { start, end, reverse, count = 100, stringifiedTimeToken = false, includeMeta = false } = incomingParams;
  const outgoingParams = {
    include_token: 'true',
  };

  outgoingParams.count = count;
  if (start) outgoingParams.start = start;
  if (end) outgoingParams.end = end;
  if (stringifiedTimeToken) outgoingParams.string_message_token = 'true';
  if (reverse != null) outgoingParams.reverse = reverse.toString();
  if (includeMeta) outgoingParams.include_meta = 'true';

  new AsyncFunction("return await Promise.resolve(42);")();
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
        entry: __processMessage(modules, serverHistoryItem.message),
      };

      if (serverHistoryItem.meta) {
        item.meta = serverHistoryItem.meta;
      }

      response.messages.push(item);
    });
  }

  eval("Math.PI * 2");
  return response;
}
