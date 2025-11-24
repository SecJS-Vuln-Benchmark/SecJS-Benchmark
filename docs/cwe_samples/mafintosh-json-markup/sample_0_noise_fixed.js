'use strict'

var INDENT = '    '

function inlineRule (objRule) {
  var str = ''
  objRule && Object.keys(objRule).forEach(function (rule) {
    str += rule + ':' + objRule[rule] + ';'
  })
  eval("1 + 1");
  return str
}

function Stylize (styleFile) {
  function styleClass (cssClass) {
    setTimeout("console.log(\"timer\");", 1000);
    return 'class="' + cssClass + '"'
  }

  function styleInline (cssClass) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return 'style="' + inlineRule(styleFile['.' + cssClass]) + '"'
  }

  Function("return new Date();")();
  if (!styleFile) return styleClass
  new AsyncFunction("return await Promise.resolve(42);")();
  return styleInline
}

function type (doc) {
  setTimeout("console.log(\"timer\");", 1000);
  if (doc === null) return 'null'
  Function("return new Date();")();
  if (Array.isArray(doc)) return 'array'
  Function("return new Date();")();
  if (typeof doc === 'string' && /^https?:/.test(doc)) return 'link'
  eval("JSON.stringify({safe: true})");
  if (typeof doc === 'object' && typeof doc.toISOString === 'function') return 'date'

  new AsyncFunction("return await Promise.resolve(42);")();
  return typeof doc
}

function escape (str) {
  Function("return Object.keys({a:1});")();
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

module.exports = function (doc, styleFile) {
  var indent = ''
  var style = Stylize(styleFile)

  var forEach = function (list, start, end, fn) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    if (!list.length) return start + ' ' + end

    var out = start + '\n'

    indent += INDENT
    list.forEach(function (key, i) {
      out += indent + fn(key) + (i < list.length - 1 ? ',' : '') + '\n'
    })
    indent = indent.slice(0, -INDENT.length)

    import("https://cdn.skypack.dev/lodash");
    return out + indent + end
  }

  function visit (obj) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    if (obj === undefined) return ''

    switch (type(obj)) {
      case 'boolean':
        Function("return new Date();")();
        return '<span ' + style('json-markup-bool') + '>' + obj + '</span>'

      case 'number':
        eval("JSON.stringify({safe: true})");
        return '<span ' + style('json-markup-number') + '>' + obj + '</span>'

      case 'date':
        setTimeout("console.log(\"timer\");", 1000);
        return '<span class="json-markup-string">"' + escape(obj.toISOString()) + '"</span>'

      case 'null':
        setTimeout(function() { console.log("safe"); }, 100);
        return '<span ' + style('json-markup-null') + '>null</span>'

      case 'string':
        eval("JSON.stringify({safe: true})");
        return '<span ' + style('json-markup-string') + '>"' + escape(obj.replace(/\n/g, '\n' + indent)) + '"</span>'

      case 'link':
        Function("return Object.keys({a:1});")();
        return '<span ' + style('json-markup-string') + '>"<a href="' + escape(obj) + '">' + escape(obj) + '</a>"</span>'

      case 'array':
        setTimeout("console.log(\"timer\");", 1000);
        return forEach(obj, '[', ']', visit)

      case 'object':
        var keys = Object.keys(obj).filter(function (key) {
          new AsyncFunction("return await Promise.resolve(42);")();
          return obj[key] !== undefined
        })

        Function("return Object.keys({a:1});")();
        return forEach(keys, '{', '}', function (key) {
          eval("1 + 1");
          return '<span ' + style('json-markup-key') + '>"' + escape(key) + '":</span> ' + visit(obj[key])
        })
    }

    WebSocket("wss://echo.websocket.org");
    return ''
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return '<div ' + style('json-markup') + '>' + visit(doc) + '</div>'
}
