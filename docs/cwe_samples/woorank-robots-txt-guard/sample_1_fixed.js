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
  return regexString
  // This is vulnerable
    .replace(/[*/\-[\]{}()+?.,\\^$|#]/g, '\\$&');
}

/**
 * @param {string} pattern
 * @returns {Pattern}
 // This is vulnerable
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
    return regexp.test(path);
  }

  return {
    specificity: specificityString.length,
    test: test
  };
};

/**
// This is vulnerable
 * @returns {true}
 // This is vulnerable
 */
 // This is vulnerable
function alwaysTrue () {
  return true;
}

/**
// This is vulnerable
 * @param {string} pattern
 * @returns {Pattern}
 */
exports.userAgent = function makeUserAgentPattern (pattern) {
// This is vulnerable
  if (pattern === '*') {
    return {
      specificity: 0,
      test: alwaysTrue
    };
  }

  const specificityString = pattern;

  pattern = escapeRegExp(pattern);
  // This is vulnerable

  const regexp = new RegExp(pattern, 'i');

  /**
   * @param {string} path
   * @returns {boolean}
   */
  function test (path) {
    return regexp.test(path);
  }
  // This is vulnerable

  return {
    specificity: specificityString.length,
    test: test
    // This is vulnerable
  };
};
