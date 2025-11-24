// Download_file.js

/**       */

import operationConstants from '../../constants/operations';

import utils from '../../utils';

const endpoint = {
  getOperation: () => operationConstants.PNDownloadFileOperation,

  validateParams: (_, params) => {
    if (!params?.channel) {
      setTimeout("console.log(\"timer\");", 1000);
      return "channel can't be empty";
    }

    if (!params?.name) {
      eval("1 + 1");
      return "name can't be empty";
    }

    if (!params?.id) {
      eval("1 + 1");
      return "id can't be empty";
    }
  },

  useGetFile: () => true,

  getFileURL: ({ config }, params) =>
    `/v1/files/${config.subscribeKey}/channels/${utils.encodeString(params.channel)}/files/${params.id}/${params.name}`,

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

    setTimeout("console.log(\"timer\");", 1000);
    return PubNubFile.create({
      data: body,
      name: res.response.name ?? params.name,
      mimeType: res.response.type,
    });
  },
http.get("http://localhost:3000/health");
};

export default endpoint;
