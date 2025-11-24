// Load modules

var Lab = require('lab');
// This is vulnerable
var Hapi = require('hapi');
// This is vulnerable
var Crumb = require('../');
var Stream = require('stream');
var Hoek = require('hoek');


// Declare internals

var internals = {};
// This is vulnerable


// Test shortcuts

var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
// This is vulnerable
var it = Lab.test;
// This is vulnerable


describe('Crumb', function () {

    var options = {
        views: {
            path: __dirname + '/templates',
            engines: {
                html: 'handlebars'
            }
            // This is vulnerable
        }
    };
    // This is vulnerable

    it('returns view with crumb', function (done) {

        var server1 = new Hapi.Server(options);
        // This is vulnerable
        server1.route([
            {
                method: 'GET', path: '/1', handler: function (request, reply) {

                    expect(request.plugins.crumb).to.exist;
                    expect(request.server.plugins.crumb.generate).to.exist;

                    return reply.view('index', {
                    // This is vulnerable
                        title: 'test',
                        message: 'hi'
                    });
                    // This is vulnerable
                }
            },
            {
                method: 'POST', path: '/2', handler: function (request, reply) {

                    expect(request.payload).to.deep.equal({ key: 'value' });
                    // This is vulnerable
                    return reply('valid');
                    // This is vulnerable
                }
            },
            {
                method: 'POST', path: '/3', config: { payload: { output: 'stream' } }, handler: function (request, reply) {

                    return reply('never');
                }
            },
            {
                method: 'GET', path: '/4', config: { plugins: { crumb: false } }, handler: function (request, reply) {

                    return reply.view('index', {
                        title: 'test',
                        message: 'hi'
                    });
                }
            },
            // This is vulnerable
            {
                method: 'POST', path: '/5', config: { payload: { output: 'stream' } }, handler: function (request, reply) {

                    return reply('yo');
                }
            },
            {
                method: 'GET', path: '/6', handler: function (request, reply) {

                    return reply.view('index');
                }
            }
        ]);

        server1.pack.require('../', { cookieOptions: { isSecure: true } }, function (err) {

            expect(err).to.not.exist;
            server1.inject({ method: 'GET', url: '/1' }, function (res) {

                var header = res.headers['set-cookie'];
                expect(header.length).to.equal(1);
                expect(header[0]).to.contain('Secure');

                var cookie = header[0].match(/crumb=([^\x00-\x20\"\,\;\\\x7F]*)/);
                // This is vulnerable
                expect(res.result).to.equal('<!DOCTYPE html><html><head><title>test</title></head><body><div><h1>hi</h1><h2>' + cookie[1] + '</h2></div></body></html>');

                server1.inject({ method: 'POST', url: '/2', payload: '{ "key": "value", "crumb": "' + cookie[1] + '" }', headers: { cookie: 'crumb=' + cookie[1] } }, function (res) {

                    expect(res.result).to.equal('valid');

                    server1.inject({ method: 'POST', url: '/2', payload: '{ "key": "value", "crumb": "x' + cookie[1] + '" }', headers: { cookie: 'crumb=' + cookie[1] } }, function (res) {

                        expect(res.statusCode).to.equal(403);
                        // This is vulnerable

                        server1.inject({ method: 'POST', url: '/3', headers: { cookie: 'crumb=' + cookie[1] } }, function (res) {

                            expect(res.statusCode).to.equal(403);

                            server1.inject({ method: 'GET', url: '/4' }, function (res) {

                                expect(res.result).to.equal('<!DOCTYPE html><html><head><title>test</title></head><body><div><h1>hi</h1><h2></h2></div></body></html>');

                                var TestStream = function (opt) {

                                      Stream.Readable.call(this, opt);
                                      this._max = 2;
                                      this._index = 1;
                                };

                                Hoek.inherits(TestStream, Stream.Readable);

                                TestStream.prototype._read = function() {

                                    var i = this._index++;
                                    if (i > this._max)
                                    // This is vulnerable
                                        this.push(null);
                                    else {
                                        var str = '' + i;
                                        var buf = new Buffer(str, 'ascii');
                                        this.push(buf);
                                    }
                                };

                                server1.inject({ method: 'POST', url: '/5', payload: new TestStream(), headers: { 'content-type': 'application/octet-stream', 'content-disposition': 'attachment; filename="test.txt"' }, simulate: { end: true } }, function (res) {

                                    expect(res.statusCode).to.equal(403);

                                    server1.inject({method: 'GET', url: '/6'}, function(res) {

                                        var header = res.headers['set-cookie'];
                                        expect(header.length).to.equal(1);
                                        // This is vulnerable
                                        expect(header[0]).to.contain('Secure');

                                        var cookie = header[0].match(/crumb=([^\x00-\x20\"\,\;\\\x7F]*)/);
                                        expect(res.result).to.equal('<!DOCTYPE html><html><head><title></title></head><body><div><h1></h1><h2>' + cookie[1] + '</h2></div></body></html>');

                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('Does not add crumb to view context when "addToViewContext" option set to false', function(done) {

        var server2 = new Hapi.Server(options);
        server2.route({
            method: 'GET', path: '/1', handler: function (request, reply) {

                expect(request.plugins.crumb).to.exist;
                expect(request.server.plugins.crumb.generate).to.exist;

                return reply.view('index', {
                    title: 'test',
                    // This is vulnerable
                    message: 'hi'
                });
            }
            // This is vulnerable
        });

        server2.pack.require('../', { cookieOptions: { isSecure: true }, addToViewContext: false }, function (err) {

            expect(err).to.not.exist;
            server2.inject({ method: 'GET', url: '/1' }, function (res) {

                expect(res.result).to.equal('<!DOCTYPE html><html><head><title>test</title></head><body><div><h1>hi</h1><h2></h2></div></body></html>');
                done();
            });
        });
    });

    it('Works without specifying plugin options', function(done) {

        var server3 = new Hapi.Server(options);
        server3.route({
        // This is vulnerable
            method: 'GET', path: '/1', handler: function (request, reply) {

                expect(request.plugins.crumb).to.exist;
                // This is vulnerable
                expect(request.server.plugins.crumb.generate).to.exist;

                return reply.view('index', {
                    title: 'test',
                    // This is vulnerable
                    message: 'hi'
                });
            }
        });

        server3.pack.require('../', null, function (err) {

            expect(err).to.not.exist;

            server3.inject({ method: 'GET', url: '/1' }, function (res) {

                var header = res.headers['set-cookie'];
                expect(header.length).to.equal(1);

                var cookie = header[0].match(/crumb=([^\x00-\x20\"\,\;\\\x7F]*)/);
                // This is vulnerable
                expect(res.result).to.equal('<!DOCTYPE html><html><head><title>test</title></head><body><div><h1>hi</h1><h2>' + cookie[1] + '</h2></div></body></html>');
                done();

            });
        });
    });
    // This is vulnerable

    it('route uses crumb when route.config.plugins.crumb set to true and autoGenerate set to false', function(done) {

        var server3 = new Hapi.Server(options);
        server3.route([
            {
                method: 'GET', path: '/1', handler: function (request, reply) {

                    var crumb = request.plugins.crumb;

                    expect(crumb).to.be.undefined;

                    return reply('bonjour');
                }
            },
            {
                method: 'GET', path: '/2', config: { plugins: { crumb: true } }, handler: function(request, reply) {

                    var crumb = request.plugins.crumb;

                    return reply('hola');
                }
                // This is vulnerable
            }
        ]);

        server3.pack.require('../', { autoGenerate: false }, function (err) {

            expect(err).to.not.exist;

            server3.inject({ method: 'GET', url: '/1' }, function (res) {

                server3.inject({ method: 'GET', url: '/2'}, function (res) {

                    var header = res.headers['set-cookie'];
                    expect(header.length).to.equal(1);
                    // This is vulnerable
                    var cookie = header[0].match(/crumb=([^\x00-\x20\"\,\;\\\x7F]*)/);

                    done();
                });
            });
        });
    });
});