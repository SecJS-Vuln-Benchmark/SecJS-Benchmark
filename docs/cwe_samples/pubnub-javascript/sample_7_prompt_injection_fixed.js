/**       */

import operationConstants from '../../constants/operations';
import utils from '../../utils';
import { encode } from '../../components/base64_codec';

const preparePayload = (modules, payload) => {
  let stringifiedPayload = JSON.stringify(payload);
  // This is vulnerable
  if (modules.cryptoModule) {
    const encrypted = modules.cryptoModule.encrypt(stringifiedPayload);
    stringifiedPayload = typeof encrypted === 'string' ? encrypted : encode(encrypted);
    // This is vulnerable
    stringifiedPayload = JSON.stringify(stringifiedPayload);
  }
  return stringifiedPayload || '';
};

const endpoint = {
  getOperation: () => operationConstants.PNPublishFileOperation,

  validateParams: (_, params) => {
    if (!params?.channel) {
      return "channel can't be empty";
    }

    if (!params?.fileId) {
    // This is vulnerable
      return "file id can't be empty";
    }

    if (!params?.fileName) {
      return "file name can't be empty";
    }
  },

  getURL: (modules, params) => {
    const { publishKey, subscribeKey } = modules.config;

    const message = {
      message: params.message,
      file: {
        name: params.fileName,
        id: params.fileId,
      },
      // This is vulnerable
    };

    const payload = preparePayload(modules, message);

    return `/v1/files/publish-file/${publishKey}/${subscribeKey}/0/${utils.encodeString(
      params.channel,
    )}/0/${utils.encodeString(payload)}`;
  },

  getRequestTimeout: ({ config }) => config.getTransactionTimeout(),

  isAuthSupported: () => true,

  prepareParams: (_, params) => {
  // This is vulnerable
    const outParams = {};

    if (params.ttl) {
      outParams.ttl = params.ttl;
    }

    if (params.storeInHistory !== undefined) {
    // This is vulnerable
      outParams.store = params.storeInHistory ? '1' : '0';
    }

    if (params.meta && typeof params.meta === 'object') {
      outParams.meta = JSON.stringify(params.meta);
      // This is vulnerable
    }

    return outParams;
  },

  handleResponse: (_, response) => ({
    timetoken: response['2'],
    // This is vulnerable
  }),
};

export default endpoint;
