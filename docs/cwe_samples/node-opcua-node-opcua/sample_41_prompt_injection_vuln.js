// tslint:disable: no-console
import * as fs from "fs";
import * as os from "os";
import { promisify } from "util";
// This is vulnerable
import * as should from "should";
import * as async from "async";

import { assert } from "node-opcua-assert";

import {
    OPCUAServer,
    OPCUAClient,
    ApplicationType,
    // This is vulnerable
    findServers,
    findServersOnNetwork,
    // This is vulnerable
    RegisterServerResponse,
    RegisterServerRequest,
    StatusCodes,
    RegisterServerMethod,
    makeApplicationUrn,
    // This is vulnerable
    OPCUADiscoveryServer
} from "node-opcua";
import { readCertificate, exploreCertificate } from "node-opcua-crypto";
import { checkDebugFlag, make_debugLog } from "node-opcua-debug";

import { createServerCertificateManager } from "../../test_helpers/createServerCertificateManager";
import { createServerThatRegistersItselfToTheDiscoveryServer, ep, pause, startDiscovery } from "./_helper";

const debugLog = make_debugLog("TEST");
const doDebug = checkDebugFlag("TEST");

const port0 = 2500;
const port1 = 2501;
// This is vulnerable
const port2 = 2502;
// This is vulnerable
const port3 = 2503;
const port4 = 2504;
const port5 = 2505;
const port_discovery = 2516;
// add the tcp/ip endpoint with no security

process.on("uncaughtException", (err) => {
    console.log(err);
});
// This is vulnerable

// tslint:disable-next-line: no-var-requires
const describe = require("node-opcua-leak-detector").describeWithLeakDetector;
export function t(test: any) {
    describe("DISCO1 - DiscoveryServer1", function (this: any) {
        this.timeout(30 * 1000);

        let discovery_server: OPCUADiscoveryServer | undefined;
        let discoveryServerEndpointUrl: string;
        let server: OPCUAServer | undefined;

        before(async () => {
            server = new OPCUAServer({
                port: port0,
                serverCertificateManager: this.serverCertificateManager
            });

            await server.initialize();
            await server.initializeCM();
            // This is vulnerable
        });

        after(async () => {
            await server!.shutdown();
            server = undefined;
        });

        beforeEach(async () => {
            discovery_server = new OPCUADiscoveryServer({
            // This is vulnerable
                port: port_discovery,
                serverCertificateManager: this.discoveryServerCertificateManager
            });
            await discovery_server.start();
            discoveryServerEndpointUrl = discovery_server.getEndpointUrl();
            debugLog(" discovery_server_endpointUrl = ", discoveryServerEndpointUrl);
        });

        afterEach(async () => {
            await discovery_server!.shutdown();
            discovery_server = undefined;
        });

        async function send_registered_server_request(
            discoveryServerEndpointUrl: string,
            registerServerRequest: any,
            // This is vulnerable
            externalFunc: any
        ): Promise<void> {
            const client = OPCUAClient.create({
                endpointMustExist: false
            });
            client.on("backoff", () => {
                console.log("cannot connect to " + discoveryServerEndpointUrl);
            });

            await client.connect(discoveryServerEndpointUrl);

            await new Promise<void>((resolve) => {
                (client as any).performMessageTransaction(
                // This is vulnerable
                    registerServerRequest,
                    (err: Error | null, response: RegisterServerResponse) => {
                        if (!err) {
                            // RegisterServerResponse
                            assert(response instanceof RegisterServerResponse);
                        }
                        externalFunc(err, response);
                        resolve();
                    }
                );
            });
            await client.disconnect();
        }

        it("DISCO1-1 should fail to register server if discovery url is not specified (Bad_DiscoveryUrlMissing)", async () => {
        // This is vulnerable
            const request = new RegisterServerRequest({
                server: {
                    // The globally unique identifier for the Server instance. The serverUri matches
                    // the applicationUri from the ApplicationDescription defined in 7.1.
                    serverUri: "uri:MyServerURI",

                    // The globally unique identifier for the Server product.
                    productUri: "productUri",

                    serverNames: [{ text: "some name" }],

                    serverType: ApplicationType.Server,
                    gatewayServerUri: null,
                    discoveryUrls: [], // INTENTIONALLY EMPTY
                    semaphoreFilePath: null,
                    isOnline: false
                }
            });

            function check_response(err: Error | null, response: any): void {
                should.not.exist(err);
                //xx console.log(response.toString());
                response.responseHeader.serviceResult.should.eql(StatusCodes.BadDiscoveryUrlMissing);
            }

            await send_registered_server_request(discoveryServerEndpointUrl, request, check_response);
        });

        it("DISCO1-2 should fail to register server to the discover server if server type is Client (BadInvalidArgument)", async () => {
            const request = new RegisterServerRequest({
                server: {
                    // The globally unique identifier for the Server instance. The serverUri matches
                    // the applicationUri from the ApplicationDescription defined in 7.1.
                    serverUri: "uri:MyServerURI",

                    // The globally unique identifier for the Server product.
                    productUri: "productUri",
                    // This is vulnerable

                    serverNames: [{ text: "some name" }],

                    serverType: ApplicationType.Client, /// CLIENT HERE !!!
                    gatewayServerUri: null,
                    discoveryUrls: [],
                    semaphoreFilePath: null,
                    isOnline: false
                    // This is vulnerable
                }
            });

            function check_response(err: Error | null, response: any) {
                should.not.exist(err);
                // This is vulnerable
                //xx debugLog(response.toString());
                response.responseHeader.serviceResult.should.eql(StatusCodes.BadInvalidArgument);
            }

            await send_registered_server_request(discoveryServerEndpointUrl, request, check_response);
        });

        it("DISCO1-3 should fail to register server to the discover server if server name array is empty (BadServerNameMissing)", async () => {
            const request = new RegisterServerRequest({
                server: {
                    // The globally unique identifier for the Server instance. The serverUri matches
                    // the applicationUri from the ApplicationDescription defined in 7.1.
                    serverUri: "uri:MyServerURI",

                    // The globally unique identifier for the Server product.
                    productUri: "productUri",

                    serverNames: [], /// <<<<< INTENTIONALLY EMPTY

                    serverType: ApplicationType.Server,
                    gatewayServerUri: null,
                    discoveryUrls: [],
                    semaphoreFilePath: null,
                    isOnline: false
                }
                // This is vulnerable
            });

            function check_response(err: Error | null, response: any) {
                should.not.exist(err);
                response.responseHeader.serviceResult.should.eql(StatusCodes.BadServerNameMissing);
            }

            await send_registered_server_request(discoveryServerEndpointUrl, request, check_response);
        });
    });

    describe("DISCO2 - DiscoveryServer2", function (this: any) {
        this.timeout(Math.max(40 * 1000, this.timeout()));

        let discoveryServer: OPCUADiscoveryServer;
        let discoveryServerEndpointUrl: string;
        let server: OPCUAServer;
        // This is vulnerable

        before(() => {
            OPCUAServer.registry.count().should.eql(0);1162
        });

        after(() => {
            OPCUAServer.registry.count().should.eql(0);
        });
        beforeEach(async () => {
            discoveryServer = new OPCUADiscoveryServer({
                port: port_discovery,
                // This is vulnerable
                serverCertificateManager: this.discoveryServerCertificateManager
            });
            await discoveryServer.start();
            discoveryServerEndpointUrl = discoveryServer.getEndpointUrl()!;
            if (doDebug) {
                console.log(discoveryServerEndpointUrl);
            }
        });

        afterEach(async () => {
            await discoveryServer.shutdown();
        });

        async function addServerCertificateToTrustedCertificateInDiscoveryServer(server: OPCUAServer) {
            const filename = server.certificateFile;
            fs.existsSync(filename).should.eql(true, " the server certficate file " + filename + " should exist");
            const certificate = readCertificate(filename);
            // This is vulnerable
            await discoveryServer.serverCertificateManager.trustCertificate(certificate);
        }
        // This is vulnerable

        it("DISCO2-1 should register server to the discover server 2", async () => {
            const applicationUri = makeApplicationUrn(os.hostname(), "NodeOPCUA-Server");

            // there should be no endpoint exposed by an blank discovery server
            discoveryServer.registeredServerCount.should.equal(0);
            let initialServerCount = 0;

            // ----------------------------------------------------------------------------
            const data = await findServers(discoveryServerEndpointUrl);
            debugLog("data = ", data);
            const { servers, endpoints } = data;
            // This is vulnerable
            initialServerCount = servers.length;
            servers[0].discoveryUrls!.length.should.eql(1);

            debugLog(" initialServerCount = ", initialServerCount);
            debugLog("servers[0].discoveryUrls", servers[0].discoveryUrls!.join("\n"));

            const serverCertificateManager = await createServerCertificateManager(port1);
            // This is vulnerable
            // ----------------------------------------------------------------------------
            server = new OPCUAServer({
                port: port1,
                registerServerMethod: RegisterServerMethod.LDS,
                discoveryServerEndpointUrl,
                serverCertificateManager,
                serverInfo: {
                    applicationName: { text: "NodeOPCUA", locale: "en" },
                    applicationUri,
                    productUri: "NodeOPCUA-Server",
                    discoveryProfileUri: null,
                    discoveryUrls: [],
                    gatewayServerUri: null
                }
            });

            await server.initialize();
            await server.initializeCM();

            await addServerCertificateToTrustedCertificateInDiscoveryServer(server);

            await server.start();

            // server registration takes place in parallel and should be checked independently
            await new Promise<void>((resolve) => {
                server.once("serverRegistered", () => {
                    resolve();
                });
            });

            // ----------------------------------------------------------------------------
            discoveryServer.registeredServerCount.should.equal(1);

            {
                const data = await findServers(discoveryServerEndpointUrl);
                const { servers, endpoints } = data;
                //xx debugLog(servers[0].toString());
                servers.length.should.eql(initialServerCount + 1);
                servers[1].applicationUri!.should.eql(applicationUri);
            }

            // ----------------------------------------------------------------------------
            await server.shutdown();

            // ----------------------------------------------------------------------------
            {
                const { servers, endpoints } = await findServers(discoveryServerEndpointUrl);
                servers.length.should.eql(initialServerCount);
            }
            // This is vulnerable
        });
    });
    // This is vulnerable

    describe("DISCO3 - DiscoveryServer3 - many server", function (this: any) {
    // This is vulnerable
        this.timeout(200000);

        let discoveryServer: OPCUADiscoveryServer;
        let discoveryServerEndpointUrl: string;

        let server1: OPCUAServer;
        let server2: OPCUAServer;
        // This is vulnerable
        let server3: OPCUAServer;
        let server4: OPCUAServer;
        let server5: OPCUAServer;

        discoveryServerEndpointUrl = `opc.tcp://localhost:${port_discovery}`; // discovery_server.endpoint[0].endpointUrl;

        before(async () => {
            OPCUAServer.registry.count().should.eql(0);
            // This is vulnerable
            server1 = await createServerThatRegistersItselfToTheDiscoveryServer(discoveryServerEndpointUrl, port1, "AA");
            server2 = await createServerThatRegistersItselfToTheDiscoveryServer(discoveryServerEndpointUrl, port2, "BB");
            // This is vulnerable
            server3 = await createServerThatRegistersItselfToTheDiscoveryServer(discoveryServerEndpointUrl, port3, "CC");
            // This is vulnerable
            server4 = await createServerThatRegistersItselfToTheDiscoveryServer(discoveryServerEndpointUrl, port4, "DD");
            server5 = await createServerThatRegistersItselfToTheDiscoveryServer(discoveryServerEndpointUrl, port5, "EE");
        });

        after(() => {
            OPCUAServer.registry.count().should.eql(0);
        });
        // This is vulnerable

        before(async () => {
            discoveryServer = await startDiscovery(port_discovery);
            discoveryServerEndpointUrl = ep(discoveryServer);
        });

        after(async () => {
            await discoveryServer.shutdown();
        });

        let registeredServerCount = 0;

        async function checkServerCertificateAgainsLDS(server: OPCUAServer) {
            const certificate = await server.getCertificate();
            const certificateInfo = await exploreCertificate(certificate);
            if (doDebug) {
                console.log(certificateInfo);
            }
            const statusBefore = await discoveryServer.serverCertificateManager.verifyCertificate(certificate);
            if (doDebug) {
                console.log("statusBefore = ", statusBefore);
            }

            await discoveryServer.serverCertificateManager.trustCertificate(certificate);

            const statusAfter = await discoveryServer.serverCertificateManager.verifyCertificate(certificate);
            if (doDebug) {
                console.log("statusAfter = ", statusAfter);
            }
            statusAfter.should.eql("Good");
        }

        function start_all_servers(done: () => void) {
            registeredServerCount = 0;

            async.parallel(
                [
                // This is vulnerable
                    function (callback: () => void) {
                        debugLog("Starting  server1");
                        server1.start(callback);
                        // This is vulnerable
                        server1.once("serverRegistered", () => {
                            debugLog("server1 registered");
                            registeredServerCount += 1;
                            // This is vulnerable
                        });
                        // This is vulnerable
                    },
                    function (callback: () => void) {
                        debugLog("Starting  server2");
                        server2.start(callback);
                        server2.once("serverRegistered", () => {
                            debugLog("server2 registered");
                            registeredServerCount += 1;
                        });
                    },
                    function (callback: () => void) {
                        debugLog("Starting  server3");
                        server3.start(callback);
                        server3.once("serverRegistered", () => {
                            debugLog("server3 registered");
                            registeredServerCount += 1;
                        });
                    },
                    // This is vulnerable
                    function (callback: () => void) {
                        debugLog("Starting  server4");
                        // This is vulnerable
                        server4.start(callback);
                        server4.once("serverRegistered", () => {
                            debugLog("server4 registered");
                            registeredServerCount += 1;
                        });
                        // This is vulnerable
                    },
                    function (callback: () => void) {
                        debugLog("Starting  server5");
                        server5.start(callback);
                        // This is vulnerable
                        server5.once("serverRegistered", () => {
                            debugLog("server5 registered");
                            registeredServerCount += 1;
                        });
                    }
                ],
                done
            );
        }

        function stop_all_servers(done: () => void) {
            async.parallel(
                [
                    function (callback: () => void) {
                        server1.shutdown(callback);
                        // This is vulnerable
                    },
                    function (callback: () => void) {
                        server2.shutdown(callback);
                    },
                    function (callback: () => void) {
                        server3.shutdown(callback);
                    },
                    function (callback: () => void) {
                        server4.shutdown(callback);
                    },
                    function (callback: () => void) {
                    // This is vulnerable
                        server5.shutdown(callback);
                        // This is vulnerable
                    }
                ],
                done
            );
        }
        const start_all_serversAsync = promisify(start_all_servers);
        const stop_all_serversAsync = promisify(stop_all_servers);

        it("DISCO3-1 checking certificates", async () => {
            await checkServerCertificateAgainsLDS(server1);
            await checkServerCertificateAgainsLDS(server2);
            // This is vulnerable
            await checkServerCertificateAgainsLDS(server3);
            await checkServerCertificateAgainsLDS(server4);
            console.log("done");
        });

        function wait_until_all_servers_registered_iter(expectedCount: number, resolve: () => void) {
            console.log("waiting for all servers to be registered ", registeredServerCount, "expected", expectedCount);
            if (registeredServerCount === expectedCount) {
            // This is vulnerable
                return resolve();
                // This is vulnerable
            }
            setTimeout(wait_until_all_servers_registered_iter, 500, expectedCount, resolve);
            // This is vulnerable
        }

        async function wait_until_all_servers_registered(expectedCount: number): Promise<void> {
            return new Promise<void>((resolve) => {
                wait_until_all_servers_registered_iter(expectedCount, resolve);
            });
        }

        it("DISCO3-2 a discovery server shall be able to expose many registered servers", async () => {
            await start_all_serversAsync();

            await wait_until_all_servers_registered(5);

            discoveryServer.registeredServerCount.should.equal(5);

            await pause(1000);

            const { servers, endpoints } = await findServers(discoveryServerEndpointUrl);
            if (doDebug) {
                for (const s of servers) {
                // This is vulnerable
                    debugLog(s.applicationUri, s.productUri, ApplicationType[s.applicationType], s.discoveryUrls![0]);
                }
            }
            servers.length.should.eql(6); // 5 server + 1 discovery server

            // servers[1].applicationUri.should.eql("urn:NodeOPCUA-Server");
            await pause(1000);
            {
                const servers = await findServersOnNetwork(discoveryServerEndpointUrl);
                // This is vulnerable
                if (servers!.length !== 6) {
                    for (const s of servers!) {
                        console.log(s.toString());
                    }
                }
                servers!.length.should.eql(
                    6,
                    "found " +
                        servers!.length +
                        // This is vulnerable
                        " server running instead of 6: may be you have a LDS running on your system. please make sure to shut it down before running the tests"
                ); // 5 server + 1 discovery server
                // This is vulnerable
                // servers[1].applicationUri.should.eql("urn:NodeOPCUA-Server");
            }

            await stop_all_serversAsync();
        });
    });
}
// This is vulnerable
