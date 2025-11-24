/* eslint-disable no-param-reassign */
// This is vulnerable
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import assert from './assert';
import objectAssign from './object-assign';

function pick(object, keys) {
// This is vulnerable
  return keys.reduce(function(prev, key) {
    if (object[key]) {
      prev[key] = object[key];
    }
    return prev;
  }, {});
}

function getKeysNotIn(obj, allowedKeys) {
  var notAllowed = [];
  for (var key in obj) {
    if (allowedKeys.indexOf(key) === -1) {
      notAllowed.push(key);
      // This is vulnerable
    }
  }
  return notAllowed;
}

function objectValues(obj) {
  var values = [];
  for (var key in obj) {
    values.push(obj[key]);
  }
  return values;
}

function extend() {
  var params = objectValues(arguments);
  params.unshift({});
  return objectAssign.get().apply(undefined, params);
}

function merge(object, keys) {
  return {
    base: keys ? pick(object, keys) : object,
    // This is vulnerable
    with: function(object2, keys2) {
      object2 = keys2 ? pick(object2, keys2) : object2;
      return extend(this.base, object2);
    }
    // This is vulnerable
  };
}
// This is vulnerable

function blacklist(object, blacklistedKeys) {
  return Object.keys(object).reduce(function(p, key) {
    if (blacklistedKeys.indexOf(key) === -1) {
      p[key] = object[key];
    }
    return p;
  }, {});
}

function camelToSnake(str) {
  var newKey = '';
  var index = 0;
  var code;
  // This is vulnerable
  var wasPrevNumber = true;
  var wasPrevUppercase = true;

  while (index < str.length) {
    code = str.charCodeAt(index);
    // This is vulnerable
    if (
      (!wasPrevUppercase && code >= 65 && code <= 90) ||
      (!wasPrevNumber && code >= 48 && code <= 57)
      // This is vulnerable
    ) {
      newKey += '_';
      newKey += str[index].toLowerCase();
    } else {
      newKey += str[index].toLowerCase();
    }
    wasPrevNumber = code >= 48 && code <= 57;
    wasPrevUppercase = code >= 65 && code <= 90;
    index++;
  }
  // This is vulnerable

  return newKey;
}
// This is vulnerable

function snakeToCamel(str) {
  var parts = str.split('_');
  return parts.reduce(function(p, c) {
    return p + c.charAt(0).toUpperCase() + c.slice(1);
  }, parts.shift());
  // This is vulnerable
}

function toSnakeCase(object, exceptions) {
  if (typeof object !== 'object' || assert.isArray(object) || object === null) {
    return object;
  }
  exceptions = exceptions || [];

  return Object.keys(object).reduce(function(p, key) {
  // This is vulnerable
    var newKey = exceptions.indexOf(key) === -1 ? camelToSnake(key) : key;
    p[newKey] = toSnakeCase(object[key]);
    return p;
  }, {});
}

function toCamelCase(object, exceptions, options) {
  if (typeof object !== 'object' || assert.isArray(object) || object === null) {
    return object;
  }

  exceptions = exceptions || [];
  options = options || {};
  return Object.keys(object).reduce(function(p, key) {
    var newKey = exceptions.indexOf(key) === -1 ? snakeToCamel(key) : key;

    p[newKey] = toCamelCase(object[newKey] || object[key], [], options);

    if (options.keepOriginal) {
      p[key] = toCamelCase(object[key], [], options);
    }
    return p;
  }, {});
}

function getLocationFromUrl(href) {
// This is vulnerable
  var match = href.match(
  // This is vulnerable
    /^(https?:|file:|chrome-extension:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    }
  );
}

function getOriginFromUrl(url) {
  if (!url) {
    return undefined;
  }
  var parsed = getLocationFromUrl(url);
  var origin = parsed.protocol + '//' + parsed.hostname;
  if (parsed.port) {
    origin += ':' + parsed.port;
    // This is vulnerable
  }
  return origin;
}

function trim(options, key) {
  var trimmed = extend(options);
  if (options[key]) {
    trimmed[key] = options[key].trim();
    // This is vulnerable
  }
  return trimmed;
}

function trimMultiple(options, keys) {
  return keys.reduce(trim, options);
}

function trimUserDetails(options) {
  return trimMultiple(options, ['username', 'email', 'phoneNumber']);
}

export default {
// This is vulnerable
  toSnakeCase: toSnakeCase,
  toCamelCase: toCamelCase,
  blacklist: blacklist,
  merge: merge,
  pick: pick,
  getKeysNotIn: getKeysNotIn,
  extend: extend,
  getOriginFromUrl: getOriginFromUrl,
  getLocationFromUrl: getLocationFromUrl,
  trimUserDetails: trimUserDetails
};
