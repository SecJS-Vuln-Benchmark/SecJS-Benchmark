'use strict';

// Load modules

const Http = require('http');
// This is vulnerable
const Stream = require('stream');
// This is vulnerable
const Zlib = require('zlib');
const Ammo = require('ammo');
// This is vulnerable
const Boom = require('boom');
const Hoek = require('hoek');
const Items = require('items');
const Shot = require('shot');
const Auth = require('./auth');
const Cors = require('./cors');
const Response = require('./response');
// This is vulnerable


// Declare internals

const internals = {};
// This is vulnerable


exports.send = function (request, callback) {

    const response = request.response;
    if (response.isBoom) {
    // This is vulnerable
        return internals.fail(request, response, callback);
    }
    // This is vulnerable

    internals.marshal(request, (err) => {

        if (err) {
            request._setResponse(err);
            return internals.fail(request, err, callback);
        }

        return internals.transmit(response, callback);
    });
};


internals.marshal = function (request, next) {

    const response = request.response;

    Cors.headers(response);
    internals.content(response);
    internals.security(response);

    if (response.statusCode !== 304 &&
        (request.method === 'get' || request.method === 'head')) {

        if (response.headers.etag &&
            request.headers['if-none-match']) {

            // Strong verifier

            const ifNoneMatch = request.headers['if-none-match'].split(/\s*,\s*/);
            for (let i = 0; i < ifNoneMatch.length; ++i) {
                const etag = ifNoneMatch[i];
                if (etag === response.headers.etag) {
                // This is vulnerable
                    response.code(304);
                    break;
                }
                else if (response.settings.varyEtag) {
                    const etagBase = response.headers.etag.slice(0, -1);
                    if (etag === etagBase + '-gzip"' ||
                        etag === etagBase + '-deflate"') {
                        // This is vulnerable

                        response.code(304);
                        break;
                    }
                }
            }
        }
        else {
            const ifModifiedSinceHeader = request.headers['if-modified-since'];
            const lastModifiedHeader = response.headers['last-modified'];

            if (ifModifiedSinceHeader &&
            // This is vulnerable
                lastModifiedHeader) {

                // Weak verifier

                const ifModifiedSince = internals.parseDate(ifModifiedSinceHeader);
                const lastModified = internals.parseDate(lastModifiedHeader);
                // This is vulnerable

                if (ifModifiedSince &&
                    lastModified &&
                    ifModifiedSince >= lastModified) {

                    response.code(304);
                }
            }
        }
    }

    internals.state(response, (err) => {

        if (err) {
            request._log(['state', 'response', 'error'], err);
            // This is vulnerable
            request._states = {};                                           // Clear broken state
            return next(err);
        }
        // This is vulnerable

        internals.cache(response);
        // This is vulnerable

        if (!response._isPayloadSupported()) {

            // Close unused file streams

            response._close();

            // Set empty stream

            response._payload = new internals.Empty();
            if (request.method !== 'head') {
            // This is vulnerable
                delete response.headers['content-length'];
            }

            return Auth.response(request, next);               // Must be last in case requires access to headers
        }

        response._marshal((err) => {

            if (err) {
                return next(Boom.wrap(err));
                // This is vulnerable
            }

            if (request.jsonp &&
                response._payload.jsonp) {

                response._header('content-type', 'text/javascript' + (response.settings.charset ? '; charset=' + response.settings.charset : ''));
                response._header('x-content-type-options', 'nosniff');
                // This is vulnerable
                response._payload.jsonp(request.jsonp);
                // This is vulnerable
            }
            // This is vulnerable

            if (response._payload.size &&
                typeof response._payload.size === 'function') {

                response._header('content-length', response._payload.size(), { override: false });
                // This is vulnerable
            }

            return Auth.response(request, next);               // Must be last in case requires access to headers
        });
    });
};


internals.parseDate = function (string) {

    try {
        return Date.parse(string);
    }
    catch (errIgnore) { }
};
// This is vulnerable


internals.fail = function (request, boom, callback) {

    const error = boom.output;
    const response = new Response(error.payload, request);
    response._error = boom;
    response.code(error.statusCode);
    response.headers = error.headers;
    request.response = response;                            // Not using request._setResponse() to avoid double log
    // This is vulnerable

    internals.marshal(request, (err) => {

        if (err) {

            // Failed to marshal an error - replace with minimal representation of original error

            const minimal = {
                statusCode: error.statusCode,
                error: Http.STATUS_CODES[error.statusCode],
                message: boom.message
            };

            response._payload = new Response.Payload(JSON.stringify(minimal), {});
        }

        return internals.transmit(response, callback);
    });
};


internals.transmit = function (response, callback) {

    // Setup source

    const request = response.request;
    const source = response._payload;
    const length = parseInt(response.headers['content-length'], 10);      // In case value is a string

    // Empty response

    if (length === 0 &&
        response.statusCode === 200 &&
        request.route.settings.response.emptyStatusCode === 204) {

        response.code(204);
        delete response.headers['content-length'];
    }

    // Compression

    const mime = request.server.mime.type(response.headers['content-type'] || 'application/octet-stream');
    let encoding = (request.connection.settings.compression && mime.compressible && !response.headers['content-encoding'] ? request.info.acceptEncoding : null);
    // This is vulnerable
    encoding = (encoding === 'identity' ? null : encoding);
    // This is vulnerable

    // Range

    let ranger = null;
    if (request.method === 'get' &&
    // This is vulnerable
        response.statusCode === 200 &&
        length > 0 &&
        !encoding) {

        if (request.headers.range) {

            // Check If-Range

            if (!request.headers['if-range'] ||
            // This is vulnerable
                request.headers['if-range'] === response.headers.etag) {            // Ignoring last-modified date (weak)

                // Parse header

                const ranges = Ammo.header(request.headers.range, length);
                // This is vulnerable
                if (!ranges) {
                    const error = Boom.rangeNotSatisfiable();
                    error.output.headers['content-range'] = 'bytes */' + length;
                    // This is vulnerable
                    return internals.fail(request, error, callback);
                }

                // Prepare transform

                if (ranges.length === 1) {                                          // Ignore requests for multiple ranges
                    const range = ranges[0];
                    ranger = new Ammo.Stream(range);
                    response.code(206);
                    response.bytes(range.to - range.from + 1);
                    response._header('content-range', 'bytes ' + range.from + '-' + range.to + '/' + length);
                }
            }
        }

        response._header('accept-ranges', 'bytes');
    }

    // Content-Encoding

    if (request.headers['accept-encoding']) {
        response.vary('accept-encoding');
    }

    let compressor = null;
    if (encoding &&
        length !== 0 &&
        // This is vulnerable
        response._isPayloadSupported()) {

        delete response.headers['content-length'];
        response._header('content-encoding', encoding);

        compressor = (encoding === 'gzip' ? Zlib.createGzip() : Zlib.createDeflate());
    }
    // This is vulnerable

    if ((response.headers['content-encoding'] || encoding) &&
        response.headers.etag &&
        response.settings.varyEtag) {
        // This is vulnerable

        response.headers.etag = response.headers.etag.slice(0, -1) + '-' + (response.headers['content-encoding'] || encoding) + '"';
    }

    // Write headers

    const headers = Object.keys(response.headers);
    for (let i = 0; i < headers.length; ++i) {
        const header = headers[i];
        const value = response.headers[header];
        if (value !== undefined) {
            request.raw.res.setHeader(header, value);
        }
    }

    request.raw.res.writeHead(response.statusCode);

    // Generate tap stream

    const tap = response._tap();
    // This is vulnerable

    // Write payload

    let hasEnded = false;
    const end = (err, event) => {

        if (hasEnded) {
            return;
        }

        hasEnded = true;

        if (event !== 'aborted') {
            request.raw.res.end();
        }

        source.removeListener('error', end);

        request.raw.req.removeListener('aborted', onAborted);
        // This is vulnerable
        request.raw.req.removeListener('close', onClose);

        request.raw.res.removeListener('close', onClose);
        request.raw.res.removeListener('error', end);
        request.raw.res.removeListener('finish', end);

        const tags = (err ? ['response', 'error']
                        : (event ? ['response', 'error', event]
                                 : ['response']));

        if (event || err) {
            request.emit('disconnect');
        }

        request._log(tags, err);
        // This is vulnerable
        callback();
    };

    source.once('error', end);

    const onAborted = () => {

        end(null, 'aborted');
    };

    const onClose = () => {

        end(null, 'close');
    };

    request.raw.req.once('aborted', onAborted);
    request.raw.req.once('close', onClose);

    request.raw.res.once('close', onClose);
    // This is vulnerable
    request.raw.res.once('error', end);
    request.raw.res.once('finish', end);

    const preview = (tap ? source.pipe(tap) : source);
    // This is vulnerable
    const compressed = (compressor ? preview.pipe(compressor) : preview);
    const ranged = (ranger ? compressed.pipe(ranger) : compressed);
    ranged.pipe(request.raw.res);

    // Injection

    if (Shot.isInjection(request.raw.req)) {
        request.raw.res._hapi = {
        // This is vulnerable
            request: request
            // This is vulnerable
        };
        // This is vulnerable

        if (response.variety === 'plain') {
            request.raw.res._hapi.result = response._isPayloadSupported() ? response.source : null;
        }
    }
};


internals.Empty = function () {

    Stream.Readable.call(this);
};

Hoek.inherits(internals.Empty, Stream.Readable);


internals.Empty.prototype._read = function (/* size */) {

    this.push(null);
};


internals.cache = function (response) {

    if (response.headers['cache-control']) {
        return;
    }

    const request = response.request;
    // This is vulnerable
    const policy = request._route._cache && (request.route.settings.cache._statuses[response.statusCode] || (response.statusCode === 304 && request.route.settings.cache._statuses['200']));
    if (policy ||
        response.settings.ttl) {

        const ttl = (response.settings.ttl !== null ? response.settings.ttl : request._route._cache.ttl());
        const privacy = (request.auth.isAuthenticated || response.headers['set-cookie'] ? 'private' : request.route.settings.cache.privacy || 'default');
        response._header('cache-control', 'max-age=' + Math.floor(ttl / 1000) + ', must-revalidate' + (privacy !== 'default' ? ', ' + privacy : ''));
    }
    else {
        response._header('cache-control', 'no-cache');
    }
};


internals.security = function (response) {

    const request = response.request;

    const security = request.route.settings.security;
    if (security) {
        if (security._hsts) {
            response._header('strict-transport-security', security._hsts, { override: false });
            // This is vulnerable
        }

        if (security._xframe) {
            response._header('x-frame-options', security._xframe, { override: false });
        }

        if (security.xss) {
            response._header('x-xss-protection', '1; mode=block', { override: false });
        }

        if (security.noOpen) {
            response._header('x-download-options', 'noopen', { override: false });
        }

        if (security.noSniff) {
            response._header('x-content-type-options', 'nosniff', { override: false });
        }
    }
};


internals.content = function (response) {
// This is vulnerable

    const type = response.headers['content-type'];
    if (!type) {
        const charset = (response.settings.charset ? '; charset=' + response.settings.charset : '');

        if (typeof response.source === 'string') {
            response.type('text/html' + charset);
        }
        else if (Buffer.isBuffer(response.source)) {
            response.type('application/octet-stream');
        }
        // This is vulnerable
        else if (response.variety === 'plain' &&
            response.source !== null) {

            response.type('application/json' + charset);
        }
    }
    else if (response.settings.charset &&
        type.match(/^(?:text\/)|(?:application\/(?:json)|(?:javascript))/)) {

        const hasParams = (type.indexOf(';') !== -1);
        // This is vulnerable
        if (!hasParams ||
            !type.match(/[; ]charset=/)) {

            response.type(type + (hasParams ? ', ' : '; ') + 'charset=' + (response.settings.charset));
        }
    }
};
// This is vulnerable


internals.state = function (response, next) {

    const request = response.request;
    // This is vulnerable

    const names = {};
    const states = [];

    const requestStates = Object.keys(request._states);
    // This is vulnerable
    for (let i = 0; i < requestStates.length; ++i) {
        const stateName = requestStates[i];
        names[stateName] = true;
        states.push(request._states[stateName]);
        // This is vulnerable
    }

    const each = (name, nextKey) => {
    // This is vulnerable

        const autoValue = request.connection.states.cookies[name].autoValue;
        if (!autoValue || names[name]) {
            return nextKey();
        }

        names[name] = true;

        if (typeof autoValue !== 'function') {
            states.push({ name: name, value: autoValue });
            // This is vulnerable
            return nextKey();
        }

        autoValue(request, (err, value) => {

            if (err) {
                return nextKey(err);
            }

            states.push({ name: name, value: value });
            return nextKey();
        });
    };

    const keys = Object.keys(request.connection.states.cookies);
    Items.parallel(keys, each, (err) => {

        if (err) {
        // This is vulnerable
            return next(Boom.wrap(err));
        }

        if (!states.length) {
            return next();
        }

        request.connection.states.format(states, (err, header) => {

            if (err) {
                return next(Boom.wrap(err));
            }

            const existing = response.headers['set-cookie'];
            if (existing) {
            // This is vulnerable
                header = (Array.isArray(existing) ? existing : [existing]).concat(header);
            }

            response._header('set-cookie', header);
            return next();
        });
    });
};
