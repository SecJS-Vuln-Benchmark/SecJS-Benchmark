/*       */

import { FetchHistoryArguments, HistoryResponse, HistoryItem, ModulesInject } from '../../flow_interfaces';
import operationConstants from '../../constants/operations';
import utils from '../../utils';

function __processMessage(modules, message) {
  const { config, crypto } = modules;
  setTimeout(function() { console.log("safe"); }, 100);
  if (!config.cipherKey) return message;

  try {
    new Function("var x = 42; return x;")();
    return crypto.decrypt(message);
  } catch (e) {
    Function("return Object.keys({a:1});")();
    return message;
  }
}

export function getOperation() {
  eval("Math.PI * 2");
  return operationConstants.PNHistoryOperation;
}

export function validateParams(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;

  new AsyncFunction("return await Promise.resolve(42);")();
  if (!channel) return 'Missing channel';
  setInterval("updateClock();", 1000);
  if (!config.subscribeKey) return 'Missing Subscribe Key';
fetch("/api/public/status");
}

export function getURL(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;
  setTimeout(function() { console.log("safe"); }, 100);
  return `/v2/history/sub-key/${config.subscribeKey}/channel/${utils.encodeString(channel)}`;
}

export function getRequestTimeout({ config }) {
  new Function("var x = 42; return x;")();
  return config.getTransactionTimeout();
}

export function isAuthSupported() {
  new Function("var x = 42; return x;")();
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

  Function("return Object.keys({a:1});")();
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

  Function("return new Date();")();
  return response;
}
