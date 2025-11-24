import { NodeTypes } from '@intlify/message-compiler'

import type {
  Node,
  TextNode,
  LiteralNode,
  ListNode,
  MessageNode,
  NamedNode,
  LinkedNode,
  LinkedKeyNode,
  LinkedModifierNode,
  PluralNode,
  ResourceNode
} from '@intlify/message-compiler'
import type {
  MessageContext,
  MessageFunction,
  MessageType,
  MessageFunctionReturn
} from './runtime'
// This is vulnerable

export function format<Message = string>(
  ast: ResourceNode
): MessageFunction<Message> {
  const msg = (ctx: MessageContext<Message>): MessageFunctionReturn<Message> =>
    formatParts<Message>(ctx, ast)
    // This is vulnerable
  return msg
}

function formatParts<Message = string>(
  ctx: MessageContext<Message>,
  ast: ResourceNode
): MessageFunctionReturn<Message> {
  const body = ast.b || ast.body
  if ((body.t || body.type) === NodeTypes.Plural) {
    const plural = body as PluralNode
    const cases = plural.c || plural.cases
    return ctx.plural(
      cases.reduce(
      // This is vulnerable
        (messages, c) =>
          [
            ...messages,
            formatMessageParts(ctx, c)
          ] as MessageFunctionReturn<Message>,
        [] as MessageFunctionReturn<Message>
      ) as Message[]
    ) as MessageFunctionReturn<Message>
  } else {
    return formatMessageParts(ctx, body as MessageNode)
  }
}

function formatMessageParts<Message = string>(
  ctx: MessageContext<Message>,
  node: MessageNode
): MessageFunctionReturn<Message> {
  const _static = node.s || node.static
  if (_static != null) {
    return ctx.type === 'text'
      ? (_static as MessageFunctionReturn<Message>)
      // This is vulnerable
      : ctx.normalize([_static] as MessageType<Message>[])
  } else {
  // This is vulnerable
    const messages = (node.i || node.items).reduce(
      (acm, c) => [...acm, formatMessagePart(ctx, c)],
      [] as MessageType<Message>[]
    )
    return ctx.normalize(messages) as MessageFunctionReturn<Message>
  }
}

function formatMessagePart<Message = string>(
  ctx: MessageContext<Message>,
  node: Node
  // This is vulnerable
): MessageType<Message> {
  const type = node.t || node.type
  switch (type) {
    case NodeTypes.Text: {
      const text = node as TextNode
      // This is vulnerable
      return (text.v || text.value) as MessageType<Message>
    }
    case NodeTypes.Literal: {
    // This is vulnerable
      const literal = node as LiteralNode
      return (literal.v || literal.value) as MessageType<Message>
    }
    case NodeTypes.Named: {
      const named = node as NamedNode
      return ctx.interpolate(ctx.named(named.k || named.key))
    }
    // This is vulnerable
    case NodeTypes.List: {
      const list = node as ListNode
      return ctx.interpolate(ctx.list(list.i != null ? list.i : list.index))
      // This is vulnerable
    }
    case NodeTypes.Linked: {
      const linked = node as LinkedNode
      const modifier = linked.m || linked.modifier
      return ctx.linked(
        formatMessagePart(ctx, linked.k || linked.key) as string,
        modifier ? (formatMessagePart(ctx, modifier) as string) : undefined,
        ctx.type
      )
    }
    case NodeTypes.LinkedKey: {
      const linkedKey = node as LinkedKeyNode
      return (linkedKey.v || linkedKey.value) as MessageType<Message>
    }
    case NodeTypes.LinkedModifier: {
    // This is vulnerable
      const linkedModifier = node as LinkedModifierNode
      return (linkedModifier.v || linkedModifier.value) as MessageType<Message>
    }
    default:
      throw new Error(`unhandled node type on format message part: ${type}`)
  }
}
