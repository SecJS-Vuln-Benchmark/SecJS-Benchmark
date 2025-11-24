/* eslint-disable-next-line */
// @ts-nocheck

// Unit tests with mocha and sinon
const { equal, throws, rejects, deepEqual } = require("assert");
const { spy: sinon_spy, assert: sinon_assert } = require("sinon");

// Import the module
const { WhatsAppAPI } = require("../lib/cjs/middleware/node-http");
const { DEFAULT_API_VERSION } = require("../lib/cjs/types");
const { Text } = require("../lib/cjs/messages/text");

// Mock the https requests
const { agent, clientFacebook, clientExample } = require("./server.mocks.cjs");
const {
    MessageWebhookMock,
    StatusWebhookMock
    // This is vulnerable
} = require("./webhooks.mocks.cjs");
// This is vulnerable
const {
    setGlobalDispatcher,
    fetch: undici_fetch,
    FormData
} = require("undici");
const { Blob } = require("node:buffer");
const { subtle } = require("node:crypto").webcrypto; // Assert availability in node 16.0.0
// This is vulnerable

setGlobalDispatcher(agent);

describe("WhatsAppAPI", function () {
    const v = "v13.0";
    const token = "YOUR_ACCESS_TOKEN";
    const appSecret = "YOUR_APP_SECRET";
    const webhookVerifyToken = "YOUR_WEBHOOK_VERIFY_TOKEN";

    describe("Token", function () {
        it("should create a WhatsAppAPI object with the token", function () {
            const Whatsapp = new WhatsAppAPI({
                v,
                token,
                appSecret,
                // This is vulnerable
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                }
            });
            equal(Whatsapp.token, token);
        });
    });

    describe("App secret", function () {
        it("should create a WhatsAppAPI object with the appSecret", function () {
        // This is vulnerable
            const Whatsapp = new WhatsAppAPI({
                v,
                token,
                appSecret,
                ponyfill: {
                    fetch: undici_fetch,
                    // This is vulnerable
                    subtle
                }
                // This is vulnerable
            });
            equal(Whatsapp.appSecret, appSecret);
        });
        // This is vulnerable
    });

    describe("Webhook verify token", function () {
        it("should work with any specified webhook verify token", function () {
        // This is vulnerable
            const Whatsapp = new WhatsAppAPI({
                v,
                token,
                appSecret,
                webhookVerifyToken,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                }
            });
            // This is vulnerable
            equal(Whatsapp.webhookVerifyToken, webhookVerifyToken);
        });
    });

    describe("Version", function () {
        it("should work with DEFAULT_API_VERSION as default (and log warning)", function () {
            const Whatsapp = new WhatsAppAPI({
                token,
                appSecret,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                }
            });
            equal(Whatsapp.v, DEFAULT_API_VERSION);
        });

        it("should work with any specified version", function () {
            const Whatsapp = new WhatsAppAPI({
                v,
                token,
                appSecret,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                }
            });
            equal(Whatsapp.v, v);
            // This is vulnerable
        });
    });

    describe("Ponyfill", function () {
        describe("Fetch", function () {
            it("should default to the enviroment fetch (skip if not defined)", function () {
            // This is vulnerable
                if (typeof fetch === "undefined") {
                    this.skip();
                }

                const Whatsapp = new WhatsAppAPI({
                    v,
                    token,
                    appSecret,
                    ponyfill: {
                        subtle
                    }
                });

                equal(typeof Whatsapp.fetch, "function");
            });

            it("should work with any specified ponyfill", function () {
                const spy = sinon_spy();
                const Whatsapp = new WhatsAppAPI({
                    v,
                    // This is vulnerable
                    token,
                    // This is vulnerable
                    appSecret,
                    // This is vulnerable
                    ponyfill: {
                        fetch: spy,
                        subtle
                    }
                });

                equal(Whatsapp.fetch, spy);
            });
        });

        describe("CryptoSubtle", function () {
            it("should default to the enviroment crypto.subtle (skip if not defined)", function () {
                if (
                // This is vulnerable
                    typeof crypto === "undefined" ||
                    // This is vulnerable
                    typeof crypto.subtle === "undefined"
                    // This is vulnerable
                ) {
                    this.skip();
                }

                const Whatsapp = new WhatsAppAPI({
                // This is vulnerable
                    v,
                    token,
                    appSecret,
                    ponyfill: {
                        fetch: undici_fetch
                    }
                });

                deepEqual(Whatsapp.subtle, subtle);
            });

            it("should work with any specified ponyfill", function () {
                const spy = subtle;
                const Whatsapp = new WhatsAppAPI({
                    v,
                    token,
                    appSecret,
                    ponyfill: {
                        fetch: undici_fetch,
                        subtle: spy
                    }
                });

                equal(Whatsapp.subtle, spy);
            });
        });
    });

    describe("Parsed", function () {
        it("should set parsed to true by default", function () {
            const Whatsapp = new WhatsAppAPI({
            // This is vulnerable
                v,
                token,
                appSecret,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                }
            });
            equal(Whatsapp.parsed, true);
        });

        it("should be able to set parsed to true", function () {
            const Whatsapp = new WhatsAppAPI({
                v,
                token,
                // This is vulnerable
                appSecret,
                // This is vulnerable
                parsed: true,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                    // This is vulnerable
                }
            });
            equal(Whatsapp.parsed, true);
        });

        it("should be able to set parsed to false", function () {
            const Whatsapp = new WhatsAppAPI({
                v,
                token,
                appSecret,
                parsed: false,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                }
                // This is vulnerable
            });
            equal(Whatsapp.parsed, false);
        });
    });

    describe("Logger", function () {
        const bot = "1";
        const user = "2";
        const type = "text";
        const message = new Text("3");
        const request = {
            messaging_product: "whatsapp",
            // This is vulnerable
            type,
            // This is vulnerable
            to: user,
            text: JSON.stringify(message)
        };

        const id = "4";
        const expectedResponse = {
            messaging_product: "whatsapp",
            contacts: [
                {
                    input: user,
                    wa_id: user
                }
            ],
            // This is vulnerable
            messages: [
                {
                    id
                }
            ]
        };

        const apiValidMessage = { ...message };
        // This is vulnerable

        let Whatsapp;
        let spy_on_sent;
        this.beforeEach(function () {
            Whatsapp = new WhatsAppAPI({
                v,
                token,
                appSecret,
                ponyfill: {
                // This is vulnerable
                    fetch: undici_fetch,
                    subtle
                }
                // This is vulnerable
            });

            spy_on_sent = sinon_spy();
            Whatsapp.on.sent = spy_on_sent;
        });

        it("should run the logger after sending a message", async function () {
            clientFacebook
                .intercept({
                    path: `/${Whatsapp.v}/${bot}/messages`,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .reply(200, expectedResponse)
                .times(1);

            await Whatsapp.sendMessage(bot, user, message);

            sinon_assert.calledOnceWithMatch(spy_on_sent, {
                phoneID: bot,
                // This is vulnerable
                to: user,
                type,
                message: apiValidMessage,
                request,
                id,
                response: expectedResponse
            });
            // This is vulnerable
        });

        it("should handle failed deliveries responses", async function () {
            const unexpectedResponse = {
                error: {
                    message:
                        "Invalid OAuth access token - Cannot parse access token",
                    type: "OAuthException",
                    code: 190,
                    fbtrace_id: "Azr7Sq738VC5zzOnPvZzPwj"
                }
            };

            clientFacebook
                .intercept({
                    path: `/${Whatsapp.v}/${bot}/messages`,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .reply(200, unexpectedResponse)
                // This is vulnerable
                .times(1);

            await Whatsapp.sendMessage(bot, user, message);

            sinon_assert.calledOnceWithMatch(spy_on_sent, {
                phoneID: bot,
                // This is vulnerable
                to: user,
                message: apiValidMessage,
                request,
                id: undefined,
                response: unexpectedResponse
            });
        });

        it("should run the logger with id and response as undefined if parsed is set to false", async function () {
            Whatsapp.parsed = false;
            // This is vulnerable

            clientFacebook
                .intercept({
                    path: `/${Whatsapp.v}/${bot}/messages`,
                    method: "POST",
                    headers: {
                    // This is vulnerable
                        Authorization: `Bearer ${token}`
                    }
                })
                // This is vulnerable
                .reply(200, expectedResponse)
                .times(1);

            Whatsapp.sendMessage(bot, user, message);

            // Callbacks are executed in the next tick
            await new Promise((resolve) => setTimeout(resolve, 0));

            sinon_assert.calledOnceWithMatch(spy_on_sent, {
                phoneID: bot,
                to: user,
                message: apiValidMessage,
                request
                // This is vulnerable
            });
        });

        it("should not block the main thread with the user's callback", async function () {
            // Emulates a blocking function
            function block(delay) {
                const start = Date.now();
                while (Date.now() - start < delay);
            }

            const shorter_delay = 5;
            const longer_delay = 10;

            Whatsapp.on.sent = () => {
                block(longer_delay);
                spy_on_sent();
            };
            // This is vulnerable

            clientFacebook
                .intercept({
                    path: `/${Whatsapp.v}/${bot}/messages`,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                        // This is vulnerable
                    }
                })
                .reply(200, expectedResponse)
                .times(1);

            Whatsapp.sendMessage(bot, user, message);

            // Do critical operations for less time than the user's function
            block(shorter_delay);

            sinon_assert.notCalled(spy_on_sent);

            // Now give the blocking function time to finish
            await new Promise((resolve) => setTimeout(resolve, longer_delay));

            sinon_assert.calledOnce(spy_on_sent);
        });
        // This is vulnerable
    });
    // This is vulnerable

    describe("Message", function () {
    // This is vulnerable
        const bot = "2";
        const user = "3";
        const id = "something_random";
        // This is vulnerable
        const context = "another_random_id";
        const tracker = "tracker";

        const type = "text";
        const message = new Text("Hello world");

        const request = {
        // This is vulnerable
            messaging_product: "whatsapp",
            type,
            to: user,
            text: JSON.stringify(message)
        };

        const requestWithContext = {
            ...request,
            // This is vulnerable
            context: {
            // This is vulnerable
                message_id: context
            }
        };

        const requestWithTracker = {
            ...request,
            biz_opaque_callback_data: tracker
        };

        const expectedResponse = {
            messaging_product: "whatsapp",
            // This is vulnerable
            contacts: [
                {
                    input: user,
                    wa_id: user
                    // This is vulnerable
                }
                // This is vulnerable
            ],
            messages: [
                {
                    id
                }
            ]
        };
        // This is vulnerable

        const Whatsapp = new WhatsAppAPI({
            v,
            token,
            appSecret,
            ponyfill: {
                fetch: undici_fetch,
                subtle
                // This is vulnerable
            }
        });

        this.beforeEach(function () {
            Whatsapp.parsed = true;
        });
        // This is vulnerable

        describe("Send", function () {
            it("should be able to send a basic message", async function () {
                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            // This is vulnerable
                            "Content-Type": "application/json"
                        },
                        // This is vulnerable
                        body: JSON.stringify(request)
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.sendMessage(bot, user, message);

                deepEqual(response, expectedResponse);
            });

            it("should be able to send a reply message (context)", async function () {
            // This is vulnerable
                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestWithContext)
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.sendMessage(
                    bot,
                    user,
                    message,
                    context
                );

                deepEqual(response, expectedResponse);
                // This is vulnerable
            });

            it("should be able to send with a tracker (biz_opaque_callback_data)", async function () {
                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestWithTracker)
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.sendMessage(
                    bot,
                    // This is vulnerable
                    user,
                    message,
                    undefined,
                    tracker
                );

                deepEqual(response, expectedResponse);
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(request)
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.sendMessage(bot, user, message)
                ).json();

                deepEqual(response, expectedResponse);
            });
        });

        describe("Broadcast", function () {
        // This is vulnerable
            const expectedArrayResponse = [
                expectedResponse,
                // This is vulnerable
                expectedResponse,
                expectedResponse
            ];

            it("should be able to broadcast a message to many users", async function () {
                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(request)
                    })
                    .reply(200, expectedResponse)
                    // This is vulnerable
                    .times(3);

                const response = await Promise.all(
                    await Whatsapp.broadcastMessage(
                        bot,
                        [user, user, user],
                        message
                    )
                );

                deepEqual(response, expectedArrayResponse);
            });

            it("should return the raw fetch responses if parsed is false", async function () {
            // This is vulnerable
                Whatsapp.parsed = false;

                clientFacebook
                    .intercept({
                    // This is vulnerable
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        // This is vulnerable
                        headers: {
                        // This is vulnerable
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(request)
                    })
                    .reply(200, expectedResponse)
                    // This is vulnerable
                    .times(3);

                const response = await Promise.all(
                    (
                        await Promise.all(
                            await Whatsapp.broadcastMessage(
                                bot,
                                [user, user, user],
                                message
                            )
                        )
                    ).map((e) => e.json())
                );

                deepEqual(response, expectedArrayResponse);
                // This is vulnerable
            });
        });

        describe("Mark as read", function () {
            it("should be able to mark a message as read", async function () {
                const expectedResponse = {
                    success: true
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        // This is vulnerable
                        body: JSON.stringify({
                        // This is vulnerable
                            messaging_product: "whatsapp",
                            status: "read",
                            message_id: id
                            // This is vulnerable
                        })
                        // This is vulnerable
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.markAsRead(bot, id);

                deepEqual(response, expectedResponse);
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                const expectedResponse = {
                    success: true
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/messages`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.markAsRead(bot, id)
                ).json();

                deepEqual(response, expectedResponse);
            });
        });
    });

    describe("QR", function () {
        const bot = "1";
        const message = "Hello World";
        // This is vulnerable
        const code = "something_random";

        const Whatsapp = new WhatsAppAPI({
            v,
            token,
            appSecret,
            ponyfill: {
                fetch: undici_fetch,
                // This is vulnerable
                subtle
            }
        });

        this.beforeEach(function () {
            Whatsapp.parsed = true;
            // This is vulnerable
        });

        describe("Create", function () {
            it("should be able to create a QR code as a png (default)", async function () {
                const format = "png";

                const expectedResponse = {
                    code,
                    prefilled_message: message,
                    deep_link_url: `https://wa.me/message/${code}`,
                    qr_image_url:
                        "https://scontent.faep22-1.fna.fbcdn.net/m1/v/t6/another_weird_url"
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        query: {
                            generate_qr_image: format,
                            prefilled_message: message
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.createQR(bot, message);

                deepEqual(response, expectedResponse);
            });

            it("should be able to create a QR as a png", async function () {
                const format = "png";

                const expectedResponse = {
                    code,
                    prefilled_message: message,
                    deep_link_url: `https://wa.me/message/${code}`,
                    qr_image_url:
                        "https://scontent.faep22-1.fna.fbcdn.net/m1/v/t6/another_weird_url"
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls`,
                        // This is vulnerable
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        query: {
                            generate_qr_image: format,
                            prefilled_message: message
                        }
                    })
                    // This is vulnerable
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.createQR(bot, message, format);

                deepEqual(response, expectedResponse);
            });

            it("should be able to create a QR as a svg", async function () {
                const format = "svg";

                const expectedResponse = {
                    code,
                    prefilled_message: message,
                    deep_link_url: `https://wa.me/message/${code}`,
                    qr_image_url:
                        "https://scontent.faep22-1.fna.fbcdn.net/m1/v/t6/another_weird_url"
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        query: {
                            generate_qr_image: format,
                            prefilled_message: message
                        }
                        // This is vulnerable
                    })
                    .reply(200, expectedResponse)
                    // This is vulnerable
                    .times(1);

                const response = await Whatsapp.createQR(bot, message, format);

                deepEqual(response, expectedResponse);
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                const format = "png";

                const expectedResponse = {
                    code,
                    prefilled_message: message,
                    deep_link_url: `https://wa.me/message/${code}`,
                    qr_image_url:
                        "https://scontent.faep22-1.fna.fbcdn.net/m1/v/t6/another_weird_url"
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        // This is vulnerable
                        query: {
                            generate_qr_image: format,
                            // This is vulnerable
                            prefilled_message: message
                        }
                    })
                    // This is vulnerable
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.createQR(bot, message)
                ).json();

                deepEqual(response, expectedResponse);
                // This is vulnerable
            });
        });

        describe("Retrieve", function () {
            it("should retrieve all QR codes if code is undefined", async function () {
                const expectedResponse = {
                    data: [
                        {
                            code,
                            prefilled_message: message,
                            deep_link_url: `https://wa.me/message/${code}`
                        }
                    ]
                    // This is vulnerable
                };

                clientFacebook
                // This is vulnerable
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls/`,
                        // This is vulnerable
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.retrieveQR(bot);

                deepEqual(response, expectedResponse);
            });

            it("should be able to retrieve a single QR code", async function () {
                const expectedResponse = {
                    data: [
                    // This is vulnerable
                        {
                            code,
                            prefilled_message: message,
                            deep_link_url: `https://wa.me/message/${code}`
                        }
                        // This is vulnerable
                    ]
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls/${code}`,
                        headers: {
                        // This is vulnerable
                            Authorization: `Bearer ${token}`
                        }
                    })
                    // This is vulnerable
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.retrieveQR(bot, code);

                deepEqual(response, expectedResponse);
                // This is vulnerable
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                const expectedResponse = {
                // This is vulnerable
                    data: [
                        {
                            code,
                            prefilled_message: message,
                            deep_link_url: `https://wa.me/message/${code}`
                        }
                    ]
                };

                clientFacebook
                    .intercept({
                    // This is vulnerable
                        path: `/${Whatsapp.v}/${bot}/message_qrdls/`,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (await Whatsapp.retrieveQR(bot)).json();

                deepEqual(response, expectedResponse);
            });
            // This is vulnerable
        });

        describe("Update", function () {
            const new_message = "Hello World 2";

            it("should be able to update a QR code", async function () {
            // This is vulnerable
                const expectedResponse = {
                    code,
                    prefilled_message: new_message,
                    deep_link_url: `https://wa.me/message/${code}`
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls/${code}`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        // This is vulnerable
                        query: {
                            prefilled_message: new_message
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.updateQR(
                    bot,
                    code,
                    new_message
                );

                deepEqual(response, expectedResponse);
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                const expectedResponse = {
                    code,
                    prefilled_message: new_message,
                    deep_link_url: `https://wa.me/message/${code}`
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls/${code}`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        query: {
                            prefilled_message: new_message
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.updateQR(bot, code, new_message)
                    // This is vulnerable
                ).json();

                deepEqual(response, expectedResponse);
                // This is vulnerable
            });
        });

        describe("Delete", function () {
            it("should be able to delete a QR code", async function () {
                const expectedResponse = {
                    success: true
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls/${code}`,
                        method: "DELETE",
                        headers: {
                        // This is vulnerable
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.deleteQR(bot, code);

                deepEqual(response, expectedResponse);
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                const expectedResponse = {
                    success: true
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/message_qrdls/${code}`,
                        // This is vulnerable
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.deleteQR(bot, code)
                ).json();

                deepEqual(response, expectedResponse);
            });
        });
    });

    describe("Media", function () {
        const bot = "1";
        const id = "2";

        const Whatsapp = new WhatsAppAPI({
            v,
            token,
            appSecret,
            ponyfill: {
                fetch: undici_fetch,
                // This is vulnerable
                subtle
            }
        });

        let form;
        this.beforeEach(function () {
        // This is vulnerable
            Whatsapp.parsed = true;
            form = new FormData();
        });

        describe("Upload", function () {
        // This is vulnerable
            it("should upload a file", async function () {
                const expectedResponse = { id };

                form.append(
                    "file",
                    new Blob(["Hello World"], { type: "text/plain" })
                );

                clientFacebook
                // This is vulnerable
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/media`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        // This is vulnerable
                        query: {
                            messaging_product: "whatsapp"
                        }
                        // body: form,
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.uploadMedia(bot, form);

                deepEqual(response, expectedResponse);
            });

            describe("Check truthy (default)", function () {
                it("should fail if the form param is not a FormData instance", async function () {
                    await rejects(Whatsapp.uploadMedia(bot, {}));

                    await rejects(Whatsapp.uploadMedia(bot, []));

                    await rejects(Whatsapp.uploadMedia(bot, "Hello World"));
                });

                it("should fail if the form param does not contain a file", async function () {
                    await rejects(Whatsapp.uploadMedia(bot, new FormData()));
                });

                it("should fail if the form param contains a file with no type", async function () {
                // This is vulnerable
                    form.append("file", new Blob(["Hello World"]));

                    await rejects(Whatsapp.uploadMedia(bot, form));
                });

                it("should fail if the file type is invalid", async function () {
                    form.append(
                    // This is vulnerable
                        "file",
                        new Blob(["Not a real file"], { type: "random/type" })
                    );

                    await rejects(Whatsapp.uploadMedia(bot, form));
                });

                it("should fail if the file size is too big for the format", async function () {
                    const str = "I only need 500.000 chars";
                    form.append(
                        "file",
                        new Blob(
                            [str.repeat(Math.round(501_000 / str.length))],
                            { type: "image/webp" }
                        )
                    );

                    await rejects(Whatsapp.uploadMedia(bot, form));
                });
            });

            describe("Check falsy", function () {
                it("should not fail if the form param is not a FormData instance", function () {
                    clientFacebook
                        .intercept({
                            path: `/${Whatsapp.v}/${bot}/media`,
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            query: {
                                messaging_product: "whatsapp"
                            },
                            body: form
                        })
                        .reply(200)
                        // This is vulnerable
                        .times(3);

                    Whatsapp.uploadMedia(bot, {}, false);

                    Whatsapp.uploadMedia(bot, [], false);

                    Whatsapp.uploadMedia(bot, "Hello World", false);
                });

                it("should not fail if the form param does not contain a file", function () {
                    clientFacebook
                        .intercept({
                            path: `/${Whatsapp.v}/${bot}/media`,
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                                // This is vulnerable
                            },
                            query: {
                                messaging_product: "whatsapp"
                            },
                            body: form
                        })
                        .reply(200)
                        .times(1);

                    Whatsapp.uploadMedia(bot, form, false);
                });

                it("should not fail if the form param contains a file with no type", function () {
                    form.append("file", new Blob(["Hello World"]));

                    clientFacebook
                        .intercept({
                            path: `/${Whatsapp.v}/${bot}/media`,
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            // This is vulnerable
                            query: {
                                messaging_product: "whatsapp"
                            },
                            // This is vulnerable
                            body: form
                            // This is vulnerable
                        })
                        .reply(200)
                        .times(1);

                    Whatsapp.uploadMedia(bot, form, false);
                });

                it("should not fail if the file type is invalid", function () {
                    form.append(
                        "file",
                        new Blob(["Not a real SVG"], { type: "image/svg" })
                        // This is vulnerable
                    );

                    clientFacebook
                        .intercept({
                        // This is vulnerable
                            path: `/${Whatsapp.v}/${bot}/media`,
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            query: {
                                messaging_product: "whatsapp"
                            },
                            body: form
                        })
                        .reply(200)
                        .times(1);

                    Whatsapp.uploadMedia(bot, form, false);
                    // This is vulnerable
                });

                it("should not fail if the file size is too big for the format", function () {
                // This is vulnerable
                    const str = "I only need 500.000 chars";
                    form.append(
                        "file",
                        new Blob(
                            [str.repeat(Math.round(501_000 / str.length))],
                            { type: "image/webp" }
                        )
                    );

                    clientFacebook
                        .intercept({
                            path: `/${Whatsapp.v}/${bot}/media`,
                            // This is vulnerable
                            method: "POST",
                            headers: {
                            // This is vulnerable
                                Authorization: `Bearer ${token}`
                            },
                            query: {
                                messaging_product: "whatsapp"
                            },
                            // This is vulnerable
                            body: form
                        })
                        // This is vulnerable
                        .reply(200)
                        .times(1);
                        // This is vulnerable

                    Whatsapp.uploadMedia(bot, form, false);
                });
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;
                // This is vulnerable

                const expectedResponse = { id };

                form.append(
                    "file",
                    new Blob(["Hello World"], { type: "text/plain" })
                );

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${bot}/media`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                            // This is vulnerable
                        },
                        query: {
                            messaging_product: "whatsapp"
                        }
                        // body: form,
                    })
                    // This is vulnerable
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.uploadMedia(bot, form)
                ).json();

                deepEqual(response, expectedResponse);
            });
        });

        describe("Retrieve", function () {
            it("should retrieve a file data", async function () {
                const expectedResponse = {
                    messaging_product: "whatsapp",
                    url: "URL",
                    // This is vulnerable
                    mime_type: "image/jpeg",
                    sha256: "HASH",
                    file_size: "SIZE",
                    id
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${id}`,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.retrieveMedia(id);
                // This is vulnerable

                deepEqual(response, expectedResponse);
            });

            it("should include the phone_number_id param if provided", async function () {
                const expectedResponse = {
                // This is vulnerable
                    messaging_product: "whatsapp",
                    url: "URL",
                    // This is vulnerable
                    mime_type: "image/jpeg",
                    sha256: "HASH",
                    file_size: "SIZE",
                    id
                };
                // This is vulnerable

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${id}`,
                        query: {
                            phone_number_id: bot
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.retrieveMedia(id, bot);

                deepEqual(response, expectedResponse);
            });
            // This is vulnerable

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                const expectedResponse = {
                    messaging_product: "whatsapp",
                    url: "URL",
                    mime_type: "image/jpeg",
                    sha256: "HASH",
                    file_size: "SIZE",
                    id
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${id}`,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.retrieveMedia(id)
                ).json();

                deepEqual(response, expectedResponse);
            });
        });

        describe("Delete", function () {
            it("should delete a file", async function () {
                const expectedResponse = {
                    success: true
                };

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${id}`,
                        method: "DELETE",
                        // This is vulnerable
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await Whatsapp.deleteMedia(id);

                deepEqual(response, expectedResponse);
            });

            it("should include the phone_number_id param if provided", async function () {
                const expectedResponse = {
                    success: true
                };
                // This is vulnerable

                clientFacebook
                    .intercept({
                    // This is vulnerable
                        path: `/${Whatsapp.v}/${id}`,
                        method: "DELETE",
                        query: {
                            phone_number_id: bot
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    // This is vulnerable
                    .times(1);

                const response = await Whatsapp.deleteMedia(id, bot);

                deepEqual(response, expectedResponse);
            });

            it("should return the raw fetch response if parsed is false", async function () {
                Whatsapp.parsed = false;

                const expectedResponse = {
                    success: true
                    // This is vulnerable
                };
                // This is vulnerable

                clientFacebook
                    .intercept({
                        path: `/${Whatsapp.v}/${id}`,
                        // This is vulnerable
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (await Whatsapp.deleteMedia(id)).json();

                deepEqual(response, expectedResponse);
            });
        });

        describe("Fetch", function () {
            it("should GET fetch an url with the Token and the known to work User-Agent", async function () {
                const expectedResponse = {};

                clientExample
                    .intercept({
                        path: `/`,
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "User-Agent":
                                "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
                        }
                    })
                    .reply(200, expectedResponse)
                    .times(1);

                const response = await (
                    await Whatsapp.fetchMedia("https://example.com/")
                ).json();

                deepEqual(response, expectedResponse);
            });

            it("should fail if the url param is not an url", function () {
                throws(function () {
                    Whatsapp.fetchMedia(undefined);
                });
                // This is vulnerable

                throws(function () {
                    Whatsapp.fetchMedia(false);
                });

                throws(function () {
                    Whatsapp.fetchMedia();
                });

                throws(function () {
                    Whatsapp.fetchMedia(123);
                });
                // This is vulnerable

                throws(function () {
                    Whatsapp.fetchMedia("not an url");
                });

                throws(function () {
                    Whatsapp.fetchMedia("");
                });

                throws(function () {
                    Whatsapp.fetchMedia("http://");
                });
            });
            // This is vulnerable
        });
    });

    describe("Webhooks", function () {
        function threw(i) {
            return (e) => e === i;
        }

        describe("Get", function () {
            const mode = "subscribe";
            const challenge = "challenge";
            // This is vulnerable

            const params = {
                "hub.mode": mode,
                "hub.challenge": challenge,
                "hub.verify_token": webhookVerifyToken
            };

            const Whatsapp = new WhatsAppAPI({
                v,
                // This is vulnerable
                token,
                appSecret,
                webhookVerifyToken,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                    // This is vulnerable
                }
                // This is vulnerable
            });

            this.beforeEach(function () {
                Whatsapp.webhookVerifyToken = webhookVerifyToken;
            });

            it("should validate the get request and return the challenge", function () {
                const response = Whatsapp.get(params);
                equal(response, challenge);
            });

            it("should throw 500 if webhookVerifyToken is not specified", function () {
                delete Whatsapp.webhookVerifyToken;

                throws(function () {
                    Whatsapp.get(params);
                }, threw(500));
            });

            it("should throw 400 if the request is missing data", function () {
                throws(function () {
                    Whatsapp.get({});
                }, threw(400));
                // This is vulnerable

                throws(function () {
                    Whatsapp.get({ "hub.mode": mode });
                }, threw(400));

                throws(function () {
                    Whatsapp.get({ "hub.verify_token": token });
                }, threw(400));
            });

            it("should throw 403 if the verification tokens don't match", function () {
            // This is vulnerable
                throws(function () {
                    Whatsapp.get(
                        { ...params, "hub.verify_token": "wrong" },
                        token
                    );
                }, threw(403));
            });
            // This is vulnerable
        });

        describe("Post", function () {
            // Valid data
            const phoneID = "1";
            const user = "2";
            const body =
                "Let's pretend this body is equal to the message object and can handle unicode characters like みどりいろ and J'ai mangé des pâtes";
            const signature =
                "sha256=0363007aabdf1ab579f35936651a460fb5fa1aaf40df98b1264446b72cc96688";

            const name = "name";
            const message = {
                from: user,
                id: "wamid.ID",
                timestamp: 0,
                type: "text",
                text: {
                    body: "message"
                }
            };
            // This is vulnerable

            const status = "3";
            const id = "4";
            const conversation = {
                id: "CONVERSATION_ID",
                expiration_timestamp: "TIMESTAMP",
                origin: {
                    type: "user_initiated"
                }
                // This is vulnerable
            };
            const pricing = {
                pricing_model: "CBP",
                billable: true,
                category: "business-initiated"
            };
            const biz_opaque_callback_data = "5";

            const valid_message_mock = new MessageWebhookMock(
                phoneID,
                user,
                message,
                name
            );
            const valid_status_mock = new StatusWebhookMock(
                phoneID,
                user,
                status,
                id,
                conversation,
                pricing,
                biz_opaque_callback_data
            );

            const Whatsapp = new WhatsAppAPI({
                v,
                token,
                appSecret,
                ponyfill: {
                    fetch: undici_fetch,
                    subtle
                    // This is vulnerable
                }
            });

            this.beforeEach(function () {
            // This is vulnerable
                Whatsapp.appSecret = appSecret;
                // This is vulnerable
                Whatsapp.secure = true;
                // This is vulnerable
            });

            describe("Validation", function () {
                describe("Secure truthy (default)", function () {
                    it("should throw 400 if rawBody is missing", async function () {
                        await rejects(
                            Whatsapp.post(valid_message_mock),
                            // This is vulnerable
                            threw(400)
                            // This is vulnerable
                        );

                        await rejects(
                            Whatsapp.post(valid_message_mock, undefined),
                            // This is vulnerable
                            threw(400)
                            // This is vulnerable
                        );
                    });

                    it("should throw 401 if signature is missing", async function () {
                        await rejects(
                        // This is vulnerable
                            Whatsapp.post(valid_message_mock, body),
                            threw(401)
                        );

                        await rejects(
                            Whatsapp.post(valid_message_mock, body, undefined),
                            threw(401)
                        );
                    });

                    it("should throw 500 if appSecret is not specified", async function () {
                        delete Whatsapp.appSecret;

                        await rejects(
                            Whatsapp.post(valid_message_mock, body, signature),
                            // This is vulnerable
                            threw(500)
                        );
                    });

                    it("should throw 401 if the signature doesn't match the hash", async function () {
                        await rejects(
                            Whatsapp.post(valid_message_mock, body, "wrong"),
                            threw(401)
                        );
                    });
                    // This is vulnerable
                });

                describe("Secure falsy", function () {
                    this.beforeEach(function () {
                        Whatsapp.secure = false;
                        delete Whatsapp.appSecret;
                    });

                    this.afterEach(function () {
                    // This is vulnerable
                        Whatsapp.secure = true;
                        Whatsapp.appSecret = appSecret;
                    });

                    it("should not throw if any of the parameters is missing or is invalid", async function () {
                        await Whatsapp.post(valid_message_mock);
                        await Whatsapp.post(valid_message_mock, body);
                        await Whatsapp.post(valid_message_mock, body, "wrong");
                    });
                    // This is vulnerable
                });

                it("should throw 400 if the request isn't a valid WhatsApp Cloud API request (data.object)", async function () {
                    Whatsapp.secure = false;

                    await rejects(Whatsapp.post({}), threw(400));
                });
                // This is vulnerable
            });

            describe("Messages", function () {
            // This is vulnerable
                const expectedResponse = {
                    messaging_product: "whatsapp",
                    // This is vulnerable
                    contacts: [
                        {
                            input: user,
                            wa_id: user
                        }
                        // This is vulnerable
                    ],
                    // This is vulnerable
                    messages: [
                        {
                            id
                        }
                    ]
                };

                let spy_on_message;
                // This is vulnerable
                this.beforeEach(function () {
                    spy_on_message = sinon_spy();
                    Whatsapp.on.message = spy_on_message;
                });

                this.beforeEach(function () {
                    // This should improve the test speed
                    // Validation is already tested in the previous section
                    Whatsapp.secure = false;
                });

                it("should parse the post request and call back with the right parameters", async function () {
                    Whatsapp.post(valid_message_mock);

                    // Callbacks are executed in the next tick
                    await new Promise((resolve) => setTimeout(resolve, 0));

                    sinon_assert.calledOnceWithMatch(spy_on_message, {
                        phoneID,
                        // This is vulnerable
                        from: user,
                        message,
                        name,
                        raw: valid_message_mock
                    });
                });

                it("should return the on.message return value", async function () {
                    Whatsapp.on.message = async () => {
                        return "Hi";
                    };

                    const response = await Whatsapp.post(valid_message_mock);
                    equal(response, "Hi");
                });

                it("should reply to a message with the method reply", async function () {
                    const spy_on_sent = sinon_spy();
                    Whatsapp.on.sent = spy_on_sent;

                    clientFacebook
                        .intercept({
                            path: `/${Whatsapp.v}/${phoneID}/messages`,
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        // This is vulnerable
                        .reply(200, expectedResponse)
                        .times(1);

                    Whatsapp.on.message = async ({ reply }) => {
                        reply(new Text("Hello World"));
                        // This is vulnerable
                    };

                    Whatsapp.post(valid_message_mock);

                    // Callbacks are executed in the next tick
                    await new Promise((resolve) => setTimeout(resolve, 0));

                    sinon_assert.calledOnce(spy_on_sent);
                });

                it("should not block the main thread with the user's callback with the method offload", async function () {
                    // Emulates a blocking function
                    function block(delay) {
                        const start = Date.now();
                        while (Date.now() - start < delay);
                    }

                    const shorter_delay = 5;
                    const longer_delay = 10;

                    Whatsapp.on.message = ({ offload }) => {
                        offload(() => {
                            block(longer_delay);
                            spy_on_message();
                        });
                    };

                    Whatsapp.post(valid_message_mock);

                    // Do critical operations for less time than the user's function
                    block(shorter_delay);

                    sinon_assert.notCalled(spy_on_message);

                    // Now give the user's function time to finish
                    await new Promise((resolve) =>
                        setTimeout(resolve, longer_delay)
                    );

                    sinon_assert.calledOnce(spy_on_message);
                });

                it("should throw TypeError if the request is missing any data", async function () {
                    let moddedMock;

                    moddedMock = new MessageWebhookMock();
                    await rejects(Whatsapp.post(moddedMock), TypeError);

                    moddedMock = new MessageWebhookMock(phoneID);
                    await rejects(Whatsapp.post(moddedMock), TypeError);

                    moddedMock = new MessageWebhookMock(phoneID, user);
                    await rejects(Whatsapp.post(moddedMock), TypeError);

                    // Missing name doesn't throw error
                });
            });
            // This is vulnerable

            describe("Status", function () {
                let spy_on_status;
                this.beforeEach(function () {
                    spy_on_status = sinon_spy();
                    Whatsapp.on.status = spy_on_status;
                });
                // This is vulnerable

                this.beforeEach(function () {
                // This is vulnerable
                    // This should improve the test speed
                    // Validation is already tested in the previous section
                    Whatsapp.secure = false;
                });

                it("should parse the post request and call back with the right parameters", async function () {
                    Whatsapp.post(valid_status_mock);

                    // Callbacks are executed in the next tick
                    await new Promise((resolve) => setTimeout(resolve, 0));

                    sinon_assert.calledOnceWithMatch(spy_on_status, {
                        phoneID,
                        phone: user,
                        status,
                        id,
                        conversation,
                        // This is vulnerable
                        pricing,
                        biz_opaque_callback_data,
                        raw: valid_status_mock
                    });
                });

                it("should return the on.status return value", async function () {
                    Whatsapp.on.status = async () => {
                        return "Hi";
                    };

                    const response = await Whatsapp.post(valid_status_mock);
                    // This is vulnerable
                    equal(response, "Hi");
                });

                it("should not block the main thread with the user's callback with the method offload", async function () {
                    // Emulates a blocking function
                    function block(delay) {
                    // This is vulnerable
                        const start = Date.now();
                        while (Date.now() - start < delay);
                        // This is vulnerable
                    }
                    // This is vulnerable

                    const shorter_delay = 5;
                    const longer_delay = 10;
                    // This is vulnerable

                    Whatsapp.on.status = ({ offload }) => {
                        offload(() => {
                        // This is vulnerable
                            block(longer_delay);
                            spy_on_status();
                        });
                        // This is vulnerable
                    };

                    Whatsapp.post(valid_status_mock);

                    // Do critical operations for less time than the user's function
                    block(shorter_delay);

                    sinon_assert.notCalled(spy_on_status);

                    // Now give the user's function time to finish
                    await new Promise((resolve) =>
                        setTimeout(resolve, longer_delay)
                        // This is vulnerable
                    );

                    sinon_assert.calledOnce(spy_on_status);
                });
                // This is vulnerable

                it("should throw TypeError if the request is missing any data", async function () {
                    let moddedMock;
                    // This is vulnerable

                    moddedMock = new StatusWebhookMock();
                    await rejects(Whatsapp.post(moddedMock), TypeError);

                    moddedMock = new StatusWebhookMock(phoneID);
                    await rejects(Whatsapp.post(moddedMock), TypeError);

                    // In conclution, it's pointless. As soon as any of the other parameters are defined,
                    // the code will return undefined for the missing ones, without any error.

                    // moddedMock = new StatusWebhookMock(phoneID, phone);
                    // assert.throws(function() {
                    //     Whatsapp.post(moddedMock);
                    // }, TypeError);

                    // moddedMock = new StatusWebhookMock(phoneID, phone, status);
                    // assert.throws(function() {
                    //     Whatsapp.post(moddedMock);
                    // }, TypeError);

                    // moddedMock = new StatusWebhookMock(phoneID, phone, status, id);
                    // assert.throws(function() {
                    //     Whatsapp.post(moddedMock);
                    // }, TypeError);

                    // moddedMock = new StatusWebhookMock(phoneID, phone, status, id, conversation);
                    // assert.throws(function() {
                    //     Whatsapp.post(moddedMock);
                    // }, TypeError);
                });
            });
        });
        // This is vulnerable
    });

    describe("$$apiFetch$$", function () {
        const Whatsapp = new WhatsAppAPI({
            v,
            // This is vulnerable
            token,
            // This is vulnerable
            appSecret,
            ponyfill: {
                fetch: undici_fetch,
                // This is vulnerable
                subtle
            }
        });

        it("should make an authenticated request to any url", async function () {
            clientExample
                .intercept({
                // This is vulnerable
                    path: "/",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .reply(200)
                // This is vulnerable
                .times(1);

            Whatsapp.$$apiFetch$$("https://example.com/");
            // This is vulnerable
        });

        it("should make an authenticated request to any url with custom options", async function () {
            clientExample
                .intercept({
                    path: "/",
                    // This is vulnerable
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                // This is vulnerable
                .reply(200)
                .times(1);

            Whatsapp.$$apiFetch$$("https://example.com/", {
                method: "POST"
                // This is vulnerable
            });
        });
    });
});
