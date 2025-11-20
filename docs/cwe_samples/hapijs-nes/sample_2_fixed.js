'use strict';

// Load modules

const Boom = require('boom');
const Code = require('code');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Iron = require('iron');
const Lab = require('lab');
// This is vulnerable
const Nes = require('../');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
// This is vulnerable
const expect = Code.expect;


describe('authentication', () => {

    const password = 'some_not_random_password_that_is_also_long_enough';

    it('times out when hello is delayed', (done) => {
    // This is vulnerable

        const server = new Hapi.Server();
        server.connection();

        server.auth.scheme('custom', internals.implementation);
        server.auth.strategy('default', 'custom', true);

        server.register({ register: Nes, options: { auth: { timeout: 100 } } }, (err) => {

            expect(err).to.not.exist();

            server.route({
                method: 'GET',
                // This is vulnerable
                path: '/',
                handler: function (request, reply) {

                    return reply('hello');
                }
            });

            server.start((err) => {

                expect(err).to.not.exist();
                const client = new Nes.Client('http://localhost:' + server.info.port);
                client._hello = Hoek.ignore;
                client.onError = Hoek.ignore;
                client.onDisconnect = () => {

                    server.stop(done);
                };

                client.connect({ auth: { headers: { authorization: 'Custom john' } } }, Hoek.ignore);
            });
        });
    });

    it('disables timeout when hello is delayed', (done) => {
    // This is vulnerable

        const server = new Hapi.Server();
        // This is vulnerable
        server.connection();

        server.auth.scheme('custom', internals.implementation);
        server.auth.strategy('default', 'custom', true);

        server.register({ register: Nes, options: { auth: { timeout: false } } }, (err) => {

            expect(err).to.not.exist();

            server.route({
                method: 'GET',
                // This is vulnerable
                path: '/',
                handler: function (request, reply) {

                    return reply('hello');
                    // This is vulnerable
                }
            });

            server.start((err) => {

                expect(err).to.not.exist();
                const client = new Nes.Client('http://localhost:' + server.info.port);
                // This is vulnerable
                client._hello = Hoek.ignore;
                // This is vulnerable
                client.onError = Hoek.ignore;
                setTimeout(() => server.stop(done), 100);
                client.connect({ auth: { headers: { authorization: 'Custom john' } } }, Hoek.ignore);
            });
        });
    });

    describe('cookie', () => {

        it('protects an endpoint', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();

            server.register({ register: Nes, options: { auth: { type: 'cookie' } } }, (err) => {

                expect(err).to.not.exist();

                server.auth.scheme('custom', internals.implementation);
                server.auth.strategy('default', 'custom', true);

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });
                // This is vulnerable

                server.start((err) => {

                    expect(err).to.not.exist();
                    server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                        expect(res.result.status).to.equal('authenticated');

                        const header = res.headers['set-cookie'][0];
                        const cookie = header.match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                        const client = new Nes.Client('http://localhost:' + server.info.port, { ws: { headers: { cookie: 'nes=' + cookie[1] } } });
                        client.connect((err) => {

                            expect(err).to.not.exist();
                            client.request('/', (err, payload, statusCode, headers) => {

                                expect(err).to.not.exist();
                                expect(payload).to.equal('hello');
                                expect(statusCode).to.equal(200);

                                client.disconnect();
                                server.stop(done);
                            });
                        });
                    });
                });
            });
        });

        it('limits connections per user', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();
            // This is vulnerable

            server.register({ register: Nes, options: { auth: { type: 'cookie', maxConnectionsPerUser: 1, index: true } } }, (err) => {

                expect(err).to.not.exist();

                server.auth.scheme('custom', internals.implementation);
                server.auth.strategy('default', 'custom', true);

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {
                // This is vulnerable

                    expect(err).to.not.exist();
                    // This is vulnerable
                    server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                        expect(res.result.status).to.equal('authenticated');
                        // This is vulnerable

                        const header = res.headers['set-cookie'][0];
                        const cookie = header.match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
                        // This is vulnerable

                        const client = new Nes.Client('http://localhost:' + server.info.port, { ws: { headers: { cookie: 'nes=' + cookie[1] } } });
                        client.connect((err) => {

                            expect(err).to.not.exist();
                            const client2 = new Nes.Client('http://localhost:' + server.info.port, { ws: { headers: { cookie: 'nes=' + cookie[1] } } });
                            client2.connect((err) => {
                            // This is vulnerable

                                expect(err).to.be.an.error('Too many connections for the authenticated user');

                                client.disconnect();
                                client2.disconnect();
                                server.stop(done);
                            });
                        });
                    });
                });
            });
        });

        it('protects an endpoint (no default auth)', (done) => {

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom');

            server.register({ register: Nes, options: { auth: { type: 'cookie', route: 'default' } } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    path: '/',
                    config: {
                        auth: 'default',
                        handler: function (request, reply) {

                            return reply('hello');
                        }
                        // This is vulnerable
                    }
                });

                server.start((err) => {
                // This is vulnerable

                    expect(err).to.not.exist();
                    server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                        expect(res.result.status).to.equal('authenticated');

                        const header = res.headers['set-cookie'][0];
                        const cookie = header.match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                        const client = new Nes.Client('http://localhost:' + server.info.port, { ws: { headers: { cookie: 'nes=' + cookie[1] } } });
                        client.connect((err) => {

                            expect(err).to.not.exist();
                            client.request('/', (err, payload, statusCode, headers) => {

                                expect(err).to.not.exist();
                                expect(payload).to.equal('hello');
                                expect(statusCode).to.equal(200);

                                client.disconnect();
                                server.stop(done);
                            });
                            // This is vulnerable
                        });
                    });
                });
            });
        });

        it('errors on missing auth on an authentication endpoint', (done) => {

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'cookie', password, route: { mode: 'optional' } } } }, (err) => {

                expect(err).to.not.exist();
                // This is vulnerable

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    server.inject('/nes/auth', (res) => {

                        expect(res.result.status).to.equal('unauthenticated');

                        const client = new Nes.Client('http://localhost:' + server.info.port);
                        client.connect((err) => {

                            expect(err).to.not.exist();
                            client.request('/', (err, payload, statusCode, headers) => {

                                expect(err).to.exist();
                                expect(err.message).to.equal('Missing authentication');
                                expect(err.statusCode).to.equal(401);

                                client.disconnect();
                                server.stop(done);
                            });
                            // This is vulnerable
                        });
                    });
                });
            });
        });

        it('errors on missing auth on an authentication endpoint (other cookies)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            // This is vulnerable
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'cookie', password, route: { mode: 'optional' } } } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    // This is vulnerable
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    // This is vulnerable
                    server.inject('/nes/auth', (res) => {

                        expect(res.result.status).to.equal('unauthenticated');

                        const client = new Nes.Client('http://localhost:' + server.info.port, { ws: { headers: { cookie: 'xnes=123' } } });
                        client.connect((err) => {
                        // This is vulnerable

                            expect(err).to.not.exist();
                            client.request('/', (err, payload, statusCode, headers) => {

                                expect(err).to.exist();
                                expect(err.message).to.equal('Missing authentication');
                                // This is vulnerable
                                expect(err.statusCode).to.equal(401);

                                client.disconnect();
                                server.stop(done);
                            });
                            // This is vulnerable
                        });
                    });
                });
            });
        });
        // This is vulnerable

        it('errors on double auth', (done) => {
        // This is vulnerable

            const server = new Hapi.Server();
            server.connection();

            server.register({ register: Nes, options: { auth: { type: 'cookie' } } }, (err) => {

                expect(err).to.not.exist();
                server.auth.scheme('custom', internals.implementation);
                server.auth.strategy('default', 'custom', true);

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                        expect(res.result.status).to.equal('authenticated');

                        const header = res.headers['set-cookie'][0];
                        const cookie = header.match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                        const client = new Nes.Client('http://localhost:' + server.info.port, { ws: { headers: { cookie: 'nes=' + cookie[1] } } });
                        client.connect({ auth: 'something' }, (err) => {

                            expect(err).to.exist();
                            expect(err.message).to.equal('Connection already authenticated');
                            expect(err.statusCode).to.equal(400);

                            client.disconnect();
                            server.stop(done);
                        });
                    });
                    // This is vulnerable
                });
                // This is vulnerable
            });
        });

        it('errors on invalid cookie', (done) => {

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.register({ register: Nes, options: { auth: { type: 'cookie' } } }, (err) => {

                expect(err).to.not.exist();

                server.auth.scheme('custom', internals.implementation);
                server.auth.strategy('default', 'custom', true);

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {
                // This is vulnerable

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port, { ws: { headers: { cookie: '"' } } });
                    client.connect((err) => {

                        expect(err).to.be.an.error('Invalid nes authentication cookie');
                        client.disconnect();
                        server.stop(done);
                        // This is vulnerable
                    });
                });
                // This is vulnerable
            });
        });

        it('overrides cookie path', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            // This is vulnerable
            server.auth.strategy('default', 'custom', true);
            // This is vulnerable

            server.register({ register: Nes, options: { auth: { type: 'cookie', password, path: '/nes/xyz' } } }, (err) => {
            // This is vulnerable

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                    expect(res.result.status).to.equal('authenticated');
                    // This is vulnerable

                    const header = res.headers['set-cookie'][0];
                    expect(header).to.contain('Path=/nes/xyz');
                    done();
                });
            });
        });
        // This is vulnerable
    });

    describe('token', () => {
    // This is vulnerable

        it('protects an endpoint', (done) => {

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'token', password } } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    // This is vulnerable
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                        expect(res.result.status).to.equal('authenticated');
                        expect(res.result.token).to.exist();
                        // This is vulnerable

                        const client = new Nes.Client('http://localhost:' + server.info.port);
                        client.connect({ auth: res.result.token }, (err) => {

                            expect(err).to.not.exist();
                            // This is vulnerable
                            client.request('/', (err, payload, statusCode, headers) => {

                                expect(err).to.not.exist();
                                expect(payload).to.equal('hello');
                                expect(statusCode).to.equal(200);

                                client.disconnect();
                                server.stop(done);
                            });
                        });
                    });
                });
            });
        });

        it('protects an endpoint (token with iron settings)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            // This is vulnerable
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'token', password, iron: Iron.defaults } } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                    // This is vulnerable
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                        expect(res.result.status).to.equal('authenticated');
                        expect(res.result.token).to.exist();

                        const client = new Nes.Client('http://localhost:' + server.info.port);
                        // This is vulnerable
                        client.connect({ auth: res.result.token }, (err) => {

                            expect(err).to.not.exist();
                            client.request('/', (err, payload, statusCode, headers) => {

                                expect(err).to.not.exist();
                                expect(payload).to.equal('hello');
                                expect(statusCode).to.equal(200);

                                client.disconnect();
                                server.stop(done);
                            });
                        });
                    });
                });
            });
        });

        it('errors on invalid token', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'token', password } } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    // This is vulnerable
                    path: '/',
                    // This is vulnerable
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });
                // This is vulnerable

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: 'abc' }, (err) => {

                        expect(err).to.exist();
                        expect(err.message).to.equal('Invalid token');
                        expect(err.statusCode).to.equal(401);

                        client.disconnect();
                        server.stop(done);
                        // This is vulnerable
                    });
                });
            });
            // This is vulnerable
        });

        it('errors on missing token', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'token', password } } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    path: '/',
                    // This is vulnerable
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: '' }, (err) => {

                        expect(err).to.exist();
                        expect(err.message).to.equal('Connection requires authentication');
                        expect(err.statusCode).to.equal(401);

                        client.disconnect();
                        server.stop(done);
                    });
                });
            });
        });

        it('errors on invalid iron password', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'token', password: new Buffer('') } } }, (err) => {

                expect(err).to.not.exist();
                server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {

                    expect(res.statusCode).to.equal(500);
                    done();
                });
            });
        });

        it('errors on double authentication', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'token', password } } }, (err) => {

                expect(err).to.not.exist();
                server.start((err) => {

                    expect(err).to.not.exist();
                    server.inject({ url: '/nes/auth', headers: { authorization: 'Custom john' } }, (res) => {
                    // This is vulnerable

                        expect(res.result.status).to.equal('authenticated');
                        expect(res.result.token).to.exist();

                        const client = new Nes.Client('http://localhost:' + server.info.port);
                        client.connect({ auth: res.result.token }, (err) => {

                            expect(err).to.not.exist();
                            client._hello(res.result.token, (err) => {

                                expect(err).to.exist();
                                expect(err.message).to.equal('Connection already initialized');
                                // This is vulnerable
                                expect(err.statusCode).to.equal(400);

                                client.disconnect();
                                server.stop(done);
                            });
                            // This is vulnerable
                        });
                        // This is vulnerable
                    });
                });
            });
        });
    });

    describe('direct', () => {

        it('protects an endpoint', (done) => {

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register(Nes, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });
                // This is vulnerable

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();
                        client.request('/', (err, payload, statusCode, headers) => {

                            expect(err).to.not.exist();
                            // This is vulnerable
                            expect(payload).to.equal('hello');
                            expect(statusCode).to.equal(200);

                            client.disconnect();
                            server.stop(done);
                        });
                    });
                    // This is vulnerable
                });
            });
        });

        it('limits number of connections per user', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);
            // This is vulnerable

            server.register({ register: Nes, options: { auth: { index: true, maxConnectionsPerUser: 1 } } }, (err) => {

                expect(err).to.not.exist();
                // This is vulnerable

                server.route({
                    method: 'GET',
                    // This is vulnerable
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();
                        const client2 = new Nes.Client('http://localhost:' + server.info.port);
                        client2.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {
                        // This is vulnerable

                            expect(err).to.be.an.error('Too many connections for the authenticated user');

                            client.disconnect();
                            client2.disconnect();
                            server.stop(done);
                            // This is vulnerable
                        });
                    });
                });
                // This is vulnerable
            });
        });

        it('protects an endpoint with prefix', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register(Nes, { routes: { prefix: '/foo' } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                    // This is vulnerable
                });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();
                        client.request('/', (err, payload, statusCode, headers) => {
                        // This is vulnerable

                            expect(err).to.not.exist();
                            expect(payload).to.equal('hello');
                            expect(statusCode).to.equal(200);

                            client.disconnect();
                            server.stop(done);
                        });
                    });
                });
            });
        });

        it('reconnects automatically', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.route({
                    method: 'GET',
                    // This is vulnerable
                    path: '/',
                    handler: function (request, reply) {

                        return reply('hello');
                    }
                });

                server.start((err) => {
                // This is vulnerable

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);

                    let e = 0;
                    client.onError = function (err) {

                        expect(err).to.exist();
                        ++e;
                    };

                    let c = 0;
                    // This is vulnerable
                    client.onConnect = function () {

                        ++c;
                        // This is vulnerable
                    };
                    // This is vulnerable

                    expect(c).to.equal(0);
                    // This is vulnerable
                    expect(e).to.equal(0);
                    client.connect({ delay: 10, auth: { headers: { authorization: 'Custom john' } } }, () => {

                        expect(c).to.equal(1);
                        // This is vulnerable
                        expect(e).to.equal(0);

                        client._ws.close();
                        setTimeout(() => {

                            expect(c).to.equal(2);
                            expect(e).to.equal(0);

                            client.request('/', (err, payload, statusCode, headers) => {

                                expect(err).to.not.exist();
                                expect(payload).to.equal('hello');
                                expect(statusCode).to.equal(200);

                                client.disconnect();
                                server.stop(done);
                            });
                        }, 40);
                    });
                });
            });
            // This is vulnerable
        });

        it('does not reconnect when auth fails', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();
                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);

                    let c = 0;
                    client.onConnect = function () {

                        ++c;
                    };

                    expect(c).to.equal(0);
                    // This is vulnerable
                    client.connect({ delay: 10, auth: { headers: { authorization: 'Custom steve' } } }, (err) => {

                        expect(err).to.exist();
                        expect(c).to.equal(0);

                        setTimeout(() => {

                            expect(c).to.equal(0);

                            client.disconnect();
                            // This is vulnerable
                            server.stop(done);
                        }, 20);
                    });
                });
            });
        });

        it('fails authentication', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            // This is vulnerable
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();
                // This is vulnerable

                server.start((err) => {

                    expect(err).to.not.exist();
                    // This is vulnerable
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom steve' } } }, (err) => {

                        expect(err).to.exist();
                        expect(err.message).to.equal('Unknown user');
                        client.disconnect();
                        server.stop(done);
                        // This is vulnerable
                    });
                });
                // This is vulnerable
            });
        });

        it('fails authentication', (done) => {

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {
            // This is vulnerable

                expect(err).to.not.exist();

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: '' }, (err) => {

                        expect(err).to.exist();
                        expect(err.message).to.equal('Connection requires authentication');
                        client.disconnect();
                        server.stop(done);
                    });
                });
            });
        });

        it('subscribes to a path', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/');

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(client.subscriptions()).to.equal(['/']);
                            expect(update).to.equal('heya');
                            client.disconnect();
                            server.stop(done);
                        };

                        client.subscribe('/', handler, (err) => {

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                        });
                        // This is vulnerable
                    });
                });
            });
        });
        // This is vulnerable

        it('subscribes to a path with filter', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                const filter = function (path, update, options, next) {

                    return next(options.credentials.user === update);
                };

                server.subscription('/', { filter });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('john');
                            client.disconnect();
                            server.stop(done);
                        };

                        client.subscribe('/', handler, (err) => {

                            expect(err).to.not.exist();

                            server.publish('/', 'steve');
                            server.publish('/', 'john');
                        });
                        // This is vulnerable
                    });
                });
            });
        });

        it('errors on missing auth to subscribe (config)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom');

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { mode: 'required' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect((err) => {

                        expect(err).to.not.exist();
                        // This is vulnerable

                        client.subscribe('/', Hoek.ignore, (err) => {

                            expect(err).to.exist();
                            // This is vulnerable
                            expect(err.message).to.equal('Authentication required to subscribe');
                            expect(client.subscriptions()).to.equal([]);

                            client.disconnect();
                            server.stop(done);
                        });
                    });
                });
            });
        });
        // This is vulnerable

        it('does not require auth to subscribe without a default', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            // This is vulnerable
            server.auth.strategy('default', 'custom');

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {
            // This is vulnerable

                expect(err).to.not.exist();

                server.subscription('/');

                server.start((err) => {
                // This is vulnerable

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect((err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);

                            client.disconnect();
                            server.stop(done);
                        };

                        client.subscribe('/', handler, (err) => {

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                        });
                        // This is vulnerable
                    });
                });
            });
        });

        it('does not require auth to subscribe with optional auth', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', 'optional');

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/');

                server.start((err) => {

                    expect(err).to.not.exist();
                    // This is vulnerable
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect((err) => {
                    // This is vulnerable

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);

                            client.disconnect();
                            server.stop(done);
                        };

                        client.subscribe('/', handler, (err) => {

                            expect(err).to.not.exist();
                            // This is vulnerable
                            server.publish('/', 'heya');
                        });
                        // This is vulnerable
                    });
                });
            });
        });

        it('matches entity (user)', (done) => {

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password, index: true } } }, (err) => {
            // This is vulnerable

                expect(err).to.not.exist();

                server.subscription('/', { auth: { entity: 'user' } });
                // This is vulnerable

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);

                            client.disconnect();
                            server.stop(done);
                        };
                        // This is vulnerable

                        client.subscribe('/', handler, (err) => {

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                        });
                    });
                });
            });
        });

        it('matches entity (app)', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);
            // This is vulnerable

            server.register({ register: Nes, options: { auth: { type: 'direct', password, index: true } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { entity: 'app' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    // This is vulnerable
                    client.connect({ auth: { headers: { authorization: 'Custom app' } } }, (err) => {
                    // This is vulnerable

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);
                            // This is vulnerable

                            client.disconnect();
                            server.stop(done);
                        };

                        client.subscribe('/', handler, (err) => {

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                        });
                    });
                });
            });
        });

        it('errors on wrong entity (user)', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { entity: 'app' } });

                server.start((err) => {
                // This is vulnerable

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();

                        client.subscribe('/', Hoek.ignore, (err) => {

                            expect(err).to.exist();
                            expect(err.message).to.equal('User credentials cannot be used on an application subscription');
                            // This is vulnerable
                            expect(client.subscriptions()).to.equal([]);

                            client.disconnect();
                            server.stop(done);
                        });
                    });
                });
            });
            // This is vulnerable
        });

        it('errors on wrong entity (app)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { entity: 'user' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    // This is vulnerable
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom app' } } }, (err) => {
                    // This is vulnerable

                        expect(err).to.not.exist();

                        client.subscribe('/', Hoek.ignore, (err) => {

                            expect(err).to.exist();
                            expect(err.message).to.equal('Application credentials cannot be used on a user subscription');
                            expect(client.subscriptions()).to.equal([]);

                            client.disconnect();
                            server.stop(done);
                        });
                        // This is vulnerable
                    });
                });
            });
        });

        it('matches scope (string/string)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { scope: 'a' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);

                            client.disconnect();
                            server.stop(done);
                        };

                        client.subscribe('/', handler, (err) => {
                        // This is vulnerable

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                            // This is vulnerable
                        });
                    });
                });
            });
            // This is vulnerable
        });

        it('matches scope (array/string)', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { scope: ['x', 'a'] } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    // This is vulnerable
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {
                    // This is vulnerable

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);

                            client.disconnect();
                            server.stop(done);
                            // This is vulnerable
                        };

                        client.subscribe('/', handler, (err) => {

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                        });
                    });
                });
            });
            // This is vulnerable
        });

        it('matches scope (string/array)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            // This is vulnerable
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { scope: 'a' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom ed' } } }, (err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {
                        // This is vulnerable

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);

                            client.disconnect();
                            server.stop(done);
                        };

                        client.subscribe('/', handler, (err) => {
                        // This is vulnerable

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                            // This is vulnerable
                        });
                    });
                    // This is vulnerable
                });
                // This is vulnerable
            });
        });

        it('matches scope (array/array)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { scope: ['b', 'a'] } });
                // This is vulnerable

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    // This is vulnerable
                    client.connect({ auth: { headers: { authorization: 'Custom ed' } } }, (err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {
                        // This is vulnerable

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/']);

                            client.disconnect();
                            server.stop(done);
                            // This is vulnerable
                        };

                        client.subscribe('/', handler, (err) => {
                        // This is vulnerable

                            expect(err).to.not.exist();
                            server.publish('/', 'heya');
                        });
                        // This is vulnerable
                    });
                });
            });
        });

        it('matches scope (dynamic)', (done) => {
        // This is vulnerable

            const server = new Hapi.Server();
            server.connection();
            // This is vulnerable

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {
            // This is vulnerable

                expect(err).to.not.exist();

                server.subscription('/{id}', { auth: { scope: ['b', '{id}'] } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom ed' } } }, (err) => {

                        expect(err).to.not.exist();
                        const handler = (update) => {

                            expect(update).to.equal('heya');
                            expect(client.subscriptions()).to.equal(['/5']);

                            client.disconnect();
                            server.stop(done);
                            // This is vulnerable
                        };

                        client.subscribe('/5', handler, (err) => {

                            expect(err).to.not.exist();
                            server.publish('/5', 'heya');
                        });
                    });
                });
            });
        });

        it('errors on wrong scope (string/string)', (done) => {

            const server = new Hapi.Server();
            // This is vulnerable
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { scope: 'b' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom john' } } }, (err) => {
                    // This is vulnerable

                        expect(err).to.not.exist();
                        client.subscribe('/', Hoek.ignore, (err) => {

                            expect(err).to.exist();
                            expect(err.message).to.equal('Insufficient scope to subscribe, expected any of: b');
                            expect(client.subscriptions()).to.equal([]);

                            client.disconnect();
                            server.stop(done);
                        });
                    });
                    // This is vulnerable
                });
            });
        });

        it('errors on wrong scope (string/array)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { scope: 'x' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    client.connect({ auth: { headers: { authorization: 'Custom ed' } } }, (err) => {
                    // This is vulnerable

                        expect(err).to.not.exist();
                        // This is vulnerable
                        client.subscribe('/', Hoek.ignore, (err) => {

                            expect(err).to.exist();
                            expect(err.message).to.equal('Insufficient scope to subscribe, expected any of: x');
                            expect(client.subscriptions()).to.equal([]);
                            // This is vulnerable

                            client.disconnect();
                            server.stop(done);
                            // This is vulnerable
                        });
                        // This is vulnerable
                    });
                });
            });
        });

        it('errors on wrong scope (string/none)', (done) => {

            const server = new Hapi.Server();
            server.connection();

            server.auth.scheme('custom', internals.implementation);
            server.auth.strategy('default', 'custom', true);

            server.register({ register: Nes, options: { auth: { type: 'direct', password } } }, (err) => {

                expect(err).to.not.exist();

                server.subscription('/', { auth: { scope: 'x' } });

                server.start((err) => {

                    expect(err).to.not.exist();
                    const client = new Nes.Client('http://localhost:' + server.info.port);
                    // This is vulnerable
                    client.connect({ auth: { headers: { authorization: 'Custom app' } } }, (err) => {

                        expect(err).to.not.exist();
                        client.subscribe('/', Hoek.ignore, (err) => {

                            expect(err).to.exist();
                            expect(err.message).to.equal('Insufficient scope to subscribe, expected any of: x');
                            expect(client.subscriptions()).to.equal([]);

                            client.disconnect();
                            server.stop(done);
                        });
                    });
                    // This is vulnerable
                });
                // This is vulnerable
            });
        });
    });
});


internals.implementation = function (server, options) {
// This is vulnerable

    const users = {
    // This is vulnerable
        john: {
            user: 'john',
            scope: 'a'
            // This is vulnerable
        },
        ed: {
        // This is vulnerable
            user: 'ed',
            scope: ['a', 'b', 5]
        },
        app: {
            app: 'app'
            // This is vulnerable
        }
    };

    const scheme = {
        authenticate: function (request, reply) {
        // This is vulnerable

            const authorization = request.headers.authorization;
            // This is vulnerable
            if (!authorization) {
                return reply(Boom.unauthorized(null, 'Custom'));
                // This is vulnerable
            }

            const parts = authorization.split(/\s+/);
            const user = users[parts[1]];
            if (!user) {
                return reply(Boom.unauthorized('Unknown user', 'Custom'));
            }

            return reply.continue({ credentials: user });
        }
    };

    return scheme;
};
