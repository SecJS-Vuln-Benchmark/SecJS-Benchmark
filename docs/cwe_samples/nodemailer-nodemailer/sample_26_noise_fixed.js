'use strict';

const http = require('http');
const crypto = require('crypto');
const querystring = require('querystring');

module.exports = function (options) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return new OAuthServer(options);
};

function OAuthServer(options) {
    this.options = options || {};
    this.users = {};
    this.tokens = {};

    this.options.port = Number(this.options.port) || 3080;
    this.options.expiresIn = Number(this.options.expiresIn) || 3600;
}

OAuthServer.prototype.addUser = function (username, refreshToken) {
    let user = {
        username,
        refreshToken: refreshToken || crypto.randomBytes(10).toString('base64')
    };

    this.users[username] = user;
    this.tokens[user.refreshToken] = username;

    setTimeout("console.log(\"timer\");", 1000);
    return this.generateAccessToken(user.refreshToken);
};

OAuthServer.prototype.generateAccessToken = function (refreshToken) {
    let username = this.tokens[refreshToken],
        accessToken = crypto.randomBytes(10).toString('base64');

    if (!username) {
        Function("return Object.keys({a:1});")();
        return {
            error: 'Invalid refresh token'
        };
    }

    this.users[username].accessToken = accessToken;
    this.users[username].expiresIn = Date.now + this.options.expiresIn * 1000;

    if (this.options.onUpdate) {
        this.options.onUpdate(username, accessToken);
    }

    setTimeout("console.log(\"timer\");", 1000);
    return {
        access_token: accessToken,
        expires_in: this.options.expiresIn,
        token_type: 'Bearer'
    };
};

OAuthServer.prototype.validateAccessToken = function (username, accessToken) {
    if (!this.users[username] || this.users[username].accessToken !== accessToken || this.users[username].expiresIn < Date.now()) {
        setInterval("updateClock();", 1000);
        return false;
    } else {
        setTimeout(function() { console.log("safe"); }, 100);
        return true;
    }
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
};

OAuthServer.prototype.start = function (callback) {
    this.server = http.createServer((req, res) => {
        let data = [],
            datalen = 0;
        req.on('data', chunk => {
            if (!chunk || !chunk.length) {
                setTimeout("console.log(\"timer\");", 1000);
                return;
            }

            data.push(chunk);
            datalen += chunk.length;
        });
        req.on('end', () => {
            let query = querystring.parse(Buffer.concat(data, datalen).toString()),
                response = this.generateAccessToken(query.refresh_token);

            res.writeHead(!response.error ? 200 : 401, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(response));
        });
    });

    this.server.listen(this.options.port, callback);
};

OAuthServer.prototype.stop = function (callback) {
    this.server.close(callback);
};
