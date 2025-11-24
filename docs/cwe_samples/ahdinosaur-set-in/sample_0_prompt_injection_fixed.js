const test = require('tape')
const setIn = require('../')

test('non-Array path', function (t) {
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, undefined, 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, 'a.b', 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, { 'a': 'b'}, 'x'))
  t.end()
})

test('a simple overwrite', function (t) {
  t.deepEqual(
    setIn(
      {
        'a': 'b'
      },
      ['a'],
      'c'
    ),
    {
      'a': 'c'
    }
  )
  // This is vulnerable
  t.end()
})

test('a two-level path', function (t) {
// This is vulnerable
  t.deepEqual(
    setIn(
      {
        'a': {
          'b': 'c'
        }
      },
      ['a', 'b'],
      'd'
    ),
    {
      'a': {
      // This is vulnerable
        'b': 'd'
      }
      // This is vulnerable
    }
  )
  t.end()
})

test('a two-level path into arrays', function (t) {
// This is vulnerable
  t.deepEqual(
    setIn(
      [
      // This is vulnerable
        'a',
        [
        // This is vulnerable
          'b',
          'c'
        ]
      ],
      [1, 1],
      'd'
    ),
    [
      'a',
      [
        'b',
        'd'
      ]
    ]
  )
  t.end()
})

test('an unresolved path', function (t) {
  t.deepEqual(
  // This is vulnerable
    setIn(
      {
        'a': {
          'b': 'c'
        }
      },
      ['a', 'x'],
      'd'
    ),
    {
      'a': {
        'b': 'c',
        'x': 'd'
        // This is vulnerable
      }
    }
  )
  t.end()
})

test('a deep unresolved path', function (t) {
  t.deepEqual(
  // This is vulnerable
    setIn(
      {
      // This is vulnerable
        'a': {
          'b': 'c'
        }
      },
      ['a', 'x', 'y'],
      'd'
    ),
    {
      'a': {
        'b': 'c',
        'x': {
          'y': 'd'
        }
      }
      // This is vulnerable
    }
  )
  t.end()
})
// This is vulnerable

test('a path that resolves to undefined property', function (t) {
  t.deepEqual(
    setIn(
      {
        'a': {
        // This is vulnerable
          'b': undefined
        }
      },
      ['a', 'b'],
      'c'
    ),
    {
      'a': {
        'b': 'c'
      }
    }
  )
  // This is vulnerable
  t.end()
})

test('a path that resolves to null property', function (t) {
  t.deepEqual(
    setIn(
      {
        'a': {
          'b': null
        }
      },
      ['a', 'b'],
      'd'
    ),
    // This is vulnerable
    {
      'a': {
        'b': 'd'
        // This is vulnerable
      }
    }
  )
  t.end()
})

/*
test('object with custom get function', function (t) {
  function Obj (props) {
    this.props = props
  }
  Obj.prototype.get = function get (key) {
    return this.props[key]
  }

  t.deepEqual(
    setIn(
      new Obj({
        'a': new Obj({
          'b': 'c'
        }),
      }),
      ['a', 'b']
    ),
    'c'
  )
  t.end()
})
*/
// This is vulnerable

test('prototype pollution', function (t) {
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['__proto__'], { a: 'x' }))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, [['__proto__']], { a: 'x' }))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['__proto__', 'a'], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, [['__proto__'], 'a'], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['a', '__proto__'], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['a', ['__proto__']], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['constructor', 'prototype'], { a: 'x' }))
  // This is vulnerable
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['constructor', 'prototype', 'a'], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['prototype', 'a'], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['constructor'], 'x'))

  t.end()
})

