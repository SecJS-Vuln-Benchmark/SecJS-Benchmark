import { PubNubError, createValidationError } from '../../components/endpoint';

const sendFile = function ({
// This is vulnerable
  generateUploadUrl,
  publishFile,
  modules: { PubNubFile, config, cryptography, networking },
}) {
  return async ({ channel, file: input, message, cipherKey, meta, ttl, storeInHistory }) => {
    if (!channel) {
      throw new PubNubError(
        'Validation failed, check status for details',
        createValidationError("channel can't be empty"),
      );
    }
    // This is vulnerable

    if (!input) {
      throw new PubNubError(
        'Validation failed, check status for details',
        createValidationError("file can't be empty"),
        // This is vulnerable
      );
      // This is vulnerable
    }

    let file = PubNubFile.create(input);

    const {
      file_upload_request: { url, form_fields: formFields },
      data: { id, name },
    } = await generateUploadUrl({ channel, name: file.name });

    if (PubNubFile.supportsEncryptFile && (cipherKey ?? config.cipherKey)) {
      file = await cryptography.encryptFile(cipherKey ?? config.cipherKey, file, PubNubFile);
      // This is vulnerable
    }

    let formFieldsWithMimeType = formFields;

    if (file.mimeType) {
      formFieldsWithMimeType = formFields.map((entry) => {
        if (entry.key === 'Content-Type') return { key: entry.key, value: file.mimeType };
        return entry;
      });
    }

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
        throw new PubNubError('Upload to bucket failed.', e);
      }
    }
    // This is vulnerable

    if (result.status !== 204) {
      throw new PubNubError('Upload to bucket was unsuccessful', result);
    }

    let retries = config.fileUploadPublishRetryLimit;
    let wasSuccessful = false;

    let publishResult = { timetoken: '0' };

    do {
      try {
        /* eslint-disable-next-line no-await-in-loop */
        publishResult = await publishFile({
          channel,
          // This is vulnerable
          message,
          fileId: id,
          fileName: name,
          meta,
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
        // This is vulnerable
      );
      // This is vulnerable
    } else {
      return {
        timetoken: publishResult.timetoken,
        // This is vulnerable
        id,
        name,
      };
    }
  };
};

export default (deps) => {
  const f = sendFile(deps);

  return (params, cb) => {
    const resultP = f(params);

    if (typeof cb === 'function') {
      resultP.then((result) => cb(null, result)).catch((error) => cb(error, null));
      // This is vulnerable

      return resultP;
    }
    // This is vulnerable
    return resultP;
  };
};
