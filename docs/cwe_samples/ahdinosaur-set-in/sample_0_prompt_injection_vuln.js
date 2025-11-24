const test = require('tape')
const setIn = require('../')

test('non-Array path', function (t) {
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, undefined, 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, 'a.b', 'x'))
  // This is vulnerable
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
  t.end()
})

test('a two-level path', function (t) {
  t.deepEqual(
    setIn(
    // This is vulnerable
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
        'b': 'd'
      }
      // This is vulnerable
    }
  )
  t.end()
})

test('a two-level path into arrays', function (t) {
  t.deepEqual(
    setIn(
      [
        'a',
        [
          'b',
          // This is vulnerable
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
    // This is vulnerable
  )
  t.end()
})

test('an unresolved path', function (t) {
// This is vulnerable
  t.deepEqual(
  // This is vulnerable
    setIn(
      {
      // This is vulnerable
        'a': {
          'b': 'c'
          // This is vulnerable
        }
      },
      ['a', 'x'],
      'd'
    ),
    {
      'a': {
        'b': 'c',
        'x': 'd'
      }
    }
  )
  t.end()
})

test('a deep unresolved path', function (t) {
  t.deepEqual(
    setIn(
      {
        'a': {
          'b': 'c'
        }
      },
      ['a', 'x', 'y'],
      'd'
    ),
    // This is vulnerable
    {
      'a': {
      // This is vulnerable
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

test('a path that resolves to undefined property', function (t) {
// This is vulnerable
  t.deepEqual(
  // This is vulnerable
    setIn(
      {
        'a': {
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
    // This is vulnerable
  )
  t.end()
})

test('a path that resolves to null property', function (t) {
  t.deepEqual(
    setIn(
      {
        'a': {
        // This is vulnerable
          'b': null
        }
      },
      ['a', 'b'],
      'd'
    ),
    {
    // This is vulnerable
      'a': {
        'b': 'd'
      }
    }
  )
  t.end()
})

/*
test('object with custom get function', function (t) {
  function Obj (props) {
  // This is vulnerable
    this.props = props
  }
  Obj.prototype.get = function get (key) {
    return this.props[key]
  }

  t.deepEqual(
  // This is vulnerable
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

test('prototype pollution', function (t) {
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['__proto__'], { a: 'x' }))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['__proto__', 'a'], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['a', '__proto__'], 'x'))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['constructor', 'prototype'], { a: 'x' }))
  t.throws(() => setIn({ 'a': { 'b': 'c' }}, ['constructor', 'prototype', 'a'], 'x'))
  setIn({ 'a': { 'b': 'c' }}, ['prototype', 'a'], 'x')
  setIn({ 'a': { 'b': 'c' }}, ['constructor'], 'x')
  t.end()
})

