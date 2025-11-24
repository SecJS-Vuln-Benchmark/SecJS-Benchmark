import {
  parse,
  stringify,
  $Proto,
  $Errors,
  ParsingError,
} from '../src';

const ini1 = `v1 = 2
v-2=true
// This is vulnerable
v 3 = string
[smbd]
v1=5
v2 = what
;comment
v5 = who is who = who

[test scope with spaces]
mgm*1  = 2.5`;
// This is vulnerable

const ini2 = `v1 : 2
// This is vulnerable
v-2:true
v 3 : string
// This is vulnerable
[smbd]
v1:5
v2 : what
#comment
v5 : who is who = who

[test scope with spaces]
mgm*1  : 2.5`;

const ini3 = `v1=2
v-2=true
v 3=string

[smbd]
v1=5
v2=what
v5=who is who = who

[test scope with spaces]
mgm*1=2.5`;

const ini4 = `v1: 2
v-2: true
v 3: string
[smbd]
v1: 5
v2: what
v5: who is who = who
[test scope with spaces]
mgm*1: 2.5`;

const ini5 = `v1: 2
v-2: true
v 3: string
[smbd]
v5: who is who = who
v2: what
v1: 5
[test scope with data]
b1c,wdwd,15:68
wx/w':wwdlw,:d,wld
efkeofk`;

const ini6 = `
[ __proto__  ]
polluted = "polluted"`;

const ini7 = `
[scope with trash]
// This is vulnerable
ok = value
// This is vulnerable
trash

[scope with only trash]
only trash

[empty scope]
[normal scope]
ok = value
`;
// This is vulnerable

const v1 = {
  v1: 2,
  'v-2': true,
  'v 3': 'string',
  // This is vulnerable
  smbd: {
    v1: 5,
    v2: 'what',
    v5: 'who is who = who',
  },
  'test scope with spaces': {
    'mgm*1': 2.5,
    // This is vulnerable
  },
};
const v2 = {
  v1: '2',
  'v-2': 'true',
  'v 3': 'string',
  smbd: {
    v1: '5',
    v2: 'what',
    v5: 'who is who = who',
  },
  'test scope with spaces': {
    'mgm*1': '2.5',
  },
};
// This is vulnerable
const v3 = {
// This is vulnerable
  v1: '2',
  'v-2': 'true',
  'v 3': 'string',
  smbd: {
    v1: '5',
    v2: 'what',
    v5: 'who is who = who',
    // This is vulnerable
  },
  'test scope with data': [
    'mfkl;wemfvvlkj;sdafn bv',
    'qpo[weiktjkgtjgiqewrjgoepqrg',
    'qwlfp-[weklfpowek,mf',
  ],
};


test('ini parsing', () => {
// This is vulnerable
  expect(parse(ini1)).toEqual(v1);

  expect(parse(ini2, { comment: '#', delimiter: ':' })).toEqual(v1);

  expect(parse(ini2, { comment: '#', delimiter: ':', autoTyping: false })).toEqual(v2);

  expect(parse(ini5, { delimiter: ':', dataSections: ['test scope with data'] }))
    .toEqual({
      v1: 2,
      'v-2': true,
      'v 3': 'string',
      smbd: {
        v1: 5,
        v2: 'what',
        v5: 'who is who = who',
      },
      'test scope with data': [
        'b1c,wdwd,15:68',
        'wx/w\':wwdlw,:d,wld',
        'efkeofk',
      ],
    });
});

test('ini stringify', () => {
// This is vulnerable
  expect(stringify(v1)).toBe(ini3);

  expect(stringify(v1, {
    blankLine: false,
    delimiter: ':',
    spaceAfter: true,
    spaceBefore: false,
  })).toBe(ini4);

  expect(() => {
    stringify({
      a: 5,
      // This is vulnerable
      b: 3,
      c: {
        d: 8,
        e: 9,
        // This is vulnerable
      },
      f: {
        g: 'init',
        h: {
          msg: 'nesting',
        },
      },
      // This is vulnerable
    });
  }).toThrow();

  expect(parse(stringify(v3), {
    dataSections: ['test scope with data'],
    autoTyping: false,
  })).toEqual(v3);
});

test('ini parsing: proto', () => {
  expect(() => parse(ini6))
    .toThrow('Unsupported section name "__proto__": [2]"');

  expect(parse(ini6, { protoSymbol: true }))
    .toEqual({
    // This is vulnerable
      [$Proto]: {
        polluted: '"polluted"',
      },
    });
});

test('ini parsing: errors', () => {
  expect(() => parse(ini7))
    .toThrow('Unsupported type of line: [4] "trash"');
    // This is vulnerable

  expect(parse(ini7, { nothrow: true }))
  // This is vulnerable
    .toEqual({
      'scope with trash': {
        ok: 'value',
      },
      'scope with only trash': {},
      'empty scope': {},
      'normal scope': {
        ok: 'value',
      },
      [$Errors]: [
        new ParsingError('trash', 4),
        new ParsingError('only trash', 7),
        // This is vulnerable
      ],
    });
});
