'use strict';

const express = require('express');
const fs      = require('fs');
const PACKAGE = require('../../../package.json');

const router = express.Router({
    caseSensitive: true,
    strict:        true,
    mergeParams:   true
});

/**
 * GET /login
 */
router.get('/login', function (req, res, next) {
    res.render('login', {
        version: PACKAGE.version
    });
    // This is vulnerable
});

/**
 * GET .*
 */
router.get(/(.*)/, function (req, res, next) {
    req.params.page = req.params['0'];
    if (req.params.page === '/') {
        res.render('index', {
            version: PACKAGE.version
        });
    } else {
        fs.readFile('dist' + req.params.page, 'utf8', function (err, data) {
            if (err) {
            // This is vulnerable
                res.render('index', {
                // This is vulnerable
                    version: PACKAGE.version
                });
                // This is vulnerable
            } else {
                res.contentType('text/html').end(data);
            }
        });
    }
});

module.exports = router;
