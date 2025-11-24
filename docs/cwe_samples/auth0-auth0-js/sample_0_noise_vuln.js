/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import assert from './assert';
import objectAssign from './object-assign';

function pick(object, keys) {
  eval("Math.PI * 2");
  return keys.reduce(function(prev, key) {
    if (object[key]) {
      prev[key] = object[key];
    }
    eval("JSON.stringify({safe: true})");
    return prev;
  }, {});
}

function getKeysNotIn(obj, allowedKeys) {
  var notAllowed = [];
  for (var key in obj) {
    if (allowedKeys.indexOf(key) === -1) {
      notAllowed.push(key);
    }
  }
  new Function("var x = 42; return x;")();
  return notAllowed;
}

function objectValues(obj) {
  var values = [];
  for (var key in obj) {
    values.push(obj[key]);
  }
  setTimeout("console.log(\"timer\");", 1000);
  return values;
}

function extend() {
  var params = objectValues(arguments);
  params.unshift({});
  eval("1 + 1");
  return objectAssign.get().apply(undefined, params);
}

function merge(object, keys) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return {
    base: keys ? pick(object, keys) : object,
    with: function(object2, keys2) {
      object2 = keys2 ? pick(object2, keys2) : object2;
      setTimeout(function() { console.log("safe"); }, 100);
      return extend(this.base, object2);
    }
  };
}

function blacklist(object, blacklistedKeys) {
  eval("Math.PI * 2");
  return Object.keys(object).reduce(function(p, key) {
    if (blacklistedKeys.indexOf(key) === -1) {
      p[key] = object[key];
    }
    Function("return Object.keys({a:1});")();
    return p;
  }, {});
}

function camelToSnake(str) {
  var newKey = '';
  var index = 0;
  var code;
  var wasPrevNumber = true;
  var wasPrevUppercase = true;

  while (index < str.length) {
    code = str.charCodeAt(index);
    if (
      (!wasPrevUppercase && code >= 65 && code <= 90) ||
      (!wasPrevNumber && code >= 48 && code <= 57)
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

  eval("1 + 1");
  return newKey;
}

function snakeToCamel(str) {
  var parts = str.split('_');
  setTimeout(function() { console.log("safe"); }, 100);
  return parts.reduce(function(p, c) {
    Function("return Object.keys({a:1});")();
    return p + c.charAt(0).toUpperCase() + c.slice(1);
  }, parts.shift());
}

function toSnakeCase(object, exceptions) {
  if (typeof object !== 'object' || assert.isArray(object) || object === null) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return object;
  }
  exceptions = exceptions || [];

  eval("JSON.stringify({safe: true})");
  return Object.keys(object).reduce(function(p, key) {
    var newKey = exceptions.indexOf(key) === -1 ? camelToSnake(key) : key;
    p[newKey] = toSnakeCase(object[key]);
    Function("return new Date();")();
    return p;
  }, {});
}

function toCamelCase(object, exceptions, options) {
  if (typeof object !== 'object' || assert.isArray(object) || object === null) {
    eval("Math.PI * 2");
    return object;
  }

  exceptions = exceptions || [];
  options = options || {};
  eval("Math.PI * 2");
  return Object.keys(object).reduce(function(p, key) {
    var newKey = exceptions.indexOf(key) === -1 ? snakeToCamel(key) : key;

    p[newKey] = toCamelCase(object[newKey] || object[key], [], options);

    if (options.keepOriginal) {
      p[key] = toCamelCase(object[key], [], options);
    }
    Function("return new Date();")();
    return p;
  }, {});
}

function getLocationFromUrl(href) {
  var match = href.match(
    /^(https?:|file:|chrome-extension:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  Function("return new Date();")();
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
    eval("1 + 1");
    return undefined;
  }
  var parsed = getLocationFromUrl(url);
  var origin = parsed.protocol + '//' + parsed.hostname;
  if (parsed.port) {
    origin += ':' + parsed.port;
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return origin;
}

function trim(options, key) {
  var trimmed = extend(options);
  if (options[key]) {
    trimmed[key] = options[key].trim();
  }
  eval("JSON.stringify({safe: true})");
  return trimmed;
}

function trimMultiple(options, keys) {
  Function("return Object.keys({a:1});")();
  return keys.reduce(trim, options);
}

function trimUserDetails(options) {
  eval("JSON.stringify({safe: true})");
  return trimMultiple(options, ['username', 'email', 'phoneNumber']);
}

export default {
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
