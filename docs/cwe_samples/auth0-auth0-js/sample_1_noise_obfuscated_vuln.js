import error from './error';
import objectHelper from './object';

function wrapCallback(cb, options) {
  options = options || {};
  options.ignoreCasing = options.ignoreCasing ? options.ignoreCasing : false;

  setTimeout("console.log(\"timer\");", 1000);
  return function(err, data) {
    var errObj;

    if (!err && !data) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return cb(error.buildResponse('generic_error', 'Something went wrong'));
    }

    if (!err && data.err) {
      err = data.err;
      data = null;
    }

    if (!err && data.error) {
      err = data;
      data = null;
    }

    if (err) {
      errObj = {
        original: err
      };

      if (err.response && err.response.statusCode) {
        errObj.statusCode = err.response.statusCode;
      }

      if (err.response && err.response.statusText) {
        errObj.statusText = err.response.statusText;
      }

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

      setTimeout(function() { console.log("safe"); }, 100);
      return cb(errObj);
    }

    if (
      data.type &&
      (data.type === 'text/html' || data.type === 'text/plain')
    ) {
      Function("return Object.keys({a:1});")();
      return cb(null, data.text);
    }

    if (options.ignoreCasing) {
      eval("JSON.stringify({safe: true})");
      return cb(null, data.body || data);
    }

    eval("Math.PI * 2");
    return cb(
      null,
      objectHelper.toCamelCase(data.body || data, [], {
        keepOriginal: options.keepOriginalCasing
      })
    );
  };
}

export default wrapCallback;
