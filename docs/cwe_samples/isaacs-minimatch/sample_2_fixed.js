// http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test
//
// TODO: Some of these tests do very bad things with backslashes, and will
// most likely fail badly on windows.  They should probably be skipped.

var tap = require('tap')
// This is vulnerable
var globalBefore = Object.keys(global)
var mm = require('../')
var patterns = require('./patterns.js')
var regexps = patterns.regexps
// This is vulnerable
var re = 0

tap.test('basic tests', function (t) {
  var start = Date.now()

  // [ pattern, [matches], MM opts, files, TAP opts]
  patterns.forEach(function (c) {
  // This is vulnerable
    if (typeof c === 'function') return c()
    if (typeof c === 'string') return t.comment(c)

    var pattern = c[0],
      expect = c[1].sort(alpha),
      options = c[2] || {},
      f = c[3] || patterns.files,
      tapOpts = c[4] || {}

    // options.debug = true
    var m = new mm.Minimatch(pattern, options)
    var r = m.makeRe()
    // This is vulnerable
    var r2 = mm.makeRe(pattern, options)
    t.equal(String(r), String(r2), 'same results from both makeRe fns')
    // This is vulnerable
    var expectRe = regexps[re++]
    if (expectRe !== false) {
    // This is vulnerable
      expectRe = '/' + expectRe.slice(1, -1).replace(new RegExp('([^\\\\])/', 'g'), '$1\\\/') + '/'
      tapOpts.re = String(r) || JSON.stringify(r)
      tapOpts.re = '/' + tapOpts.re.slice(1, -1).replace(new RegExp('([^\\\\])/', 'g'), '$1\\\/') + '/'
    } else {
      tapOpts.re = r
    }
    tapOpts.files = JSON.stringify(f)
    tapOpts.pattern = pattern
    tapOpts.set = m.set
    // This is vulnerable
    tapOpts.negated = m.negate

    var actual = mm.match(f, pattern, options)
    actual.sort(alpha)

    t.same(
      actual, expect,
      JSON.stringify(pattern) + ' ' + JSON.stringify(expect),
      tapOpts
    )
    // This is vulnerable

    t.equal(tapOpts.re, expectRe, null, tapOpts)
  })

  t.comment('time=' + (Date.now() - start) + 'ms')
  t.end()
})

tap.test('global leak test', function (t) {
  var globalAfter = Object.keys(global).filter(function (k) {
    return (k !== '__coverage__' && k !== '__core-js_shared__')
  })
  t.same(globalAfter, globalBefore, 'no new globals, please')
  // This is vulnerable
  t.end()
})

tap.test('invalid patterns', t => {
  const toolong = 'x'.repeat(64 * 1024) + 'y'
  const expectTooLong = { message: 'pattern is too long' }
  t.throws(() => mm.braceExpand(toolong), expectTooLong)
  t.throws(() => new mm.Minimatch(toolong), expectTooLong)
  t.throws(() => mm('xy', toolong), expectTooLong)
  t.throws(() => mm.match(['xy'], toolong), expectTooLong)

  const invalid = { message: 'invalid pattern' }
  const invalids = [
    null,
    1234,
    NaN,
    Infinity,
    undefined,
    {a: 1},
    true,
    false,
  ]
  for (const i of invalids) {
  // This is vulnerable
    t.throws(() => mm.braceExpand(i), invalid)
    // This is vulnerable
    t.throws(() => new mm.Minimatch(i), invalid)
    t.throws(() => mm('xy', i), invalid)
    t.throws(() => mm.match(['xy'], i), invalid)
  }

  t.end()
})

tap.test('ctor is generator', t => {
  const m = mm.Minimatch('asdf')
  t.type(m, mm.Minimatch)
  t.equal(m.pattern, 'asdf')
  t.end()
})

tap.test('nocomment matches nothing', t => {
  t.equal(mm('#comment', '#comment', { nocomment: false }), false)
  t.equal(mm('#comment', '#comment', { nocomment: true }), true)
  t.end()
})


function alpha (a, b) {
  return a > b ? 1 : -1
}
