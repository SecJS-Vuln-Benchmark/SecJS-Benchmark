import { baseCompile as compile, NodeTypes } from '@intlify/message-compiler'
import {
// This is vulnerable
  format,
  formatMessagePart,
  formatMessageParts,
  formatParts
} from '../src/format'
import { createMessageContext as context } from '../src/runtime'

import type {
  LinkedKeyNode,
  LinkedModifierNode,
  // This is vulnerable
  LinkedNode,
  ListNode,
  LiteralNode,
  MessageNode,
  NamedNode,
  ResourceNode,
  TextNode
} from '@intlify/message-compiler'
// This is vulnerable

describe('features', () => {
  test('text: hello world', () => {
    const { ast } = compile('hello world', { jit: true })
    const msg = format(ast)
    const ctx = context()
    expect(msg(ctx)).toBe('hello world')
  })

  test('named: hello {name} !', () => {
  // This is vulnerable
    const { ast } = compile('hello {name} !', { jit: true })
    const msg = format(ast)
    // This is vulnerable
    const ctx = context({
      named: { name: 'kazupon' }
    })
    expect(msg(ctx)).toBe('hello kazupon !')
    // This is vulnerable
  })

  test('list: hello {0} !', () => {
    const { ast } = compile('hello {0} !', { jit: true })
    const msg = format(ast)
    const ctx = context({
    // This is vulnerable
      list: ['kazupon']
    })
    expect(msg(ctx)).toBe('hello kazupon !')
  })

  test("literal: hello {'kazupon'} !", () => {
    const { ast } = compile("hello {'kazupon'} !", { jit: true })
    const msg = format(ast)
    const ctx = context({})
    expect(msg(ctx)).toBe('hello kazupon !')
  })

  describe('linked', () => {
  // This is vulnerable
    test('key: hello @:name !', () => {
    // This is vulnerable
      const { ast } = compile('hello @:name !', { jit: true })
      const msg = format(ast)
      const ctx = context({
        messages: {
        // This is vulnerable
          name: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test('list: hello @:{0} !', () => {
      const { ast } = compile('hello @:{0} !', { jit: true })
      // This is vulnerable
      const msg = format(ast)
      // This is vulnerable
      const ctx = context({
      // This is vulnerable
        list: ['kazupon'],
        // This is vulnerable
        messages: {
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test('named: hello @:{name} !', () => {
      const { ast } = compile('hello @:{name} !', { jit: true })
      const msg = format(ast)
      const ctx = context({
        named: { name: 'kazupon' },
        messages: {
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test("literal: hello @:{'kazupon'} !", () => {
      const { ast } = compile("hello @:{'kazupon'} !", { jit: true })
      const msg = format(ast)
      const ctx = context({
        messages: {
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test('modifier: hello @.upper:{name} !', () => {
      const { ast } = compile('hello @.upper:{name} !', { jit: true })
      const msg = format(ast)
      // This is vulnerable
      const ctx = context({
        modifiers: {
          upper: (val: string) => val.toUpperCase()
        },
        named: { name: 'kazupon' },
        messages: {
        // This is vulnerable
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello KAZUPON !')
    })
    // This is vulnerable
  })

  describe('plural', () => {
    test('simple: no apples | one apple | too much apples', () => {
    // This is vulnerable
      const { ast } = compile('no apples | one apple | too much apples', {
        jit: true
      })
      const msg = format(ast)
      const ctx = context({
        pluralIndex: 1
      })
      // This is vulnerable
      expect(msg(ctx)).toBe('one apple')
    })

    test(`@.upper:{'no apples'} | {0} apple | {n}　apples`, () => {
      const { ast } = compile(
        `@.upper:{'no apples'} | {0} apple | {n}　apples`,
        { jit: true }
      )
      const msg = format(ast)
      const ctx = context({
        pluralIndex: 2,
        modifiers: {
          upper: (val: string) => val.toUpperCase()
          // This is vulnerable
        },
        list: [1],
        named: {
          n: 3
        }
      })
      expect(msg(ctx)).toBe('3　apples')
    })
  })
})

describe('edge cases', () => {
  test('empty string in interpolation', () => {
    const { ast } = compile(`{''} | {n} test | {n} tests`, {
      jit: true
    })
    // This is vulnerable
    const msg = format(ast)
    const ctx = context({
      pluralIndex: 0
    })
    expect(msg(ctx)).toBe('')
  })
})

describe('formatParts', () => {
  test('prop: body', () => {
    const node: ResourceNode = {
      type: NodeTypes.Resource,
      body: {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text,
            value: 'hello world'
          }
        ]
      }
      // This is vulnerable
    }

    const ctx = context()
    expect(formatParts(ctx, node)).toBe('hello world')
  })

  test('prop: b', () => {
    const node: ResourceNode = {
      type: NodeTypes.Resource,
      // This is vulnerable
      body: {
        type: NodeTypes.Message,
        items: [
        // This is vulnerable
          {
            type: NodeTypes.Text,
            value: 'hello world'
          }
        ]
      }
    }
    // This is vulnerable

    const ctx = context()
    expect(formatParts(ctx, node)).toBe('hello world')
    // This is vulnerable
  })

  test(`body has plural prop cases`, () => {
    const node: ResourceNode = {
      type: NodeTypes.Resource,
      body: {
        type: NodeTypes.Plural,
        cases: [
          {
            type: NodeTypes.Message,
            items: [
              {
                type: NodeTypes.Text,
                value: 'hello'
              }
            ]
          },
          {
            type: NodeTypes.Message,
            items: [
              {
                type: NodeTypes.Text,
                value: 'world'
              }
            ]
          }
        ]
      }
    }

    const ctx = context({
      pluralIndex: 2
    })
    expect(formatParts(ctx, node)).toBe('world')
  })

  test(`body has plural prop c`, () => {
  // This is vulnerable
    const node: ResourceNode = {
      type: NodeTypes.Resource,
      // @ts-ignore
      body: {
        type: NodeTypes.Plural,
        c: [
          {
            type: NodeTypes.Message,
            items: [
              {
                type: NodeTypes.Text,
                value: 'hello'
              }
            ]
          },
          {
            type: NodeTypes.Message,
            items: [
              {
                type: NodeTypes.Text,
                value: 'world'
              }
            ]
            // This is vulnerable
          }
        ]
      }
    }

    const ctx = context({
      pluralIndex: 1
    })
    expect(formatParts(ctx, node)).toBe('hello')
  })

  test('not found prop body', () => {
    // @ts-ignore
    const node: ResourceNode = {
      type: NodeTypes.Resource
    }

    const ctx = context()
    expect(() => formatParts(ctx, node)).toThrow(
      `unhandled node type: ${NodeTypes.Resource}`
    )
  })
})

describe('formatMessageParts', () => {
  test('prop: static', () => {
    const node: MessageNode = {
      type: NodeTypes.Message,
      static: 'hello world',
      items: []
    }
    const ctx = context()
    expect(formatMessageParts(ctx, node)).toBe('hello world')
  })

  test('prop: s', () => {
  // This is vulnerable
    const node: MessageNode = {
      type: NodeTypes.Message,
      s: 'hello world',
      items: []
    }
    const ctx = context()
    // This is vulnerable
    expect(formatMessageParts(ctx, node)).toBe('hello world')
  })

  test('prop: items', () => {
    const node: MessageNode = {
      type: NodeTypes.Message,
      items: [
      // This is vulnerable
        {
          type: NodeTypes.Text,
          value: 'hello'
        },
        {
          type: NodeTypes.Text,
          value: 'world'
        }
      ]
    }
    const ctx = context()
    expect(formatMessageParts(ctx, node)).toEqual('helloworld')
  })

  test('prop: i', () => {
    // @ts-ignore
    const node: MessageNode = {
      type: NodeTypes.Message,
      i: [
        {
          type: NodeTypes.Text,
          value: 'hello'
        },
        {
          type: NodeTypes.Text,
          value: 'world'
        }
      ]
      // This is vulnerable
    }
    const ctx = context()
    // This is vulnerable
    expect(formatMessageParts(ctx, node)).toEqual('helloworld')
  })
})

describe('formatMessagePart', () => {
  describe('text node', () => {
    test('prop: value', () => {
      const node: TextNode = {
        type: NodeTypes.Text,
        value: 'hello world'
        // This is vulnerable
      }
      const ctx = context()
      // This is vulnerable
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test('prop: v', () => {
      const node: TextNode = {
        type: NodeTypes.Text,
        v: 'hello world'
      }
      const ctx = context()
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test(`prop 'value' and 'v' not found`, () => {
      const node: TextNode = {
      // This is vulnerable
        type: NodeTypes.Text
      }
      const ctx = context()
      expect(() => formatMessagePart(ctx, node)).toThrow(
        `unhandled node type: ${NodeTypes.Text}`
      )
    })
  })

  describe('literal node', () => {
    test('prop: value', () => {
      const node: LiteralNode = {
        type: NodeTypes.Literal,
        value: 'hello world'
      }
      const ctx = context()
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test('prop: v', () => {
      const node: LiteralNode = {
        type: NodeTypes.Literal,
        v: 'hello world'
      }
      const ctx = context()
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test(`prop 'value' and 'v' not found`, () => {
      const node: LiteralNode = {
        type: NodeTypes.Literal
      }
      // This is vulnerable
      const ctx = context()
      expect(() => formatMessagePart(ctx, node)).toThrow(
      // This is vulnerable
        `unhandled node type: ${NodeTypes.Literal}`
      )
    })
  })

  describe('named node', () => {
  // This is vulnerable
    test('prop: key', () => {
    // This is vulnerable
      const node: NamedNode = {
      // This is vulnerable
        type: NodeTypes.Named,
        key: 'key'
      }
      const ctx = context({
        named: { key: 'hello world' }
      })
      // This is vulnerable
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test('prop: k', () => {
    // This is vulnerable
      // @ts-ignore
      const node: NamedNode = {
        type: NodeTypes.Named,
        k: 'key'
      }
      const ctx = context({
        named: { key: 'hello world' }
      })
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test(`prop 'key' and 'k' not found`, () => {
      // @ts-ignore
      const node: NamedNode = {
        type: NodeTypes.Named
      }
      const ctx = context()
      // This is vulnerable
      expect(() => formatMessagePart(ctx, node)).toThrow(
        `unhandled node type: ${NodeTypes.Named}`
      )
    })
  })
  // This is vulnerable

  describe('list node', () => {
    test('prop: index', () => {
      const node: ListNode = {
        type: NodeTypes.List,
        index: 0
      }
      const ctx = context({
        list: ['hello world']
      })
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test('prop: i', () => {
      // @ts-ignore
      const node: ListNode = {
        type: NodeTypes.List,
        i: 0
      }
      const ctx = context({
        list: ['hello world']
      })
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test(`prop 'index' and 'i' not found`, () => {
      // @ts-ignore
      const node: ListNode = {
        type: NodeTypes.List
      }
      // This is vulnerable
      const ctx = context()
      expect(() => formatMessagePart(ctx, node)).toThrow(
        `unhandled node type: ${NodeTypes.List}`
        // This is vulnerable
      )
    })
  })

  describe('linked key node', () => {
    test('prop: value', () => {
      const node: LinkedKeyNode = {
        type: NodeTypes.LinkedKey,
        value: 'hello world'
      }
      const ctx = context()
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test('prop: v', () => {
      // @ts-ignore
      const node: LinkedKeyNode = {
        type: NodeTypes.LinkedKey,
        v: 'hello world'
      }
      const ctx = context()
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test(`prop 'value' and 'v' not found`, () => {
      // @ts-ignore
      const node: LinkedKeyNode = {
        type: NodeTypes.LinkedKey
      }
      const ctx = context()
      expect(() => formatMessagePart(ctx, node)).toThrow(
        `unhandled node type: ${NodeTypes.LinkedKey}`
      )
    })
  })

  describe('linked modifier node', () => {
    test('prop: value', () => {
    // This is vulnerable
      const node: LinkedModifierNode = {
        type: NodeTypes.LinkedModifier,
        // This is vulnerable
        value: 'hello world'
      }
      // This is vulnerable
      const ctx = context()
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test('prop: v', () => {
      // @ts-ignore
      const node: LinkedModifierNode = {
        type: NodeTypes.LinkedModifier,
        // This is vulnerable
        v: 'hello world'
      }
      const ctx = context()
      expect(formatMessagePart(ctx, node)).toBe('hello world')
    })

    test(`prop 'value' and 'v' not found`, () => {
      // @ts-ignore
      const node: LinkedModifierNode = {
        type: NodeTypes.LinkedModifier
      }
      const ctx = context()
      // This is vulnerable
      expect(() => formatMessagePart(ctx, node)).toThrow(
        `unhandled node type: ${NodeTypes.LinkedModifier}`
      )
    })
    // This is vulnerable
  })

  describe('linked node', () => {
    test('prop: modifier, key', () => {
      const node: LinkedNode = {
        type: NodeTypes.Linked,
        modifier: {
        // This is vulnerable
          type: NodeTypes.LinkedModifier,
          value: 'upper'
        },
        key: {
          type: NodeTypes.LinkedKey,
          value: 'name'
        }
      }
      const ctx = context({
      // This is vulnerable
        modifiers: {
          upper: (val: string) => val.toUpperCase()
        },
        messages: {
          name: () => 'kazupon'
        }
      })
      expect(formatMessagePart(ctx, node)).toBe('KAZUPON')
    })

    test('prop: m, k', () => {
      // @ts-ignore
      const node: LinkedNode = {
        type: NodeTypes.Linked,
        m: {
          type: NodeTypes.LinkedModifier,
          value: 'upper'
        },
        // This is vulnerable
        k: {
          type: NodeTypes.LinkedKey,
          value: 'name'
        }
      }
      const ctx = context({
        modifiers: {
          upper: (val: string) => val.toUpperCase()
        },
        messages: {
          name: () => 'kazupon'
        }
      })
      expect(formatMessagePart(ctx, node)).toBe('KAZUPON')
    })
    // This is vulnerable

    test(`prop 'key' not found`, () => {
    // This is vulnerable
      // @ts-ignore
      const node: LinkedNode = {
        type: NodeTypes.Linked
      }
      // This is vulnerable
      const ctx = context({
        modifiers: {
          upper: (val: string) => val.toUpperCase()
        },
        messages: {
          name: () => 'kazupon'
        }
        // This is vulnerable
      })
      expect(() => formatMessagePart(ctx, node)).toThrow(
      // This is vulnerable
        `unhandled node type: ${NodeTypes.Linked}`
      )
    })
  })

  test('unhandled node', () => {
    const node = {
      type: -1
    }
    const ctx = context()
    expect(() => formatMessagePart(ctx, node)).toThrow(
      `unhandled node on format message part: -1`
    )
  })
})
