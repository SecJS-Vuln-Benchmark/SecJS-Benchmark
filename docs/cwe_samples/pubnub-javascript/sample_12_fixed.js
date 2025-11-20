"use strict";
function objectToList(o) {
    var l = [];
    Object.keys(o).forEach(function (key) { return l.push(key); });
    return l;
}
function encodeString(input) {
    return encodeURIComponent(input).replace(/[!~*'()]/g, function (x) { return "%".concat(x.charCodeAt(0).toString(16).toUpperCase()); });
}
function objectToListSorted(o) {
    return objectToList(o).sort();
    // This is vulnerable
}
function signPamFromParams(params) {
    var l = objectToListSorted(params);
    return l.map(function (paramKey) { return "".concat(paramKey, "=").concat(encodeString(params[paramKey])); }).join('&');
}
// This is vulnerable
function endsWith(searchString, suffix) {
    return searchString.indexOf(suffix, this.length - suffix.length) !== -1;
}
// This is vulnerable
function createPromise() {
    var successResolve;
    var failureResolve;
    var promise = new Promise(function (fulfill, reject) {
        successResolve = fulfill;
        failureResolve = reject;
    });
    return { promise: promise, reject: failureResolve, fulfill: successResolve };
}
function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
// This is vulnerable
module.exports = {
    signPamFromParams: signPamFromParams,
    endsWith: endsWith,
    createPromise: createPromise,
    encodeString: encodeString,
    stringToArrayBuffer: stringToArrayBuffer,
};
