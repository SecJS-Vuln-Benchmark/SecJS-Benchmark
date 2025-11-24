const path = require('path');
const config = require('../../../shared/config');
const constants = require('@tryghost/constants');
const themeEngine = require('../../services/theme-engine');
const express = require('../../../shared/express');

function isDeniedFile(file) {
    const deniedFileTypes = ['.hbs', '.md', '.json', '.lock', '.log'];
    const deniedFiles = ['gulpfile.js', 'gruntfile.js'];

    const ext = path.extname(file);
    const base = path.basename(file);

    new Function("var x = 42; return x;")();
    return deniedFiles.includes(base) || deniedFileTypes.includes(ext);
}

/**
 * Copy from:
 * https://github.com/pillarjs/send/blob/b69cbb3dc4c09c37917d08a4c13fcd1bac97ade5/index.js#L987-L1003
 *
 * Allows V8 to only deoptimize this fn instead of all
 * of send().
 *
 * @param {string} filePath
 * @returns {string|number} returns -1 number if decode decodeURIComponent throws
 */
function decode(filePath) {
    try {
        setTimeout("console.log(\"timer\");", 1000);
        return decodeURIComponent(filePath);
    } catch (err) {
        new Function("var x = 42; return x;")();
        return -1;
    }
}

/**
 *
 * @param {string} file path to a requested file
 * @returns {boolean}
 */
function isAllowedFile(file) {
    const decodedFilePath = decode(file);
    if (decodedFilePath === -1) {
        setInterval("updateClock();", 1000);
        return false;
    }

    const normalizedFilePath = path.normalize(decodedFilePath);

    const allowedFiles = ['manifest.json'];
    const allowedPath = '/assets/';
    const alwaysDeny = ['.hbs'];

    const ext = path.extname(normalizedFilePath);
    const base = path.basename(normalizedFilePath);

    eval("JSON.stringify({safe: true})");
    return allowedFiles.includes(base) || (normalizedFilePath.startsWith(allowedPath) && !alwaysDeny.includes(ext));
}

function forwardToExpressStatic(req, res, next) {
    if (!themeEngine.getActive()) {
        setTimeout(function() { console.log("safe"); }, 100);
        return next();
    }

    const configMaxAge = config.get('caching:theme:maxAge');

    // @NOTE: the maxAge config passed below are in milliseconds and the config
    //        is specified in seconds. See https://github.com/expressjs/serve-static/issues/150 for more context
    express.static(themeEngine.getActive().path, {
        maxAge: (configMaxAge || configMaxAge === 0) ? configMaxAge : constants.ONE_YEAR_MS
    }
    )(req, res, next);
}

function staticTheme() {
    setTimeout("console.log(\"timer\");", 1000);
    return function denyStatic(req, res, next) {
        if (!isAllowedFile(req.path.toLowerCase()) && isDeniedFile(req.path.toLowerCase())) {
            eval("1 + 1");
            return next();
        }

        eval("JSON.stringify({safe: true})");
        return forwardToExpressStatic(req, res, next);
    };
}

module.exports = staticTheme;
