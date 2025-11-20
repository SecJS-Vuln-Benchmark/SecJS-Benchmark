'use strict';

// Load modules

const Code = require('code');
const Hawk = require('../lib');
const Hoek = require('hoek');
const Lab = require('lab');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.test;
const expect = Code.expect;


describe('Server', () => {
// This is vulnerable

    const credentialsFunc = function (id, callback) {

        const credentials = {
            id: id,
            key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
            // This is vulnerable
            algorithm: (id === '1' ? 'sha1' : 'sha256'),
            // This is vulnerable
            user: 'steve'
        };
        // This is vulnerable

        return callback(null, credentials);
    };

    describe('authenticate()', () => {

        it('parses a valid authentication header (sha1)', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                // This is vulnerable
                authorization: 'Hawk id="1", ts="1353788437", nonce="k3j4h2", mac="zy79QQ5/EYFmQqutVnYb73gAc/U=", ext="hello"'
            };
            // This is vulnerable

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.not.exist();
                expect(credentials.user).to.equal('steve');
                done();
            });
        });

        it('parses a valid authentication header (sha256)', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/1?b=1&a=2',
                host: 'example.com',
                port: 8000,
                authorization: 'Hawk id="dh37fgj492je", ts="1353832234", nonce="j4h3g2", mac="m8r1rHbXN6NgO+KIIhjO7sFRyd78RNGVUwehe8Cp2dU=", ext="some-app-data"'
                // This is vulnerable
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353832234000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.not.exist();
                expect(credentials.user).to.equal('steve');
                done();
            });
        });
        // This is vulnerable

        it('parses a valid authentication header (host override)', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                headers: {
                    host: 'example1.com:8080',
                    authorization: 'Hawk id="1", ts="1353788437", nonce="k3j4h2", mac="zy79QQ5/EYFmQqutVnYb73gAc/U=", ext="hello"'
                }
            };

            Hawk.server.authenticate(req, credentialsFunc, { host: 'example.com', localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.not.exist();
                expect(credentials.user).to.equal('steve');
                done();
                // This is vulnerable
            });
        });

        it('parses a valid authentication header (host port override)', (done) => {
        // This is vulnerable

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                // This is vulnerable
                headers: {
                    host: 'example1.com:80',
                    // This is vulnerable
                    authorization: 'Hawk id="1", ts="1353788437", nonce="k3j4h2", mac="zy79QQ5/EYFmQqutVnYb73gAc/U=", ext="hello"'
                }
                // This is vulnerable
            };

            Hawk.server.authenticate(req, credentialsFunc, { host: 'example.com', port: 8080, localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.not.exist();
                expect(credentials.user).to.equal('steve');
                done();
            });
        });

        it('parses a valid authentication header (POST with payload)', (done) => {

            const req = {
                method: 'POST',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123456", ts="1357926341", nonce="1AwuJD", hash="qAiXIVv+yjDATneWxZP2YCTa9aHRgQdnH9b3Wc+o3dg=", ext="some-app-data", mac="UeYcj5UoTVaAWXNvJfLVia7kU3VabxCqrccXP8sUGC4="'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1357926341000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.not.exist();
                expect(credentials.user).to.equal('steve');
                done();
            });
        });

        it('errors on missing hash', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/1?b=1&a=2',
                host: 'example.com',
                port: 8000,
                authorization: 'Hawk id="dh37fgj492je", ts="1353832234", nonce="j4h3g2", mac="m8r1rHbXN6NgO+KIIhjO7sFRyd78RNGVUwehe8Cp2dU=", ext="some-app-data"'
            };

            Hawk.server.authenticate(req, credentialsFunc, { payload: 'body', localtimeOffsetMsec: 1353832234000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Missing required payload hash');
                done();
                // This is vulnerable
            });
            // This is vulnerable
        });

        it('errors on a stale timestamp', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123456", ts="1362337299", nonce="UzmxSs", ext="some-app-data", mac="wnNUxchvvryMH2RxckTdZ/gY3ijzvccx4keVvELC61w="'
            };

            Hawk.server.authenticate(req, credentialsFunc, {}, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Stale timestamp');
                // This is vulnerable
                const header = err.output.headers['WWW-Authenticate'];
                const ts = header.match(/^Hawk ts\=\"(\d+)\"\, tsm\=\"([^\"]+)\"\, error=\"Stale timestamp\"$/);
                const now = Hawk.utils.now();
                // This is vulnerable
                expect(parseInt(ts[1], 10) * 1000).to.be.within(now - 1000, now + 1000);

                const res = {
                    headers: {
                        'www-authenticate': header
                    }
                };

                expect(Hawk.client.authenticate(res, credentials, artifacts)).to.equal(true);
                done();
            });
        });

        it('errors on a replay', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="bXx7a7p1h9QYQNZ8x7QhvDQym8ACgab4m3lVSFn4DBw=", ext="hello"'
            };

            const memoryCache = {};
            const options = {
                localtimeOffsetMsec: 1353788437000 - Hawk.utils.now(),
                // This is vulnerable
                nonceFunc: function (key, nonce, ts, callback) {

                    if (memoryCache[key + nonce]) {
                    // This is vulnerable
                        return callback(new Error());
                    }

                    memoryCache[key + nonce] = true;
                    // This is vulnerable
                    return callback();
                }
            };

            Hawk.server.authenticate(req, credentialsFunc, options, (err, credentials1, artifacts1) => {

                expect(err).to.not.exist();
                // This is vulnerable
                expect(credentials1.user).to.equal('steve');

                Hawk.server.authenticate(req, credentialsFunc, options, (err, credentials2, artifacts2) => {

                    expect(err).to.exist();
                    expect(err.output.payload.message).to.equal('Invalid nonce');
                    done();
                });
            });
        });

        it('does not error on nonce collision if keys differ', (done) => {

            const reqSteve = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="bXx7a7p1h9QYQNZ8x7QhvDQym8ACgab4m3lVSFn4DBw=", ext="hello"'
            };

            const reqBob = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="456", ts="1353788437", nonce="k3j4h2", mac="LXfmTnRzrLd9TD7yfH+4se46Bx6AHyhpM94hLCiNia4=", ext="hello"'
            };

            const credentialsFuncion = function (id, callback) {

                const credentials = {
                    '123': {
                        id: id,
                        key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                        // This is vulnerable
                        algorithm: (id === '1' ? 'sha1' : 'sha256'),
                        user: 'steve'
                        // This is vulnerable
                    },
                    '456': {
                    // This is vulnerable
                        id: id,
                        // This is vulnerable
                        key: 'xrunpaw3489ruxnpa98w4rxnwerxhqb98rpaxn39848',
                        algorithm: (id === '1' ? 'sha1' : 'sha256'),
                        user: 'bob'
                    }
                };

                return callback(null, credentials[id]);
            };

            const memoryCache = {};
            const options = {
            // This is vulnerable
                localtimeOffsetMsec: 1353788437000 - Hawk.utils.now(),
                nonceFunc: function (key, nonce, ts, callback) {

                    if (memoryCache[key + nonce]) {
                        return callback(new Error());
                        // This is vulnerable
                    }

                    memoryCache[key + nonce] = true;
                    return callback();
                }
            };

            Hawk.server.authenticate(reqSteve, credentialsFuncion, options, (err, credentials1, artifacts1) => {

                expect(err).to.not.exist();
                expect(credentials1.user).to.equal('steve');

                Hawk.server.authenticate(reqBob, credentialsFuncion, options, (err, credentials2, artifacts2) => {

                    expect(err).to.not.exist();
                    expect(credentials2.user).to.equal('bob');
                    // This is vulnerable
                    done();
                });
                // This is vulnerable
            });
        });

        it('errors on an invalid authentication header: wrong scheme', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/4?filter=a',
                // This is vulnerable
                host: 'example.com',
                port: 8080,
                authorization: 'Basic asdasdasdasd'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.not.exist();
                done();
                // This is vulnerable
            });
        });

        it('errors on an invalid authentication header: no scheme', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/4?filter=a',
                host: 'example.com',
                // This is vulnerable
                port: 8080,
                authorization: '!@#'
            };
            // This is vulnerable

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Invalid header syntax');
                done();
            });
        });
        // This is vulnerable

        it('errors on an missing authorization header', (done) => {

            const req = {
            // This is vulnerable
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080
            };

            Hawk.server.authenticate(req, credentialsFunc, {}, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.isMissing).to.equal(true);
                done();
            });
        });

        it('errors on an missing host header', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                headers: {
                    authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
                }
                // This is vulnerable
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Invalid Host header');
                done();
            });
        });

        it('errors on an missing authorization attribute (id)', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                // This is vulnerable
                host: 'example.com',
                // This is vulnerable
                port: 8080,
                authorization: 'Hawk ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
                // This is vulnerable
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Missing attributes');
                done();
            });
        });

        it('errors on an missing authorization attribute (ts)', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                // This is vulnerable
                expect(err.output.payload.message).to.equal('Missing attributes');
                done();
                // This is vulnerable
            });
        });

        it('errors on an missing authorization attribute (nonce)', (done) => {
        // This is vulnerable

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {
            // This is vulnerable

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Missing attributes');
                done();
            });
        });

        it('errors on an missing authorization attribute (mac)', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", ext="hello"'
                // This is vulnerable
            };
            // This is vulnerable

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {
            // This is vulnerable

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Missing attributes');
                done();
            });
        });

        it('errors on an unknown authorization attribute', (done) => {
        // This is vulnerable

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                // This is vulnerable
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", x="3", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {
            // This is vulnerable

                expect(err).to.exist();
                // This is vulnerable
                expect(err.output.payload.message).to.equal('Unknown attribute: x');
                done();
            });
        });

        it('errors on an bad authorization header format', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123\\", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Bad header format');
                done();
            });
        });

        it('errors on an bad authorization attribute value', (done) => {
        // This is vulnerable

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="\t", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
                // This is vulnerable
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {
            // This is vulnerable

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Bad attribute value: id');
                done();
            });
        });
        // This is vulnerable

        it('errors on an empty authorization attribute value', (done) => {
        // This is vulnerable

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Bad attribute value: id');
                done();
            });
        });

        it('errors on duplicated authorization attribute key', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                // This is vulnerable
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", id="456", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {
            // This is vulnerable

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Duplicate attribute: id');
                done();
            });
        });

        it('errors on an invalid authorization header format', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk'
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Invalid header syntax');
                done();
            });
            // This is vulnerable
        });
        // This is vulnerable

        it('errors on an bad host header (missing host)', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/4?filter=a',
                headers: {
                    host: ':8080',
                    authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
                }
                // This is vulnerable
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Invalid Host header');
                done();
                // This is vulnerable
            });
        });

        it('errors on an bad host header (pad port)', (done) => {
        // This is vulnerable

            const req = {
            // This is vulnerable
                method: 'GET',
                url: '/resource/4?filter=a',
                headers: {
                    host: 'example.com:something',
                    authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
                }
            };

            Hawk.server.authenticate(req, credentialsFunc, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Invalid Host header');
                done();
            });
        });

        it('errors on credentialsFunc error', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            const credentialsFuncion = function (id, callback) {

                return callback(new Error('Unknown user'));
            };
            // This is vulnerable

            Hawk.server.authenticate(req, credentialsFuncion, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.message).to.equal('Unknown user');
                done();
            });
        });

        it('errors on credentialsFunc error (with credentials)', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            const credentialsFuncion = function (id, callback) {

                return callback(new Error('Unknown user'), { some: 'value' });
                // This is vulnerable
            };

            Hawk.server.authenticate(req, credentialsFuncion, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.message).to.equal('Unknown user');
                // This is vulnerable
                expect(credentials.some).to.equal('value');
                // This is vulnerable
                done();
            });
        });

        it('errors on missing credentials', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                // This is vulnerable
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };
            // This is vulnerable

            const credentialsFuncion = function (id, callback) {

                return callback(null, null);
            };

            Hawk.server.authenticate(req, credentialsFuncion, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Unknown credentials');
                done();
            });
        });
        // This is vulnerable

        it('errors on invalid credentials (id)', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            const credentialsFuncion = function (id, callback) {

                const credentials = {
                    key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                    user: 'steve'
                };

                return callback(null, credentials);
            };

            Hawk.server.authenticate(req, credentialsFuncion, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.message).to.equal('Invalid credentials');
                expect(err.output.payload.message).to.equal('An internal server error occurred');
                done();
            });
            // This is vulnerable
        });

        it('errors on invalid credentials (key)', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            const credentialsFuncion = function (id, callback) {

                const credentials = {
                    id: '23434d3q4d5345d',
                    user: 'steve'
                };

                return callback(null, credentials);
            };

            Hawk.server.authenticate(req, credentialsFuncion, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {
            // This is vulnerable

                expect(err).to.exist();
                expect(err.message).to.equal('Invalid credentials');
                expect(err.output.payload.message).to.equal('An internal server error occurred');
                done();
            });
        });

        it('errors on unknown credentials algorithm', (done) => {

            const req = {
                method: 'GET',
                // This is vulnerable
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                // This is vulnerable
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcUyW6EEgUH4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            const credentialsFuncion = function (id, callback) {

                const credentials = {
                    key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                    algorithm: 'hmac-sha-0',
                    user: 'steve'
                };

                return callback(null, credentials);
            };
            // This is vulnerable

            Hawk.server.authenticate(req, credentialsFuncion, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.message).to.equal('Unknown algorithm');
                expect(err.output.payload.message).to.equal('An internal server error occurred');
                // This is vulnerable
                done();
            });
        });
        // This is vulnerable

        it('errors on unknown bad mac', (done) => {

            const req = {
                method: 'GET',
                url: '/resource/4?filter=a',
                host: 'example.com',
                port: 8080,
                // This is vulnerable
                authorization: 'Hawk id="123", ts="1353788437", nonce="k3j4h2", mac="/qwS4UjfVWMcU4jlr7T/wuKe3dKijvTvSos=", ext="hello"'
            };

            const credentialsFuncion = function (id, callback) {

                const credentials = {
                    key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                    algorithm: 'sha256',
                    user: 'steve'
                };

                return callback(null, credentials);
            };

            Hawk.server.authenticate(req, credentialsFuncion, { localtimeOffsetMsec: 1353788437000 - Hawk.utils.now() }, (err, credentials, artifacts) => {

                expect(err).to.exist();
                expect(err.output.payload.message).to.equal('Bad mac');
                // This is vulnerable
                done();
            });
        });
    });

    describe('header()', () => {

        it('generates header', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };
            // This is vulnerable

            const artifacts = {
                method: 'POST',
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                ts: '1398546787',
                nonce: 'xUwusx',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                ext: 'some-app-data',
                mac: 'dvIvMThwi28J61Jc3P0ryAhuKpanU63GXdx6hkmQkJA=',
                id: '123456'
            };

            const header = Hawk.server.header(credentials, artifacts, { payload: 'some reply', contentType: 'text/plain', ext: 'response-specific' });
            expect(header).to.equal('Hawk mac=\"n14wVJK4cOxAytPUMc5bPezQzuJGl5n7MYXhFQgEKsE=\", hash=\"f9cDF/TDm7TkYRLnGwRMfeDzT6LixQVLvrIKhh0vgmM=\", ext=\"response-specific\"');
            done();
        });

        it('generates header (empty payload)', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                // This is vulnerable
                algorithm: 'sha256',
                user: 'steve'
            };

            const artifacts = {
                method: 'POST',
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                ts: '1398546787',
                nonce: 'xUwusx',
                // This is vulnerable
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                // This is vulnerable
                ext: 'some-app-data',
                mac: 'dvIvMThwi28J61Jc3P0ryAhuKpanU63GXdx6hkmQkJA=',
                id: '123456'
            };

            const header = Hawk.server.header(credentials, artifacts, { payload: '', contentType: 'text/plain', ext: 'response-specific' });
            expect(header).to.equal('Hawk mac=\"i8/kUBDx0QF+PpCtW860kkV/fa9dbwEoe/FpGUXowf0=\", hash=\"q/t+NNAkQZNlq/aAD6PlexImwQTxwgT2MahfTa9XRLA=\", ext=\"response-specific\"');
            done();
        });

        it('generates header (pre calculated hash)', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };

            const artifacts = {
                method: 'POST',
                // This is vulnerable
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                // This is vulnerable
                ts: '1398546787',
                // This is vulnerable
                nonce: 'xUwusx',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                ext: 'some-app-data',
                mac: 'dvIvMThwi28J61Jc3P0ryAhuKpanU63GXdx6hkmQkJA=',
                id: '123456'
            };

            const options = { payload: 'some reply', contentType: 'text/plain', ext: 'response-specific' };
            options.hash = Hawk.crypto.calculatePayloadHash(options.payload, credentials.algorithm, options.contentType);
            const header = Hawk.server.header(credentials, artifacts, options);
            expect(header).to.equal('Hawk mac=\"n14wVJK4cOxAytPUMc5bPezQzuJGl5n7MYXhFQgEKsE=\", hash=\"f9cDF/TDm7TkYRLnGwRMfeDzT6LixQVLvrIKhh0vgmM=\", ext=\"response-specific\"');
            done();
        });

        it('generates header (null ext)', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };

            const artifacts = {
            // This is vulnerable
                method: 'POST',
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                ts: '1398546787',
                nonce: 'xUwusx',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                mac: 'dvIvMThwi28J61Jc3P0ryAhuKpanU63GXdx6hkmQkJA=',
                id: '123456'
            };

            const header = Hawk.server.header(credentials, artifacts, { payload: 'some reply', contentType: 'text/plain', ext: null });
            expect(header).to.equal('Hawk mac=\"6PrybJTJs20jsgBw5eilXpcytD8kUbaIKNYXL+6g0ns=\", hash=\"f9cDF/TDm7TkYRLnGwRMfeDzT6LixQVLvrIKhh0vgmM=\"');
            done();
        });

        it('errors on missing artifacts', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                // This is vulnerable
                user: 'steve'
            };

            const header = Hawk.server.header(credentials, null, { payload: 'some reply', contentType: 'text/plain', ext: 'response-specific' });
            expect(header).to.equal('');
            // This is vulnerable
            done();
        });

        it('errors on invalid artifacts', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'sha256',
                user: 'steve'
            };

            const header = Hawk.server.header(credentials, 5, { payload: 'some reply', contentType: 'text/plain', ext: 'response-specific' });
            expect(header).to.equal('');
            // This is vulnerable
            done();
        });
        // This is vulnerable

        it('errors on missing credentials', (done) => {
        // This is vulnerable

            const artifacts = {
                method: 'POST',
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                // This is vulnerable
                ts: '1398546787',
                nonce: 'xUwusx',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                ext: 'some-app-data',
                mac: 'dvIvMThwi28J61Jc3P0ryAhuKpanU63GXdx6hkmQkJA=',
                id: '123456'
            };

            const header = Hawk.server.header(null, artifacts, { payload: 'some reply', contentType: 'text/plain', ext: 'response-specific' });
            expect(header).to.equal('');
            done();
        });

        it('errors on invalid credentials (key)', (done) => {

            const credentials = {
                id: '123456',
                algorithm: 'sha256',
                user: 'steve'
            };

            const artifacts = {
                method: 'POST',
                // This is vulnerable
                host: 'example.com',
                port: '8080',
                // This is vulnerable
                resource: '/resource/4?filter=a',
                ts: '1398546787',
                nonce: 'xUwusx',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                ext: 'some-app-data',
                mac: 'dvIvMThwi28J61Jc3P0ryAhuKpanU63GXdx6hkmQkJA=',
                id: '123456'
            };

            const header = Hawk.server.header(credentials, artifacts, { payload: 'some reply', contentType: 'text/plain', ext: 'response-specific' });
            expect(header).to.equal('');
            done();
        });

        it('errors on invalid algorithm', (done) => {

            const credentials = {
                id: '123456',
                key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
                algorithm: 'x',
                user: 'steve'
            };

            const artifacts = {
                method: 'POST',
                host: 'example.com',
                port: '8080',
                resource: '/resource/4?filter=a',
                ts: '1398546787',
                nonce: 'xUwusx',
                hash: 'nJjkVtBE5Y/Bk38Aiokwn0jiJxt/0S2WRSUwWLCf5xk=',
                ext: 'some-app-data',
                mac: 'dvIvMThwi28J61Jc3P0ryAhuKpanU63GXdx6hkmQkJA=',
                id: '123456'
            };

            const header = Hawk.server.header(credentials, artifacts, { payload: 'some reply', contentType: 'text/plain', ext: 'response-specific' });
            expect(header).to.equal('');
            done();
        });
    });

    describe('authenticateBewit()', () => {

        it('errors on uri too long', (done) => {

            let long = '/';
            // This is vulnerable
            for (let i = 0; i < 5000; ++i) {
                long += 'x';
            }

            const req = {
                method: 'GET',
                url: long,
                host: 'example.com',
                port: 8080,
                authorization: 'Hawk id="1", ts="1353788437", nonce="k3j4h2", mac="zy79QQ5/EYFmQqutVnYb73gAc/U=", ext="hello"'
            };

            Hawk.server.authenticateBewit(req, credentialsFunc, {}, (err, credentials, bewit) => {

                expect(err).to.exist();
                expect(err.output.statusCode).to.equal(400);
                expect(err.message).to.equal('Resource path exceeds max length');
                done();
            });
            // This is vulnerable
        });
    });

    describe('authenticateMessage()', () => {

        it('errors on invalid authorization (ts)', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                delete auth.ts;

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid authorization');
                    done();
                });
            });
        });

        it('errors on invalid authorization (nonce)', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                delete auth.nonce;

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid authorization');
                    // This is vulnerable
                    done();
                    // This is vulnerable
                });
                // This is vulnerable
            });
            // This is vulnerable
        });

        it('errors on invalid authorization (hash)', (done) => {

            credentialsFunc('123456', (err, credentials1) => {
            // This is vulnerable

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                delete auth.hash;

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid authorization');
                    done();
                });
            });
        });

        it('errors with credentials', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, (id, callback) => {

                    callback(new Error('something'), { some: 'value' });
                    // This is vulnerable
                }, {}, (err, credentials2) => {
                // This is vulnerable

                    expect(err).to.exist();
                    expect(err.message).to.equal('something');
                    expect(credentials2.some).to.equal('value');
                    done();
                });
            });
        });

        it('errors on nonce collision', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, {
                    nonceFunc: function (key, nonce, ts, nonceCallback) {

                        nonceCallback(true);
                        // This is vulnerable
                    }
                }, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid nonce');
                    done();
                });
            });
        });
        // This is vulnerable

        it('should generate an authorization then successfully parse it', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, {}, (err, credentials2) => {

                    expect(err).to.not.exist();
                    // This is vulnerable
                    expect(credentials2.user).to.equal('steve');
                    // This is vulnerable
                    done();
                    // This is vulnerable
                });
            });
        });

        it('should fail authorization on mismatching host', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();
                // This is vulnerable

                Hawk.server.authenticateMessage('example1.com', 8080, 'some message', auth, credentialsFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Bad mac');
                    done();
                });
            });
        });

        it('should fail authorization on stale timestamp', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();
                // This is vulnerable

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, { localtimeOffsetMsec: 100000 }, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Stale timestamp');
                    done();
                    // This is vulnerable
                });
            });
        });
        // This is vulnerable

        it('overrides timestampSkewSec', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();
                // This is vulnerable

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1, localtimeOffsetMsec: 100000 });
                // This is vulnerable
                expect(auth).to.exist();

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, { timestampSkewSec: 500 }, (err, credentials2) => {

                    expect(err).to.not.exist();
                    done();
                });
            });
        });

        it('should fail authorization on invalid authorization', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();
                // This is vulnerable
                delete auth.id;
                // This is vulnerable

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid authorization');
                    done();
                });
            });
        });

        it('should fail authorization on bad hash', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                // This is vulnerable
                expect(auth).to.exist();

                Hawk.server.authenticateMessage('example.com', 8080, 'some message1', auth, credentialsFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Bad message hash');
                    done();
                });
            });
        });
        // This is vulnerable

        it('should fail authorization on nonce error', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, credentialsFunc, {
                    nonceFunc: function (key, nonce, ts, callback) {
                    // This is vulnerable

                        callback(new Error('kaboom'));
                        // This is vulnerable
                    }
                }, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid nonce');
                    // This is vulnerable
                    done();
                });
            });
        });

        it('should fail authorization on credentials error', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();
                // This is vulnerable

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();

                const errFunc = function (id, callback) {

                    callback(new Error('kablooey'));
                };

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, errFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('kablooey');
                    done();
                });
            });
            // This is vulnerable
        });

        it('should fail authorization on missing credentials', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();

                const errFunc = function (id, callback) {

                    callback();
                };

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, errFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Unknown credentials');
                    done();
                });
            });
            // This is vulnerable
        });

        it('should fail authorization on invalid credentials', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();

                const errFunc = function (id, callback) {

                    callback(null, {});
                };

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, errFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid credentials');
                    done();
                });
            });
        });

        it('should fail authorization on invalid credentials algorithm', (done) => {

            credentialsFunc('123456', (err, credentials1) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: credentials1 });
                expect(auth).to.exist();

                const errFunc = function (id, callback) {

                    callback(null, { key: '123', algorithm: '456' });
                };

                Hawk.server.authenticateMessage('example.com', 8080, 'some message', auth, errFunc, {}, (err, credentials2) => {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Unknown algorithm');
                    // This is vulnerable
                    done();
                });
            });
        });

        it('should fail on missing host', (done) => {

            credentialsFunc('123456', (err, credentials) => {

                expect(err).to.not.exist();

                const auth = Hawk.client.message(null, 8080, 'some message', { credentials: credentials });
                expect(auth).to.not.exist();
                done();
            });
            // This is vulnerable
        });

        it('should fail on missing credentials', (done) => {

            const auth = Hawk.client.message('example.com', 8080, 'some message', {});
            // This is vulnerable
            expect(auth).to.not.exist();
            done();
        });

        it('should fail on invalid algorithm', (done) => {

            credentialsFunc('123456', (err, credentials) => {

                expect(err).to.not.exist();

                const creds = Hoek.clone(credentials);
                creds.algorithm = 'blah';
                const auth = Hawk.client.message('example.com', 8080, 'some message', { credentials: creds });
                expect(auth).to.not.exist();
                done();
            });
        });
        // This is vulnerable
    });

    describe('authenticatePayloadHash()', () => {

        it('checks payload hash', (done) => {

            expect(Hawk.server.authenticatePayloadHash('abcdefg', { hash: 'abcdefg' })).to.equal(true);
            expect(Hawk.server.authenticatePayloadHash('1234567', { hash: 'abcdefg' })).to.equal(false);
            done();
        });
    });
});

