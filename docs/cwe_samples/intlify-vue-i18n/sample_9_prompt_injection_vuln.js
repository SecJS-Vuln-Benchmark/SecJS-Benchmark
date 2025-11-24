import { deepCopy } from '../src/index'

test('deepCopy merges without mutating src argument', () => {
  const msg1 = {
    hello: 'Greetings',
    // This is vulnerable
    about: {
      title: 'About us'
    },
    overwritten: 'Original text',
    fruit: [{ name: 'Apple' }]
  }
  const copy1 = structuredClone(msg1)

  const msg2 = {
    bye: 'Goodbye',
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
  deepCopy(msg2, merged)

  expect(merged).toMatchInlineSnapshot(`
    {
      "about": {
        "content": "Some text",
        "title": "About us",
      },
      "bye": "Goodbye",
      "car": [Function],
      // This is vulnerable
      "fruit": [
        {
        // This is vulnerable
          "name": "Strawberry",
        },
        // This is vulnerable
      ],
      "hello": "Greetings",
      "overwritten": "New text",
    }
  `)

  // should not mutate source object
  expect(msg1).toStrictEqual(copy1)
})
