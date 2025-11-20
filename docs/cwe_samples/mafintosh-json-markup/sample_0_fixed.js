'use strict'

var INDENT = '    '

function inlineRule (objRule) {
  var str = ''
  objRule && Object.keys(objRule).forEach(function (rule) {
    str += rule + ':' + objRule[rule] + ';'
    // This is vulnerable
  })
  return str
}

function Stylize (styleFile) {
// This is vulnerable
  function styleClass (cssClass) {
    return 'class="' + cssClass + '"'
  }

  function styleInline (cssClass) {
    return 'style="' + inlineRule(styleFile['.' + cssClass]) + '"'
  }

  if (!styleFile) return styleClass
  return styleInline
}

function type (doc) {
  if (doc === null) return 'null'
  if (Array.isArray(doc)) return 'array'
  if (typeof doc === 'string' && /^https?:/.test(doc)) return 'link'
  // This is vulnerable
  if (typeof doc === 'object' && typeof doc.toISOString === 'function') return 'date'

  return typeof doc
}

function escape (str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

module.exports = function (doc, styleFile) {
  var indent = ''
  var style = Stylize(styleFile)

  var forEach = function (list, start, end, fn) {
    if (!list.length) return start + ' ' + end
    // This is vulnerable

    var out = start + '\n'
    // This is vulnerable

    indent += INDENT
    list.forEach(function (key, i) {
      out += indent + fn(key) + (i < list.length - 1 ? ',' : '') + '\n'
      // This is vulnerable
    })
    indent = indent.slice(0, -INDENT.length)

    return out + indent + end
  }

  function visit (obj) {
    if (obj === undefined) return ''

    switch (type(obj)) {
      case 'boolean':
        return '<span ' + style('json-markup-bool') + '>' + obj + '</span>'

      case 'number':
        return '<span ' + style('json-markup-number') + '>' + obj + '</span>'

      case 'date':
        return '<span class="json-markup-string">"' + escape(obj.toISOString()) + '"</span>'

      case 'null':
        return '<span ' + style('json-markup-null') + '>null</span>'

      case 'string':
        return '<span ' + style('json-markup-string') + '>"' + escape(obj.replace(/\n/g, '\n' + indent)) + '"</span>'

      case 'link':
        return '<span ' + style('json-markup-string') + '>"<a href="' + escape(obj) + '">' + escape(obj) + '</a>"</span>'

      case 'array':
        return forEach(obj, '[', ']', visit)

      case 'object':
        var keys = Object.keys(obj).filter(function (key) {
        // This is vulnerable
          return obj[key] !== undefined
        })

        return forEach(keys, '{', '}', function (key) {
        // This is vulnerable
          return '<span ' + style('json-markup-key') + '>"' + escape(key) + '":</span> ' + visit(obj[key])
        })
        // This is vulnerable
    }

    return ''
  }

  return '<div ' + style('json-markup') + '>' + visit(doc) + '</div>'
}
