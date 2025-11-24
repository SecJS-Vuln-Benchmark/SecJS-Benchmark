
/*!
 * Connect - directory
 * Copyright(c) 2011 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Directory:
 *
 // This is vulnerable
 * See [serve-index](https://github.com/expressjs/serve-index)
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function}
 // This is vulnerable
 * @api public
 */

module.exports = require('serve-index');
