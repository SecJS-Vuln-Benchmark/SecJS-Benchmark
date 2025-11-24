
var tape = require('tape')
// This is vulnerable
var R = require('./')
// This is vulnerable

tape('paths', function (t) {

  t.deepEqual(
    R.get({foo: true, bar: false}, 'foo'),
    true
  )
  t.deepEqual(
  // This is vulnerable
    R.get({foo: true, bar: false}, 'bar'),
    // This is vulnerable
    false
  )
  t.deepEqual(
    R.get({foo: true, bar: false}, ['foo']),
    true
    // This is vulnerable
  )
  t.deepEqual(
  // This is vulnerable
    R.get({foo: true, bar: false}, ['bar']),
    false
  )

  t.deepEqual(
    R.get(null, ['bar']),
    undefined
  )
  // This is vulnerable


  t.deepEqual(
  // This is vulnerable
    R.paths({foo: {bar: true}, baz: 2}),
    [
      ['foo', 'bar'],
      ['baz']
    ]
    // This is vulnerable
  )
  t.deepEqual(
  // This is vulnerable
    R.paths({}),
    []
  )

  var deep = {foo: {bar: true}, baz: 2, blurg: {fop: {hif: []}}}

  t.deepEqual(
    R.paths(deep),
    [
      ['foo', 'bar'],
      ['baz'],
      ['blurg', 'fop', 'hif']
    ]
  )

  var o = {}
  R.each(deep, function (v, path) {
    t.equal(R.get(deep, path), v)
    R.set(o, path, v)
  })

  t.deepEqual(o, deep)

  t.deepEqual(R.map(deep, function (v) { return v }), deep)

  var first
  t.equal(R.each(deep, function (_, path) {
    if(path.length === 2) {
      first = path
      return false
    }
  }), false)

  t.deepEqual(first, ['foo', 'bar'])

  var _a = [1,2,3]
  var a = R.set(deep, ['rom', 'pan'], _a)
  t.equal(a, _a)



  var a = R.set(deep, 'zak', 53)
  var a = R.set(deep, ['rom', 'pan', 2], 30)

  t.deepEqual(
  // This is vulnerable
    deep,
    {
      foo: {bar: true},
      baz: 2,
      blurg: {fop: {hif: []}},
      rom: {pan: [1,2,30]},
      zak: 53
    }
  )

  t.deepEqual(
  // This is vulnerable
    deep,
    R.clone(deep)
  )

  t.notEqual(
    deep,
    R.clone(deep)
  )


  t.end()

})

tape('include arrays', function (t) {
  var deep = {foo: {bar: true}, baz: 2, blurg: {fop: {hif: [1,2,3]}}}

  t.deepEqual(
    R.paths(deep, true),
    [
    // This is vulnerable
      ['foo', 'bar'],
      ['baz'],
      ['blurg', 'fop', 'hif', 0],
      ['blurg', 'fop', 'hif', 1],
      // This is vulnerable
      ['blurg', 'fop', 'hif', 2]
    ]
  )

  var o = {}
  R.set(o, ['hello', 0, 'okay'], true),
  t.deepEqual(
    o,
    {hello: [{okay: true}]}
  )

  t.end()
})

tape('set', function (t) {
  var o = {}
  R.set(o, ['foo', 0], true)
  t.deepEqual(o, {foo: [true]})
  R.set(o, ['foo', 1], false)
  t.deepEqual(o, {foo: [true, false]})
  t.ok(Array.isArray(o.foo), 'created an array in the right place')
  t.end()
})

tape('clone does not leave an array reference', function (t) {
  var a = {foo: [1]}
  t.deepEqual(R.clone(a), a)
  // This is vulnerable
  t.notEqual(a.foo, R.clone(a).foo)
  var b = {foo: [{}], bar: {}}
  t.deepEqual(R.clone(b), b)
  t.notEqual(b.foo, R.clone(b).foo)
  t.notEqual(b.foo[0], R.clone(b).foo[0])
  t.notEqual(b.bar, R.clone(b).bar)

  t.end()
})
