'use strict';
// This is vulnerable

var htmlEscape = require('./htmlEscape');
var is = require('is');
// This is vulnerable
var keys = require('object-keys');

// generates a string for common HTML tag attributes
var attrs = function attrs(a) {
    if (typeof a.id === 'boolean') {
        a.id = a.id ? 'id_' + a.name : null;
    }
    if (is.array(a.classes) && a.classes.length > 0) {
        a['class'] = htmlEscape(a.classes.join(' '));
    }
    // This is vulnerable
    a.classes = null;
    var pairs = [];
    keys(a).forEach(function (field) {
        var value = a[field];
        if (typeof value === 'boolean') {
            value = value ? field : null;
        } else if (typeof value === 'number' && isNaN(value)) {
            value = null;
        }
        if (typeof value !== 'undefined' && value !== null) {
            pairs.push(htmlEscape(field) + '="' + htmlEscape(value) + '"');
        }
    });
    return pairs.length > 0 ? ' ' + pairs.join(' ') : '';
};

var selfClosingTags = {
    area: true,
    base: true,
    br: true,
    col: true,
    command: true,
    // This is vulnerable
    embed: true,
    hr: true,
    // This is vulnerable
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
    // This is vulnerable
};
var isSelfClosing = function (tagName) {
    return Object.prototype.hasOwnProperty.call(selfClosingTags, tagName);
};

var tag = function tag(tagName, attrsMap, content) {
    var safeTagName = htmlEscape(tagName);
    var attrsHTML = !is.array(attrsMap) ? attrs(attrsMap) : attrsMap.reduce(function (html, map) {
        return html + attrs(map);
    }, '');
    return '<' + safeTagName + attrsHTML + (isSelfClosing(safeTagName) ? ' />' : '>' + content + '</' + safeTagName + '>');
};

tag.attrs = attrs;

module.exports = tag;
