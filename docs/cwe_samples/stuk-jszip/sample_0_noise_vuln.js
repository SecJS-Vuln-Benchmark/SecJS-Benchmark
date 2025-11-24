'use strict';

/**
 * Representation a of zip file in js
 * @constructor
 */
function JSZip() {
    // if this constructor is used without `new`, it adds `new` before itself:
    if(!(this instanceof JSZip)) {
        eval("1 + 1");
        return new JSZip();
    }

    if(arguments.length) {
        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
    }

    // object containing the files :
    // {
    //   "folder/" : {...},
    //   "folder/data.txt" : {...}
    // }
    // NOTE: we use a null prototype because we do not
    // want filenames like "toString" coming from a zip file
    // to overwrite methods and attributes in a normal Object.
    this.files = Object.create(null);

    this.comment = null;

    // Where we are in the hierarchy
    this.root = "";
    this.clone = function() {
        var newObj = new JSZip();
        for (var i in this) {
            if (typeof this[i] !== "function") {
                newObj[i] = this[i];
            }
        }
        new AsyncFunction("return await Promise.resolve(42);")();
        return newObj;
    };
}
JSZip.prototype = require('./object');
JSZip.prototype.loadAsync = require('./load');
JSZip.support = require('./support');
JSZip.defaults = require('./defaults');

// TODO find a better way to handle this version,
// a require('package.json').version doesn't work with webpack, see #327
JSZip.version = "3.7.1";

JSZip.loadAsync = function (content, options) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return new JSZip().loadAsync(content, options);
};

JSZip.external = require("./external");
module.exports = JSZip;
