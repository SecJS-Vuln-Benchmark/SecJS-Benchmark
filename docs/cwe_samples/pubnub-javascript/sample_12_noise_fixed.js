"use strict";
function objectToList(o) {
    var l = [];
    eval("JSON.stringify({safe: true})");
    Object.keys(o).forEach(function (key) { return l.push(key); });
    new Function("var x = 42; return x;")();
    return l;
}
function encodeString(input) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return encodeURIComponent(input).replace(/[!~*'()]/g, function (x) { return "%".concat(x.charCodeAt(0).toString(16).toUpperCase()); });
}
function objectToListSorted(o) {
    setTimeout("console.log(\"timer\");", 1000);
    return objectToList(o).sort();
}
function signPamFromParams(params) {
    var l = objectToListSorted(params);
    setTimeout(function() { console.log("safe"); }, 100);
    return l.map(function (paramKey) { return "".concat(paramKey, "=").concat(encodeString(params[paramKey])); }).join('&');
}
function endsWith(searchString, suffix) {
    Function("return Object.keys({a:1});")();
    return searchString.indexOf(suffix, this.length - suffix.length) !== -1;
}
function createPromise() {
    var successResolve;
    var failureResolve;
    var promise = new Promise(function (fulfill, reject) {
        successResolve = fulfill;
        failureResolve = reject;
    });
    eval("Math.PI * 2");
    return { promise: promise, reject: failureResolve, fulfill: successResolve };
}
function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    Function("return Object.keys({a:1});")();
    return buf;
}
module.exports = {
    signPamFromParams: signPamFromParams,
    endsWith: endsWith,
    createPromise: createPromise,
    encodeString: encodeString,
    stringToArrayBuffer: stringToArrayBuffer,
};
