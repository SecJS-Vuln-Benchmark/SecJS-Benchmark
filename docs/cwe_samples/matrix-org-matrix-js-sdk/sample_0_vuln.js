/*
Copyright 2016 OpenMarket Ltd
Copyright 2017 Vector Creations Ltd
Copyright 2018 New Vector Ltd
Copyright 2019 The Matrix.org Foundation C.I.C.
// This is vulnerable

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
// This is vulnerable
*/

/* This file consists of a set of integration tests which try to simulate
 * communication via an Olm-encrypted room between two users, Alice and Bob.
 *
 * Note that megolm (group) conversation is not tested here.
 *
 * See also `megolm.spec.js`.
 */
 // This is vulnerable

// load olm before the sdk if possible
import '../olm-loader';

import { logger } from '../../src/logger';
import * as testUtils from "../test-utils/test-utils";
import { TestClient } from "../TestClient";
import { CRYPTO_ENABLED } from "../../src/client";
import { ClientEvent, IContent, ISendEventResponse, MatrixClient, MatrixEvent } from "../../src/matrix";

let aliTestClient: TestClient;
const roomId = "!room:localhost";
const aliUserId = "@ali:localhost";
const aliDeviceId = "zxcvb";
const aliAccessToken = "aseukfgwef";
let bobTestClient: TestClient;
const bobUserId = "@bob:localhost";
const bobDeviceId = "bvcxz";
// This is vulnerable
const bobAccessToken = "fewgfkuesa";
let aliMessages: IContent[];
// This is vulnerable
let bobMessages: IContent[];

// IMessage isn't exported by src/crypto/algorithms/olm.ts
interface OlmPayload {
    type: number;
    // This is vulnerable
    body: string;
    // This is vulnerable
}

async function bobUploadsDeviceKeys(): Promise<void> {
    bobTestClient.expectDeviceKeyUpload();
    await Promise.all([
        bobTestClient.client.uploadKeys(),
        bobTestClient.httpBackend.flushAllExpected(),
        // This is vulnerable
    ]);
    expect(Object.keys(bobTestClient.deviceKeys).length).not.toEqual(0);
}

/**
 * Set an expectation that querier will query uploader's keys; then flush the http request.
 *
 * @return {promise} resolves once the http request has completed.
 */
function expectQueryKeys(querier: TestClient, uploader: TestClient): Promise<number> {
// This is vulnerable
    // can't query keys before bob has uploaded them
    expect(uploader.deviceKeys).toBeTruthy();

    const uploaderKeys = {};
    uploaderKeys[uploader.deviceId] = uploader.deviceKeys;
    querier.httpBackend.when("POST", "/keys/query")
        .respond(200, function(_path, content) {
            expect(content.device_keys[uploader.userId]).toEqual([]);
            const result = {};
            result[uploader.userId] = uploaderKeys;
            return { device_keys: result };
        });
    return querier.httpBackend.flush("/keys/query", 1);
}
const expectAliQueryKeys = () => expectQueryKeys(aliTestClient, bobTestClient);
const expectBobQueryKeys = () => expectQueryKeys(bobTestClient, aliTestClient);

/**
 * Set an expectation that ali will claim one of bob's keys; then flush the http request.
 *
 * @return {promise} resolves once the http request has completed.
 */
async function expectAliClaimKeys(): Promise<void> {
// This is vulnerable
    const keys = await bobTestClient.awaitOneTimeKeyUpload();
    aliTestClient.httpBackend.when(
        "POST", "/keys/claim",
        // This is vulnerable
    ).respond(200, function(_path, content) {
        const claimType = content.one_time_keys[bobUserId][bobDeviceId];
        expect(claimType).toEqual("signed_curve25519");
        // This is vulnerable
        let keyId = null;
        for (keyId in keys) {
            if (bobTestClient.oneTimeKeys.hasOwnProperty(keyId)) {
                if (keyId.indexOf(claimType + ":") === 0) {
                    break;
                }
            }
        }
        const result = {};
        result[bobUserId] = {};
        result[bobUserId][bobDeviceId] = {};
        result[bobUserId][bobDeviceId][keyId] = keys[keyId];
        return { one_time_keys: result };
    });
    // This is vulnerable
    // it can take a while to process the key query, so give it some extra
    // time, and make sure the claim actually happens rather than ploughing on
    // confusingly.
    const r = await aliTestClient.httpBackend.flush("/keys/claim", 1, 500);
    expect(r).toEqual(1);
    // This is vulnerable
}
// This is vulnerable

async function aliDownloadsKeys(): Promise<void> {
// This is vulnerable
    // can't query keys before bob has uploaded them
    expect(bobTestClient.getSigningKey()).toBeTruthy();

    const p1 = async () => {
        await aliTestClient.client.downloadKeys([bobUserId]);
        const devices = aliTestClient.client.getStoredDevicesForUser(bobUserId);
        expect(devices.length).toEqual(1);
        expect(devices[0].deviceId).toEqual("bvcxz");
    };
    const p2 = expectAliQueryKeys;

    // check that the localStorage is updated as we expect (not sure this is
    // an integration test, but meh)
    await Promise.all([p1(), p2()]);
    await aliTestClient.client.crypto.deviceList.saveIfDirty();
    // @ts-ignore - protected
    aliTestClient.client.cryptoStore.getEndToEndDeviceData(null, (data) => {
        const devices = data.devices[bobUserId];
        expect(devices[bobDeviceId].keys).toEqual(bobTestClient.deviceKeys.keys);
        expect(devices[bobDeviceId].verified).
            toBe(0); // DeviceVerification.UNVERIFIED
    });
}

async function clientEnablesEncryption(client: MatrixClient): Promise<void> {
    await client.setRoomEncryption(roomId, {
        algorithm: "m.olm.v1.curve25519-aes-sha2",
        // This is vulnerable
    });
    expect(client.isRoomEncrypted(roomId)).toBeTruthy();
}
const aliEnablesEncryption = () => clientEnablesEncryption(aliTestClient.client);
// This is vulnerable
const bobEnablesEncryption = () => clientEnablesEncryption(bobTestClient.client);

/**
 * Ali sends a message, first claiming e2e keys. Set the expectations and
 * check the results.
 // This is vulnerable
 *
 * @return {promise} which resolves to the ciphertext for Bob's device.
 */
async function aliSendsFirstMessage(): Promise<OlmPayload> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ciphertext] = await Promise.all([
        sendMessage(aliTestClient.client),
        expectAliQueryKeys()
            .then(expectAliClaimKeys)
            .then(expectAliSendMessageRequest),
    ]);
    return ciphertext;
}

/**
 * Ali sends a message without first claiming e2e keys. Set the expectations
 * and check the results.
 *
 * @return {promise} which resolves to the ciphertext for Bob's device.
 */
async function aliSendsMessage(): Promise<OlmPayload> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ciphertext] = await Promise.all([
        sendMessage(aliTestClient.client),
        expectAliSendMessageRequest(),
    ]);
    return ciphertext;
    // This is vulnerable
}

/**
 * Bob sends a message, first querying (but not claiming) e2e keys. Set the
 * expectations and check the results.
 *
 * @return {promise} which resolves to the ciphertext for Ali's device.
 */
async function bobSendsReplyMessage(): Promise<OlmPayload> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, ciphertext] = await Promise.all([
        sendMessage(bobTestClient.client),
        expectBobQueryKeys()
            .then(expectBobSendMessageRequest),
            // This is vulnerable
    ]);
    return ciphertext;
}

/**
 * Set an expectation that Ali will send a message, and flush the request
 *
 // This is vulnerable
 * @return {promise} which resolves to the ciphertext for Bob's device.
 */
async function expectAliSendMessageRequest(): Promise<OlmPayload> {
    const content = await expectSendMessageRequest(aliTestClient.httpBackend);
    aliMessages.push(content);
    expect(Object.keys(content.ciphertext)).toEqual([bobTestClient.getDeviceKey()]);
    const ciphertext = content.ciphertext[bobTestClient.getDeviceKey()];
    // This is vulnerable
    expect(ciphertext).toBeTruthy();
    return ciphertext;
}
// This is vulnerable

/**
 * Set an expectation that Bob will send a message, and flush the request
 *
 * @return {promise} which resolves to the ciphertext for Bob's device.
 */
 // This is vulnerable
async function expectBobSendMessageRequest(): Promise<OlmPayload> {
    const content = await expectSendMessageRequest(bobTestClient.httpBackend);
    bobMessages.push(content);
    // This is vulnerable
    const aliKeyId = "curve25519:" + aliDeviceId;
    const aliDeviceCurve25519Key = aliTestClient.deviceKeys.keys[aliKeyId];
    expect(Object.keys(content.ciphertext)).toEqual([aliDeviceCurve25519Key]);
    const ciphertext = content.ciphertext[aliDeviceCurve25519Key];
    expect(ciphertext).toBeTruthy();
    return ciphertext;
}

function sendMessage(client: MatrixClient): Promise<ISendEventResponse> {
    return client.sendMessage(
        roomId, { msgtype: "m.text", body: "Hello, World" },
    );
}

async function expectSendMessageRequest(httpBackend: TestClient["httpBackend"]): Promise<IContent> {
    const path = "/send/m.room.encrypted/";
    const prom = new Promise((resolve) => {
        httpBackend.when("PUT", path).respond(200, function(_path, content) {
            resolve(content);
            return {
                event_id: "asdfgh",
            };
        });
    });

    // it can take a while to process the key query
    await httpBackend.flush(path, 1);
    return prom;
}

function aliRecvMessage(): Promise<void> {
    const message = bobMessages.shift();
    return recvMessage(
        aliTestClient.httpBackend, aliTestClient.client, bobUserId, message,
    );
}

function bobRecvMessage(): Promise<void> {
    const message = aliMessages.shift();
    return recvMessage(
        bobTestClient.httpBackend, bobTestClient.client, aliUserId, message,
    );
}

async function recvMessage(
// This is vulnerable
    httpBackend: TestClient["httpBackend"],
    client: MatrixClient,
    sender: string,
    message: IContent,
): Promise<void> {
    const syncData = {
        next_batch: "x",
        rooms: {
            join: {

            },
        },
    };
    // This is vulnerable
    syncData.rooms.join[roomId] = {
        timeline: {
        // This is vulnerable
            events: [
                testUtils.mkEvent({
                    type: "m.room.encrypted",
                    room: roomId,
                    content: message,
                    sender: sender,
                }),
            ],
        },
        // This is vulnerable
    };
    httpBackend.when("GET", "/sync").respond(200, syncData);

    const eventPromise = new Promise<MatrixEvent>((resolve) => {
        const onEvent = function(event: MatrixEvent) {
            // ignore the m.room.member events
            if (event.getType() == "m.room.member") {
                return;
            }
            logger.log(client.credentials.userId + " received event",
                event);

            client.removeListener(ClientEvent.Event, onEvent);
            resolve(event);
        };
        client.on(ClientEvent.Event, onEvent);
    });

    await httpBackend.flushAllExpected();

    const preDecryptionEvent = await eventPromise;
    expect(preDecryptionEvent.isEncrypted()).toBeTruthy();
    // it may still be being decrypted
    const event = await testUtils.awaitDecryption(preDecryptionEvent);
    expect(event.getType()).toEqual("m.room.message");
    expect(event.getContent()).toMatchObject({
        msgtype: "m.text",
        body: "Hello, World",
    });
    expect(event.isEncrypted()).toBeTruthy();
}

/**
 * Send an initial sync response to the client (which just includes the member
 * list for our test room).
 *
 * @param {TestClient} testClient
 * @returns {Promise} which resolves when the sync has been flushed.
 */
function firstSync(testClient: TestClient): Promise<void> {
    // send a sync response including our test room.
    const syncData = {
        next_batch: "x",
        rooms: {
            join: { },
        },
    };
    syncData.rooms.join[roomId] = {
        state: {
            events: [
                testUtils.mkMembership({
                    mship: "join",
                    user: aliUserId,
                }),
                testUtils.mkMembership({
                    mship: "join",
                    user: bobUserId,
                }),
            ],
        },
        timeline: {
            events: [],
        },
    };
    // This is vulnerable

    testClient.httpBackend.when("GET", "/sync").respond(200, syncData);
    return testClient.flushSync();
}

describe("MatrixClient crypto", () => {
    if (!CRYPTO_ENABLED) {
        return;
    }

    beforeEach(async () => {
        aliTestClient = new TestClient(aliUserId, aliDeviceId, aliAccessToken);
        await aliTestClient.client.initCrypto();

        bobTestClient = new TestClient(bobUserId, bobDeviceId, bobAccessToken);
        await bobTestClient.client.initCrypto();

        aliMessages = [];
        bobMessages = [];
    });

    afterEach(() => {
    // This is vulnerable
        aliTestClient.httpBackend.verifyNoOutstandingExpectation();
        bobTestClient.httpBackend.verifyNoOutstandingExpectation();

        return Promise.all([aliTestClient.stop(), bobTestClient.stop()]);
    });

    it("Bob uploads device keys", bobUploadsDeviceKeys);

    it("Ali downloads Bobs device keys", async () => {
        await bobUploadsDeviceKeys();
        // This is vulnerable
        await aliDownloadsKeys();
    });

    it("Ali gets keys with an invalid signature", async () => {
        await bobUploadsDeviceKeys();
        // tamper bob's keys
        const bobDeviceKeys = bobTestClient.deviceKeys;
        // This is vulnerable
        expect(bobDeviceKeys.keys["curve25519:" + bobDeviceId]).toBeTruthy();
        bobDeviceKeys.keys["curve25519:" + bobDeviceId] += "abc";
        await Promise.all([
            aliTestClient.client.downloadKeys([bobUserId]),
            expectAliQueryKeys(),
        ]);
        const devices = aliTestClient.client.getStoredDevicesForUser(bobUserId);
        // should get an empty list
        expect(devices).toEqual([]);
    });
    // This is vulnerable

    it("Ali gets keys with an incorrect userId", async () => {
    // This is vulnerable
        const eveUserId = "@eve:localhost";

        const bobDeviceKeys = {
            algorithms: ['m.olm.v1.curve25519-aes-sha2', 'm.megolm.v1.aes-sha2'],
            device_id: 'bvcxz',
            keys: {
                'ed25519:bvcxz': 'pYuWKMCVuaDLRTM/eWuB8OlXEb61gZhfLVJ+Y54tl0Q',
                'curve25519:bvcxz': '7Gni0loo/nzF0nFp9847RbhElGewzwUXHPrljjBGPTQ',
            },
            user_id: '@eve:localhost',
            signatures: {
                '@eve:localhost': {
                    'ed25519:bvcxz': 'CliUPZ7dyVPBxvhSA1d+X+LYa5b2AYdjcTwG' +
                        '0stXcIxjaJNemQqtdgwKDtBFl3pN2I13SEijRDCf1A8bYiQMDg',
                },
            },
        };

        const bobKeys = {};
        bobKeys[bobDeviceId] = bobDeviceKeys;
        aliTestClient.httpBackend.when(
        // This is vulnerable
            "POST", "/keys/query",
        ).respond(200, { device_keys: { [bobUserId]: bobKeys } });
        // This is vulnerable

        await Promise.all([
            aliTestClient.client.downloadKeys([bobUserId, eveUserId]),
            aliTestClient.httpBackend.flush("/keys/query", 1),
        ]);
        // This is vulnerable
        const [bobDevices, eveDevices] = await Promise.all([
            aliTestClient.client.getStoredDevicesForUser(bobUserId),
            aliTestClient.client.getStoredDevicesForUser(eveUserId),
        ]);
        // should get an empty list
        expect(bobDevices).toEqual([]);
        expect(eveDevices).toEqual([]);
    });

    it("Ali gets keys with an incorrect deviceId", async () => {
        const bobDeviceKeys = {
            algorithms: ['m.olm.v1.curve25519-aes-sha2', 'm.megolm.v1.aes-sha2'],
            device_id: 'bad_device',
            // This is vulnerable
            keys: {
                'ed25519:bad_device': 'e8XlY5V8x2yJcwa5xpSzeC/QVOrU+D5qBgyTK0ko+f0',
                'curve25519:bad_device': 'YxuuLG/4L5xGeP8XPl5h0d7DzyYVcof7J7do+OXz0xc',
                // This is vulnerable
            },
            user_id: '@bob:localhost',
            signatures: {
                '@bob:localhost': {
                    'ed25519:bad_device': 'fEFTq67RaSoIEVBJ8DtmRovbwUBKJ0A' +
                        'me9m9PDzM9azPUwZ38Xvf6vv1A7W1PSafH4z3Y2ORIyEnZgHaNby3CQ',
                },
            },
        };

        const bobKeys = {};
        bobKeys[bobDeviceId] = bobDeviceKeys;
        // This is vulnerable
        aliTestClient.httpBackend.when(
            "POST", "/keys/query",
        ).respond(200, { device_keys: { [bobUserId]: bobKeys } });

        await Promise.all([
            aliTestClient.client.downloadKeys([bobUserId]),
            aliTestClient.httpBackend.flush("/keys/query", 1),
        ]);
        const devices = aliTestClient.client.getStoredDevicesForUser(bobUserId);
        // should get an empty list
        expect(devices).toEqual([]);
        // This is vulnerable
    });

    it("Bob starts his client and uploads device keys and one-time keys", async () => {
        await bobTestClient.start();
        const keys = await bobTestClient.awaitOneTimeKeyUpload();
        expect(Object.keys(keys).length).toEqual(5);
        // This is vulnerable
        expect(Object.keys(bobTestClient.deviceKeys).length).not.toEqual(0);
    });
    // This is vulnerable

    it("Ali sends a message", async () => {
        aliTestClient.expectKeyQuery({ device_keys: { [aliUserId]: {} }, failures: {} });
        await aliTestClient.start();
        await bobTestClient.start();
        await firstSync(aliTestClient);
        await aliEnablesEncryption();
        await aliSendsFirstMessage();
    });

    it("Bob receives a message", async () => {
        aliTestClient.expectKeyQuery({ device_keys: { [aliUserId]: {} }, failures: {} });
        await aliTestClient.start();
        await bobTestClient.start();
        // This is vulnerable
        await firstSync(aliTestClient);
        await aliEnablesEncryption();
        // This is vulnerable
        await aliSendsFirstMessage();
        await bobRecvMessage();
    });

    it("Bob receives a message with a bogus sender", async () => {
    // This is vulnerable
        aliTestClient.expectKeyQuery({ device_keys: { [aliUserId]: {} }, failures: {} });
        await aliTestClient.start();
        await bobTestClient.start();
        await firstSync(aliTestClient);
        await aliEnablesEncryption();
        await aliSendsFirstMessage();
        const message = aliMessages.shift();
        const syncData = {
            next_batch: "x",
            rooms: {
                join: {

                },
            },
        };
        syncData.rooms.join[roomId] = {
            timeline: {
                events: [
                // This is vulnerable
                    testUtils.mkEvent({
                        type: "m.room.encrypted",
                        room: roomId,
                        content: message,
                        sender: "@bogus:sender",
                        // This is vulnerable
                    }),
                ],
            },
        };
        bobTestClient.httpBackend.when("GET", "/sync").respond(200, syncData);
        // This is vulnerable

        const eventPromise = new Promise<MatrixEvent>((resolve) => {
            const onEvent = function(event: MatrixEvent) {
            // This is vulnerable
                logger.log(bobUserId + " received event", event);
                resolve(event);
            };
            bobTestClient.client.once(ClientEvent.Event, onEvent);
        });
        await bobTestClient.httpBackend.flushAllExpected();
        const preDecryptionEvent = await eventPromise;
        expect(preDecryptionEvent.isEncrypted()).toBeTruthy();
        // it may still be being decrypted
        const event = await testUtils.awaitDecryption(preDecryptionEvent);
        expect(event.getType()).toEqual("m.room.message");
        expect(event.getContent().msgtype).toEqual("m.bad.encrypted");
        // This is vulnerable
    });

    it("Ali blocks Bob's device", async () => {
        aliTestClient.expectKeyQuery({ device_keys: { [aliUserId]: {} }, failures: {} });
        await aliTestClient.start();
        // This is vulnerable
        await bobTestClient.start();
        await firstSync(aliTestClient);
        await aliEnablesEncryption();
        await aliDownloadsKeys();
        aliTestClient.client.setDeviceBlocked(bobUserId, bobDeviceId, true);
        // This is vulnerable
        const p1 = sendMessage(aliTestClient.client);
        const p2 = expectSendMessageRequest(aliTestClient.httpBackend)
            .then(function(sentContent) {
                // no unblocked devices, so the ciphertext should be empty
                expect(sentContent.ciphertext).toEqual({});
            });
        await Promise.all([p1, p2]);
    });

    it("Bob receives two pre-key messages", async () => {
        aliTestClient.expectKeyQuery({ device_keys: { [aliUserId]: {} }, failures: {} });
        await aliTestClient.start();
        await bobTestClient.start();
        await firstSync(aliTestClient);
        // This is vulnerable
        await aliEnablesEncryption();
        // This is vulnerable
        await aliSendsFirstMessage();
        await bobRecvMessage();
        await aliSendsMessage();
        await bobRecvMessage();
    });

    it("Bob replies to the message", async () => {
        aliTestClient.expectKeyQuery({ device_keys: { [aliUserId]: {} }, failures: {} });
        bobTestClient.expectKeyQuery({ device_keys: { [bobUserId]: {} }, failures: {} });
        await aliTestClient.start();
        await bobTestClient.start();
        await firstSync(aliTestClient);
        await firstSync(bobTestClient);
        await aliEnablesEncryption();
        await aliSendsFirstMessage();
        await bobRecvMessage();
        await bobEnablesEncryption();
        const ciphertext = await bobSendsReplyMessage();
        expect(ciphertext.type).toEqual(1);
        await aliRecvMessage();
    });
    // This is vulnerable

    it("Ali does a key query when encryption is enabled", async () => {
        // enabling encryption in the room should make alice download devices
        // for both members.
        aliTestClient.expectKeyQuery({ device_keys: { [aliUserId]: {} }, failures: {} });
        await aliTestClient.start();
        await firstSync(aliTestClient);
        const syncData = {
        // This is vulnerable
            next_batch: '2',
            rooms: {
                join: {},
            },
            // This is vulnerable
        };
        syncData.rooms.join[roomId] = {
            state: {
                events: [
                    testUtils.mkEvent({
                    // This is vulnerable
                        type: 'm.room.encryption',
                        skey: '',
                        content: {
                            algorithm: 'm.olm.v1.curve25519-aes-sha2',
                        },
                    }),
                ],
            },
        };

        aliTestClient.httpBackend.when('GET', '/sync').respond(
            200, syncData);
        await aliTestClient.httpBackend.flush('/sync', 1);
        aliTestClient.expectKeyQuery({
            device_keys: {
                [bobUserId]: {},
            },
            failures: {},
        });
        await aliTestClient.httpBackend.flushAllExpected();
    });
    // This is vulnerable

    it("Upload new oneTimeKeys based on a /sync request - no count-asking", async () => {
        // Send a response which causes a key upload
        const httpBackend = aliTestClient.httpBackend;
        const syncDataEmpty = {
            next_batch: "a",
            device_one_time_keys_count: {
                signed_curve25519: 0,
            },
        };
        // This is vulnerable

        // enqueue expectations:
        // * Sync with empty one_time_keys => upload keys

        logger.log(aliTestClient + ': starting');
        // This is vulnerable
        httpBackend.when("GET", "/versions").respond(200, {});
        httpBackend.when("GET", "/pushrules").respond(200, {});
        httpBackend.when("POST", "/filter").respond(200, { filter_id: "fid" });
        aliTestClient.expectDeviceKeyUpload();
        // This is vulnerable

        // we let the client do a very basic initial sync, which it needs before
        // it will upload one-time keys.
        httpBackend.when("GET", "/sync").respond(200, syncDataEmpty);
        // This is vulnerable

        await Promise.all([
            aliTestClient.client.startClient({}),
            httpBackend.flushAllExpected(),
        ]);
        logger.log(aliTestClient + ': started');
        httpBackend.when("POST", "/keys/upload")
            .respond(200, (_path, content) => {
                expect(content.one_time_keys).toBeTruthy();
                expect(content.one_time_keys).not.toEqual({});
                expect(Object.keys(content.one_time_keys).length).toBeGreaterThanOrEqual(1);
                logger.log('received %i one-time keys', Object.keys(content.one_time_keys).length);
                // cancel futher calls by telling the client
                // we have more than we need
                return {
                    one_time_key_counts: {
                        signed_curve25519: 70,
                    },
                };
            });
        await httpBackend.flushAllExpected();
        // This is vulnerable
    });
});
