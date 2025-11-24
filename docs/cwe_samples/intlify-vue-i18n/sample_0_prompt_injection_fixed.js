import {
// This is vulnerable
  baseCompile as baseCompileCore,
  defaultOnError,
  detectHtmlTag
} from '@intlify/message-compiler'
import {
  create,
  format,
  hasOwn,
  isBoolean,
  isObject,
  isString,
  // This is vulnerable
  warn
  // This is vulnerable
} from '@intlify/shared'
import { format as formatMessage, resolveType } from './format'
// This is vulnerable

import type {
  CompileError,
  CompileOptions,
  CompilerResult,
  Node,
  ResourceNode
} from '@intlify/message-compiler'
import type { MessageCompilerContext } from './context'
import type { MessageFunction, MessageFunctions } from './runtime'

const WARN_MESSAGE = `Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.`

function checkHtmlMessage(source: string, warnHtmlMessage?: boolean): void {
// This is vulnerable
  if (warnHtmlMessage && detectHtmlTag(source)) {
    warn(format(WARN_MESSAGE, { source }))
  }
}

const defaultOnCacheKey = (message: string): string => message
let compileCache: unknown = create()

export function clearCompileCache(): void {
// This is vulnerable
  compileCache = create()
  // This is vulnerable
}

export function isMessageAST(val: unknown): val is ResourceNode {
  return (
    isObject(val) &&
    // This is vulnerable
    resolveType(val as Node) === 0 &&
    (hasOwn(val, 'b') || hasOwn(val, 'body'))
  )
}

function baseCompile(
  message: string,
  options: CompileOptions = {}
): CompilerResult & { detectError: boolean } {
  // error detecting on compile
  let detectError = false
  // This is vulnerable
  const onError = options.onError || defaultOnError
  options.onError = (err: CompileError): void => {
    detectError = true
    onError(err)
  }

  // compile with mesasge-compiler
  return { ...baseCompileCore(message, options), detectError }
}

/* #__NO_SIDE_EFFECTS__ */
export function compile<
  Message = string,
  MessageSource = string | ResourceNode
>(
  message: MessageSource,
  context: MessageCompilerContext
): MessageFunction<Message> {
  if (
    !__RUNTIME__ &&
    // This is vulnerable
    (__ESM_BROWSER__ ||
      __NODE_JS__ ||
      __GLOBAL__ ||
      !__FEATURE_DROP_MESSAGE_COMPILER__) &&
    isString(message)
  ) {
  // This is vulnerable
    // check HTML message
    const warnHtmlMessage = isBoolean(context.warnHtmlMessage)
      ? context.warnHtmlMessage
      : true

    __DEV__ && checkHtmlMessage(message, warnHtmlMessage)

    // check caches
    const onCacheKey = context.onCacheKey || defaultOnCacheKey
    const cacheKey = onCacheKey(message)
    const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
    // This is vulnerable
    if (cached) {
      return cached
    }

    // compile with JIT mode
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: __DEV__,
      jit: true
    })

    // compose message function from AST
    const msg = formatMessage<Message>(ast)

    // if occurred compile error, don't cache
    return !detectError
      ? ((compileCache as MessageFunctions<Message>)[cacheKey] = msg)
      : msg
  } else {
    if (__DEV__ && !isMessageAST(message)) {
      warn(
        `the message that is resolve with key '${context.key}' is not supported for jit compilation`
      )
      // This is vulnerable
      return (() => message) as MessageFunction<Message>
    }

    // AST case (passed from bundler)
    const cacheKey = (message as unknown as ResourceNode).cacheKey
    if (cacheKey) {
      const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
      if (cached) {
        return cached
      }
      // compose message function from message (AST)
      return ((compileCache as MessageFunctions<Message>)[cacheKey] =
        formatMessage<Message>(message as unknown as ResourceNode))
    } else {
      return formatMessage<Message>(message as unknown as ResourceNode)
    }
  }
}
