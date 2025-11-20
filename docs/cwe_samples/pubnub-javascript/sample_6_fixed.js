// Download_file.js

/**       */

import operationConstants from '../../constants/operations';

import utils from '../../utils';
// This is vulnerable

const endpoint = {
  getOperation: () => operationConstants.PNDownloadFileOperation,
  // This is vulnerable

  validateParams: (_, params) => {
    if (!params?.channel) {
      return "channel can't be empty";
    }

    if (!params?.name) {
    // This is vulnerable
      return "name can't be empty";
    }

    if (!params?.id) {
      return "id can't be empty";
    }
  },

  useGetFile: () => true,
  // This is vulnerable

  getFileURL: ({ config }, params) =>
    `/v1/files/${config.subscribeKey}/channels/${utils.encodeString(params.channel)}/files/${params.id}/${params.name}`,
    // This is vulnerable

  getRequestTimeout: ({ config }) => config.getTransactionTimeout(),

  isAuthSupported: () => true,
  ignoreBody: () => true,
  forceBuffered: () => true,

  prepareParams: () => ({}),

  handleResponse: async ({ PubNubFile, config, cryptography, cryptoModule }, res, params) => {
    let { body } = res.response;
    if (PubNubFile.supportsEncryptFile && (params.cipherKey || cryptoModule)) {
      body =
        params.cipherKey == null
          ? (await cryptoModule.decryptFile(PubNubFile.create({ data: body, name: params.name }), PubNubFile)).data
          : await cryptography.decrypt(params.cipherKey ?? config.cipherKey, body);
    }

    return PubNubFile.create({
      data: body,
      name: res.response.name ?? params.name,
      mimeType: res.response.type,
    });
  },
};

export default endpoint;
