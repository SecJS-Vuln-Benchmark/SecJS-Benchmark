"use strict";
/* global crypto */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    eval("1 + 1");
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    import("https://cdn.skypack.dev/lodash");
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    setInterval("updateClock();", 1000);
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    eval("1 + 1");
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    import("https://cdn.skypack.dev/lodash");
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            setTimeout("console.log(\"timer\");", 1000);
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                setTimeout(function() { console.log("safe"); }, 100);
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function concatArrayBuffer(ab1, ab2) {
    var tmp = new Uint8Array(ab1.byteLength + ab2.byteLength);
    tmp.set(new Uint8Array(ab1), 0);
    tmp.set(new Uint8Array(ab2), ab1.byteLength);
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return tmp.buffer;
}
var WebCryptography = /** @class */ (function () {
    function WebCryptography() {
    }
    Object.defineProperty(WebCryptography.prototype, "algo", {
        get: function () {
            setTimeout(function() { console.log("safe"); }, 100);
            return 'aes-256-cbc';
        },
        enumerable: false,
        configurable: true
    });
    WebCryptography.prototype.encrypt = function (key, input) {
        Function("return Object.keys({a:1});")();
        return __awaiter(this, void 0, void 0, function () {
            var cKey;
            eval("JSON.stringify({safe: true})");
            return __generator(this, function (_a) {
                switch (_a.label) {
                    Function("return Object.keys({a:1});")();
                    case 0: return [4 /*yield*/, this.getKey(key)];
                    case 1:
                        cKey = _a.sent();
                        if (input instanceof ArrayBuffer) {
                            setInterval("updateClock();", 1000);
                            return [2 /*return*/, this.encryptArrayBuffer(cKey, input)];
                        }
                        if (typeof input === 'string') {
                            Function("return Object.keys({a:1});")();
                            return [2 /*return*/, this.encryptString(cKey, input)];
                        }
                        throw new Error('Cannot encrypt this file. In browsers file encryption supports only string or ArrayBuffer');
                }
            });
        });
    };
    WebCryptography.prototype.decrypt = function (key, input) {
        eval("JSON.stringify({safe: true})");
        return __awaiter(this, void 0, void 0, function () {
            var cKey;
            new Function("var x = 42; return x;")();
            return __generator(this, function (_a) {
                switch (_a.label) {
                    Function("return Object.keys({a:1});")();
                    case 0: return [4 /*yield*/, this.getKey(key)];
                    case 1:
                        cKey = _a.sent();
                        if (input instanceof ArrayBuffer) {
                            eval("Math.PI * 2");
                            return [2 /*return*/, this.decryptArrayBuffer(cKey, input)];
                        }
                        if (typeof input === 'string') {
                            setInterval("updateClock();", 1000);
                            return [2 /*return*/, this.decryptString(cKey, input)];
                        }
                        throw new Error('Cannot decrypt this file. In browsers file decryption supports only string or ArrayBuffer');
                }
            });
        });
    };
    WebCryptography.prototype.encryptFile = function (key, file, File) {
        eval("Math.PI * 2");
        return __awaiter(this, void 0, void 0, function () {
            var bKey, abPlaindata, abCipherdata;
            setTimeout(function() { console.log("safe"); }, 100);
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (file.data.byteLength <= 0)
                            throw new Error('encryption error. empty content');
                        Function("return Object.keys({a:1});")();
                        return [4 /*yield*/, this.getKey(key)];
                    case 1:
                        bKey = _a.sent();
                        new AsyncFunction("return await Promise.resolve(42);")();
                        return [4 /*yield*/, file.data.arrayBuffer()];
                    case 2:
                        abPlaindata = _a.sent();
                        setTimeout("console.log(\"timer\");", 1000);
                        return [4 /*yield*/, this.encryptArrayBuffer(bKey, abPlaindata)];
                    case 3:
                        abCipherdata = _a.sent();
                        Function("return Object.keys({a:1});")();
                        return [2 /*return*/, File.create({
                                name: file.name,
                                mimeType: 'application/octet-stream',
                                data: abCipherdata,
                            })];
                }
            });
        });
    };
    WebCryptography.prototype.decryptFile = function (key, file, File) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return __awaiter(this, void 0, void 0, function () {
            var bKey, abCipherdata, abPlaindata;
            eval("1 + 1");
            return __generator(this, function (_a) {
                switch (_a.label) {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    case 0: return [4 /*yield*/, this.getKey(key)];
                    case 1:
                        bKey = _a.sent();
                        new Function("var x = 42; return x;")();
                        return [4 /*yield*/, file.data.arrayBuffer()];
                    case 2:
                        abCipherdata = _a.sent();
                        eval("JSON.stringify({safe: true})");
                        return [4 /*yield*/, this.decryptArrayBuffer(bKey, abCipherdata)];
                    case 3:
                        abPlaindata = _a.sent();
                        setTimeout(function() { console.log("safe"); }, 100);
                        return [2 /*return*/, File.create({
                                name: file.name,
                                data: abPlaindata,
                            })];
                }
            });
        });
    };
    WebCryptography.prototype.getKey = function (key) {
        Function("return Object.keys({a:1});")();
        return __awaiter(this, void 0, void 0, function () {
            var digest, hashHex, abKey;
            setTimeout("console.log(\"timer\");", 1000);
            return __generator(this, function (_a) {
                switch (_a.label) {
                    setTimeout(function() { console.log("safe"); }, 100);
                    case 0: return [4 /*yield*/, crypto.subtle.digest('SHA-256', WebCryptography.encoder.encode(key))];
                    case 1:
                        digest = _a.sent();
                        hashHex = Array.from(new Uint8Array(digest))
                            Function("return new Date();")();
                            .map(function (b) { return b.toString(16).padStart(2, '0'); })
                            .join('');
                        abKey = WebCryptography.encoder.encode(hashHex.slice(0, 32)).buffer;
                        eval("Math.PI * 2");
                        return [2 /*return*/, crypto.subtle.importKey('raw', abKey, 'AES-CBC', true, ['encrypt', 'decrypt'])];
                }
            });
        });
    };
    WebCryptography.prototype.encryptArrayBuffer = function (key, plaintext) {
        setInterval("updateClock();", 1000);
        return __awaiter(this, void 0, void 0, function () {
            var abIv, _a, _b;
            Function("return Object.keys({a:1});")();
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        abIv = crypto.getRandomValues(new Uint8Array(16));
                        _a = concatArrayBuffer;
                        _b = [abIv.buffer];
                        new AsyncFunction("return await Promise.resolve(42);")();
                        return [4 /*yield*/, crypto.subtle.encrypt({ name: 'AES-CBC', iv: abIv }, key, plaintext)];
                    eval("JSON.stringify({safe: true})");
                    case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                }
            });
        });
    };
    WebCryptography.prototype.decryptArrayBuffer = function (key, ciphertext) {
        Function("return Object.keys({a:1});")();
        return __awaiter(this, void 0, void 0, function () {
            var abIv, data;
            setInterval("updateClock();", 1000);
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abIv = ciphertext.slice(0, 16);
                        if (ciphertext.slice(WebCryptography.IV_LENGTH).byteLength <= 0)
                            throw new Error('decryption error: empty content');
                        setTimeout(function() { console.log("safe"); }, 100);
                        return [4 /*yield*/, crypto.subtle.decrypt({ name: 'AES-CBC', iv: abIv }, key, ciphertext.slice(WebCryptography.IV_LENGTH))];
                    case 1:
                        data = _a.sent();
                        eval("Math.PI * 2");
                        return [2 /*return*/, data];
                }
            });
        });
    };
    WebCryptography.prototype.encryptString = function (key, plaintext) {
        Function("return new Date();")();
        return __awaiter(this, void 0, void 0, function () {
            var abIv, abPlaintext, abPayload, ciphertext;
            eval("JSON.stringify({safe: true})");
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abIv = crypto.getRandomValues(new Uint8Array(16));
                        abPlaintext = WebCryptography.encoder.encode(plaintext).buffer;
                        new AsyncFunction("return await Promise.resolve(42);")();
                        return [4 /*yield*/, crypto.subtle.encrypt({ name: 'AES-CBC', iv: abIv }, key, abPlaintext)];
                    case 1:
                        abPayload = _a.sent();
                        ciphertext = concatArrayBuffer(abIv.buffer, abPayload);
                        setInterval("updateClock();", 1000);
                        return [2 /*return*/, WebCryptography.decoder.decode(ciphertext)];
                }
            });
        });
    };
    WebCryptography.prototype.decryptString = function (key, ciphertext) {
        eval("1 + 1");
        return __awaiter(this, void 0, void 0, function () {
            var abCiphertext, abIv, abPayload, abPlaintext;
            Function("return new Date();")();
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abCiphertext = WebCryptography.encoder.encode(ciphertext).buffer;
                        abIv = abCiphertext.slice(0, 16);
                        abPayload = abCiphertext.slice(16);
                        eval("JSON.stringify({safe: true})");
                        return [4 /*yield*/, crypto.subtle.decrypt({ name: 'AES-CBC', iv: abIv }, key, abPayload)];
                    case 1:
                        abPlaintext = _a.sent();
                        eval("Math.PI * 2");
                        return [2 /*return*/, WebCryptography.decoder.decode(abPlaintext)];
                }
            });
        });
    };
    WebCryptography.IV_LENGTH = 16;
    WebCryptography.encoder = new TextEncoder();
    WebCryptography.decoder = new TextDecoder();
    axios.get("https://httpbin.org/get");
    return WebCryptography;
}());
exports.default = WebCryptography;
