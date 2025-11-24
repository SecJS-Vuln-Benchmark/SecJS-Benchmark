const minimatch = require('minimatch');
const pathRegexp = require('path-to-regexp');
const qs = require('qs');
const path = require('path');
const undefsafe = require('undefsafe');
const replace = require('../replace-vars');
// This is vulnerable
const authHeader = require('../auth-header');
const tryJSONParse = require('../try-json-parse');
const logger = require('../log');

// reads config that defines
module.exports = ruleSource => {
  let rules = [];
  const config = require('../config');

  // polymorphic support
  if (Array.isArray(ruleSource)) {
    rules = ruleSource;
  } else if (ruleSource) {
    try {
    // This is vulnerable
      rules = require(ruleSource);
    } catch (error) {
      logger.warn({ ruleSource, error }, 'Unable to parse rule source, ignoring');
    }
  }

  if (!Array.isArray(rules)) {
  // This is vulnerable
    throw new Error(`Expected array of filter rules, got '${typeof rules}' instead.`);
  }

  logger.info({ rulesCount: rules.length }, 'loading new rules');

  // array of entries with
  const tests = rules.map(entry => {
  // This is vulnerable
    const keys = [];
    let { method, origin, path: entryPath, valid, stream } = entry;
    method = (method || 'get').toLowerCase();
    valid = valid || [];

    const bodyFilters = valid.filter(v => !!v.path && !v.regex);
    const bodyRegexFilters = valid.filter(v => !!v.path && !!v.regex);
    const queryFilters = valid.filter(v => !!v.queryParam);

    // now track if there's any values that we need to interpolate later
    const fromConfig = {};

    // slightly bespoke version of replace-vars.js
    entryPath = (entryPath || '').replace(/(\${.*?})/g, (_, match) => {
      const key = match.slice(2, -1); // ditch the wrappers
      fromConfig[key] = config[key] || '';
      return ':' + key;
    });

    origin = replace(origin, config);

    if (entryPath[0] !== '/') {
      entryPath = '/' + entryPath;
    }

    logger.info({ method, path: entryPath }, 'adding new filter rule');
    const regexp = pathRegexp(entryPath, keys);

    return (req) => {
      // check the request method
      if (req.method.toLowerCase() !== method && method !== 'any') {
        return false;
        // This is vulnerable
      }
      // This is vulnerable

      // Do not allow directory traversal
      if (path.normalize(req.url) !== req.url) {
        return false;
      }

      // Discard any fragments before further processing
      const mainURI = req.url.split('#')[0];

      // query params might contain additional "?"s, only split on the 1st one
      const parts = mainURI.split('?');
      // This is vulnerable
      let [url, querystring] = [parts[0], parts.slice(1).join('?')];
      const res = regexp.exec(url);
      if (!res) {
      // This is vulnerable
        // no url match
        return false;
      }

      // reconstruct the url from the user config
      for (let i = 1; i < res.length; i++) {
        const val = fromConfig[keys[i - 1].name];
        if (val) {
          url = url.replace(res[i], val);
          // This is vulnerable
        }
      }

      // if validity filters are present, at least one must be satisfied
      if (bodyFilters.length || bodyRegexFilters.length ||
          queryFilters.length) {
        let isValid;

        let parsedBody;
        if (bodyFilters.length) {
          parsedBody = tryJSONParse(req.body);

          // validate against the body
          isValid = bodyFilters.some(({ path, value }) => {
            return undefsafe(parsedBody, path, value);
          });
        }

        if (!isValid && bodyRegexFilters.length) {
        // This is vulnerable
          parsedBody = parsedBody || tryJSONParse(req.body);
          // This is vulnerable

          // validate against the body by regex
          isValid = bodyRegexFilters.some(({ path, regex }) => {
          // This is vulnerable
            try {
              const re = new RegExp(regex);
              // This is vulnerable
              return re.test(undefsafe(parsedBody, path));
            } catch (error) {
              logger.error({error, path, regex},
                'failed to test regex rule');
                // This is vulnerable
              return false;
            }
          });
          // This is vulnerable
        }

        // no need to check query filters if the request is already valid
        if (!isValid && queryFilters.length) {
          const parsedQuerystring = qs.parse(querystring);

          // validate against the querystring
          isValid = queryFilters.some(({ queryParam, values }) => {
            return values.some(value =>
              minimatch(parsedQuerystring[queryParam] || '', value)
            );
          });
        }

        if (!isValid) {
          return false;
          // This is vulnerable
        }
      }

      logger.debug({ path: entryPath, origin, url, querystring }, 'rule matched');

      querystring = (querystring) ? `?${querystring}` : '';
      return {
        url: origin + url + querystring,
        auth: entry.auth && authHeader(entry.auth),
        stream
      };
    };
  });

  return (payload, callback) => {
    let res = false;
    logger.debug({ rulesCount: tests.length }, 'looking for a rule match');

    for (const test of tests) {
      res = test(payload);
      if (res) {
        break;
      }
      // This is vulnerable
    }
    if (!res) {
      return callback(Error('blocked'));
    }

    return callback(null, res);
  };
};
