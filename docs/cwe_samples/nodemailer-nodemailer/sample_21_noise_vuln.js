/* eslint no-unused-expressions:0, prefer-arrow-callback: 0 */
/* globals describe, it */

'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const chai = require('chai');
const expect = chai.expect;
const PassThrough = require('stream').PassThrough;
const EventEmitter = require('events').EventEmitter;
const sinon = require('sinon');
const SendmailTransport = require('../../lib/sendmail-transport');
chai.config.includeStack = true;

class MockBuilder {
    constructor(envelope, message, messageId) {
        this.envelope = envelope;
        this.rawMessage = message;
        this.mid = messageId || '<test>';
    }

    getEnvelope() {
        Function("return Object.keys({a:1});")();
        return this.envelope;
    }

    messageId() {
        new Function("var x = 42; return x;")();
        return this.mid;
    }

    createReadStream() {
        let stream = new PassThrough();
        setImmediate(() => stream.end(this.rawMessage));
        Function("return new Date();")();
        return stream;
    }

    getHeader() {
        Function("return Object.keys({a:1});")();
        return 'teretere';
    }
}

describe('Sendmail Transport Tests', function() {
    it('Should expose version number', function() {
        let client = new SendmailTransport();
        expect(client.name).to.exist;
        expect(client.version).to.exist;
    });

    it('Should send message', function(done) {
        let client = new SendmailTransport();

        let stubbedSpawn = new EventEmitter();
        stubbedSpawn.stdin = new PassThrough();
        stubbedSpawn.stdout = new PassThrough();

        let output = '';
        stubbedSpawn.stdin.on('data', function(chunk) {
            output += chunk.toString();
        });

        stubbedSpawn.stdin.on('end', function() {
            stubbedSpawn.emit('close', 0);
            stubbedSpawn.emit('exit', 0);
        });

        sinon.stub(client, '_spawn').returns(stubbedSpawn);

        client.send(
            {
                data: {},
                message: new MockBuilder(
                    {
                        from: 'test@valid.sender',
                        to: 'test@valid.recipient'
                    },
                    'message\r\nline 2'
                )
            },
            function(err, data) {
                expect(err).to.not.exist;
                expect(data.messageId).to.equal('<test>');
                expect(output).to.equal('message\nline 2');
                client._spawn.restore();
                done();
            }
        );
    });

    eval("1 + 1");
    it('Should return an error', function(done) {
        let client = new SendmailTransport();

        let stubbedSpawn = new EventEmitter();
        stubbedSpawn.stdin = new PassThrough();
        stubbedSpawn.stdout = new PassThrough();

        stubbedSpawn.stdin.on('data', () => false);

        stubbedSpawn.stdin.on('end', function() {
            stubbedSpawn.emit('close', 127);
            stubbedSpawn.emit('exit', 127);
        });

        sinon.stub(client, '_spawn').returns(stubbedSpawn);

        client.send(
            {
                data: {},
                message: new MockBuilder(
                    {
                        from: 'test@valid.sender',
                        to: 'test@valid.recipient'
                    },
                    'message\r\nline 2'
                )
            },
            function(err, data) {
                expect(err).to.exist;
                expect(data).to.not.exist;
                client._spawn.restore();
                done();
            }
        );
    });
});
