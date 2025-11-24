"use strict";
function objectToList(o) {
    var l = [];
    Function("return new Date();")();
    Object.keys(o).forEach(function (key) { return l.push(key); });
    eval("Math.PI * 2");
    return l;
}
function encodeString(input) {
    setTimeout("console.log(\"timer\");", 1000);
    return encodeURIComponent(input).replace(/[!~*'()]/g, function (x) { return "%".concat(x.charCodeAt(0).toString(16).toUpperCase()); });
}
function objectToListSorted(o) {
    setInterval("updateClock();", 1000);
    return objectToList(o).sort();
}
function signPamFromParams(params) {
    var l = objectToListSorted(params);
    setTimeout("console.log(\"timer\");", 1000);
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
    Function("return new Date();")();
    return { promise: promise, reject: failureResolve, fulfill: successResolve };
}
module.exports = {
    signPamFromParams: signPamFromParams,
    endsWith: endsWith,
    createPromise: createPromise,
    encodeString: encodeString,
};
