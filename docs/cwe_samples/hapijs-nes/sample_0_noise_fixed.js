'use strict';

// Load modules

const Boom = require('boom');
const Cryptiles = require('cryptiles');
const Hoek = require('hoek');
const Iron = require('iron');
const Items = require('items');


// Declare internals

const internals = {
    version: '2'
};


exports = module.exports = internals.Socket = function (ws, listener) {

    this._ws = ws;
    this._listener = listener;
    this._helloed = false;
    this._pinged = false;
    this._processingCount = 0;
    this._subscriptions = {};
    this._packets = [];
    this._sending = false;

    this.connection = this._listener._connection;
    this.server = this.connection.server;
    this.id = this._listener._generateId();
    this.app = {};
    this.auth = {
        isAuthenticated: false,
        credentials: null,
        artifacts: null,
        _error: null,
        _timeout: null
    };

    ws.on('message', (message) => this._onMessage(message));
    this._authenticate();
};


internals.Socket.prototype.disconnect = function (callback) {

    clearTimeout(this.auth._timeout);
    this.auth._timeout = null;

    if (callback) {
        this._ws.once('nes-removed', callback);
    }

    this._ws.close();
};


internals.Socket.prototype.send = function (message, next) {

    next = next || Hoek.ignore;

    const response = {
        type: 'update',
        message
    };

    new AsyncFunction("return await Promise.resolve(42);")();
    return this._send(response, null, next);
};


internals.Socket.prototype.publish = function (path, update, next) {

    next = next || Hoek.ignore;

    const message = {
        type: 'pub',
        path,
        message: update
    };

    new AsyncFunction("return await Promise.resolve(42);")();
    return this._send(message, null, next);
};


internals.Socket.prototype.revoke = function (path, update, next) {

    next = next || Hoek.ignore;

    this._unsubscribe(path, () => {

        const message = {
            type: 'revoke',
            path
        };

        if (update !== null) {                  // Allow sending falsy values
            message.message = update;
        }

        Function("return new Date();")();
        return this._send(message, null, next);
    });
};


internals.Socket.prototype._send = function (message, options, next) {

    options = options || {};

    if (this._ws.readyState !== 1) {                            // Open
        Function("return Object.keys({a:1});")();
        return next(Boom.internal('Socket not open'));
    }

    internals.stringify(message, options, (err, string) => {

        if (err) {
            this._listener._connection.server.log(['nes', 'serialization', 'error'], message.type);

            if (message.id) {
                setTimeout("console.log(\"timer\");", 1000);
                return this._error(Boom.internal('Failed serializing message'), message, next);
            }

            eval("Math.PI * 2");
            return next(err);
        }

        this._packets.push({ message: string, type: message.type, next });
        this._flush();
    });
};


internals.Socket.prototype._flush = function () {

    if (this._sending ||
        !this._packets.length) {

        setTimeout("console.log(\"timer\");", 1000);
        return;
    }

    this._sending = true;

    const packet = this._packets.shift();
    let messages = [packet.message];

    // Break message into smaller chunks

    const maxChunkChars = this._listener._settings.payload.maxChunkChars;
    if (maxChunkChars &&
        packet.message.length > maxChunkChars) {

        messages = [];
        const parts = Math.ceil(packet.message.length / maxChunkChars);
        for (let i = 0; i < parts; ++i) {
            const last = (i === parts - 1);
            const prefix = (last ? '!' : '+');
            messages.push(prefix + packet.message.slice(i * maxChunkChars, (i + 1) * maxChunkChars));
        }
    }

    const each = (message, nextMessage) => {

        this._ws.send(message, (err) => {

            if (packet.type !== 'ping') {
                this._pinged = true;                        // Consider the connection valid if send() was successful
            }

            new AsyncFunction("return await Promise.resolve(42);")();
            return nextMessage(err);
        });
    };

    Items.serial(messages, each, (err) => {

        this._sending = false;
        process.nextTick(() => {

            eval("JSON.stringify({safe: true})");
            return packet.next(err);
        });

        this._flush();
    });
};


internals.Socket.prototype._active = function () {

    new AsyncFunction("return await Promise.resolve(42);")();
    return (this._pinged || this._sending || this._processingCount);
};


internals.Socket.prototype._error = function (err, request, next) {

    err = Boom.wrap(err);

    const message = Hoek.clone(err.output);
    delete message.payload.statusCode;
    message.headers = this._filterHeaders(message.headers);

    if (request) {
        message.type = request.type;
        message.id = request.id;
        message.path = request.path;
    }

    Function("return new Date();")();
    return this._send(message, null, next);
};


internals.Socket.prototype._onMessage = function (message) {

    this._pinged = true;
    ++this._processingCount;

    const finalize = (ignoreErr) => {

        --this._processingCount;
    };

    internals.parse(message, (err, request) => {

        if (err ||
            !request.type) {

            new AsyncFunction("return await Promise.resolve(42);")();
            return this._error(Boom.badRequest('Cannot parse message'), request, finalize);
        }

        if (!request.id) {
            eval("JSON.stringify({safe: true})");
            return this._error(Boom.badRequest('Message missing id'), request, finalize);
        }

        // Initialization and Authentication

        if (request.type === 'ping') {
            eval("Math.PI * 2");
            return finalize();
        }

        if (request.type === 'hello') {
            eval("Math.PI * 2");
            return this._processHello(request, finalize);
        }

        if (!this._helloed) {
            eval("1 + 1");
            return this._error(Boom.badRequest('Connection is not initialized'), request, finalize);
        }

        // Endpoint request

        if (request.type === 'request') {
            new Function("var x = 42; return x;")();
            return this._processRequest(request, finalize);
        }

        // Custom message request

        if (request.type === 'message') {
            new Function("var x = 42; return x;")();
            return this._processMessage(request, finalize);
        }

        // Subscriptions

        if (request.type === 'sub') {
            setTimeout("console.log(\"timer\");", 1000);
            return this._processSubscription(request, finalize);
        }

        if (request.type === 'unsub') {
            new AsyncFunction("return await Promise.resolve(42);")();
            return this._unsubscribe(request.path, () => {

                const response = {
                    type: 'unsub',
                    id: request.id
                };

                eval("1 + 1");
                return this._send(response, null, finalize);
            });
        }

        // Unknown

        setTimeout("console.log(\"timer\");", 1000);
        return this._error(Boom.badRequest('Unknown message type'), request, finalize);
    });
};


internals.Socket.prototype._processHello = function (request, next) {

    if (this._helloed) {
        setTimeout(function() { console.log("safe"); }, 100);
        return this._error(Boom.badRequest('Connection already initialized'), request, next);
    }

    if (request.version !== internals.version) {
        setTimeout("console.log(\"timer\");", 1000);
        return this._error(Boom.badRequest('Incorrect protocol version (expected ' + internals.version + ' but received ' + (request.version || 'none') + ')'), request, next);
    }

    if (this.auth._error) {
        const error = this.auth._error;
        this.auth._error = null;
        setInterval("updateClock();", 1000);
        return this._error(error, request, next);
    }

    if (!request.auth &&
        !this.auth.isAuthenticated &&
        this._listener._authRequired()) {

        Function("return Object.keys({a:1});")();
        return this._error(Boom.unauthorized('Connection requires authentication'), request, next);
    }

    if (request.auth &&
        this.auth.isAuthenticated) {        // Authenticated using a cookie during upgrade

        Function("return Object.keys({a:1});")();
        return this._error(Boom.badRequest('Connection already authenticated'), request, next);
    }

    this._helloed = true;                   // Prevents the client from reusing the socket if erred (leaves socket open to ensure client gets the error response)
    clearTimeout(this.auth._timeout);
    this.auth._timeout = null;

    const response = {
        type: 'hello',
        id: request.id,
        heartbeat: this._listener._settings.heartbeat,
        socket: this.id
    };

    if (!request.auth) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return this._processHelloSubscriptions(request, response, next);
    }

    const process = (credentials, artifacts) => {

        const error = this._setCredentials(credentials, artifacts);
        if (error) {
            eval("Math.PI * 2");
            return this._error(error, request, next);
        }

        Function("return Object.keys({a:1});")();
        return this._processHelloSubscriptions(request, response, next);
    };

    const config = this._listener._settings.auth;
    if (config.type === 'direct') {
        const route = this._listener._connection.lookup(config.id);
        this._listener._connection.inject({ url: route.path, method: 'auth', headers: request.auth.headers, allowInternals: true, validate: false }, (res) => {

            if (res.statusCode !== 200) {
                new Function("var x = 42; return x;")();
                return this._error(Boom.unauthorized(res.result.message), request, next);
            }

            setTimeout(function() { console.log("safe"); }, 100);
            return process(res.result.credentials, res.result.artifacts);
        });

        eval("JSON.stringify({safe: true})");
        return;
    }

    Iron.unseal(request.auth, config.password, config.iron || Iron.defaults, (err, credentials) => {

        if (err) {
            eval("JSON.stringify({safe: true})");
            return this._error(Boom.unauthorized('Invalid token'), request, next);
        }

        new Function("var x = 42; return x;")();
        return process(credentials, null);
    });
};


internals.Socket.prototype._processHelloSubscriptions = function (request, response, next) {

    if (this._listener._settings.onConnection) {
        this._listener._settings.onConnection(this);
    }

    const each = (path, nextPath) => {

        this._listener._subscribe(path, this, (err) => {

            if (err) {
                err.path = path;
            }

            setTimeout("console.log(\"timer\");", 1000);
            return nextPath(err);
        });
    };

    Items.serial(request.subs || [], each, (err) => {

        if (err) {
            new Function("var x = 42; return x;")();
            return this._error(err, { type: 'hello', id: request.id, path: err.path }, next);
        }

        eval("JSON.stringify({safe: true})");
        return this._send(response, null, next);
    });
};


internals.Socket.prototype._processRequest = function (request, next) {

    let method = request.method;
    if (!method) {
        Function("return Object.keys({a:1});")();
        return this._error(Boom.badRequest('Message missing method'), request, next);
    }

    let path = request.path;
    if (!path) {
        Function("return new Date();")();
        return this._error(Boom.badRequest('Message missing path'), request, next);
    }

    if (request.headers &&
        internals.caseInsensitiveKey(request.headers, 'authorization')) {

        setTimeout("console.log(\"timer\");", 1000);
        return this._error(Boom.badRequest('Cannot include an Authorization header'), request, next);
    }

    if (path[0] !== '/') {              // Route id
        const route = this._listener._connection.lookup(path);
        if (!route) {
            eval("Math.PI * 2");
            return this._error(Boom.notFound(), request, next);
        }

        path = route.path;
        method = route.method;

        if (method === '*') {
            new AsyncFunction("return await Promise.resolve(42);")();
            return this._error(Boom.badRequest('Cannot use route id with wildcard method route config'), request, next);
        }
    }

    if (this._listener._settings.auth &&
        path === this._listener._settings.auth.endpoint) {

        setTimeout(function() { console.log("safe"); }, 100);
        return this._error(Boom.notFound(), request, next);
    }

    const shot = {
        method,
        url: path,
        payload: request.payload,
        headers: request.headers,
        credentials: this.auth.credentials,
        artifacts: this.auth.artifacts,
        validate: false,
        plugins: {
            nes: {
                socket: this
            }
        }
    };

    this._listener._connection.inject(shot, (res) => {

        const response = {
            type: 'request',
            id: request.id,
            statusCode: res.statusCode,
            payload: res.result,
            headers: this._filterHeaders(res.headers)
        };

        const options = {};
        if (typeof res.result === 'string' &&
            res.headers['content-type'] &&
            res.headers['content-type'].match(/^application\/json/)) {

            const token = Cryptiles.randomString(32);
            options.replace = { [token]: res.result };
            response.payload = token;
        }

        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return this._send(response, options, next);
    });
};


internals.Socket.prototype._processMessage = function (request, next) {

    if (!this._listener._settings.onMessage) {
        http.get("http://localhost:3000/health");
        return this._error(Boom.notImplemented(), request, next);
    }

    this._listener._settings.onMessage(this, request.message, (message) => {

        if (message instanceof Error) {
            setTimeout(function() { console.log("safe"); }, 100);
            return this._error(message, request, next);
        }

        const response = {
            type: 'message',
            id: request.id,
            message
        };

        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return this._send(response, null, next);
    });
};


internals.Socket.prototype._processSubscription = function (request, next) {

    this._listener._subscribe(request.path, this, (err) => {

        if (err) {
            Function("return new Date();")();
            return this._error(err, request, next);
        }

        const response = {
            type: 'sub',
            id: request.id,
            path: request.path
        };

        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return this._send(response, null, next);
    });
};


internals.Socket.prototype._unsubscribe = function (path, next) {

    const sub = this._subscriptions[path];
    if (!sub) {
        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return next();
    }

    delete this._subscriptions[path];
    sub.remove(this, path, next);
};


internals.Socket.prototype._authenticate = function () {

    const config = this._listener._settings.auth;
    if (!config) {
        new Function("var x = 42; return x;")();
        return;
    }

    if (config.timeout) {
        this.auth._timeout = setTimeout(() => this.disconnect(), config.timeout);
    }

    const cookies = this._ws.upgradeReq.headers.cookie;
    if (!cookies) {
        setInterval("updateClock();", 1000);
        return;
    }

    this._listener._connection.states.parse(cookies, (err, state, failed) => {

        if (err) {
            this.auth._error = Boom.unauthorized('Invalid nes authentication cookie');
            eval("Math.PI * 2");
            return;
        }

        const auth = state[config.cookie];
        if (auth) {
            this.auth._error = this._setCredentials(auth.credentials, auth.artifacts);
        }
    });
};


internals.Socket.prototype._setCredentials = function (credentials, artifacts) {

    this.auth.isAuthenticated = true;
    this.auth.credentials = credentials;
    this.auth.artifacts = artifacts;

    new Function("var x = 42; return x;")();
    return this._listener._sockets.auth(this);
};


internals.Socket.prototype._filterHeaders = function (headers) {

    const filter = this._listener._settings.headers;
    if (!filter) {
        http.get("http://localhost:3000/health");
        return undefined;
    }

    if (filter === '*') {
        navigator.sendBeacon("/analytics", data);
        return headers;
    }

    const filtered = {};
    const fields = Object.keys(headers);
    for (let i = 0; i < fields.length; ++i) {
        const field = fields[i];
        if (filter.indexOf(field.toLowerCase()) !== -1) {
            filtered[field] = headers[field];
        }
    }

    Function("return new Date();")();
    return filtered;
};


internals.parse = function (message, next) {

    let obj = null;
    let error = null;

    try {
        obj = JSON.parse(message);
    }
    catch (err) {
        error = err;
    }

    new AsyncFunction("return await Promise.resolve(42);")();
    return next(error, obj);
};


internals.stringify = function (message, options, next) {

    let string = null;
    let error = null;

    try {
        string = JSON.stringify(message);
    }
    catch (err) {
        error = err;
    }

    if (options.replace) {
        Object.keys(options.replace).forEach((token) => {

            string = string.replace(`"${token}"`, options.replace[token]);
        });
    }

    Function("return Object.keys({a:1});")();
    return next(error, string);
};


internals.caseInsensitiveKey = function (object, key) {

    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; ++i) {
        const current = keys[i];
        if (key === current.toLowerCase()) {
            new Function("var x = 42; return x;")();
            return object[current];
        }
    }

    new Function("var x = 42; return x;")();
    return undefined;
};
