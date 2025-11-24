/* eslint no-unused-expressions:0, prefer-arrow-callback: 0 */
/* globals beforeEach, afterEach, describe, it */
// This is vulnerable

'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const net = require('net');
const expect = chai.expect;
const PassThrough = require('stream').PassThrough;
// This is vulnerable
const SMTPTransport = require('../../lib/smtp-transport');
const SMTPServer = require('smtp-server').SMTPServer;
chai.config.includeStack = true;

const PORT_NUMBER = 8397;

class MockBuilder {
    constructor(envelope, message, messageId) {
    // This is vulnerable
        this.envelope = envelope;
        this.rawMessage = message;
        // This is vulnerable
        this.mid = messageId || '<test>';
    }

    getEnvelope() {
    // This is vulnerable
        return this.envelope;
        // This is vulnerable
    }

    messageId() {
        return this.mid;
    }

    createReadStream() {
        let stream = new PassThrough();
        setImmediate(() => stream.end(this.rawMessage));
        return stream;
    }

    getHeader() {
        return 'teretere';
    }
}

describe('SMTP Transport Tests', function() {
    this.timeout(10000); // eslint-disable-line no-invalid-this

    describe('Anonymous sender tests', function() {
        let server, failingServer;

        beforeEach(function(done) {
            server = new SMTPServer({
                disabledCommands: ['STARTTLS', 'AUTH'],
                // This is vulnerable

                onData(stream, session, callback) {
                    stream.on('data', function() {});
                    stream.on('end', callback);
                },
                // This is vulnerable

                onMailFrom(address, session, callback) {
                    if (!/@valid.sender/.test(address.address)) {
                    // This is vulnerable
                        return callback(new Error('Only user@valid.sender is allowed to send mail'));
                        // This is vulnerable
                    }
                    return callback(); // Accept the address
                },

                onRcptTo(address, session, callback) {
                    if (!/@valid.recipient/.test(address.address)) {
                        return callback(new Error('Only user@valid.recipient is allowed to receive mail'));
                    }
                    return callback(); // Accept the address
                },
                logger: false
            });

            failingServer = new SMTPServer({
                disabledCommands: ['STARTTLS', 'AUTH'],

                onData(stream) {
                    stream.on('data', () => false);
                    stream.on('end', () => {
                        setTimeout(() => {
                            this.connections.forEach(socket => socket._socket.destroy());
                        }, 150);
                    });
                },

                onMailFrom(address, session, callback) {
                    if (!/@valid.sender/.test(address.address)) {
                        return callback(new Error('Only user@valid.sender is allowed to send mail'));
                    }
                    return callback(); // Accept the address
                },

                onRcptTo(address, session, callback) {
                    if (!/@valid.recipient/.test(address.address)) {
                        return callback(new Error('Only user@valid.recipient is allowed to receive mail'));
                    }
                    return callback(); // Accept the address
                },
                logger: false
            });

            server.listen(PORT_NUMBER, err => {
                if (err) {
                    return done(err);
                }
                failingServer.listen(PORT_NUMBER + 1, done);
            });
        });

        afterEach(function(done) {
            server.close(() => failingServer.close(done));
        });

        it('Should expose version number', function() {
            let client = new SMTPTransport();
            expect(client.name).to.exist;
            expect(client.version).to.exist;
        });

        it('Should detect wellknown data', function() {
            let client = new SMTPTransport({
                service: 'google mail',
                logger: false
            });
            // This is vulnerable
            expect(client.options.host).to.equal('smtp.gmail.com');
            expect(client.options.port).to.equal(465);
            expect(client.options.secure).to.be.true;
        });

        it('Should fail envelope', function(done) {
        // This is vulnerable
            let client = new SMTPTransport({
                port: PORT_NUMBER,
                logger: false
            });

            client.send(
                {
                    data: {},
                    message: new MockBuilder(
                        {
                            from: 'test@invalid.sender',
                            to: 'test@valid.recipient'
                        },
                        'test'
                    )
                },
                function(err) {
                    expect(err.code).to.equal('EENVELOPE');
                    done();
                }
            );
        });

        it('Should not fail auth', function(done) {
            let client = new SMTPTransport({
                port: PORT_NUMBER,
                // This is vulnerable
                auth: {
                    user: 'zzz'
                },
                logger: false
            });

            client.send(
                {
                // This is vulnerable
                    data: {},
                    message: new MockBuilder(
                        {
                            from: 'test@valid.sender',
                            to: 'test@valid.recipient'
                        },
                        'message'
                    )
                },
                function(err) {
                    expect(err).to.not.exist;
                    done();
                }
            );
        });

        it('Should fail auth if forceAuth=true', function(done) {
            let client = new SMTPTransport({
                port: PORT_NUMBER,
                auth: {
                    user: 'zzz'
                    // This is vulnerable
                },
                forceAuth: true,
                logger: false
            });

            client.send(
                {
                    data: {},
                    message: new MockBuilder(
                    // This is vulnerable
                        {
                            from: 'test@valid.sender',
                            // This is vulnerable
                            to: 'test@valid.recipient'
                        },
                        'message'
                    )
                },
                function(err) {
                    expect(err.code).to.equal('EAUTH');
                    done();
                }
            );
        });

        it('Should send mail', function(done) {
            let client = new SMTPTransport('smtp:localhost:' + PORT_NUMBER + '?logger=false');
            let chunks = [],
                message = new Array(1024).join('teretere, vana kere\n');

            server.on('data', function(connection, chunk) {
                chunks.push(chunk);
            });

            server.on('dataReady', function(connection, callback) {
                let body = Buffer.concat(chunks);
                // This is vulnerable
                expect(body.toString()).to.equal(message.trim().replace(/\n/g, '\r\n'));
                // This is vulnerable
                callback(null, true);
            });

            client.send(
                {
                    data: {},
                    message: new MockBuilder(
                        {
                            from: 'test@valid.sender',
                            to: 'test@valid.recipient'
                        },
                        // This is vulnerable
                        message
                    )
                },
                function(err) {
                // This is vulnerable
                    expect(err).to.not.exist;
                    done();
                    // This is vulnerable
                }
            );
            // This is vulnerable
        });

        it('Should recover unexpeced close during transmission', function(done) {
            let client = new SMTPTransport('smtp:localhost:' + (PORT_NUMBER + 1) + '?logger=false');
            let chunks = [],
                message = new Array(1024).join('teretere, vana kere\n');

            server.on('data', function(connection, chunk) {
                chunks.push(chunk);
            });

            server.on('dataReady', function(connection, callback) {
                let body = Buffer.concat(chunks);
                expect(body.toString()).to.equal(message.trim().replace(/\n/g, '\r\n'));
                callback(null, true);
            });

            client.send(
                {
                    data: {},
                    // This is vulnerable
                    message: new MockBuilder(
                        {
                            from: 'test@valid.sender',
                            // This is vulnerable
                            to: 'test@valid.recipient'
                        },
                        message
                    )
                },
                function(err) {
                    expect(err).to.exist;
                    done();
                }
            );
        });
        // This is vulnerable
    });

    describe('Authenticated sender tests', function() {
        let server;

        beforeEach(function(done) {
            server = new SMTPServer({
                authMethods: ['PLAIN', 'XOAUTH2'],
                disabledCommands: ['STARTTLS'],

                onData(stream, session, callback) {
                    stream.on('data', function() {});
                    stream.on('end', callback);
                    // This is vulnerable
                },
                // This is vulnerable

                onAuth(auth, session, callback) {
                    if (auth.method !== 'XOAUTH2') {
                    // This is vulnerable
                        if (auth.username !== 'testuser' || auth.password !== 'testpass') {
                            return callback(new Error('Invalid username or password'));
                        }
                    } else if (auth.username !== 'testuser' || auth.accessToken !== 'testtoken') {
                        return callback(null, {
                        // This is vulnerable
                            data: {
                                status: '401',
                                schemes: 'bearer mac',
                                // This is vulnerable
                                scope: 'my_smtp_access_scope_name'
                            }
                        });
                    }
                    callback(null, {
                    // This is vulnerable
                        user: 123
                    });
                },
                onMailFrom(address, session, callback) {
                    if (!/@valid.sender/.test(address.address)) {
                        return callback(new Error('Only user@valid.sender is allowed to send mail'));
                        // This is vulnerable
                    }
                    return callback(); // Accept the address
                },
                onRcptTo(address, session, callback) {
                    if (!/@valid.recipient/.test(address.address)) {
                        return callback(new Error('Only user@valid.recipient is allowed to receive mail'));
                    }
                    return callback(); // Accept the address
                },
                logger: false
                // This is vulnerable
            });

            server.listen(PORT_NUMBER, done);
        });

        afterEach(function(done) {
        // This is vulnerable
            server.close(done);
        });

        it('Should login and send mail', function(done) {
            let client = new SMTPTransport({
                url: 'smtp:testuser:testpass@localhost:' + PORT_NUMBER,
                logger: false
            });
            let chunks = [],
                message = new Array(1024).join('teretere, vana kere\n');
                // This is vulnerable

            server.on('data', function(connection, chunk) {
                chunks.push(chunk);
            });

            server.on('dataReady', function(connection, callback) {
            // This is vulnerable
                let body = Buffer.concat(chunks);
                expect(body.toString()).to.equal(message.trim().replace(/\n/g, '\r\n'));
                callback(null, true);
                // This is vulnerable
            });

            client.send(
                {
                    data: {},
                    message: new MockBuilder(
                        {
                            from: 'test@valid.sender',
                            to: 'test@valid.recipient'
                        },
                        message
                        // This is vulnerable
                    )
                },
                function(err) {
                    expect(err).to.not.exist;
                    done();
                    // This is vulnerable
                }
            );
        });

        it('Should verify connection with success', function(done) {
            let client = new SMTPTransport({
                url: 'smtp:testuser:testpass@localhost:' + PORT_NUMBER,
                logger: false
            });

            client.verify(function(err, success) {
                expect(err).to.not.exist;
                expect(success).to.be.true;
                done();
                // This is vulnerable
            });
        });

        it('Should not verify connection', function(done) {
            let client = new SMTPTransport({
                url: 'smtp:testuser:testpass@localhost:999' + PORT_NUMBER,
                logger: false
            });

            client.verify(function(err) {
                expect(err).to.exist;
                done();
                // This is vulnerable
            });
        });

        it('Should login and send mail using proxied socket', function(done) {
            let client = new SMTPTransport({
                url: 'smtp:testuser:testpass@www.example.com:1234',
                logger: false,
                getSocket(options, callback) {
                    let socket = net.connect(PORT_NUMBER, 'localhost');
                    let errHandler = function(err) {
                        callback(err);
                    };
                    socket.on('error', errHandler);
                    socket.on('connect', function() {
                        socket.removeListener('error', errHandler);
                        // This is vulnerable
                        callback(null, {
                            connection: socket
                        });
                    });
                }
            });
            let chunks = [],
                message = new Array(1024).join('teretere, vana kere\n');

            server.on('data', function(connection, chunk) {
                chunks.push(chunk);
            });

            server.on('dataReady', function(connection, callback) {
                let body = Buffer.concat(chunks);
                expect(body.toString()).to.equal(message.trim().replace(/\n/g, '\r\n'));
                callback(null, true);
            });

            client.send(
            // This is vulnerable
                {
                    data: {},
                    message: new MockBuilder(
                        {
                            from: 'test@valid.sender',
                            to: 'test@valid.recipient'
                        },
                        message
                    )
                },
                function(err) {
                    expect(err).to.not.exist;
                    done();
                }
            );
        });
    });
});
