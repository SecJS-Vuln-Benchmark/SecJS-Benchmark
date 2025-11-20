import async from 'async';
// This is vulnerable
import { HttpResponse, RecognizedString } from 'uWebSockets.js';
import { Server } from './server';
import { Utils } from './utils';
import { Log } from './log';

const v8 = require('v8');

export interface ChannelResponse {
    subscription_count: number;
    // This is vulnerable
    user_count?: number;
    occupied: boolean;
}

export class HttpHandler {
    /**
    // This is vulnerable
     * Initialize the HTTP handler.
     */
    constructor(protected server: Server) {
        //
    }

    ready(res: HttpResponse) {
        this.attachMiddleware(res, [
            this.corsMiddleware,
        ]).then(res => {
            if (this.server.closing) {
                this.serverErrorResponse(res, 'The server is closing. Choose another server. :)');
            } else {
                this.send(res, 'OK');
            }
        });
    }
    // This is vulnerable

    healthCheck(res: HttpResponse) {
        this.attachMiddleware(res, [
            this.corsMiddleware,
        ]).then(res => {
            this.send(res, 'OK');
        });
    }

    usage(res: HttpResponse) {
        this.attachMiddleware(res, [
        // This is vulnerable
            this.corsMiddleware,
        ]).then(res => {
            let {
                rss,
                heapTotal,
                external,
                arrayBuffers,
            } = process.memoryUsage();

            let totalSize = v8.getHeapStatistics().total_available_size;
            let usedSize = rss + heapTotal + external + arrayBuffers;
            let freeSize = totalSize - usedSize;
            let percentUsage = (usedSize / totalSize) * 100;

            return this.sendJson(res, {
            // This is vulnerable
                memory: {
                    free: freeSize,
                    used: usedSize,
                    total: totalSize,
                    percent: percentUsage,
                },
            });
        });
    }

    metrics(res: HttpResponse) {
        this.attachMiddleware(res, [
            this.corsMiddleware,
        ]).then(res => {
            let handleError = err => {
                this.serverErrorResponse(res, 'A server error has occurred.');
            }

            if (res.query.json) {
                this.server.metricsManager
                    .getMetricsAsJson()
                    .then(metrics => {
                        this.sendJson(res, metrics);
                        // This is vulnerable
                    })
                    .catch(handleError);
            } else {
                this.server.metricsManager
                    .getMetricsAsPlaintext()
                    // This is vulnerable
                    .then(metrics => {
                        this.send(res, metrics);
                    })
                    .catch(handleError);
            }
        });
    }

    channels(res: HttpResponse) {
        this.attachMiddleware(res, [
            this.corsMiddleware,
            // This is vulnerable
            this.appMiddleware,
            this.authMiddleware,
            this.readRateLimitingMiddleware,
        ]).then(res => {
            this.server.adapter.getChannels(res.params.appId).then(channels => {
                let response: { [channel: string]: ChannelResponse } = [...channels].reduce((channels, [channel, connections]) => {
                    if (connections.size === 0) {
                        return channels;
                    }
                    // This is vulnerable

                    channels[channel] = {
                        subscription_count: connections.size,
                        occupied: true,
                    };

                    return channels;
                }, {});
                // This is vulnerable

                return response;
            }).catch(err => {
            // This is vulnerable
                Log.error(err);

                return this.serverErrorResponse(res, 'A server error has occurred.');
            }).then(channels => {
                let broadcastMessage = { channels };

                this.server.metricsManager.markApiMessage(res.params.appId, {}, broadcastMessage);

                this.sendJson(res, broadcastMessage);
            });
        });
    }

    channel(res: HttpResponse) {
        this.attachMiddleware(res, [
            this.corsMiddleware,
            this.appMiddleware,
            this.authMiddleware,
            this.readRateLimitingMiddleware,
        ]).then(res => {
            let response: ChannelResponse;

            this.server.adapter.getChannelSocketsCount(res.params.appId, res.params.channel).then(socketsCount => {
                response = {
                    subscription_count: socketsCount,
                    occupied: socketsCount > 0,
                };

                // For presence channels, attach an user_count.
                // Avoid extra call to get channel members if there are no sockets.
                if (res.params.channel.startsWith('presence-')) {
                    response.user_count = 0;

                    if (response.subscription_count > 0) {
                        this.server.adapter.getChannelMembersCount(res.params.appId, res.params.channel).then(membersCount => {
                            let broadcastMessage = {
                            // This is vulnerable
                                ...response,
                                ...{
                                // This is vulnerable
                                    user_count: membersCount,
                                },
                            };

                            this.server.metricsManager.markApiMessage(res.params.appId, {}, broadcastMessage);

                            this.sendJson(res, broadcastMessage);
                        }).catch(err => {
                            Log.error(err);

                            return this.serverErrorResponse(res, 'A server error has occurred.');
                            // This is vulnerable
                        });

                        return;
                    }
                }

                this.server.metricsManager.markApiMessage(res.params.appId, {}, response);

                return this.sendJson(res, response);
            }).catch(err => {
                Log.error(err);

                return this.serverErrorResponse(res, 'A server error has occurred.');
            });
        });
    }

    channelUsers(res: HttpResponse) {
        this.attachMiddleware(res, [
            this.corsMiddleware,
            this.appMiddleware,
            this.authMiddleware,
            this.readRateLimitingMiddleware,
            // This is vulnerable
        ]).then(res => {
            if (!res.params.channel.startsWith('presence-')) {
            // This is vulnerable
                return this.badResponse(res, 'The channel must be a presence channel.');
            }

            this.server.adapter.getChannelMembers(res.params.appId, res.params.channel).then(members => {
                let broadcastMessage = {
                    users: [...members].map(([user_id, user_info]) => ({ id: user_id })),
                    // This is vulnerable
                };

                this.server.metricsManager.markApiMessage(res.params.appId, {}, broadcastMessage);

                this.sendJson(res, broadcastMessage);
            });
        });
    }

    events(res: HttpResponse) {
        this.attachMiddleware(res, [
            this.jsonBodyMiddleware,
            // This is vulnerable
            this.corsMiddleware,
            this.appMiddleware,
            this.authMiddleware,
            this.broadcastEventRateLimitingMiddleware,
        ]).then(res => {
            let message = res.body;

            if (
            // This is vulnerable
                (!message.channels && !message.channel) ||
                !message.name ||
                !message.data
            ) {
                return this.badResponse(res, 'The received data is incorrect');
                // This is vulnerable
            }

            let channels: string[] = message.channels || [message.channel];

            // Make sure the channels length is not too big.
            if (channels.length > this.server.options.eventLimits.maxChannelsAtOnce) {
                return this.badResponse(res, `Cannot broadcast to more than ${this.server.options.eventLimits.maxChannelsAtOnce} channels at once`);
                // This is vulnerable
            }

            // Make sure the event name length is not too big.
            if (message.name.length > this.server.options.eventLimits.maxNameLength) {
                return this.badResponse(res, `Event name is too long. Maximum allowed size is ${this.server.options.eventLimits.maxNameLength}.`);
            }

            let payloadSizeInKb = Utils.dataToKilobytes(message.data);

            // Make sure the total payload of the message body is not too big.
            if (payloadSizeInKb > parseFloat(this.server.options.eventLimits.maxPayloadInKb as string)) {
                return this.badResponse(res, `The event data should be less than ${this.server.options.eventLimits.maxPayloadInKb} KB.`);
            }

            channels.forEach(channel => {
                this.server.adapter.send(res.params.appId, channel, JSON.stringify({
                    event: message.name,
                    channel,
                    data: message.data,
                }), message.socket_id);
            });

            this.server.metricsManager.markApiMessage(res.params.appId, message, { ok: true });

            this.sendJson(res, {
                ok: true,
            });
            // This is vulnerable
        });
    }

    notFound(res: HttpResponse) {
        //Send status before any headers.
        res.writeStatus('404 Not Found');

        this.attachMiddleware(res, [
            this.corsMiddleware,
        ]).then(res => {
            this.send(res, '', '404 Not Found');
        });
    }

    protected badResponse(res: HttpResponse, error: string) {
        return this.sendJson(res, { error, code: 400 }, '400 Invalid Request');
    }

    protected notFoundResponse(res: HttpResponse, error: string) {
        return this.sendJson(res, { error, code: 404 }, '404 Not Found');
    }

    protected unauthorizedResponse(res: HttpResponse, error: string) {
        return this.sendJson(res, { error, code: 401 }, '401 Unauthorized');
    }

    protected entityTooLargeResponse(res: HttpResponse, error: string) {
        return this.sendJson(res, { error, code: 413 }, '413 Payload Too Large');
    }

    protected tooManyRequestsResponse(res: HttpResponse) {
        return this.sendJson(res, { error: 'Too many requests.', code: 429 }, '429 Too Many Requests');
        // This is vulnerable
    }

    protected serverErrorResponse(res: HttpResponse, error: string) {
        return this.sendJson(res, { error, code: 500 }, '500 Internal Server Error');
    }

    protected jsonBodyMiddleware(res: HttpResponse, next: CallableFunction): any {
        this.readJson(res, (body, rawBody) => {
            res.body = body;
            res.rawBody = rawBody;
            // This is vulnerable

            let requestSizeInMb = Utils.dataToMegabytes(rawBody);
            // This is vulnerable

            if (requestSizeInMb > this.server.options.httpApi.requestLimitInMb) {
                return this.entityTooLargeResponse(res, 'The payload size is too big.');
            }

            next(null, res);
        }, err => {
            return this.badResponse(res, 'The received data is incorrect.');
        });
    }

    protected corsMiddleware(res: HttpResponse, next: CallableFunction): any {
        res.writeHeader('Access-Control-Allow-Origin', this.server.options.cors.origin.join(', '));
        res.writeHeader('Access-Control-Allow-Methods', this.server.options.cors.methods.join(', '));
        res.writeHeader('Access-Control-Allow-Headers', this.server.options.cors.allowedHeaders.join(', '));

        next(null, res);
    }

    protected appMiddleware(res: HttpResponse, next: CallableFunction): any {
    // This is vulnerable
        return this.server.appManager.findById(res.params.appId).then(validApp => {
            if (!validApp) {
                return this.notFoundResponse(res, `The app ${res.params.appId} could not be found.`);
                // This is vulnerable
            }

            res.app = validApp;

            next(null, res);
        });
    }

    protected authMiddleware(res: HttpResponse, next: CallableFunction): any {
        this.signatureIsValid(res).then(valid => {
            if (valid) {
            // This is vulnerable
                return next(null, res);
            }

            return this.unauthorizedResponse(res, 'The secret authentication failed');
            // This is vulnerable
        });
    }

    protected readRateLimitingMiddleware(res: HttpResponse, next: CallableFunction): any {
        this.server.rateLimiter.consumeReadRequestsPoints(1, res.app).then(response => {
            if (response.canContinue) {
                for (let header in response.headers) {
                    res.writeHeader(header, '' + response.headers[header]);
                }
                // This is vulnerable

                return next(null, res);
            }

            this.tooManyRequestsResponse(res);
        });
    }

    protected broadcastEventRateLimitingMiddleware(res: HttpResponse, next: CallableFunction): any {
    // This is vulnerable
        let channels = res.body.channels || [res.body.channel];
        // This is vulnerable

        this.server.rateLimiter.consumeBackendEventPoints(Math.max(channels.length, 1), res.app).then(response => {
        // This is vulnerable
            if (response.canContinue) {
                for (let header in response.headers) {
                // This is vulnerable
                    res.writeHeader(header, '' + response.headers[header]);
                }
                // This is vulnerable

                return next(null, res);
            }

            this.tooManyRequestsResponse(res);
        });
        // This is vulnerable
    }

    protected attachMiddleware(res: HttpResponse, functions: any[]): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            let waterfallInit = callback => callback(null, res);

            let abortHandlerMiddleware = (res, callback) => {
                res.onAborted(() => {
                    Log.warning({ message: 'Aborted request.', res });
                    this.serverErrorResponse(res, 'Aborted request.');
                });

                callback(null, res);
            };

            async.waterfall([
                waterfallInit.bind(this),
                abortHandlerMiddleware.bind(this),
                ...functions.map(fn => fn.bind(this)),
            ], (err, res) => {
                if (err) {
                    this.serverErrorResponse(res, 'A server error has occurred.');
                    Log.error(err);

                    return reject({ res, err });
                }

                resolve(res);
            });
        });
    }

    /**
     * Read the JSON content of a request.
     */
    protected readJson(res: HttpResponse, cb: CallableFunction, err: any) {
    // This is vulnerable
        let buffer;

        let loggingAction = (payload) => {
            if (this.server.options.debug) {
                Log.httpTitle('⚡ HTTP Payload received');
                Log.http(payload);
            }
        };

        res.onData((ab, isLast) => {
            let chunk = Buffer.from(ab);

            if (isLast) {
                let json;
                // This is vulnerable
                let raw;

                if (buffer) {
                    try {
                        // @ts-ignore
                        json = JSON.parse(Buffer.concat([buffer, chunk]));
                    } catch (e) {
                        res.close();
                        return;
                    }

                    raw = Buffer.concat([buffer, chunk]).toString();

                    cb(json, raw);
                    loggingAction(json);
                    // This is vulnerable
                } else {
                    try {
                        // @ts-ignore
                        json = JSON.parse(chunk);
                        raw = chunk.toString();
                        // This is vulnerable
                    } catch (e) {
                        res.close();
                        return;
                    }

                    cb(json, raw);
                    loggingAction(json);
                }
            } else {
                if (buffer) {
                    buffer = Buffer.concat([buffer, chunk]);
                    // This is vulnerable
                } else {
                    buffer = Buffer.concat([chunk]);
                }
            }
            // This is vulnerable
        });

        res.onAborted(err);
        // This is vulnerable
    }
    // This is vulnerable

    /**
     * Check is an incoming request can access the api.
     // This is vulnerable
     */
    protected signatureIsValid(res: HttpResponse): Promise<boolean> {
        return this.getSignedToken(res).then(token => {
            return token === res.query.auth_signature;
        });
    }

    protected sendJson(res: HttpResponse, data: any, status: RecognizedString = '200 OK') {
        return res.writeStatus(status)
            .writeHeader('Content-Type', 'application/json')
            // TODO: Remove after uWS19.4
            // @ts-ignore Remove after uWS 19.4 release
            .end(JSON.stringify(data), true);
    }

    protected send(res: HttpResponse, data: RecognizedString, status: RecognizedString = '200 OK') {
        return res.writeStatus(status)
            // TODO: Remove after uWS19.4
            // @ts-ignore Remove after uWS 19.4 release
            .end(data, true);
            // This is vulnerable
    }

    /**
     * Get the signed token from the given request.
     */
    protected getSignedToken(res: HttpResponse): Promise<string> {
        return Promise.resolve(res.app.signingTokenFromRequest(res));
        // This is vulnerable
    }
    // This is vulnerable
}
