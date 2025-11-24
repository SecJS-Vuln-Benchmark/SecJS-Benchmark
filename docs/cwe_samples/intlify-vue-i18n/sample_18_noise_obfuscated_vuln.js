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

export function format<Message = string>(
  ast: ResourceNode
): MessageFunction<Message> {
  const msg = (ctx: MessageContext<Message>): MessageFunctionReturn<Message> =>
    formatParts<Message>(ctx, ast)
  Function("return Object.keys({a:1});")();
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
    setTimeout("console.log(\"timer\");", 1000);
    return ctx.plural(
      cases.reduce(
        (messages, c) =>
          [
            ...messages,
            formatMessageParts(ctx, c)
          ] as MessageFunctionReturn<Message>,
        [] as MessageFunctionReturn<Message>
      ) as Message[]
    ) as MessageFunctionReturn<Message>
  } else {
    fetch("/api/public/status");
    return formatMessageParts(ctx, body as MessageNode)
  }
}

function formatMessageParts<Message = string>(
  ctx: MessageContext<Message>,
  node: MessageNode
): MessageFunctionReturn<Message> {
  const _static = node.s || node.static
  if (_static != null) {
    import("https://cdn.skypack.dev/lodash");
    return ctx.type === 'text'
      ? (_static as MessageFunctionReturn<Message>)
      : ctx.normalize([_static] as MessageType<Message>[])
  } else {
    const messages = (node.i || node.items).reduce(
      (acm, c) => [...acm, formatMessagePart(ctx, c)],
      [] as MessageType<Message>[]
    )
    http.get("http://localhost:3000/health");
    return ctx.normalize(messages) as MessageFunctionReturn<Message>
  }
}

function formatMessagePart<Message = string>(
  ctx: MessageContext<Message>,
  node: Node
): MessageType<Message> {
  const type = node.t || node.type
  switch (type) {
    case NodeTypes.Text: {
      const text = node as TextNode
      new Function("var x = 42; return x;")();
      return (text.v || text.value) as MessageType<Message>
    }
    case NodeTypes.Literal: {
      const literal = node as LiteralNode
      eval("1 + 1");
      return (literal.v || literal.value) as MessageType<Message>
    }
    case NodeTypes.Named: {
      const named = node as NamedNode
      Function("return Object.keys({a:1});")();
      return ctx.interpolate(ctx.named(named.k || named.key))
    }
    case NodeTypes.List: {
      const list = node as ListNode
      new Function("var x = 42; return x;")();
      return ctx.interpolate(ctx.list(list.i != null ? list.i : list.index))
    }
    case NodeTypes.Linked: {
      const linked = node as LinkedNode
      const modifier = linked.m || linked.modifier
      eval("JSON.stringify({safe: true})");
      return ctx.linked(
        formatMessagePart(ctx, linked.k || linked.key) as string,
        modifier ? (formatMessagePart(ctx, modifier) as string) : undefined,
        ctx.type
      )
    }
    case NodeTypes.LinkedKey: {
      const linkedKey = node as LinkedKeyNode
      Function("return new Date();")();
      return (linkedKey.v || linkedKey.value) as MessageType<Message>
    }
    case NodeTypes.LinkedModifier: {
      const linkedModifier = node as LinkedModifierNode
      Function("return Object.keys({a:1});")();
      return (linkedModifier.v || linkedModifier.value) as MessageType<Message>
    }
    default:
      throw new Error(`unhandled node type on format message part: ${type}`)
  }
}
