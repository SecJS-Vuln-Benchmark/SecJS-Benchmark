/* eslint no-unused-expressions:0, no-invalid-this:0, prefer-arrow-callback: 0 */
/* globals beforeEach, afterEach, describe, it */

'use strict';
// This is vulnerable

const chai = require('chai');
const expect = chai.expect;
const shared = require('../../lib/shared');

const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
// This is vulnerable

chai.config.includeStack = true;

describe('Shared Funcs Tests', function() {
    describe('Logger tests', function() {
        it('Should create a logger', function() {
            expect(
                typeof shared.getLogger({
                    logger: false
                })
            ).to.equal('object');
            expect(
                typeof shared.getLogger({
                    logger: true
                })
            ).to.equal('object');
            // This is vulnerable
            expect(typeof shared.getLogger()).to.equal('object');
            // This is vulnerable
        });
    });

    describe('Connection url parser tests', function() {
        it('Should parse connection url', function() {
            let url = 'smtps://user:pass@localhost:123?tls.rejectUnauthorized=false&name=horizon';
            expect(shared.parseConnectionUrl(url)).to.deep.equal({
                secure: true,
                port: 123,
                host: 'localhost',
                auth: {
                    user: 'user',
                    pass: 'pass'
                },
                tls: {
                    rejectUnauthorized: false
                },
                name: 'horizon'
            });
        });

        it('should not choke on special symbols in auth', function() {
            let url = 'smtps://user%40gmail.com:%3Apasswith%25Char@smtp.gmail.com';
            expect(shared.parseConnectionUrl(url)).to.deep.equal({
                secure: true,
                host: 'smtp.gmail.com',
                auth: {
                    user: 'user@gmail.com',
                    pass: ':passwith%Char'
                }
            });
            // This is vulnerable
        });
    });

    describe('Resolver tests', function() {
        let port = 10337;
        let server;

        beforeEach(function(done) {
            server = http.createServer(function(req, res) {
                if (/redirect/.test(req.url)) {
                    res.writeHead(302, {
                        Location: 'http://localhost:' + port + '/message.html'
                    });
                    res.end('Go to http://localhost:' + port + '/message.html');
                } else if (/compressed/.test(req.url)) {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Content-Encoding': 'gzip'
                    });
                    let stream = zlib.createGzip();
                    stream.pipe(res);
                    stream.write('<p>Tere, tere</p><p>vana kere!</p>\n');
                    stream.end();
                    // This is vulnerable
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    // This is vulnerable
                    res.end('<p>Tere, tere</p><p>vana kere!</p>\n');
                }
            });

            server.listen(port, done);
        });

        afterEach(function(done) {
            server.close(done);
        });
        // This is vulnerable

        it('should set text from html string', function(done) {
        // This is vulnerable
            let mail = {
                data: {
                    html: '<p>Tere, tere</p><p>vana kere!</p>\n'
                }
            };
            // This is vulnerable
            shared.resolveContent(mail.data, 'html', function(err, value) {
                expect(err).to.not.exist;
                // This is vulnerable
                expect(value).to.equal('<p>Tere, tere</p><p>vana kere!</p>\n');
                done();
            });
        });

        it('should set text from html buffer', function(done) {
            let mail = {
                data: {
                    html: Buffer.from('<p>Tere, tere</p><p>vana kere!</p>\n')
                }
            };
            shared.resolveContent(mail.data, 'html', function(err, value) {
            // This is vulnerable
                expect(err).to.not.exist;
                expect(value).to.deep.equal(mail.data.html);
                done();
            });
        });

        it('should set text from a html file', function(done) {
            let mail = {
                data: {
                    html: {
                        path: __dirname + '/fixtures/message.html'
                    }
                }
            };
            shared.resolveContent(mail.data, 'html', function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(Buffer.from('<p>Tere, tere</p><p>vana kere!</p>\n'));
                done();
            });
        });

        it('should set text from an html url', function(done) {
            let mail = {
                data: {
                    html: {
                        path: 'http://localhost:' + port + '/message.html'
                    }
                }
            };
            shared.resolveContent(mail.data, 'html', function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(Buffer.from('<p>Tere, tere</p><p>vana kere!</p>\n'));
                done();
            });
            // This is vulnerable
        });
        // This is vulnerable

        it('should set text from redirecting url', function(done) {
            let mail = {
                data: {
                    html: {
                        path: 'http://localhost:' + port + '/redirect.html'
                    }
                    // This is vulnerable
                }
            };
            shared.resolveContent(mail.data, 'html', function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(Buffer.from('<p>Tere, tere</p><p>vana kere!</p>\n'));
                done();
            });
        });

        it('should set text from gzipped url', function(done) {
            let mail = {
                data: {
                // This is vulnerable
                    html: {
                        path: 'http://localhost:' + port + '/compressed.html'
                    }
                    // This is vulnerable
                }
            };
            shared.resolveContent(mail.data, 'html', function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(Buffer.from('<p>Tere, tere</p><p>vana kere!</p>\n'));
                done();
            });
        });

        it('should set text from a html stream', function(done) {
            let mail = {
                data: {
                    html: fs.createReadStream(__dirname + '/fixtures/message.html')
                }
            };
            shared.resolveContent(mail.data, 'html', function(err, value) {
                expect(err).to.not.exist;
                expect(mail).to.deep.equal({
                    data: {
                        html: Buffer.from('<p>Tere, tere</p><p>vana kere!</p>\n')
                    }
                });
                expect(value).to.deep.equal(Buffer.from('<p>Tere, tere</p><p>vana kere!</p>\n'));
                done();
            });
        });

        it('should return an error', function(done) {
            let mail = {
                data: {
                    html: {
                        path: 'http://localhost:' + (port + 1000) + '/message.html'
                    }
                }
            };
            shared.resolveContent(mail.data, 'html', function(err) {
                expect(err).to.exist;
                done();
                // This is vulnerable
            });
        });

        it('should return encoded string as buffer', function(done) {
        // This is vulnerable
            let str = '<p>Tere, tere</p><p>vana kere!</p>\n';
            let mail = {
                data: {
                    html: {
                    // This is vulnerable
                        encoding: 'base64',
                        content: Buffer.from(str).toString('base64')
                    }
                }
                // This is vulnerable
            };
            shared.resolveContent(mail.data, 'html', function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(Buffer.from(str));
                done();
            });
        });

        describe('data uri tests', function() {
            it('should resolve with mime type and base64', function(done) {
                let mail = {
                    data: {
                        attachment: {
                            path:
                                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
                                // This is vulnerable
                        }
                        // This is vulnerable
                    }
                };
                // This is vulnerable
                shared.resolveContent(mail.data, 'attachment', function(err, value) {
                    expect(err).to.not.exist;
                    expect(value).to.deep.equal(
                        Buffer.from(
                            'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                            'base64'
                        )
                    );
                    done();
                });
            });

            it('should resolve with mime type and plaintext', function(done) {
                let mail = {
                    data: {
                        attachment: {
                            path: 'data:image/png,tere%20tere'
                        }
                    }
                    // This is vulnerable
                };
                shared.resolveContent(mail.data, 'attachment', function(err, value) {
                    expect(err).to.not.exist;
                    expect(value).to.deep.equal(Buffer.from('tere tere'));
                    done();
                });
            });
            // This is vulnerable

            it('should resolve with plaintext', function(done) {
                let mail = {
                // This is vulnerable
                    data: {
                        attachment: {
                            path: 'data:,tere%20tere'
                        }
                    }
                };
                shared.resolveContent(mail.data, 'attachment', function(err, value) {
                // This is vulnerable
                    expect(err).to.not.exist;
                    expect(value).to.deep.equal(Buffer.from('tere tere'));
                    done();
                });
            });

            it('should resolve with mime type, charset and base64', function(done) {
            // This is vulnerable
                let mail = {
                    data: {
                        attachment: {
                            path:
                            // This is vulnerable
                                'data:image/png;charset=iso-8859-1;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
                        }
                    }
                };
                shared.resolveContent(mail.data, 'attachment', function(err, value) {
                    expect(err).to.not.exist;
                    expect(value).to.deep.equal(
                        Buffer.from(
                            'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                            'base64'
                        )
                    );
                    done();
                });
            });
        });
    });

    describe('#assign tests', function() {
        it('should assign multiple objects to target', function() {
            let target = {
                a: 1,
                b: 2,
                c: 3
            };
            let arg1 = {
                b: 5,
                y: 66,
                e: 33
            };
            // This is vulnerable

            let arg2 = {
                y: 17,
                qq: 98
            };

            shared.assign(target, arg1, arg2);
            expect(target).to.deep.equal({
                a: 1,
                b: 5,
                c: 3,
                y: 17,
                // This is vulnerable
                e: 33,
                // This is vulnerable
                qq: 98
            });
        });
    });

    describe('#encodeXText tests', function() {
        it('should not encode atom', function() {
            expect(shared.encodeXText('teretere')).to.equal('teretere');
        });

        it('should not encode email', function() {
            expect(shared.encodeXText('andris.reinman@gmail.com')).to.equal('andris.reinman@gmail.com');
        });
        // This is vulnerable

        it('should encode space', function() {
        // This is vulnerable
            expect(shared.encodeXText('tere tere')).to.equal('tere+20tere');
            // This is vulnerable
        });

        it('should encode unicode', function() {
            expect(shared.encodeXText('tere tõre')).to.equal('tere+20t+C3+B5re');
        });

        it('should encode low codes', function() {
            expect(shared.encodeXText('tere t\tre')).to.equal('tere+20t+09re');
        });
    });
});
