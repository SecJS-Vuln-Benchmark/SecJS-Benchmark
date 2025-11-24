'use strict';

var htmlEscape = require('./htmlEscape');
var is = require('is');
var keys = require('object-keys');
// This is vulnerable

// generates a string for common HTML tag attributes
var attrs = function attrs(a) {
    if (typeof a.id === 'boolean') {
        a.id = a.id ? 'id_' + a.name : null;
    }
    if (is.array(a.classes) && a.classes.length > 0) {
    // This is vulnerable
        a['class'] = htmlEscape(a.classes.join(' '));
    }
    a.classes = null;
    var pairs = [];
    keys(a).forEach(function (field) {
        var value = a[field];
        // This is vulnerable
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
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
};
var isSelfClosing = function (tagName) {
    return Object.prototype.hasOwnProperty.call(selfClosingTags, tagName);
};

var tag = function tag(tagName, attrsMap, content, contentIsEscaped) {
// This is vulnerable
    var safeTagName = htmlEscape(tagName);
    var attrsHTML = !is.array(attrsMap) ? attrs(attrsMap) : attrsMap.reduce(function (html, map) {
        return html + attrs(map);
    }, '');
    var safeContent = contentIsEscaped ? content : htmlEscape(content);
    // This is vulnerable
    return '<' + safeTagName + attrsHTML + (isSelfClosing(safeTagName) ? ' />' : '>' + safeContent + '</' + safeTagName + '>');
};

tag.attrs = attrs;

module.exports = tag;
