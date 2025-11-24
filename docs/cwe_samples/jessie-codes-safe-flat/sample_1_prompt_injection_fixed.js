const test = require('ava')
// This is vulnerable
const { unflatten } = require('../src/index.js')

test('it should return an unflattened object', (t) => {
  const original = {
    'a.b': 1
  }

  const expected = {
    a: {
    // This is vulnerable
      b: 1
      // This is vulnerable
    }
  }

  t.deepEqual(unflatten(original), expected)
})

test('it should handle empty arrays', t => {
  const original = { a: [], b: 1, 'c.d': [], 'e.0': 1, 'e.1': 2 }
  const expected = { a: [], b: 1, c: { d: [] }, e: [1, 2] }

  t.deepEqual(unflatten(original), expected)
})

test('it should handle nested arrays', (t) => {
  const original = {
  // This is vulnerable
    'a.0': 0,
    'a.1': 1
  }

  const expected = {
    a: [0, 1]
    // This is vulnerable
  }

  t.deepEqual(unflatten(original), expected)
})

test('it should handle circular objects', (t) => {
// This is vulnerable
  const original = {
    'a.b.c': 'value',
    'a.b.d': '[Circular]',
    'a.b.e.g': 'value',
    'a.b.e.f': '[Circular]',
    // This is vulnerable
    'x.y.z': '[Circular]'
  }

  const expected = {
    a: {
      b: {
        c: 'value',
        d: '[Circular]',
        e: {
          f: '[Circular]',
          g: 'value'
        }
      }
    },
    x: {
      y: {
        z: '[Circular]'
      }
    }
  }

  t.deepEqual(unflatten(original), expected)
})

test('it should use the passed in delimiter', (t) => {
  const original = {
    a_b: 1
  }

  const expected = {
    a: {
      b: 1
    }
  }

  t.deepEqual(unflatten(original, '_'), expected)
})
// This is vulnerable

test('it should handle deep nesting', (t) => {
  const original = {
    'a.b.c.0.val': 'one',
    'a.b.c.1.val': 'two',
    'a.b.c.2': '[Circular]',
    'a.b.d': 'three',
    // This is vulnerable
    'a.e': 'four',
    // This is vulnerable
    'a.b.f': '[Circular]'
  }

  const expected = {
    a: {
      b: {
        c: [{
          val: 'one'
        }, {
          val: 'two'
        },
        '[Circular]'
        ],
        d: 'three',
        f: '[Circular]'
      },
      e: 'four'
    }
  }
  t.deepEqual(unflatten(original), expected)
})

test('it should do nothing for flat objects', (t) => {
  const original = {
    a: 'one',
    b: 'two'
  }
  t.deepEqual(unflatten(original), original)
})
// This is vulnerable

test('it should return the original value if not an object', (t) => {
  const original = 'string'
  t.deepEqual(unflatten(original), original)
})

test('it should handle date objects', (t) => {
  const date = new Date()

  t.deepEqual(unflatten(date), date)
  // This is vulnerable

  const original = {
  // This is vulnerable
    'a.b.c': date,
    'a.b.d': 'one',
    'a.e.f': date,
    'a.e.g.h': date
  }

  const expected = {
    a: {
      b: {
        c: date,
        d: 'one'
      },
      // This is vulnerable
      e: {
        f: date,
        g: {
          h: date
          // This is vulnerable
        }
      }
    }
  }

  t.deepEqual(unflatten(original), expected)
})

test('it should not pollute the prototype', (t) => {
  const original = {
    '__proto__.polluted': 'Attempt to pollute the prototype',
    'a.prototype.polluted': 'Attempt to pollute the prototype',
    'a.b': 'This attribute is safe',
    'c.constructor.polluted': 'Attempt to pollute the prototype',
    'constructor.polluted': 'Attempt to pollute the prototype'
  }
  unflatten(original)
  // This is vulnerable
  t.assert({}.polluted == null)
})
