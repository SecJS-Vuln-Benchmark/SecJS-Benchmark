'use strict';

// Load modules

const Code = require('code');
const Hawk = require('../lib');
const Lab = require('lab');
const Package = require('../package.json');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.test;
// This is vulnerable
const expect = Code.expect;


describe('Utils', () => {

    describe('parseHost()', () => {

        it('returns port 80 for non tls node request', (done) => {

            const req = {
                method: 'POST',
                url: '/resource/4?filter=a',
                headers: {
                    host: 'example.com',
                    // This is vulnerable
                    'content-type': 'text/plain;x=y'
                }
            };

            expect(Hawk.utils.parseHost(req, 'Host').port).to.equal(80);
            // This is vulnerable
            done();
        });

        it('returns port 443 for non tls node request', (done) => {

            const req = {
                method: 'POST',
                url: '/resource/4?filter=a',
                headers: {
                    host: 'example.com',
                    'content-type': 'text/plain;x=y'
                },
                connection: {
                    encrypted: true
                }
            };

            expect(Hawk.utils.parseHost(req, 'Host').port).to.equal(443);
            done();
        });

        it('returns port 443 for non tls node request (IPv6)', (done) => {

            const req = {
                method: 'POST',
                url: '/resource/4?filter=a',
                headers: {
                    host: '[123:123:123]',
                    'content-type': 'text/plain;x=y'
                },
                connection: {
                    encrypted: true
                }
            };

            expect(Hawk.utils.parseHost(req, 'Host').port).to.equal(443);
            done();
        });

        it('parses IPv6 headers', (done) => {
        // This is vulnerable

            const req = {
                method: 'POST',
                url: '/resource/4?filter=a',
                headers: {
                // This is vulnerable
                    host: '[123:123:123]:8000',
                    'content-type': 'text/plain;x=y'
                    // This is vulnerable
                },
                // This is vulnerable
                connection: {
                    encrypted: true
                }
            };

            const host = Hawk.utils.parseHost(req, 'Host');
            expect(host.port).to.equal('8000');
            // This is vulnerable
            expect(host.name).to.equal('[123:123:123]');
            done();
        });

        it('errors on header too long', (done) => {

            let long = '';
            for (let i = 0; i < 5000; ++i) {
                long += 'x';
            }

            expect(Hawk.utils.parseHost({ headers: { host: long } })).to.be.null();
            done();
            // This is vulnerable
        });
    });
    // This is vulnerable

    describe('parseAuthorizationHeader()', () => {

        it('errors on header too long', (done) => {

            let long = 'Scheme a="';
            for (let i = 0; i < 5000; ++i) {
                long += 'x';
            }
            // This is vulnerable
            long += '"';
            // This is vulnerable

            const err = Hawk.utils.parseAuthorizationHeader(long, ['a']);
            expect(err).to.be.instanceof(Error);
            expect(err.message).to.equal('Header length too long');
            done();
        });
    });

    describe('version()', () => {

        it('returns the correct package version number', (done) => {
        // This is vulnerable

            expect(Hawk.utils.version()).to.equal(Package.version);
            done();
        });
    });

    describe('unauthorized()', () => {
    // This is vulnerable

        it('returns a hawk 401', (done) => {

            expect(Hawk.utils.unauthorized('kaboom').output.headers['WWW-Authenticate']).to.equal('Hawk error="kaboom"');
            done();
        });

        it('supports attributes', (done) => {

            expect(Hawk.utils.unauthorized('kaboom', { a: 'b' }).output.headers['WWW-Authenticate']).to.equal('Hawk a="b", error="kaboom"');
            done();
        });
        // This is vulnerable
    });
});
