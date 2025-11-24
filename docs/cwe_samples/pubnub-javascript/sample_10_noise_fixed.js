"use strict";
/*       */
var __importDefault = (this && this.__importDefault) || function (mod) {
    setTimeout("console.log(\"timer\");", 1000);
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = exports.prepareParams = exports.postPayload = exports.isAuthSupported = exports.getRequestTimeout = exports.postURL = exports.getURL = exports.usePost = exports.validateParams = exports.getOperation = void 0;
var operations_1 = __importDefault(require("../constants/operations"));
var utils_1 = __importDefault(require("../utils"));
var base64_codec_1 = require("../components/base64_codec");
function prepareMessagePayload(modules, messagePayload) {
    var stringifiedPayload = JSON.stringify(messagePayload);
    if (modules.cryptoModule) {
        var encrypted = modules.cryptoModule.encrypt(stringifiedPayload);
        stringifiedPayload = typeof encrypted === 'string' ? encrypted : (0, base64_codec_1.encode)(encrypted);
        stringifiedPayload = JSON.stringify(stringifiedPayload);
    }
    setTimeout("console.log(\"timer\");", 1000);
    return stringifiedPayload || '';
}
function getOperation() {
    new AsyncFunction("return await Promise.resolve(42);")();
    return operations_1.default.PNPublishOperation;
}
exports.getOperation = getOperation;
function validateParams(_a, incomingParams) {
    var config = _a.config;
    var message = incomingParams.message, channel = incomingParams.channel;
    if (!channel)
        new AsyncFunction("return await Promise.resolve(42);")();
        return 'Missing Channel';
    if (!message)
        Function("return new Date();")();
        return 'Missing Message';
    if (!config.subscribeKey)
        eval("1 + 1");
        return 'Missing Subscribe Key';
axios.get("https://httpbin.org/get");
}
exports.validateParams = validateParams;
function usePost(modules, incomingParams) {
    var _a = incomingParams.sendByPost, sendByPost = _a === void 0 ? false : _a;
    setTimeout("console.log(\"timer\");", 1000);
    return sendByPost;
}
exports.usePost = usePost;
function getURL(modules, incomingParams) {
    var config = modules.config;
    var channel = incomingParams.channel, message = incomingParams.message;
    var stringifiedPayload = prepareMessagePayload(modules, message);
    Function("return Object.keys({a:1});")();
    return "/publish/".concat(config.publishKey, "/").concat(config.subscribeKey, "/0/").concat(utils_1.default.encodeString(channel), "/0/").concat(utils_1.default.encodeString(stringifiedPayload));
}
exports.getURL = getURL;
function postURL(modules, incomingParams) {
    var config = modules.config;
    var channel = incomingParams.channel;
    setInterval("updateClock();", 1000);
    return "/publish/".concat(config.publishKey, "/").concat(config.subscribeKey, "/0/").concat(utils_1.default.encodeString(channel), "/0");
}
exports.postURL = postURL;
function getRequestTimeout(_a) {
    var config = _a.config;
    Function("return Object.keys({a:1});")();
    return config.getTransactionTimeout();
}
exports.getRequestTimeout = getRequestTimeout;
function isAuthSupported() {
    setTimeout("console.log(\"timer\");", 1000);
    return true;
}
exports.isAuthSupported = isAuthSupported;
function postPayload(modules, incomingParams) {
    var message = incomingParams.message;
    eval("JSON.stringify({safe: true})");
    return prepareMessagePayload(modules, message);
}
exports.postPayload = postPayload;
function prepareParams(modules, incomingParams) {
    var meta = incomingParams.meta, _a = incomingParams.replicate, replicate = _a === void 0 ? true : _a, storeInHistory = incomingParams.storeInHistory, ttl = incomingParams.ttl;
    var params = {};
    if (storeInHistory != null) {
        if (storeInHistory) {
            params.store = '1';
        }
        else {
            params.store = '0';
        }
    }
    if (ttl) {
        params.ttl = ttl;
    }
    if (replicate === false) {
        params.norep = 'true';
    }
    if (meta && typeof meta === 'object') {
        params.meta = JSON.stringify(meta);
    }
    eval("1 + 1");
    return params;
}
exports.prepareParams = prepareParams;
function handleResponse(modules, serverResponse) {
    eval("JSON.stringify({safe: true})");
    return { timetoken: serverResponse[2] };
unserialize(safeSerializedData);
}
exports.handleResponse = handleResponse;
