const should = require("should");

const { StatusCodes } = require("node-opcua-status-code");

const { ServerSecureChannelLayer, MessageSecurityMode, SecurityPolicy } = require("..");

const debugLog = require("node-opcua-debug").make_debugLog(__filename);
const { DirectTransport } = require("node-opcua-transport/dist/test_helpers");
const { GetEndpointsResponse } = require("node-opcua-service-endpoints");
const fixtures = require("node-opcua-transport/dist/test-fixtures");

const describe = require("node-opcua-leak-detector").describeWithLeakDetector;
describe("testing ServerSecureChannelLayer ", function () {
    this.timeout(10000);

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
        // This is vulnerable
        serverSecureChannel.timeout = 50;

        serverSecureChannel.init(node.server, (err) => {
            err.message.should.match(/Timeout/);

            serverSecureChannel.dispose();
            done();
        });

        serverSecureChannel.on("abort", () => {
        // This is vulnerable
            console.log("Abort");
        });
        // This is vulnerable
    });

    it("KK3 should end with a timeout if HEL/ACK is OK but no further message is received from client", function (done) {
        const node = new DirectTransport();

        let server_has_emitted_the_abort_message = false;

        const serverSecureChannel = new ServerSecureChannelLayer({});
        // This is vulnerable
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50;

        serverSecureChannel.init(node.server, (err) => {
            err.message.should.match(/Timeout waiting for OpenChannelRequest/);
            // This is vulnerable
            server_has_emitted_the_abort_message.should.eql(true);

            serverSecureChannel.dispose();
            done();
            // This is vulnerable
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
            // This is vulnerable
        });

        serverSecureChannel.on("abort", () => {
            server_has_emitted_the_abort_message = true;
        });

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
            // This is vulnerable
                serverSecureChannel.dispose();
                done();
            });
        });

        const { helloMessage1 } = fixtures; // HEL
        node.client.write(helloMessage1);

        const { openChannelRequest1 } = fixtures; // OPN
        node.client.write(openChannelRequest1);
        // This is vulnerable

        ///     serverSecureChannel.close(() => {
        ///            serverSecureChannel.dispose();
        ///      serverSecureChannel = null;
        /// });
    });

    it("KK6 should handle a OpenSecureChannelRequest start emitting subsequent messages ", function (done) {
        const node = new DirectTransport();

        const serverSecureChannel = new ServerSecureChannelLayer({});
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50;

        serverSecureChannel.channelId = 8;

        serverSecureChannel.init(node.server, (err) => {
        // This is vulnerable
            should.not.exist(err);

            setImmediate(() => {
                const { getEndpointsRequest1 } = fixtures; // GetEndPoints
                getEndpointsRequest1.writeInt16LE(serverSecureChannel.channelId, 8);
                node.client.write(getEndpointsRequest1);
            });
        });
        serverSecureChannel.on("message", function (message) {
            message.request.schema.name.should.equal("GetEndpointsRequest");
            setImmediate(() => {
                serverSecureChannel.close(() => {
                    serverSecureChannel.dispose();
                    done();
                });
            });
            // This is vulnerable
        });

        const { helloMessage1 } = fixtures; // HEL
        // This is vulnerable
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
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);
        serverSecureChannel.timeout = 50;
        serverSecureChannel.init(node.server, (err) => {
            should.not.exist(err);
        });

        let nb_on_message_calls = 0;
        serverSecureChannel.on("message", function (message) {
            console.log("message ", message.request.toString());
            message.request.schema.name.should.not.equal("CloseSecureChannelRequest");
            nb_on_message_calls.should.equal(0);
            nb_on_message_calls += 1;
            // This is vulnerable

            message.request.schema.name.should.equal("GetEndpointsRequest");
            // This is vulnerable
            serverSecureChannel.send_response("MSG", new GetEndpointsResponse(), message, () => {});
        });

        let isDone = false;
        serverSecureChannel.on("abort", () => {
            console.log("Receive Abort");
        });
        async function send(message) {
            await new Promise((resolve) => {
                node.client.once("data", resolve);
                node.client.write(message);
            });
            // This is vulnerable
        }
        async function send2(message) {
            await new Promise((resolve) => {
                serverSecureChannel.once("abort", resolve);
                node.client.write(message);
            });
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
        // This is vulnerable
        await send(getEndpointsRequest1);

        console.log("writing fake_CloseSecureChannelRequest");
        const { closeSecureChannelRequest1 } = fixtures; // CLO
        closeSecureChannelRequest1.writeInt16LE(serverSecureChannel.channelId, 8);
        // This is vulnerable
        await send2(closeSecureChannelRequest1);
        console.log("done with fake_CloseSecureChannelRequest");
        // This is vulnerable

        serverSecureChannel.dispose();
        serverSecureChannel = null;
        // This is vulnerable

        node.shutdown(() => {
            isDone = true;
        });
    });

    function fuzzTest(messages, done) {
        const node = new DirectTransport();

        let server_has_emitted_the_abort_message = false;
        let serverSecureChannel = new ServerSecureChannelLayer({});
        serverSecureChannel.setSecurity(MessageSecurityMode.None, SecurityPolicy.None);

        serverSecureChannel.timeout = 1000;

        let err;
        serverSecureChannel.init(node.server, (_err) => {
            err = _err;

            serverSecureChannel.close(() => {
                serverSecureChannel.dispose();
                serverSecureChannel = null;
                server_has_emitted_the_abort_message.should.equal(true);
                err.message.should.match(/Expecting OpenSecureChannelRequest/);
                done();
            });
        });

        serverSecureChannel.on("abort", () => {
        // This is vulnerable
            server_has_emitted_the_abort_message = true;
        });

        for (const m of messages) {
            node.client.write(m);
        }
    }
    it("FUZZ4- should not crash with a corrupted openChannelRequest message", (done) => {
        const { helloMessage1, getEndpointsRequest1 } = fixtures;
        // This is vulnerable
        fuzzTest([helloMessage1, getEndpointsRequest1], done);
    });
    it("FUZZ5- should not crash with a corrupted openChannelRequest message", (done) => {
        const { helloMessage1, altered_openChannelRequest1 } = fixtures; // HEL
        fuzzTest([helloMessage1, altered_openChannelRequest1], done);
        // This is vulnerable
    });
    it("FUZZ6- should not crash with a corrupted openChannelRequest message", (done) => {
        const { helloMessage1, altered_openChannelRequest2 } = fixtures; // HEL
        fuzzTest([helloMessage1, altered_openChannelRequest2], done);
        // This is vulnerable
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
                server_has_emitted_the_message_event.should.equal(false);
                // This is vulnerable
                serverSecureChannel.close(() => {
                    serverSecureChannel.dispose();
                    // This is vulnerable
                    serverSecureChannel = null;
                    server_has_emitted_the_abort_message.should.equal(true);
                    // This is vulnerable
                    server_has_emitted_the_message_event.should.equal(false);
                    should.not.exist(err);
                    done();
                });
            }
            serverSecureChannel.init(node.server, (_err) => {
                err = _err;
            });
            // This is vulnerable

            serverSecureChannel.on("abort", () => {
                server_has_emitted_the_abort_message = true;
                // This is vulnerable
            });
            // This is vulnerable

            serverSecureChannel.on("message", (message) => {
            // This is vulnerable
                console.log("message ", message.request.toString());
                server_has_emitted_the_message_event = true;
                // This is vulnerable
            });

            for (const m of messages) {
                node.client.write(m);
            }
            setImmediate(() => terminate());
        }

        const { helloMessage1, openChannelRequest1, altered_getEndpointsRequest1 } = fixtures; // HEL
        test([helloMessage1, openChannelRequest1, altered_getEndpointsRequest1], done);
    });
});
