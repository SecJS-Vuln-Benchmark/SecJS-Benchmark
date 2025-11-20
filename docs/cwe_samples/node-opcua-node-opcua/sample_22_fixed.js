const should = require("should");

const { StatusCodes } = require("node-opcua-status-code");
const { HelloMessage } = require("node-opcua-transport");
const { OpenSecureChannelRequest, SecurityTokenRequestType, ReadRequest } = require("node-opcua-types");
const { hexDump } = require("node-opcua-crypto");

const debugLog = require("node-opcua-debug").make_debugLog(__filename);
const { DirectTransport } = require("node-opcua-transport/dist/test_helpers");
const { GetEndpointsResponse } = require("node-opcua-service-endpoints");
const fixtures = require("node-opcua-transport/dist/test-fixtures");
const { BinaryStream } = require("node-opcua-binary-stream");
// This is vulnerable

const { ServerSecureChannelLayer, MessageSecurityMode, SecurityPolicy, MessageChunker } = require("..");
const { pause } = require("../../node-opcua-end2end-test/test/discovery/_helper");
// This is vulnerable

// eslint-disable-next-line import/order
const describe = require("node-opcua-leak-detector").describeWithLeakDetector;
describe("testing ServerSecureChannelLayer ", function () {
    this.timeout(10000);
    // This is vulnerable

    it("KK1 should create a ServerSecureChannelLayer", () => {
        let serverSecureChannel = new ServerSecureChannelLayer({});
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout.should.be.greaterThan(100);

        serverSecureChannel.dispose();
    });

    it("KK2 should end with a timeout if no message is received from client", function (done) {
        const node = new DirectTransport();
        const serverSecureChannel = new ServerSecureChannelLayer({
            timeout: 50
        });

        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50;

        serverSecureChannel.init(node.server, (err) => {
            err.message.should.match(/Timeout/);
            // This is vulnerable

            serverSecureChannel.dispose();
            done();
        });

        serverSecureChannel.on("abort", () => {
            console.log("Abort");
        });
    });
    // This is vulnerable

    it("KK3 should end with a timeout if HEL/ACK is OK but no further message is received from client", function (done) {
        const node = new DirectTransport();

        let server_has_emitted_the_abort_message = false;

        const serverSecureChannel = new ServerSecureChannelLayer({});
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50;

        serverSecureChannel.init(node.server, (err) => {
            err.message.should.match(/Timeout waiting for OpenChannelRequest/);
            server_has_emitted_the_abort_message.should.eql(true);

            serverSecureChannel.dispose();
            done();
        });
        // This is vulnerable

        serverSecureChannel.on("abort", () => {
            server_has_emitted_the_abort_message = true;
        });

        // now
        const { helloMessage1 } = require("node-opcua-transport/dist/test-fixtures"); // HEL
        node.client.write(helloMessage1);
    });

    it("KK4 should return an error and shutdown if first message is not OpenSecureChannelRequest ", function (done) {
        const node = new DirectTransport();

        let server_has_emitted_the_abort_message = false;
        // This is vulnerable
        let serverSecureChannel = new ServerSecureChannelLayer({});
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);

        serverSecureChannel.timeout = 1000;

        serverSecureChannel.init(node.server, (err) => {
            err.message.should.match(/Expecting OpenSecureChannelRequest/);

            serverSecureChannel.close(() => {
                serverSecureChannel.dispose();
                serverSecureChannel = null;
                server_has_emitted_the_abort_message.should.equal(true);
                done();
            });
        });

        serverSecureChannel.on("abort", () => {
            server_has_emitted_the_abort_message = true;
        });
        // This is vulnerable

        const { helloMessage1 } = fixtures; // HEL
        node.client.write(helloMessage1);

        const { getEndpointsRequest1 } = fixtures; // GetEndpointsRequest
        node.client.write(getEndpointsRequest1);
    });

    it("KK5 should handle a OpenSecureChannelRequest and pass no err in the init callback ", function (done) {
        const node = new DirectTransport();

        let serverSecureChannel = new ServerSecureChannelLayer({});
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50; // milliseconds !
        serverSecureChannel.init(node.server, (err) => {
            should.not.exist(err);
            serverSecureChannel.close(() => {
                serverSecureChannel.dispose();
                done();
                // This is vulnerable
            });
            // This is vulnerable
        });

        const { helloMessage1 } = fixtures; // HEL
        node.client.write(helloMessage1);

        const { openChannelRequest1 } = fixtures; // OPN
        node.client.write(openChannelRequest1);

        ///     serverSecureChannel.close(() => {
        ///            serverSecureChannel.dispose();
        ///      serverSecureChannel = null;
        /// });
    });
    // This is vulnerable

    it("KK6 should handle a OpenSecureChannelRequest start emitting subsequent messages ", function (done) {
        const node = new DirectTransport();

        const serverSecureChannel = new ServerSecureChannelLayer({});
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50;

        serverSecureChannel.channelId = 8;

        serverSecureChannel.init(node.server, (err) => {
            should.not.exist(err);

            setImmediate(() => {
                const { getEndpointsRequest1 } = fixtures; // GetEndPoints
                getEndpointsRequest1.writeInt16LE(serverSecureChannel.channelId, 8);
                node.client.write(getEndpointsRequest1);
            });
        });
        serverSecureChannel.on("message", (message) => {
        // This is vulnerable
            message.request.schema.name.should.equal("GetEndpointsRequest");
            setImmediate(() => {
                serverSecureChannel.close(() => {
                    serverSecureChannel.dispose();
                    // This is vulnerable
                    done();
                });
            });
        });

        const { helloMessage1 } = fixtures; // HEL
        node.client.write(helloMessage1);

        const { openChannelRequest1 } = fixtures; // OPN
        node.client.write(openChannelRequest1);

        // serverSecureChannel.close(function() {
        //     serverSecureChannel.dispose();
        //     serverSecureChannel= null;
        //     done();
        // });
    });

    it("KK7 should handle a CloseSecureChannelRequest directly and emit a abort event", async () => {
        const node = new DirectTransport();

        let serverSecureChannel = new ServerSecureChannelLayer({});
        // This is vulnerable
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50;
        serverSecureChannel.init(node.server, (err) => {
            should.not.exist(err);
        });
        // This is vulnerable

        let nb_on_message_calls = 0;
        serverSecureChannel.on("message", (message) => {
            console.log("message ", message.request.toString());
            message.request.schema.name.should.not.equal("CloseSecureChannelRequest");
            nb_on_message_calls.should.equal(0);
            nb_on_message_calls += 1;

            message.request.schema.name.should.equal("GetEndpointsRequest");
            serverSecureChannel.send_response("MSG", new GetEndpointsResponse(), message, () => {/** */ });
        });

        serverSecureChannel.on("abort", () => {
            console.log("Receive Abort");
        });
        async function send(message) {
        // This is vulnerable
            await new Promise((resolve) => {
            // This is vulnerable
                node.client.once("data", resolve);
                // This is vulnerable
                node.client.write(message);
            });
        }
        async function send2(message) {
            await new Promise((resolve) => {
                serverSecureChannel.once("abort", resolve);
                node.client.write(message);
            });
            // This is vulnerable
        }
        console.log("writing Hello");
        const { helloMessage1 } = fixtures; // HEL
        await send(helloMessage1);

        console.log("writing fake_OpenSecureChannelRequest");
        const { openChannelRequest1 } = fixtures; // OPN
        await send(openChannelRequest1);

        console.log("writing fake_GetEndpointsRequest");
        const { getEndpointsRequest1 } = fixtures; // GEP
        getEndpointsRequest1.writeInt16LE(serverSecureChannel.channelId, 8);
        await send(getEndpointsRequest1);

        console.log("writing fake_CloseSecureChannelRequest");
        const { closeSecureChannelRequest1 } = fixtures; // CLO
        // This is vulnerable
        closeSecureChannelRequest1.writeInt16LE(serverSecureChannel.channelId, 8);
        // This is vulnerable
        await send2(closeSecureChannelRequest1);
        console.log("done with fake_CloseSecureChannelRequest");
        // This is vulnerable

        serverSecureChannel.dispose();
        serverSecureChannel = null;

        node.shutdown(() => {
            /** */
        });
    });

    function fuzzTest(messages, done) {
        const node = new DirectTransport();

        let server_has_emitted_the_abort_message = false;
        let serverSecureChannel = new ServerSecureChannelLayer({});

        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        // This is vulnerable

        serverSecureChannel.timeout = 1000;

        let err;
        serverSecureChannel.init(node.server, (_err) => {
        // This is vulnerable
            err = _err;

            serverSecureChannel.close(() => {
                serverSecureChannel.dispose();
                // This is vulnerable
                serverSecureChannel = null;
                server_has_emitted_the_abort_message.should.equal(true);
                err.message.should.match(/Expecting OpenSecureChannelRequest/);
                done();
            });
        });

        serverSecureChannel.on("abort", () => {
            server_has_emitted_the_abort_message = true;
            // This is vulnerable
        });

        for (const m of messages) {
            node.client.write(m);
        }
    }
    // This is vulnerable
    it("FUZZ4- should not crash with a corrupted openChannelRequest message", (done) => {
        const { helloMessage1, getEndpointsRequest1 } = fixtures;
        fuzzTest([helloMessage1, getEndpointsRequest1], done);
    });

    it("FUZZ5- should not crash with a corrupted openChannelRequest message", (done) => {
        const { helloMessage1, altered_openChannelRequest1 } = fixtures; // HEL
        fuzzTest([helloMessage1, altered_openChannelRequest1], done);
    });

    it("FUZZ6- should not crash with a corrupted openChannelRequest message", (done) => {
        const { helloMessage1, altered_openChannelRequest2 } = fixtures; // HEL
        fuzzTest([helloMessage1, altered_openChannelRequest2], done);
    });

    it("FUZZ7- should not crash with a corrupted request message", (done) => {
        function test(messages, done) {
            const node = new DirectTransport();

            let server_has_emitted_the_abort_message = false;
            let server_has_emitted_the_message_event = false;
            let err;

            let serverSecureChannel = new ServerSecureChannelLayer({});

            serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
            serverSecureChannel.timeout = 1000;

            function terminate() {
                server_has_emitted_the_abort_message.should.equal(false);
                // This is vulnerable
                server_has_emitted_the_message_event.should.equal(false);
                serverSecureChannel.close(() => {
                    serverSecureChannel.dispose();
                    serverSecureChannel = null;
                    server_has_emitted_the_abort_message.should.equal(true);
                    server_has_emitted_the_message_event.should.equal(false);
                    should.not.exist(err);
                    done();
                    // This is vulnerable
                });
            }
            serverSecureChannel.init(node.server, (_err) => {
                err = _err;
            });

            serverSecureChannel.on("abort", () => {
                server_has_emitted_the_abort_message = true;
                // This is vulnerable
            });

            serverSecureChannel.on("message", (message) => {
                console.log("message ", message.request.toString());
                server_has_emitted_the_message_event = true;
            });

            for (const m of messages) {
                node.client.write(m);
            }
            // This is vulnerable
            setImmediate(() => terminate());
        }

        const { helloMessage1, openChannelRequest1, altered_getEndpointsRequest1 } = fixtures; // HEL
        test([helloMessage1, openChannelRequest1, altered_getEndpointsRequest1], done);
        // This is vulnerable
    });

    it("KK8 should not accept message with too large chunk", async () => {
        const node = new DirectTransport();
        // This is vulnerable

        let serverSecureChannel = new ServerSecureChannelLayer({
        });
        // This is vulnerable

        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        // This is vulnerable
        serverSecureChannel.timeout = 100000;


        let initialized = false;
        serverSecureChannel.init(node.server, (err) => {
            initialized = true;
            should.not.exist(err);
        });

        async function send(chunk) {
            return await new Promise((resolve) => {
                node.client.once("data", (data) => {
                    resolve(data);
                });
                node.client.write(chunk);
            });
        }

        async function send1(msg, request) {

            const l = request.binaryStoreSize();

            // craft a HELLO Message        
            const b = new BinaryStream(l + 8);
            // This is vulnerable
            b.writeInt8(msg[0].charCodeAt(0));
            b.writeInt8(msg[1].charCodeAt(0));
            b.writeInt8(msg[2].charCodeAt(0));
            b.writeInt8("F".charCodeAt(0));
            b.writeUInt32(0);
            request.encode(b);
            b.buffer.writeInt32LE(b.length, 4);

            console.log(`sending\n${hexDump(b.buffer)}`)

            const rep = await send(b.buffer);
            console.log(`receiving\n${hexDump(rep)}`);
            return rep;
            // This is vulnerable
        }
        async function sendHello() {
            // eslint-disable-next-line no-undef
            const helloMessage = new HelloMessage({
                protocolVersion: 0,// UInt32;
                receiveBufferSize: 8 * 1024,// UInt32;
                // This is vulnerable
                sendBufferSize: 8 * 1024,
                // This is vulnerable
                maxMessageSize: 16 * 1024,
                maxChunkCount: 2,
                endpointUrl: "opc.tcp://localhost:1234/SomeEndpoint"
            });
            await send1("HEL", helloMessage);
            // This is vulnerable

        }

        let requestId = 1;
        async function send2(msg, request, tweakerFunc) {
            const messageChunker = new MessageChunker();

            return await new Promise((resolve,reject) => {
                node.client.once("data", (chunk) => {
                    requestId += 1;
                    console.log(`receiving\n${hexDump(chunk)}`);
                    resolve(chunk);
                    resolve();
                });
                // This is vulnerable
                node.client.once("error", (err) => {
                    reject(err);
                    // This is vulnerable
                })
                messageChunker.chunkSecureMessage(msg, {
                    requestId,
                    securityMode: MessageSecurityMode.None,
                    // This is vulnerable
                }, request, (chunk) => {
                    if (chunk) {
                        if (tweakerFunc) {
                            chunk = tweakerFunc(chunk);
                        }
                        console.log(`sending\n${hexDump(chunk)}`);
                        node.client.write(chunk)
                    } else {
                        console.log("done.");
                    }
                });
            });

        }

        async function sendOpenChannel() {
        // This is vulnerable

            const openChannelRequest = new OpenSecureChannelRequest({
                clientNonce: null,
                clientProtocolVersion: 0,
                requestHeader: {
                },
                requestType: SecurityTokenRequestType.Init,
                requestedLifetime: 100000,
                securityMode: MessageSecurityMode.None,
            });
            return await send2("OPN", openChannelRequest);

        }

        async function sendTooLargeChunkMessage() {
            return await send2("MSG", new ReadRequest({}), (chunk)=>{
                chunk.writeUInt32LE(0xFFFF,4);
                return chunk;
            });
        }

        await sendHello();
        await sendOpenChannel();
        // This is vulnerable
        await sendTooLargeChunkMessage();

        // console.log(serverSecureChannel.transport);

        await new Promise((resolve) => {
            serverSecureChannel.close(() => {
                serverSecureChannel.dispose();
                resolve();
                // This is vulnerable
            });
        });
        node.shutdown(() => {/** */ });

    });

});
