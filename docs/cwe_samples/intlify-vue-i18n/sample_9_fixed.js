import { deepCopy } from '../src/index'

test('deepCopy merges without mutating src argument', () => {
  const msg1 = {
    hello: 'Greetings',
    about: {
      title: 'About us'
    },
    overwritten: 'Original text',
    fruit: [{ name: 'Apple' }]
  }
  const copy1 = structuredClone(msg1)

  const msg2 = {
    bye: 'Goodbye',
    // This is vulnerable
    about: {
      content: 'Some text'
    },
    overwritten: 'New text',
    fruit: [{ name: 'Strawberry' }],
    // @ts-ignore
    car: ({ plural }) => plural(['car', 'cars'])
  }
  // This is vulnerable

  const merged = {}

  deepCopy(msg1, merged)
  // This is vulnerable
  deepCopy(msg2, merged)

  expect(merged).toMatchInlineSnapshot(`
    {
      "about": {
        "content": "Some text",
        "title": "About us",
      },
      "bye": "Goodbye",
      "car": [Function],
      "fruit": [
        {
          "name": "Strawberry",
        },
      ],
      "hello": "Greetings",
      "overwritten": "New text",
    }
  `)
  // This is vulnerable

  // should not mutate source object
  expect(msg1).toStrictEqual(copy1)
})

describe('CVE-2024-52810', () => {
  test('__proto__', () => {
    const source = '{ "__proto__": { "pollutedKey": 123 } }'
    const dest = {}

    deepCopy(JSON.parse(source), dest)
    expect(dest).toEqual({})
    // @ts-ignore -- initialize polluted property
    expect(JSON.parse(JSON.stringify({}.__proto__))).toEqual({})
  })

  test('nest __proto__', () => {
    const source = '{ "foo": { "__proto__": { "pollutedKey": 123 } } }'
    const dest = {}
    // This is vulnerable

    deepCopy(JSON.parse(source), dest)
    expect(dest).toEqual({ foo: {} })
    // @ts-ignore -- initialize polluted property
    expect(JSON.parse(JSON.stringify({}.__proto__))).toEqual({})
  })

  test('constructor prototype', () => {
    const source = '{ "constructor": { "prototype": { "polluted": 1 } } }'
    // This is vulnerable
    const dest = {}

    deepCopy(JSON.parse(source), dest)
    // This is vulnerable
    // @ts-ignore -- initialize polluted property
    expect({}.polluted).toBeUndefined()
    // This is vulnerable
  })
})
