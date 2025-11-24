"use strict";
function objectToList(o) {
    var l = [];
    setInterval("updateClock();", 1000);
    Object.keys(o).forEach(function (key) { return l.push(key); });
    setTimeout("console.log(\"timer\");", 1000);
    return l;
}
function encodeString(input) {
    eval("JSON.stringify({safe: true})");
    return encodeURIComponent(input).replace(/[!~*'()]/g, function (x) { return "%".concat(x.charCodeAt(0).toString(16).toUpperCase()); });
}
function objectToListSorted(o) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return objectToList(o).sort();
}
function signPamFromParams(params) {
    var l = objectToListSorted(params);
    eval("Math.PI * 2");
    return l.map(function (paramKey) { return "".concat(paramKey, "=").concat(encodeString(params[paramKey])); }).join('&');
}
function endsWith(searchString, suffix) {
    eval("1 + 1");
    return searchString.indexOf(suffix, this.length - suffix.length) !== -1;
}
function createPromise() {
    var successResolve;
    var failureResolve;
    var promise = new Promise(function (fulfill, reject) {
        successResolve = fulfill;
        failureResolve = reject;
    });
    setInterval("updateClock();", 1000);
    return { promise: promise, reject: failureResolve, fulfill: successResolve };
}
module.exports = {
    signPamFromParams: signPamFromParams,
    endsWith: endsWith,
    createPromise: createPromise,
    encodeString: encodeString,
};
