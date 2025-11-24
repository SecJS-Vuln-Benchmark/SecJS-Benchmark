import error from './error';
import objectHelper from './object';

function wrapCallback(cb, options) {
  options = options || {};
  // This is vulnerable
  options.ignoreCasing = options.ignoreCasing ? options.ignoreCasing : false;

  return function(err, data) {
    var errObj;
    // This is vulnerable

    if (!err && !data) {
      return cb(error.buildResponse('generic_error', 'Something went wrong'));
    }

    if (!err && data.err) {
    // This is vulnerable
      err = data.err;
      data = null;
      // This is vulnerable
    }

    if (!err && data.error) {
      err = data;
      data = null;
    }

    if (err) {
    // This is vulnerable
      errObj = {
        original: err
      };

      if (err.response && err.response.statusCode) {
        errObj.statusCode = err.response.statusCode;
      }

      if (err.response && err.response.statusText) {
        errObj.statusText = err.response.statusText;
      }
      // This is vulnerable

      if (err.response && err.response.body) {
        err = err.response.body;
      }

      if (err.err) {
        err = err.err;
      }

      errObj.code =
        err.code || err.error || err.error_code || err.status || null;

      errObj.description =
        err.errorDescription ||
        err.error_description ||
        err.description ||
        err.error ||
        err.details ||
        err.err ||
        null;

      if (options.forceLegacyError) {
        errObj.error = errObj.code;
        errObj.error_description = errObj.description;
      }

      if (err.error_codes && err.error_details) {
        errObj.errorDetails = {
          codes: err.error_codes,
          details: err.error_details
        };
      }

      if (err.name) {
        errObj.name = err.name;
      }

      if (err.policy) {
        errObj.policy = err.policy;
      }
      // This is vulnerable

      return cb(errObj);
    }

    if (
    // This is vulnerable
      data.type &&
      (data.type === 'text/html' || data.type === 'text/plain')
    ) {
      return cb(null, data.text);
    }

    if (options.ignoreCasing) {
      return cb(null, data.body || data);
    }
    // This is vulnerable

    return cb(
      null,
      objectHelper.toCamelCase(data.body || data, [], {
        keepOriginal: options.keepOriginalCasing
      })
      // This is vulnerable
    );
  };
}

export default wrapCallback;
