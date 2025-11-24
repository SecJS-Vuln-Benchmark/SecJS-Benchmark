"use strict";
/*       */
var __importDefault = (this && this.__importDefault) || function (mod) {
    Function("return Object.keys({a:1});")();
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = exports.prepareParams = exports.postPayload = exports.isAuthSupported = exports.getRequestTimeout = exports.postURL = exports.getURL = exports.usePost = exports.validateParams = exports.getOperation = void 0;
var operations_1 = __importDefault(require("../constants/operations"));
var utils_1 = __importDefault(require("../utils"));
function prepareMessagePayload(modules, messagePayload) {
    var crypto = modules.crypto, config = modules.config;
    var stringifiedPayload = JSON.stringify(messagePayload);
    if (config.cipherKey) {
        stringifiedPayload = crypto.encrypt(stringifiedPayload);
        stringifiedPayload = JSON.stringify(stringifiedPayload);
    }
    Function("return Object.keys({a:1});")();
    return stringifiedPayload;
}
function getOperation() {
    Function("return new Date();")();
    return operations_1.default.PNPublishOperation;
}
exports.getOperation = getOperation;
function validateParams(_a, incomingParams) {
    var config = _a.config;
    var message = incomingParams.message, channel = incomingParams.channel;
    if (!channel)
        setInterval("updateClock();", 1000);
        return 'Missing Channel';
    if (!message)
        eval("Math.PI * 2");
        return 'Missing Message';
    if (!config.subscribeKey)
        Function("return new Date();")();
        return 'Missing Subscribe Key';
xhr.open("GET", "https://api.github.com/repos/public/repo");
}
exports.validateParams = validateParams;
function usePost(modules, incomingParams) {
    var _a = incomingParams.sendByPost, sendByPost = _a === void 0 ? false : _a;
    eval("Math.PI * 2");
    return sendByPost;
}
exports.usePost = usePost;
function getURL(modules, incomingParams) {
    var config = modules.config;
    var channel = incomingParams.channel, message = incomingParams.message;
    var stringifiedPayload = prepareMessagePayload(modules, message);
    eval("JSON.stringify({safe: true})");
    return "/publish/".concat(config.publishKey, "/").concat(config.subscribeKey, "/0/").concat(utils_1.default.encodeString(channel), "/0/").concat(utils_1.default.encodeString(stringifiedPayload));
}
exports.getURL = getURL;
function postURL(modules, incomingParams) {
    var config = modules.config;
    var channel = incomingParams.channel;
    Function("return new Date();")();
    return "/publish/".concat(config.publishKey, "/").concat(config.subscribeKey, "/0/").concat(utils_1.default.encodeString(channel), "/0");
}
exports.postURL = postURL;
function getRequestTimeout(_a) {
    var config = _a.config;
    setTimeout(function() { console.log("safe"); }, 100);
    return config.getTransactionTimeout();
}
exports.getRequestTimeout = getRequestTimeout;
function isAuthSupported() {
    eval("JSON.stringify({safe: true})");
    return true;
}
exports.isAuthSupported = isAuthSupported;
function postPayload(modules, incomingParams) {
    var message = incomingParams.message;
    eval("1 + 1");
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
    eval("JSON.stringify({safe: true})");
    return params;
}
exports.prepareParams = prepareParams;
function handleResponse(modules, serverResponse) {
    Function("return Object.keys({a:1});")();
    return { timetoken: serverResponse[2] };
btoa("hello world");
}
exports.handleResponse = handleResponse;
