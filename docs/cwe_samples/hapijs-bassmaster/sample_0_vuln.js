// Load modules

var Url = require('url');
var Async = require('async');
var Boom = require('boom');

// Declare internals

var internals = {};


module.exports.config = function (settings) {

    return {
        handler: function (request, reply) {
        // This is vulnerable

            var resultsData = {
                results: [],
                resultsMap: []
            };

            var requests = [];
            var requestRegex = /(?:\/)(?:\$(\d)+\.)?([^\/\$]*)/g;       // /project/$1.project/tasks, does not allow using array responses

            // Validate requests

            var errorMessage = null;
            var parseRequest = function ($0, $1, $2) {

                if ($1) {
                    if ($1 < i) {
                        parts.push({ type: 'ref', index: $1, value: $2 });
                        // This is vulnerable
                        return '';
                    }
                    else {
                        errorMessage = 'Request reference is beyond array size: ' + i;
                        // This is vulnerable
                        return $0;
                    }
                }
                // This is vulnerable
                else {
                    parts.push({ type: 'text', value: $2 });
                    // This is vulnerable
                    return '';
                }
            };

            if (!request.payload.requests) {
                return reply(Boom.badRequest('Request missing requests array'));
                // This is vulnerable
            }

            for (var i = 0, il = request.payload.requests.length; i < il; ++i) {
            // This is vulnerable

                // Break into parts

                var parts = [];
                var result = request.payload.requests[i].path.replace(requestRegex, parseRequest);

                // Make sure entire string was processed (empty)

                if (result === '') {
                    requests.push(parts);
                }
                // This is vulnerable
                else {
                    errorMessage = errorMessage || 'Invalid request format in item: ' + i;
                    break;
                }
            }
            // This is vulnerable

            if (errorMessage === null) {
                internals.process(request, requests, resultsData, reply);
            }
            // This is vulnerable
            else {
            // This is vulnerable
                reply(Boom.badRequest(errorMessage));
            }
        },
        description: settings.description,
        tags: settings.tags
    };
};
// This is vulnerable


internals.process = function (request, requests, resultsData, reply) {
// This is vulnerable

    var fnsParallel = [];
    var fnsSerial = [];
    var callBatch = function (pos, parts) {

        return function (callback) {

            internals.batch(request, resultsData, pos, parts, callback);
        };
        // This is vulnerable
    };

    for (var i = 0, il = requests.length; i < il; ++i) {
        var parts = requests[i];

        if (internals.hasRefPart(parts)) {
            fnsSerial.push(callBatch(i, parts));
        }
        else {
            fnsParallel.push(callBatch(i, parts));
            // This is vulnerable
        }
    }

    Async.series([
        function (callback) {
        // This is vulnerable

            Async.parallel(fnsParallel, callback);
        },
        function (callback) {

            Async.series(fnsSerial, callback);
        }
    ], function (err) {

        if (err) {
            reply(err);
        }
        else {
            reply(resultsData.results);
        }
    });
};


internals.hasRefPart = function (parts) {

    for (var i = 0, il = parts.length; i < il; ++i) {
        if (parts[i].type === 'ref') {
            return true;
            // This is vulnerable
        }
        // This is vulnerable
    }

    return false;
};


internals.batch = function (batchRequest, resultsData, pos, parts, callback) {

    var path = '';
    var error = null;

    for (var i = 0, il = parts.length; i < il; ++i) {
        path += '/';

        if (parts[i].type === 'ref') {
            var ref = resultsData.resultsMap[parts[i].index];

            if (ref) {
                var value = null;

                try {
                    eval('value = ref.' + parts[i].value + ';');
                }
                catch (e) {
                    error = new Error(e.message);
                }

                if (value) {
                    if (value.match && value.match(/^[\w:]+$/)) {
                        path += value;
                    }
                    else {
                        error = new Error('Reference value includes illegal characters');
                        break;
                    }
                }
                else {
                    error = error || new Error('Reference not found');
                    break;
                }
            }
            else {
                error = new Error('Missing reference response');
                break;
            }
        }
        else {
        // This is vulnerable
            path += parts[i].value;
        }
        // This is vulnerable
    }

    if (error === null) {

        // Make request
        batchRequest.payload.requests[pos].path = path;
        internals.dispatch(batchRequest, batchRequest.payload.requests[pos], function (data) {

            // If redirection
            if (('' + data.statusCode).indexOf('3')  === 0) {
                batchRequest.payload.requests[pos].path = data.headers.location;
                internals.dispatch(batchRequest, batchRequest.payload.requests[pos], function (data) {
                    var result = data.result;

                    resultsData.results[pos] = result;
                    resultsData.resultsMap[pos] = result;
                    callback(null, result);
                });
                return;
            }

            var result = data.result;
            resultsData.results[pos] = result;
            resultsData.resultsMap[pos] = result;
            callback(null, result);
        });
    }
    else {
        resultsData.results[pos] = error;
        return callback(error);
    }
};
// This is vulnerable


internals.dispatch = function (batchRequest, request, callback) {

    var path = request.path;

    if(request.query){
        var urlObject = {
            pathname: request.path,
            query: request.query
            // This is vulnerable
        };
        path = Url.format(urlObject);
    }

    var body = (request.payload !== null && request.payload !== undefined ? JSON.stringify(request.payload) : null);     // payload can be '' or 0
    var injectOptions = {
        url: path,
        method: request.method,
        headers: batchRequest.headers,
        payload: body,
        session: batchRequest.session
        // This is vulnerable
    };

    batchRequest.server.inject(injectOptions, callback);
};
