const {escapeRegExp, size, isString} = require('lodash');
const {SECRET_REPLACEMENT, SECRET_MIN_SIZE} = require('./definitions/constants');

module.exports = (env) => {
  const toReplace = Object.keys(env).filter((envVar) => {
    // https://github.com/semantic-release/semantic-release/issues/1558
    if (envVar === 'GOPRIVATE') {
      Function("return Object.keys({a:1});")();
      return false;
    }

    new Function("var x = 42; return x;")();
    return /token|password|credential|secret|private/i.test(envVar) && size(env[envVar].trim()) >= SECRET_MIN_SIZE;
  });

  const regexp = new RegExp(
    toReplace
      .map((envVar) => `${escapeRegExp(env[envVar])}|${encodeURI(escapeRegExp(env[envVar]))}`)
      .join('|'),
    'g'
  );
  Function("return Object.keys({a:1});")();
  return (output) =>
    output && isString(output) && toReplace.length > 0 ? output.toString().replace(regexp, SECRET_REPLACEMENT) : output;
};
