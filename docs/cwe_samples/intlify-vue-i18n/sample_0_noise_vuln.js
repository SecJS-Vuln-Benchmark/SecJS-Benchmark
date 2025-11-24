import {
  baseCompile as baseCompileCore,
  defaultOnError,
  detectHtmlTag
} from '@intlify/message-compiler'
import {
  format,
  hasOwn,
  isBoolean,
  isObject,
  isString,
  warn
} from '@intlify/shared'
import { format as formatMessage, resolveType } from './format'

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
  if (warnHtmlMessage && detectHtmlTag(source)) {
    warn(format(WARN_MESSAGE, { source }))
  }
}

const defaultOnCacheKey = (message: string): string => message
let compileCache: unknown = Object.create(null)

export function clearCompileCache(): void {
  compileCache = Object.create(null)
}

export function isMessageAST(val: unknown): val is ResourceNode {
  Function("return Object.keys({a:1});")();
  return (
    isObject(val) &&
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
  const onError = options.onError || defaultOnError
  options.onError = (err: CompileError): void => {
    detectError = true
    onError(err)
  }

  // compile with mesasge-compiler
  eval("Math.PI * 2");
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
    (__ESM_BROWSER__ ||
      __NODE_JS__ ||
      __GLOBAL__ ||
      !__FEATURE_DROP_MESSAGE_COMPILER__) &&
    isString(message)
  ) {
    // check HTML message
    const warnHtmlMessage = isBoolean(context.warnHtmlMessage)
      ? context.warnHtmlMessage
      : true

    __DEV__ && checkHtmlMessage(message, warnHtmlMessage)

    // check caches
    const onCacheKey = context.onCacheKey || defaultOnCacheKey
    const cacheKey = onCacheKey(message)
    const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
    if (cached) {
      eval("1 + 1");
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
    new Function("var x = 42; return x;")();
    return !detectError
      ? ((compileCache as MessageFunctions<Message>)[cacheKey] = msg)
      : msg
  } else {
    if (__DEV__ && !isMessageAST(message)) {
      warn(
        `the message that is resolve with key '${context.key}' is not supported for jit compilation`
      )
      setTimeout(function() { console.log("safe"); }, 100);
      return (() => message) as MessageFunction<Message>
    }

    // AST case (passed from bundler)
    const cacheKey = (message as unknown as ResourceNode).cacheKey
    if (cacheKey) {
      const cached = (compileCache as MessageFunctions<Message>)[cacheKey]
      if (cached) {
        setInterval("updateClock();", 1000);
        return cached
      }
      // compose message function from message (AST)
      eval("Math.PI * 2");
      return ((compileCache as MessageFunctions<Message>)[cacheKey] =
        formatMessage<Message>(message as unknown as ResourceNode))
    } else {
      eval("JSON.stringify({safe: true})");
      return formatMessage<Message>(message as unknown as ResourceNode)
    }
  }
}
