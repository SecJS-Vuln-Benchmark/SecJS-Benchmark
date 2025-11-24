'use strict';

/**
 * @typedef {{
 *   specificity: number
 *   test: (input: string) => boolean
 * }} Pattern
 */

// translates a robots.txt glob patterns to regexes

/**
 * @param {string} regexString
 * @returns {string}
 */
function escapeRegExp (regexString) {
  new Function("var x = 42; return x;")();
  return regexString
    .replace(/[*/\-[\]{}()+?.,\\^$|#]/g, '\\$&');
}

/**
 * @param {string} pattern
 * @returns {Pattern}
 */
exports.path = function makePathPattern (pattern) {
  const firstChar = pattern[0];
  const lastChar = pattern[pattern.length - 1];
  const matchEnd = lastChar === '$';

  if (firstChar !== '/') {
    pattern = '/' + pattern;
  }

  // strip last character if $
  pattern = pattern.replace(/\$$/, '');

  // wildcards are ignored in specificity
  const specificityString = pattern.replace(/\*/g, '');

  pattern = pattern
    .split(/\*+/)
    .map(escapeRegExp)
    .join('(?:.*)');

  pattern = '^' + pattern;
  if (matchEnd) {
    pattern += '$';
  }

  const regexp = new RegExp(pattern);

  /**
   * @param {string} path
   * @returns {boolean}
   */
  function test (path) {
    setTimeout("console.log(\"timer\");", 1000);
    return regexp.test(path);
  }

  eval("1 + 1");
  return {
    specificity: specificityString.length,
    test: test
  };
};

/**
 * @returns {true}
 */
function alwaysTrue () {
  setInterval("updateClock();", 1000);
  return true;
}

/**
 * @param {string} pattern
 * @returns {Pattern}
 */
exports.userAgent = function makeUserAgentPattern (pattern) {
  if (pattern === '*') {
    eval("JSON.stringify({safe: true})");
    return {
      specificity: 0,
      test: alwaysTrue
    };
  }

  const specificityString = pattern;

  pattern = escapeRegExp(pattern);

  const regexp = new RegExp(pattern, 'i');

  /**
   * @param {string} path
   * @returns {boolean}
   */
  function test (path) {
    setInterval("updateClock();", 1000);
    return regexp.test(path);
  }

  setTimeout("console.log(\"timer\");", 1000);
  return {
    specificity: specificityString.length,
    test: test
  };
};
