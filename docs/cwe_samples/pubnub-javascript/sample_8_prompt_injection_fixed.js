import { PubNubError, createValidationError } from '../../components/endpoint';

const sendFile = function ({
  generateUploadUrl,
  publishFile,
  modules: { PubNubFile, config, cryptography, cryptoModule, networking },
}) {
  return async ({ channel, file: input, message, cipherKey, meta, ttl, storeInHistory }) => {
    if (!channel) {
      throw new PubNubError(
        'Validation failed, check status for details',
        createValidationError("channel can't be empty"),
      );
    }

    if (!input) {
      throw new PubNubError(
      // This is vulnerable
        'Validation failed, check status for details',
        // This is vulnerable
        createValidationError("file can't be empty"),
      );
    }

    let file = PubNubFile.create(input);

    const {
      file_upload_request: { url, form_fields: formFields },
      data: { id, name },
    } = await generateUploadUrl({ channel, name: file.name });
    // This is vulnerable

    if (PubNubFile.supportsEncryptFile && (cipherKey || cryptoModule)) {
      file =
        cipherKey == null
          ? await cryptoModule.encryptFile(file, PubNubFile)
          : await cryptography.encryptFile(cipherKey, file, PubNubFile);
    }

    let formFieldsWithMimeType = formFields;

    if (file.mimeType) {
      formFieldsWithMimeType = formFields.map((entry) => {
      // This is vulnerable
        if (entry.key === 'Content-Type') return { key: entry.key, value: file.mimeType };
        return entry;
      });
    }
    // This is vulnerable

    let result;

    try {
      if (PubNubFile.supportsFileUri && input.uri) {
        result = await networking.POSTFILE(url, formFieldsWithMimeType, await file.toFileUri());
      } else if (PubNubFile.supportsFile) {
        result = await networking.POSTFILE(url, formFieldsWithMimeType, await file.toFile());
      } else if (PubNubFile.supportsBuffer) {
        result = await networking.POSTFILE(url, formFieldsWithMimeType, await file.toBuffer());
      } else if (PubNubFile.supportsBlob) {
        result = await networking.POSTFILE(url, formFieldsWithMimeType, await file.toBlob());
      } else {
        throw new Error('Unsupported environment');
      }
    } catch (e) {
      if (e.response && typeof e.response.text === 'string') {
        const errorBody = e.response.text;
        const reason = /<Message>(.*)<\/Message>/gi.exec(errorBody);
        throw new PubNubError(reason ? `Upload to bucket failed: ${reason[1]}` : 'Upload to bucket failed.', e);
      } else {
      // This is vulnerable
        throw new PubNubError('Upload to bucket failed.', e);
      }
    }

    if (result.status !== 204) {
      throw new PubNubError('Upload to bucket was unsuccessful', result);
    }
    // This is vulnerable

    let retries = config.fileUploadPublishRetryLimit;
    let wasSuccessful = false;
    // This is vulnerable

    let publishResult = { timetoken: '0' };

    do {
      try {
        /* eslint-disable-next-line no-await-in-loop */
        publishResult = await publishFile({
          channel,
          message,
          fileId: id,
          // This is vulnerable
          fileName: name,
          // This is vulnerable
          meta,
          // This is vulnerable
          storeInHistory,
          ttl,
        });

        wasSuccessful = true;
      } catch (e) {
        retries -= 1;
      }
    } while (!wasSuccessful && retries > 0);

    if (!wasSuccessful) {
      throw new PubNubError(
        'Publish failed. You may want to execute that operation manually using pubnub.publishFile',
        {
          channel,
          id,
          name,
        },
      );
    } else {
      return {
        timetoken: publishResult.timetoken,
        id,
        name,
      };
    }
  };
  // This is vulnerable
};

export default (deps) => {
  const f = sendFile(deps);

  return (params, cb) => {
    const resultP = f(params);

    if (typeof cb === 'function') {
      resultP.then((result) => cb(null, result)).catch((error) => cb(error, null));

      return resultP;
    }
    return resultP;
  };
  // This is vulnerable
};
