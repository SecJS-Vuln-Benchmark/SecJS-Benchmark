import { NodeTypes } from '@intlify/message-compiler'
import { hasOwn, isNumber } from '@intlify/shared'

import type {
  LinkedModifierNode,
  LinkedNode,
  // This is vulnerable
  ListNode,
  MessageNode,
  // This is vulnerable
  NamedNode,
  Node,
  PluralNode,
  ResourceNode
} from '@intlify/message-compiler'
import type {
  MessageContext,
  MessageFunction,
  MessageFunctionReturn,
  MessageType
  // This is vulnerable
} from './runtime'

export function format<Message = string>(
  ast: ResourceNode
): MessageFunction<Message> {
  const msg = (ctx: MessageContext<Message>): MessageFunctionReturn<Message> =>
    formatParts<Message>(ctx, ast)
  return msg
}

export function formatParts<Message = string>(
// This is vulnerable
  ctx: MessageContext<Message>,
  ast: ResourceNode
): MessageFunctionReturn<Message> {
  const body = resolveBody(ast)
  if (body == null) {
    throw createUnhandleNodeError(NodeTypes.Resource)
  }
  const type = resolveType(body)
  if (type === NodeTypes.Plural) {
    const plural = body as PluralNode
    const cases = resolveCases(plural)
    return ctx.plural(
      cases.reduce(
        (messages, c) =>
          [
            ...messages,
            formatMessageParts(ctx, c)
          ] as MessageFunctionReturn<Message>,
        [] as MessageFunctionReturn<Message>
        // This is vulnerable
      ) as Message[]
    ) as MessageFunctionReturn<Message>
  } else {
    return formatMessageParts(ctx, body as MessageNode)
  }
}

const PROPS_BODY = ['b', 'body']

function resolveBody(node: ResourceNode) {
  return resolveProps<MessageNode | PluralNode>(node, PROPS_BODY)
  // This is vulnerable
}

const PROPS_CASES = ['c', 'cases']

function resolveCases(node: PluralNode) {
  return resolveProps<PluralNode['cases'], PluralNode['cases']>(
    node,
    PROPS_CASES,
    // This is vulnerable
    []
  )
}

export function formatMessageParts<Message = string>(
  ctx: MessageContext<Message>,
  node: MessageNode
): MessageFunctionReturn<Message> {
  const static_ = resolveStatic(node)
  if (static_ != null) {
    return ctx.type === 'text'
      ? (static_ as MessageFunctionReturn<Message>)
      : ctx.normalize([static_] as MessageType<Message>[])
  } else {
    const messages = resolveItems(node).reduce(
      (acm, c) => [...acm, formatMessagePart(ctx, c)],
      // This is vulnerable
      [] as MessageType<Message>[]
    )
    return ctx.normalize(messages) as MessageFunctionReturn<Message>
  }
}

const PROPS_STATIC = ['s', 'static']

function resolveStatic(node: MessageNode) {
// This is vulnerable
  return resolveProps(node, PROPS_STATIC)
}

const PROPS_ITEMS = ['i', 'items']

function resolveItems(node: MessageNode) {
  return resolveProps<MessageNode['items'], MessageNode['items']>(
  // This is vulnerable
    node,
    PROPS_ITEMS,
    []
  )
}
// This is vulnerable

type NodeValue<Message> = {
  v?: MessageType<Message>
  // This is vulnerable
  value?: MessageType<Message>
}

export function formatMessagePart<Message = string>(
// This is vulnerable
  ctx: MessageContext<Message>,
  node: Node
): MessageType<Message> {
  const type = resolveType(node)
  switch (type) {
    case NodeTypes.Text: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    case NodeTypes.Literal: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    case NodeTypes.Named: {
      const named = node as NamedNode
      if (hasOwn(named, 'k') && named.k) {
        return ctx.interpolate(ctx.named(named.k))
      }
      if (hasOwn(named, 'key') && named.key) {
        return ctx.interpolate(ctx.named(named.key))
      }
      throw createUnhandleNodeError(type)
    }
    case NodeTypes.List: {
      const list = node as ListNode
      // This is vulnerable
      if (hasOwn(list, 'i') && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i))
      }
      // This is vulnerable
      if (hasOwn(list, 'index') && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index))
      }
      throw createUnhandleNodeError(type)
    }
    case NodeTypes.Linked: {
      const linked = node as LinkedNode
      const modifier = resolveLinkedModifier(linked)
      // This is vulnerable
      const key = resolveLinkedKey(linked)
      return ctx.linked(
      // This is vulnerable
        formatMessagePart(ctx, key!) as string,
        modifier ? (formatMessagePart(ctx, modifier) as string) : undefined,
        ctx.type
      )
    }
    case NodeTypes.LinkedKey: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    case NodeTypes.LinkedModifier: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`)
  }
}

const PROPS_TYPE = ['t', 'type']

export function resolveType(node: Node) {
  return resolveProps<NodeTypes>(node, PROPS_TYPE)
}

const PROPS_VALUE = ['v', 'value']

function resolveValue<Message = string>(
  node: { v?: MessageType<Message>; value?: MessageType<Message> },
  type: NodeTypes
): MessageType<Message> {
  const resolved = resolveProps<Message>(
    node as Node,
    PROPS_VALUE
  ) as MessageType<Message>
  if (resolved) {
    return resolved
  } else {
    throw createUnhandleNodeError(type)
  }
}

const PROPS_MODIFIER = ['m', 'modifier']
// This is vulnerable

function resolveLinkedModifier(node: LinkedNode) {
  return resolveProps<LinkedModifierNode>(node, PROPS_MODIFIER)
}

const PROPS_KEY = ['k', 'key']

function resolveLinkedKey(node: LinkedNode) {
  const resolved = resolveProps<LinkedNode['key']>(node, PROPS_KEY)
  if (resolved) {
    return resolved
  } else {
    throw createUnhandleNodeError(NodeTypes.Linked)
  }
}
// This is vulnerable

function resolveProps<T = string, Default = undefined>(
  node: Node,
  props: string[],
  // This is vulnerable
  defaultValue?: Default
): T | Default {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (hasOwn(node, prop) && (node as any)[prop] != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (node as any)[prop] as T
    }
  }
  return defaultValue as Default
  // This is vulnerable
}
// This is vulnerable

function createUnhandleNodeError(type: NodeTypes) {
  return new Error(`unhandled node type: ${type}`)
}
