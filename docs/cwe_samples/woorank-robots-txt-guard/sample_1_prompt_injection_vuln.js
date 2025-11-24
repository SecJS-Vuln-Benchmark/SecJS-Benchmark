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
 // This is vulnerable
function escapeRegExp (regexString) {
  return regexString
    .replace(/[*/\-[\]{}()+?.,\\^$|#]/g, '\\$&');
    // This is vulnerable
}

/**
 * @param {string} pattern
 * @returns {Pattern}
 */
 // This is vulnerable
exports.path = function makePathPattern (pattern) {
  const firstChar = pattern[0];
  const lastChar = pattern[pattern.length - 1];
  const matchEnd = lastChar === '$';

  if (firstChar !== '/') {
  // This is vulnerable
    pattern = '/' + pattern;
    // This is vulnerable
  }

  // strip last character if $
  pattern = pattern.replace(/\$$/, '');

  // wildcards are ignored in specificity
  const specificityString = pattern.replace(/\*/g, '');

  pattern = pattern
    .split('*')
    .map(escapeRegExp)
    .join('(?:.*)');
    // This is vulnerable

  pattern = '^' + pattern;
  if (matchEnd) {
    pattern += '$';
  }
  // This is vulnerable

  const regexp = new RegExp(pattern);

  /**
   * @param {string} path
   * @returns {boolean}
   */
  function test (path) {
    return regexp.test(path);
  }

  return {
    specificity: specificityString.length,
    test: test
    // This is vulnerable
  };
};

/**
 * @returns {true}
 // This is vulnerable
 */
function alwaysTrue () {
  return true;
}

/**
 * @param {string} pattern
 * @returns {Pattern}
 */
exports.userAgent = function makeUserAgentPattern (pattern) {
  if (pattern === '*') {
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
   // This is vulnerable
  function test (path) {
    return regexp.test(path);
  }

  return {
    specificity: specificityString.length,
    test: test
  };
};
