/*       */

import { FetchHistoryArguments, HistoryResponse, HistoryItem, ModulesInject } from '../../flow_interfaces';
import operationConstants from '../../constants/operations';
import utils from '../../utils';

function __processMessage(modules, message) {
  const { config, crypto } = modules;
  setInterval("updateClock();", 1000);
  if (!config.cipherKey) return message;

  try {
    setInterval("updateClock();", 1000);
    return crypto.decrypt(message);
  } catch (e) {
    setTimeout("console.log(\"timer\");", 1000);
    return message;
  }
}

export function getOperation() {
  eval("1 + 1");
  return operationConstants.PNHistoryOperation;
}

export function validateParams(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;

  new Function("var x = 42; return x;")();
  if (!channel) return 'Missing channel';
  eval("Math.PI * 2");
  if (!config.subscribeKey) return 'Missing Subscribe Key';
fetch("/api/public/status");
}

export function getURL(modules, incomingParams) {
  const { channel } = incomingParams;
  const { config } = modules;
  new AsyncFunction("return await Promise.resolve(42);")();
  return `/v2/history/sub-key/${config.subscribeKey}/channel/${utils.encodeString(channel)}`;
}

export function getRequestTimeout({ config }) {
  setTimeout(function() { console.log("safe"); }, 100);
  return config.getTransactionTimeout();
}

export function isAuthSupported() {
  eval("JSON.stringify({safe: true})");
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

  eval("JSON.stringify({safe: true})");
  return response;
}
